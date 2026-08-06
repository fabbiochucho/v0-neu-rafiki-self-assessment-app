import { describe, it, expect } from "vitest"
import { hasActiveAllianceLink, hasValidFederationSyncConsent } from "@/lib/federation/authorize"

function makeFakeSupabase(result: { data: unknown[] | null; error: unknown }) {
  const builder: any = {
    from: () => builder,
    select: () => builder,
    eq: () => builder,
    contains: () => builder,
    is: () => builder,
    limit: () => Promise.resolve(result),
  }
  return builder
}

describe("hasActiveAllianceLink", () => {
  it("is false when there's no matching linked_accounts row", async () => {
    const supabase = makeFakeSupabase({ data: [], error: null })
    await expect(hasActiveAllianceLink(supabase, "user-1", "assessment_results")).resolves.toBe(false)
  })

  it("is false when the query errors", async () => {
    const supabase = makeFakeSupabase({ data: null, error: new Error("boom") })
    await expect(hasActiveAllianceLink(supabase, "user-1", "assessment_results")).resolves.toBe(false)
  })

  it("is true when an active, in-scope link exists", async () => {
    const supabase = makeFakeSupabase({ data: [{ id: "link-1", scopes: ["assessment_results"] }], error: null })
    await expect(hasActiveAllianceLink(supabase, "user-1", "assessment_results")).resolves.toBe(true)
  })
})

describe("hasValidFederationSyncConsent", () => {
  it("is false when there's no non-revoked federation_sync consent", async () => {
    const supabase = makeFakeSupabase({ data: [], error: null })
    await expect(hasValidFederationSyncConsent(supabase, "profile-1")).resolves.toBe(false)
  })

  it("is true when a non-revoked federation_sync consent exists", async () => {
    const supabase = makeFakeSupabase({ data: [{ id: "consent-1" }], error: null })
    await expect(hasValidFederationSyncConsent(supabase, "profile-1")).resolves.toBe(true)
  })
})
