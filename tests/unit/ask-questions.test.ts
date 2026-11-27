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

describe("expertSourceDraft", () => {
  it("is a draft owned by the answering clinician, so someone else must approve it", async () => {
    const { expertSourceDraft } = await import("@/lib/ask/questions")
    const row = expertSourceDraft(
      { id: "0b5c7e2a-1111-2222-3333-444455556666", question: "What is masking?", language: "en" },
      "Masking means hiding traits. ".repeat(3),
      { userId: "u1", email: "c@x.org" },
    )
    expect(row).toMatchObject({ status: "draft", origin: "expert_answer", created_by: "u1", publisher: "NeuRafiki clinician", key: "expert-0b5c7e2a" })
    expect(row.body.startsWith("# What is masking?")).toBe(true)
  })
})
