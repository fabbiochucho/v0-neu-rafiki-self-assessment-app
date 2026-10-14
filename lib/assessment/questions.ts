import type { SupabaseClient } from "@supabase/supabase-js"
import { dbAgeGroupForProfile } from "@/lib/assessment/journey"

interface AssessmentForQuestions {
  domains: string[]
  respondent_type: string
  assessment_type: string
  user_profiles: { age?: number | null; date_of_birth?: string | null } | null
}

/**
 * The one place that decides which question-bank rows belong to an
 * assessment. Used by the questions page and the /complete route so they can
 * never disagree.
 *
 * `assessment_domains!inner` matters: without !inner, PostgREST's filter on
 * the embedded name only blanks the embed and still returns questions from
 * unselected domains (with assessment_domains = null).
 */
export async function loadAssessmentQuestions(supabase: SupabaseClient, assessment: AssessmentForQuestions) {
  return supabase
    .from("questions")
    .select("*, assessment_domains!inner(name, description)")
    .in("assessment_domains.name", assessment.domains)
    .eq("age_group", dbAgeGroupForProfile(assessment.user_profiles))
    .eq("respondent_type", assessment.respondent_type)
    .eq("is_follow_up", assessment.assessment_type === "follow_up")
    .order("domain_id")
    .order("question_id")
}
