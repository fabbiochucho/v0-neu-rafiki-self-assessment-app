import { NextResponse, type NextRequest } from "next/server"
import { createServiceRoleClient, getAssessmentEncryptionKey } from "@/lib/supabase/service"
import { isFederationEnabled } from "@/lib/federation/config"
import { verifyAllianceRequestToken } from "@/lib/federation/jwt"
import { hasValidFederationSyncConsent } from "@/lib/federation/authorize"

const REQUIRED_SCOPE = "assessment_sync"

function getAgeFromBirthDate(birthDate: string | null): number | null {
  if (!birthDate) return null
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

/**
 * GET: the pull API Alliance calls to fetch assessment results for a linked
 * Neu Rafiki account. Authorization is via `Authorization: Bearer <token>`
 * -- NOT a normal Supabase session, since Alliance never holds a Neu Rafiki
 * user session. Because there's no session, every query below goes through
 * the service-role client (RLS is bypassed by construction here); ownership
 * is instead enforced explicitly:
 *
 *   1. The bearer token must verify against Alliance's public key
 *      (verifyAllianceRequestToken) and carry the assessment_sync scope.
 *   2. There must be an ACTIVE linked_accounts row proving this specific
 *      Alliance user (requesting_user_id) is linked to this specific Neu
 *      Rafiki user (target_remote_user_id) with assessment_sync granted --
 *      this is what stops a validly-signed token for account A from being
 *      used to read account B's data.
 *   3. For each of that Neu Rafiki user's profiles, an ACTIVE
 *      'federation_sync' consent must exist for that specific profile_id.
 *      Profiles without it are silently omitted, not errored -- consent is
 *      opt-in per profile, so "no consent" is an expected, normal case.
 */
export async function GET(request: NextRequest) {
  if (!isFederationEnabled()) {
    return NextResponse.json({ error: "Federation is not enabled on this deployment" }, { status: 503 })
  }

  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization")
  const token = authHeader?.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : null
  if (!token) {
    return NextResponse.json({ error: "Missing bearer token" }, { status: 401 })
  }

  let payload
  try {
    payload = await verifyAllianceRequestToken(token)
  } catch (error) {
    return NextResponse.json({ error: "Invalid or expired request token" }, { status: 401 })
  }

  if (payload.scope !== REQUIRED_SCOPE) {
    return NextResponse.json({ error: "Token does not grant the required scope" }, { status: 403 })
  }

  const serviceClient = createServiceRoleClient()

  const { data: link, error: linkError } = await serviceClient
    .from("linked_accounts")
    .select("id, scopes")
    .eq("local_user_id", payload.target_remote_user_id)
    .eq("remote_app", "alliance")
    .eq("remote_user_id", payload.requesting_user_id)
    .eq("status", "active")
    .contains("scopes", [REQUIRED_SCOPE])
    .maybeSingle()

  if (linkError || !link) {
    return NextResponse.json({ error: "No active linked account with the required scope" }, { status: 403 })
  }

  const { data: profiles, error: profilesError } = await serviceClient
    .from("user_profiles")
    .select("id, full_name, preferred_name, age, date_of_birth")
    .eq("user_id", payload.target_remote_user_id)

  if (profilesError) {
    return NextResponse.json({ error: "Failed to load profiles" }, { status: 500 })
  }

  const key = getAssessmentEncryptionKey()
  const results: unknown[] = []

  for (const profile of profiles || []) {
    const consented = await hasValidFederationSyncConsent(serviceClient, profile.id)
    if (!consented) continue

    const { data: assessment } = await serviceClient
      .from("assessments")
      .select("id, domains, completed_at")
      .eq("profile_id", profile.id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!assessment) continue

    const { data: domainRows, error: domainError } = await serviceClient
      .from("assessment_results")
      .select("id, domain_name, risk_level, percentage_score")
      .eq("assessment_id", assessment.id)

    if (domainError || !domainRows || domainRows.length === 0) continue

    const domains = await Promise.all(
      domainRows.map(async (row) => {
        const { data: recommendations } = await serviceClient.rpc("get_assessment_result_recommendations", {
          p_result_id: row.id,
          p_key: key,
        })
        return {
          domain_name: row.domain_name,
          risk_level: row.risk_level,
          percentage_score: row.percentage_score,
          recommendations: (recommendations as string | null) ?? null,
        }
      }),
    )

    results.push({
      profile_ref: {
        name: profile.preferred_name || profile.full_name,
        age: profile.age ?? getAgeFromBirthDate(profile.date_of_birth),
        diagnosis_domains: assessment.domains,
      },
      domains,
      completed_at: assessment.completed_at,
      source: "neurafiki",
      source_assessment_id: assessment.id,
    })
  }

  return NextResponse.json({ results })
}
