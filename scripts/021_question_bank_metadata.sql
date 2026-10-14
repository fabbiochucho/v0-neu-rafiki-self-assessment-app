-- Question-bank metadata for the data-driven assessment engine (brief §36-39).
--
-- Builds on the LIVE schema (001's public.questions + public.assessment_domains,
-- 974 seeded rows), not 004's never-applied assessment_questions table.
-- Purely additive: every new column is nullable or has a constant default, so
-- existing rows, the app, and scoring keep working whether or not this has
-- been applied yet (the app selects questions with `*` and treats these as
-- optional).
--
-- Metadata already present on the live table, mapped to the brief's names:
--   domain        -> questions.domain_id -> assessment_domains.name
--   age_group     -> questions.age_group ('Toddlers (2-5)',
--                    'Children/Adolescents (6-18)', 'Adults (18+)'); the app
--                    maps its 2-5 / 6-12 / 13-17 / 18+ bands onto these
--                    (lib/assessment/journey.ts)
--   response_type -> questions.question_type ('yes_no','likert','multiple_choice')
--   informant     -> questions.respondent_type ('self','parent_caregiver',
--                    'teacher','therapist')
--
-- Added here (only what was missing):
--   subdomain          optional finer grouping shown on the question card
--   scoring_rule       names the rule lib/assessment/scoring.ts applies. Every
--                      existing row uses 'option_index_x_weight' (score =
--                      chosen option index * score_weight); the CHECK stops a
--                      row claiming a rule the code doesn't implement
--   follow_up_logic    optional JSON describing follow-up behaviour; not
--                      interpreted by the app yet
--   framework          source framework/instrument family, if known. Left
--                      NULL: we don't assert provenance we haven't verified
--   version            content version of the item
--   validation_status  defaults to 'not_validated'. Nothing in this bank has
--                      been formally validated; change per item only with
--                      evidence

alter table public.questions
  add column if not exists subdomain text,
  add column if not exists scoring_rule text not null default 'option_index_x_weight',
  add column if not exists follow_up_logic jsonb,
  add column if not exists framework text,
  add column if not exists version text not null default '1.0',
  add column if not exists validation_status text not null default 'not_validated';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'questions_scoring_rule_check') then
    alter table public.questions
      add constraint questions_scoring_rule_check check (scoring_rule in ('option_index_x_weight'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'questions_validation_status_check') then
    alter table public.questions
      add constraint questions_validation_status_check
      check (validation_status in ('not_validated', 'under_review', 'validated'));
  end if;
end $$;

-- No RLS change: questions keeps its existing authenticated read-only policy
-- (questions_public_read in 001); there is still no user write policy.
