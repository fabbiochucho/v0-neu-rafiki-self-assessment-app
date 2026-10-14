import { describe, it, expect } from "vitest"
import {
  CORE_QUESTIONS,
  MAX_FOLLOW_UPS,
  followUpsFor,
  isMeaningfulChange,
  structuredAnswers,
  summaryText,
  trendFor,
  validateAnswers,
  type Answers,
} from "@/lib/check-in/rules"

const base: Answers = {
  frequency: "Sometimes", // score 2
  helped: ["A predictable routine"],
  harder: ["Tiredness"],
  visual_prompts: "A little",
  setting_difference: "About the same",
  recent_change: "No changes",
}

describe("check-in shape", () => {
  it("has 5-10 core questions", () => {
    expect(CORE_QUESTIONS.length).toBeGreaterThanOrEqual(5)
    expect(CORE_QUESTIONS.length + MAX_FOLLOW_UPS).toBeLessThanOrEqual(10)
  })
})

describe("meaningful change rule", () => {
  it("triggers on a frequency move of 2+ points from the previous check-in", () => {
    expect(isMeaningfulChange(base, 0)).toBe(true) // 2 vs 0
    expect(isMeaningfulChange(base, 4)).toBe(true) // 2 vs 4
    expect(isMeaningfulChange(base, 1)).toBe(false)
    expect(isMeaningfulChange(base, 3)).toBe(false)
  })

  it("on a first check-in, triggers only when it went well never/rarely", () => {
    expect(isMeaningfulChange(base, null)).toBe(false)
    expect(isMeaningfulChange({ ...base, frequency: "Rarely" }, null)).toBe(true)
  })

  it("triggers on any reported recent change", () => {
    expect(isMeaningfulChange({ ...base, recent_change: "Yes – health or sleep" }, 2)).toBe(true)
    expect(isMeaningfulChange({ ...base, recent_change: "Not sure" }, 2)).toBe(false)
  })

  it("adds at most 3 follow-ups, only when triggered", () => {
    expect(followUpsFor(base, 2)).toHaveLength(0)
    expect(followUpsFor(base, 0)).toHaveLength(3)
  })
})

describe("validateAnswers", () => {
  it("accepts a complete check-in", () => {
    expect(validateAnswers(base, 2)).toBeNull()
  })

  it("requires follow-ups once they are triggered", () => {
    expect(validateAnswers(base, 0)).toMatch(/Please answer/)
    const full = { ...base, change_when: "Mornings", change_duration: "Yes", review_plan: "Not now" }
    expect(validateAnswers(full, 0)).toBeNull()
  })

  it("rejects unknown options, unknown keys, and arrays on single-choice questions", () => {
    expect(validateAnswers({ ...base, frequency: "Always" }, 2)).toMatch(/Invalid/)
    expect(validateAnswers({ ...base, free_text: "hello" }, 2)).toMatch(/Unexpected/)
    expect(validateAnswers({ ...base, frequency: ["Often"] }, 2)).toMatch(/Only one/)
    // follow-up answers aren't accepted when not triggered
    expect(validateAnswers({ ...base, review_plan: "Yes" }, 2)).toMatch(/Unexpected/)
  })
})

describe("trend", () => {
  it("needs at least two check-ins", () => {
    expect(trendFor([])).toBe("not_enough_data")
    expect(trendFor([3])).toBe("not_enough_data")
  })
  it("compares the latest with the mean of up to 3 before it", () => {
    expect(trendFor([1, 1, 2])).toBe("improving")
    expect(trendFor([3, 3, 2])).toBe("declining")
    expect(trendFor([2, 3, 2])).toBe("steady")
    expect(trendFor([0, 4, 4, 4, 4])).toBe("steady") // only the last 3 prior count
  })
})

describe("ANDA summary", () => {
  it("contains option values only, never notes", () => {
    const answers = structuredAnswers(base)
    expect(answers.map((a) => a.question_key)).toEqual(Object.keys(base))
    expect(JSON.stringify(answers)).not.toMatch(/note/i)
    expect(summaryText("Morning routine", base)).toContain('Goal "Morning routine": went well sometimes')
  })
})
