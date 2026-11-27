import { describe, it, expect } from "vitest"
import { validateEscalation } from "@/lib/ask/questions"

describe("validateEscalation", () => {
  it("needs consent", () => {
    expect(validateEscalation({ question: "What is screening?", language: "en", consent: false })).toMatchObject({ ok: false })
  })
  it("never stores a crisis message: returns crisis instead (Review Focus 1)", () => {
    expect(validateEscalation({ question: "I want to kill myself", language: "en", consent: true })).toEqual({ ok: false, crisis: true })
  })
  it("rejects too short, too long and unknown languages", () => {
    expect(validateEscalation({ question: "hi", language: "en", consent: true }).ok).toBe(false)
    expect(validateEscalation({ question: "x".repeat(1001), language: "en", consent: true }).ok).toBe(false)
    expect(validateEscalation({ question: "What is screening?", language: "de", consent: true }).ok).toBe(false)
  })
  it("accepts a normal question and trims it; a ticked form box counts as consent", () => {
    expect(validateEscalation({ question: "  What is screening?  ", language: "sw", consent: "on" })).toEqual({
      ok: true,
      question: "What is screening?",
      language: "sw",
    })
  })
})
