-- Encrypt sensitive assessment data at rest using pgcrypto.
--
-- Scope: this migration encrypts the two columns that hold actual clinical
-- screening content:
--   - public.assessment_responses.response_value (a person's raw answer to a
--     screening question -- e.g. an ASD/ADHD/dyslexia/dyspraxia item)
--   - public.assessment_results.recommendations (free-text clinical
--     recommendation text keyed to a computed risk level)
--
-- public.appointments.notes was reviewed but deliberately left out of this
-- pass: app/dashboard/appointments/page.tsx currently renders appointment
-- notes directly from a plain RLS-scoped SELECT with no service-role decrypt
-- path in front of it. Encrypting it here without also shipping that read
-- path would silently break that page. Appointment notes are scheduling
-- logistics rather than clinical assessment content, so this is a reasonable
-- place to draw the line for this pass; encrypting it is a natural follow-up
-- once an /api/appointments read path exists.
--
-- Approach: additive-and-reversible-feeling migration.
--   1. Enable pgcrypto.
--   2. Add new `<column>_encrypted bytea` columns alongside the existing
--      plaintext columns.
--   3. Backfill the encrypted columns from the plaintext columns using
--      pgp_sym_encrypt(..., key). For this one-time backfill only, the key is
--      passed in as a session-local setting (SET app.encryption_key = ...)
--      so it never has to be hard-coded into this file or committed to
--      source control. The ongoing read/write functions created below take
--      the key as an explicit function parameter instead -- see the note in
--      step 3/4 for why.
--   4. Drop the plaintext columns and rename the encrypted columns into
--      their place.
--   5. Add SECURITY DEFINER decrypt functions, executable only by the
--      service_role (i.e. only reachable from server-side API routes that
--      hold SUPABASE_SERVICE_ROLE_KEY, never from anon/authenticated
--      clients), plus matching SECURITY DEFINER upsert/encrypt functions so
--      the API layer can write ciphertext without ever handling raw pgcrypto
--      calls itself (PostgREST/postgrest-js cannot express pgp_sym_encrypt()
--      inline inside a normal insert/update payload).
--
-- IMPORTANT -- before running this migration:
--   Set the encryption key for this session so the backfill in step 3 can
--   read it. Run this in the SAME session/transaction as the rest of this
--   file, e.g. via psql:
--
--     psql "$DATABASE_URL" \
--       -c "SET app.encryption_key = '<value of ASSESSMENT_ENCRYPTION_KEY>';" \
--       -f scripts/010_encrypt_sensitive_columns.sql
--
--   or paste the SET line as the first statement of this file in the
--   Supabase SQL editor before running the rest. The key itself must never
--   be committed to source control -- it lives only in the server-side
--   ASSESSMENT_ENCRYPTION_KEY env var (see .env.example).
--
-- To "reverse" this migration: add plaintext columns back, backfill via
-- pgp_sym_decrypt() using the same key, drop the *_encrypted columns, and
-- drop the functions created in step 5.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF current_setting('app.encryption_key', true) IS NULL OR current_setting('app.encryption_key', true) = '' THEN
    RAISE EXCEPTION 'app.encryption_key is not set for this session. Run: SET app.encryption_key = ''<ASSESSMENT_ENCRYPTION_KEY value>''; before running this migration.';
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 1. assessment_responses.response_value
-- ---------------------------------------------------------------------------
ALTER TABLE public.assessment_responses ADD COLUMN IF NOT EXISTS response_value_encrypted BYTEA;

UPDATE public.assessment_responses
SET response_value_encrypted = pgp_sym_encrypt(response_value, current_setting('app.encryption_key'))
WHERE response_value IS NOT NULL AND response_value_encrypted IS NULL;

ALTER TABLE public.assessment_responses DROP COLUMN response_value;
ALTER TABLE public.assessment_responses RENAME COLUMN response_value_encrypted TO response_value;

-- ---------------------------------------------------------------------------
-- 2. assessment_results.recommendations
-- ---------------------------------------------------------------------------
ALTER TABLE public.assessment_results ADD COLUMN IF NOT EXISTS recommendations_encrypted BYTEA;

UPDATE public.assessment_results
SET recommendations_encrypted = pgp_sym_encrypt(recommendations, current_setting('app.encryption_key'))
WHERE recommendations IS NOT NULL AND recommendations_encrypted IS NULL;

ALTER TABLE public.assessment_results DROP COLUMN recommendations;
ALTER TABLE public.assessment_results RENAME COLUMN recommendations_encrypted TO recommendations;

