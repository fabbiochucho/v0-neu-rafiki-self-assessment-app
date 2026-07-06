-- Phase 1 cross-app federation: lets a user optionally link their Neu Rafiki
-- account to a sibling "Alliance" app account (and vice versa -- either app
-- can initiate the link), so completed Neu Rafiki assessment results can
-- later be pulled into an Alliance IEP learner profile, gated by explicit
-- per-profile consent (see the federation_sync consent_type added below).
--
-- This table and the JWT contract in lib/federation/** are built to an
-- identical shared spec in both repos so the two apps can interoperate --
-- remote_app's CHECK constraint intentionally allows both 'alliance' and
-- 'neurafiki' even though every row created BY this repo will always have
-- remote_app = 'alliance' (the sibling app is always the "remote" side from
-- here). Keeping the constraint symmetric matches the identical table in the
-- Alliance repo, where remote_app = 'neurafiki' for all its rows.
--
-- Nothing here is ever synced automatically -- every row is created by an
-- explicit user action (clicking "Connect account" and accepting a consent
-- screen) and can be revoked at any time by setting status = 'revoked'.

CREATE TABLE IF NOT EXISTS public.linked_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  local_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  remote_app TEXT NOT NULL CHECK (remote_app IN ('alliance', 'neurafiki')),
  remote_user_id UUID NOT NULL,
  remote_email TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'revoked')),
  scopes TEXT[] NOT NULL DEFAULT '{}',
  consent_version TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  UNIQUE(local_user_id, remote_app, remote_user_id)
);

ALTER TABLE public.linked_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "linked_accounts_select_own" ON public.linked_accounts FOR SELECT USING (auth.uid() = local_user_id);
CREATE POLICY "linked_accounts_insert_own" ON public.linked_accounts FOR INSERT WITH CHECK (auth.uid() = local_user_id);
CREATE POLICY "linked_accounts_update_own" ON public.linked_accounts FOR UPDATE USING (auth.uid() = local_user_id) WITH CHECK (auth.uid() = local_user_id);

CREATE INDEX IF NOT EXISTS idx_linked_accounts_local_user_id ON public.linked_accounts(local_user_id);

-- ---------------------------------------------------------------------------
-- Per-profile federation sync consent.
--
-- A linked_accounts row alone only proves the two accounts are connected --
-- it must NOT be sufficient to let Alliance pull a given profile's clinical
-- assessment data, since a single Neu Rafiki account can hold profiles for
-- multiple family members (including minors) and linking accounts is a
-- one-time, account-level action while data sharing needs to be granted (and
-- revocable) per profile. This adds a third consent_type, 'federation_sync',
-- to the existing consents table (see scripts/009_create_consents_table.sql)
-- so each profile_id can independently opt in/out.
--
-- 009 relies on Postgres's default naming convention for an inline column
-- CHECK constraint (<table>_<column>_check), so the DROP below targets
-- consents_consent_type_check.
-- ---------------------------------------------------------------------------
ALTER TABLE public.consents DROP CONSTRAINT IF EXISTS consents_consent_type_check;
ALTER TABLE public.consents ADD CONSTRAINT consents_consent_type_check
  CHECK (consent_type IN ('account_terms', 'assessment_data', 'federation_sync'));
