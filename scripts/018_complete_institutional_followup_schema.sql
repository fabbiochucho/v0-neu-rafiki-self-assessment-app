-- Completes the tables migration 004 defined but never finished creating:
-- follow_up_assessments, follow_up_responses, and bulk_enrollments. (004
-- also defined assessment_questions and a replacement assessment_domains
-- schema, neither of which this migration recreates -- see note below.)
--
-- Why 004 never finished: live assessment_domains is still on the original
-- 001 schema (name/description/age_groups[]), not 004's replacement
-- (code/age_min/age_max/question_count/cultural_adaptations). That means
-- 004's `DROP TABLE assessment_domains CASCADE; CREATE TABLE
-- assessment_domains (...)` step itself never completed, which halted the
-- rest of that migration -- assessment_questions, follow_up_assessments,
-- follow_up_responses, and bulk_enrollments were never created. 005
-- onward then seeded 974 real questions into the *original* schema
-- (confirmed: assessment_domains has 6 rows, questions has 974 rows, both
-- on the 001 shape), which is what the live app actually uses today.
--
-- This migration completes the institutional tables (bulk_enrollments) and
-- the follow-up tables (follow_up_assessments/follow_up_responses), fixing
-- two things as it does:
--   1. follow_up_assessments.profile_id now references user_profiles(id)
--      directly (not profiles(id) as 004 had it) -- the same
--      wrong-parent-table bug fixed in 016 for assessment_followup_schedules,
--      caught here before it ever shipped instead of after.
--   2. follow_up_responses.question_id now references the real, populated
--      public.questions(id) instead of the never-created assessment_questions.
--
-- assessment_questions and the replacement assessment_domains schema are
-- deliberately NOT created here: nothing seeded them, recreating an empty
-- parallel question bank next to the real, 974-question-populated one would
-- just be a second, inconsistent source of truth. The admin Question Bank
-- Explorer (app/admin/questions) was repointed at the real
-- assessment_domains/questions tables instead (see components/assessment/
-- question-bank-manager.tsx).
--
-- follow_up_assessments/follow_up_responses are created here for schema
-- completeness and because lib/types/assessment.ts already defines
-- FollowUpAssessment/FollowUpResponse, but deliberately have no UI wired to
-- them: assessment_followup_schedules (fixed in 016) plus the reminders cron
-- already form a complete, working follow-up system. Building a second one
-- on these tables would just be two competing follow-up features.

CREATE TABLE IF NOT EXISTS public.follow_up_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    baseline_assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    follow_up_type VARCHAR(20) NOT NULL CHECK (follow_up_type IN ('weekly', 'monthly', 'quarterly', 'biannual')),
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'skipped')),
    progress_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.follow_up_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follow_up_assessment_id UUID REFERENCES public.follow_up_assessments(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    response_value INTEGER NOT NULL,
    baseline_response_value INTEGER,
    change_score INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follow_up_assessment_id, question_id)
);

CREATE TABLE IF NOT EXISTS public.bulk_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    total_records INTEGER NOT NULL,
    processed_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    error_log JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_follow_up_assessments_baseline ON public.follow_up_assessments(baseline_assessment_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_assessments_profile ON public.follow_up_assessments(profile_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_responses_assessment ON public.follow_up_responses(follow_up_assessment_id);
CREATE INDEX IF NOT EXISTS idx_bulk_enrollments_organization ON public.bulk_enrollments(organization_id);
CREATE INDEX IF NOT EXISTS idx_bulk_enrollments_uploaded_by ON public.bulk_enrollments(uploaded_by);

ALTER TABLE public.follow_up_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "follow_up_assessments_select_own" ON public.follow_up_assessments FOR SELECT USING (
  profile_id IN (
    SELECT id FROM public.user_profiles
    WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
  )
  OR profile_id IN (
    SELECT up.id FROM public.user_profiles up
    JOIN public.profiles p ON p.id = up.user_id
    WHERE p.organization_id IN (SELECT id FROM public.organizations WHERE admin_user_id = auth.uid())
  )
);
CREATE POLICY "follow_up_assessments_manage_own" ON public.follow_up_assessments FOR ALL USING (
  profile_id IN (
    SELECT id FROM public.user_profiles
    WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
  )
);

CREATE POLICY "follow_up_responses_select_own" ON public.follow_up_responses FOR SELECT USING (
  follow_up_assessment_id IN (
    SELECT id FROM public.follow_up_assessments
    WHERE profile_id IN (
      SELECT id FROM public.user_profiles
      WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
    )
  )
);
CREATE POLICY "follow_up_responses_manage_own" ON public.follow_up_responses FOR ALL USING (
  follow_up_assessment_id IN (
    SELECT id FROM public.follow_up_assessments
    WHERE profile_id IN (
      SELECT id FROM public.user_profiles
      WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
    )
  )
);

CREATE POLICY "bulk_enrollments_select_own" ON public.bulk_enrollments FOR SELECT USING (
  organization_id IN (SELECT id FROM public.organizations WHERE admin_user_id = auth.uid())
);
CREATE POLICY "bulk_enrollments_manage_own" ON public.bulk_enrollments FOR ALL USING (
  organization_id IN (SELECT id FROM public.organizations WHERE admin_user_id = auth.uid())
);
