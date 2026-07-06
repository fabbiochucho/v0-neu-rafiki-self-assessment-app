// Server-side assessment scoring logic.
//
// Ported verbatim from the client-side calculateScore/calculateResults
// functions that used to live in components/assessment/assessment-questions.tsx.
// That component computed scores in the browser and wrote them straight to
// Supabase, which meant a user could tamper with a request to alter their own
// (or someone else's) risk scores. This module is now the single source of
// truth for scoring and is only ever invoked from server-side API routes.
//
// IMPORTANT: the thresholds and formulas below are intentionally unchanged
// from the original client-side implementation.

export interface ScorableQuestion {
  id: string
  question_type: string
  options: string[]
  score_weight: number
}

export type RiskLevel = "low" | "moderate" | "high"

export interface DomainResult {
  domain_name: string
  total_score: number
  max_possible_score: number
  percentage_score: number
  risk_level: RiskLevel
}

/**
 * Score a single question response. Mirrors the original client-side
 * calculateScore(): for likert/yes_no/multiple_choice questions, the score is
 * the index of the chosen option (in the question's options array)
 * multiplied by the question's score_weight. Unknown question types score 0.
 */
export function calculateScore(question: ScorableQuestion, responseValue: string): number {
  const options = question.options
  const responseIndex = options.indexOf(responseValue)

  if (question.question_type === "likert") {
    return responseIndex * question.score_weight
  } else if (question.question_type === "yes_no" || question.question_type === "multiple_choice") {
    return responseIndex * question.score_weight
  }

  return 0
}

/** The maximum possible score for a single question. */
export function calculateMaxScore(question: ScorableQuestion): number {
  return (question.options.length - 1) * question.score_weight
}

/** Maps a percentage score to a risk level using the original thresholds. */
export function riskLevelForPercentage(percentage: number): RiskLevel {
  if (percentage >= 70) return "high"
  if (percentage >= 40) return "moderate"
  return "low"
}

export interface QuestionWithDomain extends ScorableQuestion {
  domain_name: string
}

/**
 * Compute final per-domain results for a completed assessment, given the set
 * of questions (with their domain name attached) and a map of
 * question_id -> response_value. Mirrors the original client-side
 * calculateResults().
 */
export function computeDomainResults(
  questions: QuestionWithDomain[],
  responses: Record<string, string>,
): DomainResult[] {
  const domainScores: Record<string, { total: number; max: number }> = {}

  for (const question of questions) {
    const response = responses[question.id]
    if (!response) continue

    const score = calculateScore(question, response)
    const maxScore = calculateMaxScore(question)

    if (!domainScores[question.domain_name]) {
      domainScores[question.domain_name] = { total: 0, max: 0 }
    }

    domainScores[question.domain_name].total += score
    domainScores[question.domain_name].max += maxScore
  }

  return Object.entries(domainScores).map(([domain_name, scores]) => {
    const percentage_score = scores.max > 0 ? (scores.total / scores.max) * 100 : 0
    return {
      domain_name,
      total_score: scores.total,
      max_possible_score: scores.max,
      percentage_score,
      risk_level: riskLevelForPercentage(percentage_score),
    }
  })
}
