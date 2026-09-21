-- scripts/008_add_followup_scheduling.sql wired assessment_followup_schedules
-- to public.profiles (the one-row-per-account table: id = auth.uid()) instead
-- of public.user_profiles (the one-row-per-family-member table the rest of
-- the assessment flow actually uses -- see assessments.profile_id). Its own
-- RLS policies then filtered on `profiles.user_id = auth.uid()`, a column
-- that has never existed on public.profiles (it doesn't need one: profiles.id
-- *is* the user id). CREATE POLICY validates column references at creation
-- time, so this would have failed to apply as written; app/dashboard/
-- followups/page.tsx has the matching bug, selecting profiles(name) and
-- profiles.name, neither of which exists (person-level names live on
-- user_profiles.full_name). This migration repoints the table at the correct
-- parent and fixes the policies. Written defensively (IF EXISTS / safe to
-- re-run) since it's unknown whether 008 ever fully applied.

-- Re-point profile_id at user_profiles instead of profiles.
alter table public.assessment_followup_schedules
  drop constraint if exists assessment_followup_schedules_profile_id_fkey;

alter table public.assessment_followup_schedules
  add constraint assessment_followup_schedules_profile_id_fkey
  foreign key (profile_id) references public.user_profiles(id) on delete cascade;

-- Fix the RLS policies to check ownership via user_profiles.user_id (the
-- correct column) instead of the nonexistent profiles.user_id.
drop policy if exists "Users can view their own follow-up schedules" on public.assessment_followup_schedules;
create policy "Users can view their own follow-up schedules"
  on public.assessment_followup_schedules for select
  using (profile_id in (select id from public.user_profiles where user_id = auth.uid()));

drop policy if exists "Users can create follow-up schedules for their profiles" on public.assessment_followup_schedules;
create policy "Users can create follow-up schedules for their profiles"
  on public.assessment_followup_schedules for insert
  with check (profile_id in (select id from public.user_profiles where user_id = auth.uid()));

drop policy if exists "Users can view their own follow-up responses" on public.assessment_followup_responses;
create policy "Users can view their own follow-up responses"
  on public.assessment_followup_responses for select
  using (schedule_id in (
    select id from public.assessment_followup_schedules
    where profile_id in (select id from public.user_profiles where user_id = auth.uid())
  ));

drop policy if exists "Users can create follow-up responses" on public.assessment_followup_responses;
create policy "Users can create follow-up responses"
  on public.assessment_followup_responses for insert
  with check (schedule_id in (
    select id from public.assessment_followup_schedules
    where profile_id in (select id from public.user_profiles where user_id = auth.uid())
  ));

drop policy if exists "Users can view their own follow-up results" on public.assessment_followup_results;
create policy "Users can view their own follow-up results"
  on public.assessment_followup_results for select
  using (schedule_id in (
    select id from public.assessment_followup_schedules
    where profile_id in (select id from public.user_profiles where user_id = auth.uid())
  ));
