import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AssessmentQuestions } from "@/components/assessment/assessment-questions"

interface AssessmentQuestionsPageProps {
  params: Promise<{ id: string }>
}

export default async function AssessmentQuestionsPage({ params }: AssessmentQuestionsPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
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

  // Get questions for selected domains and age group
  const profileAge = assessment.user_profiles?.age || 0
  const getAgeGroup = (age: number) => {
    if (age <= 5) return "Toddlers (2-5)"
    if (age <= 18) return "Children/Adolescents (6-18)"
    return "Adults (18+)"
  }

  const ageGroup = getAgeGroup(profileAge)

  const { data: questions } = await supabase
    .from("questions")
    .select(`
      *,
      assessment_domains(name)
    `)
    .in("assessment_domains.name", assessment.domains)
    .eq("age_group", ageGroup)
    .eq("respondent_type", assessment.respondent_type)
    .eq("is_follow_up", assessment.assessment_type === "follow_up")
    .order("domain_id")
    .order("question_id")

  // Get existing responses
  const { data: existingResponses } = await supabase.from("assessment_responses").select("*").eq("assessment_id", id)

  return (
    <AssessmentQuestions
      assessment={assessment}
      questions={questions || []}
      existingResponses={existingResponses || []}
    />
  )
}
