import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { hasActiveAllianceLink } from "@/lib/federation/authorize"

/**
 * POST: grants or revokes this account's 'federation_sync' consent for one
 * profile, i.e. whether that profile's completed assessment results may be
 * shared with the account's linked Alliance account. This is a separate gate
 * from the linked_accounts row itself -- see
 * app/api/federation/assessment-results/route.ts, which requires BOTH an
 * active link AND an active federation_sync consent for the specific
 * profile being requested.
 *
 * Body: { profile_id: string, grant: boolean }
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  let body: { profile_id?: unknown; grant?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { profile_id, grant } = body
  if (typeof profile_id !== "string" || !profile_id) {
    return NextResponse.json({ error: "profile_id is required" }, { status: 400 })
  }
  if (typeof grant !== "boolean") {
    return NextResponse.json({ error: "grant must be a boolean" }, { status: 400 })
  }

  // Verify the caller owns this profile before doing anything else -- the
  // profiles table's id is the same as auth.users.id (see
  // scripts/001_create_database_schema.sql's handle_new_user trigger), so
  // user_profiles.user_id === auth.uid() for the owning account, matching
  // the ownership check already used in app/dashboard/profiles/page.tsx.
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("id", profile_id)
    .eq("user_id", user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }

  if (grant) {
    // Defense in depth: the UI is expected to keep this toggle disabled
    // unless there's already an active linked Alliance account with the
    // assessment_sync scope, but re-check here too rather than trusting the
    // client's disabled state.
    const hasLink = await hasActiveAllianceLink(supabase, user.id, "assessment_sync")
    if (!hasLink) {
      return NextResponse.json(
        { error: "Connect an Alliance account with assessment_sync access before enabling sharing for a profile." },
        { status: 409 },
      )
    }

    const { error: insertError } = await supabase.from("consents").insert({
      user_id: user.id,
      profile_id,
      consent_type: "federation_sync",
      version: "1.0",
      granted_at: new Date().toISOString(),
      is_for_minor: false,
    })

    if (insertError) {
      console.error("[api/federation/profile-consent] grant failed:", insertError)
      return NextResponse.json({ error: "Failed to grant consent" }, { status: 500 })
    }
  } else {
    // Revoke rather than delete, preserving the audit trail -- same
    // convention as consents_revoke_own in scripts/009_create_consents_table.sql.
    const { error: revokeError } = await supabase
      .from("consents")
      .update({ revoked_at: new Date().toISOString() })
      .eq("profile_id", profile_id)
      .eq("user_id", user.id)
      .eq("consent_type", "federation_sync")
      .is("revoked_at", null)

    if (revokeError) {
      console.error("[api/federation/profile-consent] revoke failed:", revokeError)
      return NextResponse.json({ error: "Failed to revoke consent" }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true })
}
