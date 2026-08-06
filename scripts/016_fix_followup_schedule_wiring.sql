-- The follow-up scheduling feature added in 008 was wired to the wrong
-- table throughout: assessment_followup_schedules.profile_id references
-- profiles(id) (the one-per-account table), but every other assessment
-- table (assessments, appointments) keys profile_id off user_profiles(id)
-- (the one-per-assessed-person table -- a parent's account can have several
-- user_profiles for different children). Its RLS policies compound the bug
-- by filtering on "profiles.user_id", a column that doesn't exist on
-- profiles at all (profiles.id *is* the auth.users id -- see 001). Both bugs
-- together meant: schedule creation/listing silently matched zero rows
-- through RLS for real users, and the FK didn't even point at the table the
-- app's UI populates its profile picker from.

-- Drop the mis-scoped RLS policies from 008.
DROP POLICY IF EXISTS "Users can view their own follow-up schedules" ON assessment_followup_schedules;
DROP POLICY IF EXISTS "Users can create follow-up schedules for their profiles" ON assessment_followup_schedules;
DROP POLICY IF EXISTS "Users can view their own follow-up responses" ON assessment_followup_responses;
DROP POLICY IF EXISTS "Users can create follow-up responses" ON assessment_followup_responses;
DROP POLICY IF EXISTS "Users can view their own follow-up results" ON assessment_followup_results;

-- Re-point profile_id at user_profiles(id), matching assessments/appointments.
ALTER TABLE assessment_followup_schedules DROP CONSTRAINT IF EXISTS assessment_followup_schedules_profile_id_fkey;
ALTER TABLE assessment_followup_schedules
  ADD CONSTRAINT assessment_followup_schedules_profile_id_fkey
  FOREIGN KEY (profile_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

-- Recreate policies using the same profiles -> user_profiles ownership chain
-- used everywhere else (see assessments_select_own in 001).
CREATE POLICY "followup_schedules_select_own" ON assessment_followup_schedules FOR SELECT USING (
  profile_id IN (
    SELECT id FROM public.user_profiles
    WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
  )
);
CREATE POLICY "followup_schedules_insert_own" ON assessment_followup_schedules FOR INSERT WITH CHECK (
  profile_id IN (
    SELECT id FROM public.user_profiles
    WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
  )
);
CREATE POLICY "followup_schedules_update_own" ON assessment_followup_schedules FOR UPDATE USING (
  profile_id IN (
    SELECT id FROM public.user_profiles
    WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
  )
);

CREATE POLICY "followup_responses_select_own" ON assessment_followup_responses FOR SELECT USING (
  schedule_id IN (
    SELECT id FROM assessment_followup_schedules
    WHERE profile_id IN (
      SELECT id FROM public.user_profiles
      WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
    )
  )
);
CREATE POLICY "followup_responses_insert_own" ON assessment_followup_responses FOR INSERT WITH CHECK (
  schedule_id IN (
    SELECT id FROM assessment_followup_schedules
    WHERE profile_id IN (
      SELECT id FROM public.user_profiles
      WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
    )
  )
);

CREATE POLICY "followup_results_select_own" ON assessment_followup_results FOR SELECT USING (
  schedule_id IN (
    SELECT id FROM assessment_followup_schedules
    WHERE profile_id IN (
      SELECT id FROM public.user_profiles
      WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
    )
  )
);

-- Tracks the last time an automated reminder email was sent for a schedule,
-- so the reminders cron (app/api/cron/followup-reminders/route.ts) can skip
-- schedules it already reminded today instead of re-sending on every run.
ALTER TABLE assessment_followup_schedules
  ADD COLUMN IF NOT EXISTS last_reminder_sent_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_followup_schedules_status_next_date
  ON assessment_followup_schedules (status, next_scheduled_date);
