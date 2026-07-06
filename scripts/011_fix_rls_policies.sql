-- scripts/001_create_database_schema.sql defines two conflicting policy
-- pairs, side by side, for both public.profiles and public.user_profiles:
--   - a permissive pair using `USING (true)` / `WITH CHECK (true)`
--     ("profiles_select_policy" / "profiles_insert_policy" and
--      "user_profiles_select_policy" / "user_profiles_insert_policy"),
--     which let ANY authenticated (or anon, depending on role grants) caller
--     read or insert ANY row in these tables, and
--   - a correct, owner-scoped pair ("*_select_own" / "*_insert_own" / etc.)
--     that restricts access to auth.uid() = id (or the equivalent via
--     user_id).
--
-- Postgres RLS policies are OR'd together, so as long as the permissive
-- pair exists, the owner-scoped pair is effectively meaningless -- anyone
-- can read or create profiles for other people. This migration removes only
-- the permissive policies, leaving the owner-scoped ones (already created in
-- 001) as the sole access path. This is additive/ordered per the project's
-- migration convention -- 001 itself is not edited.

DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;

DROP POLICY IF EXISTS "user_profiles_select_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_policy" ON public.user_profiles;