-- ---------------------------------------------------------------------------
-- 3. Decrypt functions -- SECURITY DEFINER, service_role only.
--    Anon/authenticated clients can still SELECT these columns directly
--    (RLS still applies), but will only ever get back ciphertext bytes,
--    which is the intended, harmless outcome.
--
--    p_key is threaded through explicitly by the caller (the server-side API
--    route, reading the server-only ASSESSMENT_ENCRYPTION_KEY env var) for
--    the same reason as the upsert functions below: a serverless API route
--    and the RPC call it makes are not guaranteed to share a Postgres
--    session, so relying on a session-level `SET app.encryption_key = ...`
--    executed in a separate round-trip would silently decrypt with a NULL
--    key and error out.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_assessment_response(p_response_id UUID, p_key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_value BYTEA;
BEGIN
  SELECT response_value INTO v_value FROM public.assessment_responses WHERE id = p_response_id;
  IF v_value IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN pgp_sym_decrypt(v_value, p_key);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_assessment_result_recommendations(p_result_id UUID, p_key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_value BYTEA;
BEGIN
  SELECT recommendations INTO v_value FROM public.assessment_results WHERE id = p_result_id;
  IF v_value IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN pgp_sym_decrypt(v_value, p_key);
END;
$$;

-- ---------------------------------------------------------------------------
-- 4. Encrypting upsert functions -- the write-side counterpart. PostgREST
--    (and therefore the supabase-js service-role client used by our API
--    routes) cannot call pgp_sym_encrypt() inline as part of an insert/
--    upsert payload, so encryption-on-write is performed inside these
--    functions instead. p_key is threaded through explicitly by the calling
--    API route (read from the server-only ASSESSMENT_ENCRYPTION_KEY env
--    var) rather than relying on a session-level GUC, since a serverless
--    API route and its RPC call may not share a Postgres session.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.upsert_assessment_response(
  p_assessment_id UUID,
  p_question_id UUID,
  p_response_value TEXT,
  p_score INTEGER,
  p_key TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.assessment_responses (assessment_id, question_id, response_value, score)
  VALUES (p_assessment_id, p_question_id, pgp_sym_encrypt(p_response_value, p_key), p_score)
  ON CONFLICT (assessment_id, question_id)
  DO UPDATE SET response_value = EXCLUDED.response_value, score = EXCLUDED.score
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.upsert_assessment_result(
  p_assessment_id UUID,
  p_domain_name TEXT,
  p_total_score INTEGER,
  p_max_possible_score INTEGER,
  p_percentage_score NUMERIC,
  p_risk_level TEXT,
  p_recommendations TEXT,
  p_key TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.assessment_results (
    assessment_id, domain_name, total_score, max_possible_score, percentage_score, risk_level, recommendations
  )
  VALUES (
    p_assessment_id, p_domain_name, p_total_score, p_max_possible_score, p_percentage_score, p_risk_level,
    CASE WHEN p_recommendations IS NULL THEN NULL ELSE pgp_sym_encrypt(p_recommendations, p_key) END
  )
  ON CONFLICT (assessment_id, domain_name)
  DO UPDATE SET
    total_score = EXCLUDED.total_score,
    max_possible_score = EXCLUDED.max_possible_score,
    percentage_score = EXCLUDED.percentage_score,
    risk_level = EXCLUDED.risk_level,
    recommendations = EXCLUDED.recommendations
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- ---------------------------------------------------------------------------
-- 5. Lock down execute privileges: service_role only. Revoke first so this
--    migration is safe to re-run, then grant explicitly.
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.get_assessment_response(UUID, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_assessment_result_recommendations(UUID, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.upsert_assessment_response(UUID, UUID, TEXT, INTEGER, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.upsert_assessment_result(UUID, TEXT, INTEGER, INTEGER, NUMERIC, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_assessment_response(UUID, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_assessment_result_recommendations(UUID, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.upsert_assessment_response(UUID, UUID, TEXT, INTEGER, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.upsert_assessment_result(UUID, TEXT, INTEGER, INTEGER, NUMERIC, TEXT, TEXT, TEXT) TO service_role;

-- ---------------------------------------------------------------------------
-- 6. Now that scoring/persistence goes through app/api/assessments/[id]/... ,
--    which write via the service-role client (calling the upsert_* functions
--    above), the anon/authenticated roles no longer need direct INSERT
--    access to these tables. Removing it means a reverse-engineered direct
--    write (e.g. a hand-crafted PostgREST request bypassing the app) fails
--    outright instead of merely writing unencrypted/untrusted data. SELECT
--    policies are left in place (own-data read access), and there was never
--    an UPDATE policy on either table, so this closes the only remaining gap.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "assessment_responses_insert_own" ON public.assessment_responses;
DROP POLICY IF EXISTS "assessment_results_insert_own" ON public.assessment_results;
