import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient, getAssessmentEncryptionKey } from "@/lib/supabase/service"
import { AssessmentQuestions } from "@/components/assessment/assessment-questions"
import { loadAssessmentQuestions } from "@/lib/assessment/questions"
import { isCompanionConfigured } from "@/lib/entitlements"

interface AssessmentQuestionsPageProps {
  params: Promise<{ id: string }>
}

export default async function AssessmentQuestionsPage({ params }: AssessmentQuestionsPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect(`/auth/login?redirect=${encodeURIComponent(`/assessment/${id}/questions`)}`)
  }

  // Get assessment details
  const { data: assessment, error: assessmentError } = await supabase
    .from("assessments")
    .select(`
      *,
      user_profiles(*)
    `)
    .eq("id", id)
    .single()

  if (assessmentError || !assessment) {
    redirect("/dashboard")
  }

  // Verify user owns this assessment
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("id", assessment.profile_id)
    .single()

  if (!profile || profile.user_id !== data.user.id) {
    redirect("/dashboard")
  }

  // A completed assessment can't take more answers -- send people to their results.
  if (assessment.status === "completed") {
    redirect(`/assessment/${id}/results`)
  }

  const { data: questions } = await loadAssessmentQuestions(supabase, assessment)

  // Get existing responses. response_value is stored encrypted at rest (see
  // scripts/010_encrypt_sensitive_columns.sql), so decryption must happen via
  // the service-role client + get_assessment_response(), never by selecting
  // the column directly with the anon/authenticated client.
  const serviceClient = createServiceRoleClient()
  const encryptionKey = getAssessmentEncryptionKey()
  const { data: encryptedResponses } = await serviceClient
    .from("assessment_responses")
    .select("id, question_id, score")
    .eq("assessment_id", id)

  const existingResponses = await Promise.all(
    (encryptedResponses || []).map(async (row) => {
      const { data: decrypted } = await serviceClient.rpc("get_assessment_response", {
        p_response_id: row.id,
        p_key: encryptionKey,
      })
      return {
        id: row.id,
        question_id: row.question_id,
        response_value: (decrypted as string | null) ?? "",
        score: row.score,
      }
    }),
  )

  return (
    <AssessmentQuestions
      assessment={assessment}
      questions={questions || []}
      existingResponses={existingResponses || []}
      companionEnabled={isCompanionConfigured()}
    />
  )
}
