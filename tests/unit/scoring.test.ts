import { describe, it, expect } from "vitest"
import {
  calculateScore,
  calculateMaxScore,
  riskLevelForPercentage,
  computeDomainResults,
  type QuestionWithDomain,
} from "@/lib/assessment/scoring"

// These are the highest-value tests in the repo: this is the actual
// clinical-risk computation, ported verbatim from the client-side
// calculateScore/calculateResults functions that used to live in
// components/assessment/assessment-questions.tsx (and were tamperable,
// since the client computed its own score and the server trusted it).

describe("calculateScore", () => {
  const likertQuestion = {
    id: "q1",
    question_type: "likert",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    score_weight: 2,
  }

  it("scores a likert response as optionIndex * score_weight", () => {
    expect(calculateScore(likertQuestion, "Never")).toBe(0)
    expect(calculateScore(likertQuestion, "Sometimes")).toBe(4) // index 2 * weight 2
    expect(calculateScore(likertQuestion, "Always")).toBe(8) // index 4 * weight 2
  })

  it("scores yes_no and multiple_choice the same way as likert", () => {
    const yesNo = { id: "q2", question_type: "yes_no", options: ["No", "Yes"], score_weight: 3 }
    expect(calculateScore(yesNo, "No")).toBe(0)
    expect(calculateScore(yesNo, "Yes")).toBe(3)

    const mc = { id: "q3", question_type: "multiple_choice", options: ["A", "B", "C"], score_weight: 1 }
    expect(calculateScore(mc, "C")).toBe(2)
  })

  it("returns 0 for an unknown question_type", () => {
    const weird = { id: "q4", question_type: "scale", options: ["A", "B"], score_weight: 5 }
    expect(calculateScore(weird, "B")).toBe(0)
  })

  it("returns a negative score (indexOf === -1) for a response not in options", () => {
    // This mirrors the original implementation's behavior exactly -- it's
    // exercised here so a future change to reject invalid options is a
    // deliberate decision, not an accidental behavior change. The API route
    // additionally validates response_value against question.options before
    // ever calling calculateScore, so this path shouldn't be reachable in
    // practice.
    expect(calculateScore(likertQuestion, "Not An Option")).toBe(-1 * 2)
  })
})

describe("calculateMaxScore", () => {
  it("is (options.length - 1) * score_weight", () => {
    expect(calculateMaxScore({ id: "q1", question_type: "likert", options: ["a", "b", "c"], score_weight: 3 })).toBe(6)
  })
})

describe("riskLevelForPercentage", () => {
  it("classifies using the original >=70 high / >=40 moderate / else low thresholds", () => {
    expect(riskLevelForPercentage(0)).toBe("low")
    expect(riskLevelForPercentage(39.999)).toBe("low")
    expect(riskLevelForPercentage(40)).toBe("moderate")
    expect(riskLevelForPercentage(69.999)).toBe("moderate")
    expect(riskLevelForPercentage(70)).toBe("high")
    expect(riskLevelForPercentage(100)).toBe("high")
  })
})

describe("computeDomainResults", () => {
  const questions: QuestionWithDomain[] = [
    { id: "q1", question_type: "likert", options: ["No", "Somewhat", "Yes"], score_weight: 1, domain_name: "ADHD" },
    { id: "q2", question_type: "likert", options: ["No", "Somewhat", "Yes"], score_weight: 1, domain_name: "ADHD" },
    {
      id: "q3",
      question_type: "yes_no",
      options: ["No", "Yes"],
      score_weight: 2,
      domain_name: "Autism Spectrum",
    },
  ]

  it("groups scores by domain and computes percentage + risk level", () => {
    const results = computeDomainResults(questions, { q1: "Yes", q2: "Somewhat", q3: "Yes" })

    const adhd = results.find((r) => r.domain_name === "ADHD")!
    expect(adhd.total_score).toBe(2 + 1) // q1: index2*1=2, q2: index1*1=1
    expect(adhd.max_possible_score).toBe(2 + 2) // (3-1)*1 each
    expect(adhd.percentage_score).toBeCloseTo(75)
    expect(adhd.risk_level).toBe("high")

    const autism = results.find((r) => r.domain_name === "Autism Spectrum")!
    expect(autism.total_score).toBe(2) // index1*2
    expect(autism.max_possible_score).toBe(2) // (2-1)*2
    expect(autism.percentage_score).toBeCloseTo(100)
    expect(autism.risk_level).toBe("high")
  })

  it("skips questions with no recorded response", () => {
    const results = computeDomainResults(questions, { q1: "No" })
    const adhd = results.find((r) => r.domain_name === "ADHD")!
    expect(adhd.total_score).toBe(0)
    expect(adhd.max_possible_score).toBe(2) // only q1 counted
    expect(results.find((r) => r.domain_name === "Autism Spectrum")).toBeUndefined()
  })

  it("returns an empty array when there are no responses at all", () => {
    expect(computeDomainResults(questions, {})).toEqual([])
  })
})
