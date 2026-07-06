import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient, getAssessmentEncryptionKey } from "@/lib/supabase/service"
import { getOwnedAssessment } from "@/lib/assessment/authorize"
import { calculateScore } from "@/lib/assessment/scoring"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET: returns this assessment's previously-saved responses, decrypted, so
 * the questions UI can prefill answers the user already gave. Reads go
 * through the service-role client + get_assessment_response() so the API
 * layer (not the browser) is what handles decryption.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
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

  const serviceClient = createServiceRoleClient()
  const key = getAssessmentEncryptionKey()

  const { data: rows, error } = await serviceClient
    .from("assessment_responses")
    .select("id, question_id, score")
    .eq("assessment_id", id)

  if (error) {
    return NextResponse.json({ error: "Failed to load responses" }, { status: 500 })
  }

  const responses = await Promise.all(
    (rows || []).map(async (row) => {
      const { data: decrypted, error: decryptError } = await serviceClient.rpc("get_assessment_response", {
        p_response_id: row.id,
        p_key: key,
      })
      if (decryptError) {
        return { question_id: row.question_id, response_value: null, score: row.score }
      }
      return { question_id: row.question_id, response_value: decrypted as string | null, score: row.score }
    }),
  )

  return NextResponse.json({ responses })
}

/**
 * POST: accepts { question_id, response_value }, looks up the question
 * server-side (so a client can never supply its own score/weight), computes
 * the score using the server-ported scoring logic, and upserts the response
 * (encrypted) via the service-role client. The caller must be authenticated
 * and own the assessment.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
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

  if (assessment.status === "completed") {
    return NextResponse.json({ error: "This assessment has already been completed" }, { status: 409 })
  }

  let body: { question_id?: string; response_value?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { question_id, response_value } = body
  if (typeof question_id !== "string" || typeof response_value !== "string" || !response_value) {
    return NextResponse.json({ error: "question_id and response_value are required" }, { status: 400 })
  }

  // Look up the question server-side -- never trust a client-supplied score
  // or weight. Also verify the question actually belongs to this
  // assessment (matching domain, respondent type, and baseline/follow-up
  // status), so a tampered question_id from an unrelated assessment can't be
  // used to smuggle in an out-of-context score.
  const { data: question, error: questionError } = await supabase
    .from("questions")
    .select("id, question_type, options, score_weight, respondent_type, is_follow_up, assessment_domains(name)")
    .eq("id", question_id)
    .single()

  if (questionError || !question) {
    return NextResponse.json({ error: "Unknown question" }, { status: 400 })
  }

  const domainName = (question as any).assessment_domains?.name
  const belongsToAssessment =
    assessment.domains?.includes(domainName) &&
    question.respondent_type === assessment.respondent_type &&
    question.is_follow_up === (assessment.assessment_type === "follow_up")

  if (!belongsToAssessment) {
    return NextResponse.json({ error: "Question does not belong to this assessment" }, { status: 400 })
  }

  if (!Array.isArray(question.options) || !question.options.includes(response_value)) {
    return NextResponse.json({ error: "response_value is not a valid option for this question" }, { status: 400 })
  }

  const score = calculateScore(
    {
      id: question.id,
      question_type: question.question_type,
      options: question.options as string[],
      score_weight: question.score_weight,
    },
    response_value,
  )

  const serviceClient = createServiceRoleClient()
  const key = getAssessmentEncryptionKey()

  const { data: responseId, error: upsertError } = await serviceClient.rpc("upsert_assessment_response", {
    p_assessment_id: id,
    p_question_id: question_id,
    p_response_value: response_value,
    p_score: score,
    p_key: key,
  })

  if (upsertError) {
    console.error("[api/assessments/responses] upsert failed:", upsertError)
    return NextResponse.json({ error: "Failed to save response" }, { status: 500 })
  }

  return NextResponse.json({ id: responseId, score })
}
