import { describe, expect, it } from "vitest"
import { scrubUrl } from "@/lib/analytics-url"

describe("scrubUrl", () => {
  it("drops the query string and hash", () => {
    expect(scrubUrl("https://neurafiki.becomechange.institute/directory?profile=x#x")).toBe(
      "https://neurafiki.becomechange.institute/directory",
    )
  })
  it("replaces record ids", () => {
    expect(scrubUrl("https://a.example/learners/3f2b1c4d-1111-4abc-9def-0123456789ab/plan")).toBe(
      "https://a.example/learners/[id]/plan",
    )
  })
})
