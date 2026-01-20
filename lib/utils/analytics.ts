import { createClient } from "@/lib/supabase/server"

export interface AssessmentMetrics {
  totalAssessments: number
  completedAssessments: number
  pendingAssessments: number
  averageCompletionTime: number
  riskDistribution: {
    high: number
    moderate: number
    low: number
  }
  domainPerformance: Record<string, { avgScore: number; riskCount: number }>
}

export interface UserEngagement {
  newUsersThisMonth: number
  activeUsersThisMonth: number
  totalUsers: number
  returnRate: number
  avgAssessmentsPerUser: number
}

export async function getAssessmentMetrics(organizationId?: string): Promise<AssessmentMetrics> {
  const supabase = await createClient()

  let assessmentQuery = supabase.from("assessments").select("*")
  let resultsQuery = supabase.from("assessment_results").select("*")

  if (organizationId) {
    assessmentQuery = assessmentQuery.eq("organization_id", organizationId)
    resultsQuery = resultsQuery.eq("organization_id", organizationId)
  }

  const { data: assessments } = await assessmentQuery
  const { data: results } = await resultsQuery

  const totalAssessments = assessments?.length || 0
  const completedAssessments = assessments?.filter((a) => a.status === "completed").length || 0
  const pendingAssessments = totalAssessments - completedAssessments

  // Calculate average completion time in minutes
  const completionTimes = (assessments || [])
    .filter((a) => a.completed_at && a.created_at)
    .map((a) => {
      const start = new Date(a.created_at).getTime()
      const end = new Date(a.completed_at).getTime()
      return (end - start) / 1000 / 60
    })

  const averageCompletionTime =
    completionTimes.length > 0 ? Math.round(completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length) : 0

  // Risk distribution
  const riskDistribution = {
    high: results?.filter((r) => r.risk_level === "high").length || 0,
    moderate: results?.filter((r) => r.risk_level === "moderate").length || 0,
    low: results?.filter((r) => r.risk_level === "low").length || 0,
  }

  // Domain performance
  const domainPerformance: Record<string, { avgScore: number; riskCount: number }> = {}
  results?.forEach((result) => {
    if (!domainPerformance[result.domain_name]) {
      domainPerformance[result.domain_name] = { avgScore: 0, riskCount: 0 }
    }
    domainPerformance[result.domain_name].avgScore = result.percentage_score
    if (result.risk_level === "high") {
      domainPerformance[result.domain_name].riskCount += 1
    }
  })

  return {
    totalAssessments,
    completedAssessments,
    pendingAssessments,
    averageCompletionTime,
    riskDistribution,
    domainPerformance,
  }
}

export async function getUserEngagement(organizationId?: string): Promise<UserEngagement> {
  const supabase = await createClient()

  // Get total users
  let usersQuery = supabase.from("user_profiles").select("*", { count: "exact", head: true })
  if (organizationId) {
    usersQuery = usersQuery.eq("organization_id", organizationId)
  }
  const { count: totalUsers } = await usersQuery

  // Get new users this month
  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)

  let newUsersQuery = supabase
    .from("user_profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", thisMonth.toISOString())

  if (organizationId) {
    newUsersQuery = newUsersQuery.eq("organization_id", organizationId)
  }
  const { count: newUsersThisMonth } = await newUsersQuery

  // Get active users this month
  let activeUsersQuery = supabase
    .from("assessments")
    .select("user_id", { count: "exact", head: true })
    .gte("created_at", thisMonth.toISOString())

  if (organizationId) {
    activeUsersQuery = activeUsersQuery.eq("organization_id", organizationId)
  }
  const { count: activeUsersThisMonth } = await activeUsersQuery

  // Average assessments per user
  const { data: assessmentsData } = await supabase
    .from("assessments")
    .select("user_id")

  const assessmentsPerUser = assessmentsData
    ? assessmentsData.reduce((acc: Record<string, number>, a) => {
        acc[a.user_id] = (acc[a.user_id] || 0) + 1
        return acc
      }, {})
    : {}

  const avgAssessmentsPerUser = Object.values(assessmentsPerUser).length > 0
    ? Object.values(assessmentsPerUser).reduce((a: number, b: number) => a + b, 0) / Object.values(assessmentsPerUser).length
    : 0

  const returnRate = totalUsers ? Math.round((activeUsersThisMonth! / totalUsers) * 100) : 0

  return {
    newUsersThisMonth: newUsersThisMonth || 0,
    activeUsersThisMonth: activeUsersThisMonth || 0,
    totalUsers: totalUsers || 0,
    returnRate,
    avgAssessmentsPerUser: Math.round(avgAssessmentsPerUser * 100) / 100,
  }
}

export async function logPageView(pageName: string, userId?: string) {
  // This would typically send to a analytics service like Sentry, DataDog, or similar
  console.log(`[Analytics] Page view: ${pageName} - User: ${userId || "anonymous"}`)
}

export async function logAssessmentStart(assessmentId: string, userId: string) {
  console.log(`[Analytics] Assessment started: ${assessmentId} - User: ${userId}`)
}

export async function logAssessmentComplete(assessmentId: string, userId: string, completionTime: number) {
  console.log(`[Analytics] Assessment completed: ${assessmentId} - User: ${userId} - Time: ${completionTime}ms`)
}

export async function logError(error: Error, context: Record<string, string>) {
  console.error("[Analytics] Error logged:", { error: error.message, ...context })
  // This would be sent to error tracking service in production
}
