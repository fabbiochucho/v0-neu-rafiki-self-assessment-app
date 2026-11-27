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
