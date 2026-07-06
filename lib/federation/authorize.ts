import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Returns true if the given local user has an active linked_accounts row to
 * Alliance that includes the given scope. Used to gate whether the
 * per-profile federation_sync consent toggle can meaningfully be turned on
 * (see app/dashboard/connections/page.tsx) and, defense-in-depth, re-checked
 * server-side in app/api/federation/profile-consent/route.ts rather than
 * trusted purely from the UI's disabled state.
 */
export async function hasActiveAllianceLink(
  supabase: SupabaseClient,
  localUserId: string,
  scope: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("linked_accounts")
    .select("id, scopes")
    .eq("local_user_id", localUserId)
    .eq("remote_app", "alliance")
    .eq("status", "active")
    .contains("scopes", [scope])
    .limit(1)

  if (error) return false
  return !!data && data.length > 0
}

/**
 * Returns true if there is a currently-valid (non-revoked) 'federation_sync'
 * consent on file for the given profile. This is a separate, explicit gate
 * from hasActiveAllianceLink above -- a linked_accounts row only proves the
 * two accounts are connected, not that this specific profile's assessment
 * data may be shared. Mirrors hasValidAssessmentConsent in
 * lib/assessment/authorize.ts.
 */
export async function hasValidFederationSyncConsent(supabase: SupabaseClient, profileId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("consents")
    .select("id")
    .eq("profile_id", profileId)
    .eq("consent_type", "federation_sync")
    .is("revoked_at", null)
    .limit(1)

  if (error) return false
  return !!data && data.length > 0
}
