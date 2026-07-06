import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Loads an assessment (with its user_profiles row) and returns it only if the
 * given userId owns the profile behind it. Returns null otherwise, whether
 * because the assessment doesn't exist or because it belongs to someone
 * else -- callers should treat both cases identically (404/403) so as not to
 * leak which assessment IDs exist.
 *
 * This mirrors the ownership check already used in
 * app/assessment/[id]/questions/page.tsx and app/assessment/[id]/results/page.tsx.
 */
export async function getOwnedAssessment(supabase: SupabaseClient, assessmentId: string, userId: string) {
  const { data: assessment, error } = await supabase
    .from("assessments")
    .select("*, user_profiles(*)")
    .eq("id", assessmentId)
    .single()

  if (error || !assessment) return null

  const profile = assessment.user_profiles as { user_id: string } | null
  if (!profile || profile.user_id !== userId) return null

  return assessment
}

/**
 * Returns true if there is a currently-valid (non-revoked) 'assessment_data'
 * consent on file for the given profile. Used to gate assessment completion
 * server-side -- this must be checked in the API layer, not just the UI,
 * since a direct request to /complete should not be able to bypass consent.
 */
export async function hasValidAssessmentConsent(supabase: SupabaseClient, profileId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("consents")
    .select("id")
    .eq("profile_id", profileId)
    .eq("consent_type", "assessment_data")
    .is("revoked_at", null)
    .limit(1)

  if (error) return false
  return !!data && data.length > 0
}
