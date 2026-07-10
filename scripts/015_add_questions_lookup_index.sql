-- Performance: app/api/assessments/[id]/{complete,responses}/route.ts both
-- filter the questions table on age_group + respondent_type (in addition to
-- domain_id, which already has an index). With the question bank now at 974
-- rows and growing, add a composite index covering the actual WHERE clause
-- shape used by those routes.
CREATE INDEX IF NOT EXISTS idx_questions_age_respondent
  ON public.questions (age_group, respondent_type, domain_id);
