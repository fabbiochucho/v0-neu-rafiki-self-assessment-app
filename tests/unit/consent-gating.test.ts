import { describe, it, expect } from "vitest"
import { hasValidAssessmentConsent } from "@/lib/assessment/authorize"

// Minimal fake that mimics the exact Supabase query-builder chain used by
// hasValidAssessmentConsent:
//   supabase.from("consents").select("id").eq(...).eq(...).is(...).limit(...)
// Each method returns `this` except the terminal call, which resolves the
// promise-like result. Since the real chain is awaited as a thenable, we
// return a plain object with a `.then` for the terminal `.limit()` call so
// `await` works without needing a real Supabase client.
function makeFakeSupabase(result: { data: unknown[] | null; error: unknown }) {
  const builder: any = {
    from: () => builder,
    select: () => builder,
    eq: () => builder,
    is: () => builder,
    limit: () => Promise.resolve(result),
  }
  return builder
}

describe("hasValidAssessmentConsent", () => {
  it("rejects (false) when there is no matching consent row at all", async () => {
    const supabase = makeFakeSupabase({ data: [], error: null })
    await expect(hasValidAssessmentConsent(supabase, "profile-1")).resolves.toBe(false)
  })

  it("rejects (false) when the query errors", async () => {
    const supabase = makeFakeSupabase({ data: null, error: new Error("boom") })
    await expect(hasValidAssessmentConsent(supabase, "profile-1")).resolves.toBe(false)
  })

  it("accepts (true) when a non-revoked assessment_data consent row exists", async () => {
    // .is("revoked_at", null) is part of the query itself -- a revoked
    // consent (revoked_at IS NOT NULL) would never be returned by Postgres,
    // so this fake only needs to simulate "the DB found one valid row".
    const supabase = makeFakeSupabase({ data: [{ id: "consent-1" }], error: null })
    await expect(hasValidAssessmentConsent(supabase, "profile-1")).resolves.toBe(true)
  })
})
