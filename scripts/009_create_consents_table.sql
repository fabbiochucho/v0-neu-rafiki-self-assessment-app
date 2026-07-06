-- Consent tracking for account-level terms and per-profile assessment data collection.
--
-- Two consent_type values are used by the application today:
--   'account_terms'    - accepted once at sign-up (Privacy Policy + Terms).
--   'assessment_data'  - accepted immediately before starting an assessment for a
--                        specific profile (profile_id). Required when the profile
--                        being assessed is a minor (is_for_minor = true), since the
--                        account holder is consenting as parent/guardian on the
--                        child's behalf.
--
-- profile_id links to public.user_profiles (the per-family-member profile table
-- created in 001_create_database_schema.sql), not to auth.users, because a single
-- account can hold consents for multiple child profiles.

CREATE TABLE IF NOT EXISTS public.consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('account_terms', 'assessment_data')),
  version TEXT NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  is_for_minor BOOLEAN NOT NULL DEFAULT FALSE,
  guardian_relationship TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consents_user_id ON public.consents(user_id);
CREATE INDEX IF NOT EXISTS idx_consents_profile_id ON public.consents(profile_id);
CREATE INDEX IF NOT EXISTS idx_consents_type ON public.consents(consent_type);

ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;

-- Users may only see and manage their own consent records. There is
-- deliberately no UPDATE policy that allows changing granted_at/consent_type
-- after the fact -- "editing" a consent means revoking it (setting
-- revoked_at) and creating a fresh row, which preserves an audit trail.
CREATE POLICY "consents_select_own" ON public.consents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "consents_insert_own" ON public.consents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "consents_revoke_own" ON public.consents
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
