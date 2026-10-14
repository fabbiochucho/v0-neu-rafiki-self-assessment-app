-- NeuRafiki Check-ins (brief §13): short, goal-linked, structured
-- check-ins stored as longitudinal data. See lib/check-in/rules.ts for the
-- question set, the adaptive follow-up rule and the trend rule.
--
-- One row per completed check-in. `answers` holds option values only
-- (validated server-side against lib/check-in/rules.ts); `notes` holds the
-- optional short notes, which stay in NeuRafiki and are never sent to ANDA.
--
-- Sharing with ANDA is opt-in per check-in: share_consent_at and
-- share_consent_version record the explicit consent (timestamp and the
-- version of the wording shown), captured in the same insert as the
-- check-in. shared_at is set only by the server (service role) once ANDA
-- has accepted the summary.
--
-- RLS: users can read and insert only their own rows. There is deliberately
-- NO user UPDATE or DELETE policy, so a user can't backdate consent or mark
-- a check-in as shared. The only update (shared_at) runs under the
-- service role from app/api/check-ins/route.ts.

create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source text not null default 'neurafiki' check (source in ('neurafiki', 'anda')),
  learner_ref text check (learner_ref is null or char_length(learner_ref) <= 200),
  goal_title text not null check (char_length(goal_title) between 1 and 300),
  answers jsonb not null,
  notes jsonb,
  frequency_score smallint check (frequency_score between 0 and 4),
  follow_up_triggered boolean not null default false,
  share_consent_at timestamptz,
  share_consent_version text,
  shared_at timestamptz,
  created_at timestamptz not null default now(),
  check ((share_consent_at is null) = (share_consent_version is null))
);

alter table public.check_ins enable row level security;

create policy "check_ins_select_own" on public.check_ins
  for select using (user_id = auth.uid());

create policy "check_ins_insert_own" on public.check_ins
  for insert with check (user_id = auth.uid() and shared_at is null);

create index if not exists idx_check_ins_user_goal
  on public.check_ins (user_id, learner_ref, goal_title, created_at desc);
