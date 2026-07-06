import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient, getAssessmentEncryptionKey } from "@/lib/supabase/service"
import { getOwnedAssessment, hasValidAssessmentConsent } from "@/lib/assessment/authorize"
import { computeDomainResults, type QuestionWithDomain } from "@/lib/assessment/scoring"

interface RouteParams {
  params: Promise<{ id: string }>
}

function getAgeGroup(age: number) {
  if (age <= 5) return "Toddlers (2-5)"
  if (age <= 18) return "Children/Adolescents (6-18)"
  return "Adults (18+)"
}

/**
 * POST: ports the full calculateResults() logic server-side. Re-reads all
 * stored responses for the assessment (decrypting via the service-role
 * client), computes final per-domain risk levels, verifies the caller owns
 * the profile behind the assessment, verifies a valid non-revoked
 * assessment_data consent exists for that profile, and writes results using
 * the service-role client. Rejects (409) if consent is missing so a direct
 * API request can't bypass the UI's consent gate.
 */
export async function POST(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const assessment = await getOwnedAssessment(supabase, id, user.id)
  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
  }

  const consentOk = await hasValidAssessmentConsent(supabase, assessment.profile_id)
  if (!consentOk) {
    return NextResponse.json(
      { error: "Missing required consent to store assessment data for this profile. Please provide consent before completing the assessment." },
      { status: 409 },
    )
  }

  const profile = assessment.user_profiles as { age: number | null } | null
  const ageGroup = getAgeGroup(profile?.age || 0)

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("id, question_type, options, score_weight, assessment_domains(name)")
    .in("assessment_domains.name", assessment.domains)
    .eq("age_group", ageGroup)
    .eq("respondent_type", assessment.respondent_type)
    .eq("is_follow_up", assessment.assessment_type === "follow_up")

  if (questionsError) {
    return NextResponse.json({ error: "Failed to load questions" }, { status: 500 })
  }

  const serviceClient = createServiceRoleClient()
  const key = getAssessmentEncryptionKey()

  const { data: responseRows, error: responsesError } = await serviceClient
    .from("assessment_responses")
    .select("id, question_id")
    .eq("assessment_id", id)

  if (responsesError) {
    return NextResponse.json({ error: "Failed to load responses" }, { status: 500 })
  }

  const responseMap: Record<string, string> = {}
  for (const row of responseRows || []) {
    const { data: decrypted, error: decryptError } = await serviceClient.rpc("get_assessment_response", {
      p_response_id: row.id,
      p_key: key,
    })
    if (!decryptError && typeof decrypted === "string") {
      responseMap[row.question_id] = decrypted
    }
  }

  const questionsWithDomain: QuestionWithDomain[] = (questions || []).map((q: any) => ({
    id: q.id,
    question_type: q.question_type,
    options: q.options as string[],
    score_weight: q.score_weight,
    domain_name: q.assessment_domains?.name,
  }))

  const domainResults = computeDomainResults(questionsWithDomain, responseMap)

  for (const result of domainResults) {
    const { error: upsertError } = await serviceClient.rpc("upsert_assessment_result", {
      p_assessment_id: id,
      p_domain_name: result.domain_name,
      p_total_score: result.total_score,
      p_max_possible_score: result.max_possible_score,
      p_percentage_score: result.percentage_score,
      p_risk_level: result.risk_level,
      p_recommendations: null,
      p_key: key,
    })
    if (upsertError) {
      console.error("[api/assessments/complete] result upsert failed:", upsertError)
      return NextResponse.json({ error: "Failed to save results" }, { status: 500 })
    }
  }

  // Mark the assessment completed through the RLS-scoped client (the
  // assessments_update_own policy already permits this for the owner) rather
  // than the service-role client, keeping privileged access limited to the
  // encrypted tables that actually need it.
  const { error: updateError } = await supabase
    .from("assessments")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", id)

  if (updateError) {
    return NextResponse.json({ error: "Failed to mark assessment completed" }, { status: 500 })
  }

  return NextResponse.json({ results: domainResults })
}
