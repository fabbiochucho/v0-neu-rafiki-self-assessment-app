import { describe, it, expect } from "vitest"
import { companionPath } from "@/lib/companion/path"
import { FEATURES } from "@/lib/features"

describe("companionPath", () => {
  it("is unchanged for people without ai.ask (Review Focus 4)", () => {
    for (const mode of ["before", "during", "after"] as const) expect(companionPath(mode, false)).toBe("legacy")
  })
  it("wording help during a screening skips retrieval", () => expect(companionPath("during", true)).toBe("clarify"))
  it("before and after use approved answers", () => {
    expect(companionPath("before", true)).toBe("verified")
    expect(companionPath("after", true)).toBe("verified")
  })
  it("all three switches exist", () => {
    expect(FEATURES).toHaveProperty("ai.ask")
    expect(FEATURES).toHaveProperty("ai.companion.freeform")
    expect(FEATURES).toHaveProperty("ai.ask.handoff")
  })
})

describe("switches that must fail closed (final review)", () => {
  it("ai.ask and ai.ask.handoff are off when their row is missing, e.g. code deployed before migration 031", async () => {
    const { resolveFeature, FEATURE_DEFAULT_OFF } = await import("@/lib/features")
    expect([...FEATURE_DEFAULT_OFF].sort()).toEqual(["ai.ask", "ai.ask.handoff"])
    expect(resolveFeature(null, [], { userId: "u" }, false)).toBe(false)
    // Every other switch keeps the existing rule: no row means on.
    expect(resolveFeature(null, [], { userId: "u" })).toBe(true)
  })
})
