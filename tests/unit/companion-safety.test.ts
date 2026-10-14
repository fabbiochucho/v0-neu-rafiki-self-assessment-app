import { describe, it, expect } from "vitest"
import { containsDiagnosticClaim, isCrisisMessage, CRISIS_REPLY } from "@/lib/companion/safety"
import { systemPromptFor } from "@/lib/companion/prompts"
import { AI_DAILY_LIMIT, entitlementsFor } from "@/lib/entitlements"

describe("crisis pre-check", () => {
  it.each([
    "I want to kill myself",
    "sometimes I think about suicide",
    "my son said he wants to die",
    "I've been self-harming",
    "I don't want to be alive anymore",
  ])("routes %j to human help", (text) => {
    expect(isCrisisMessage(text)).toBe(true)
  })

  it.each(["What does 'repetitive behaviour' mean?", "How long does this take?", "Is this a diagnosis?"])(
    "lets ordinary questions through: %j",
    (text) => {
      expect(isCrisisMessage(text)).toBe(false)
    },
  )

  it("points to findahelpline.com and contains no phone numbers", () => {
    expect(CRISIS_REPLY).toContain("https://findahelpline.com")
    expect(CRISIS_REPLY).not.toMatch(/\d{3}/)
  })
})

describe("diagnostic-claim guard", () => {
  it("catches diagnosis statements", () => {
    expect(containsDiagnosticClaim("Based on this, you are autistic.")).toBe(true)
    expect(containsDiagnosticClaim("Your child has ADHD.")).toBe(true)
  })
  it("allows careful wording", () => {
    expect(
      containsDiagnosticClaim(
        "Your responses indicate elevated traits in areas commonly associated with ADHD. This screening does not establish a diagnosis.",
      ),
    ).toBe(false)
  })
})

describe("system prompts", () => {
  it("during mode forbids suggesting answers", () => {
    const p = systemPromptFor("during")
    expect(p).toMatch(/Never suggest, hint at, rank, or infer an answer/)
    expect(p).toMatch(/does not establish a diagnosis|never provides a diagnosis/)
  })
})

describe("plan gating", () => {
  it("free has a smaller daily allowance than premium", () => {
    expect(AI_DAILY_LIMIT.free).toBeLessThan(AI_DAILY_LIMIT.premium)
  })
  it("follow-up is premium-only; assessment and check-ins are always on", () => {
    expect(entitlementsFor("free")).toMatchObject({ assessment: true, check_ins: true, follow_up: false })
    expect(entitlementsFor("premium").follow_up).toBe(true)
  })
})
