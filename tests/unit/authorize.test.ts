import { describe, it, expect } from "vitest"
import { getOwnedAssessment } from "@/lib/assessment/authorize"

// Minimal fake mimicking the exact chain getOwnedAssessment uses:
//   supabase.from("assessments").select(...).eq("id", id).single()
function makeFakeSupabase(result: { data: unknown; error: unknown }) {
  const builder: any = {
    from: () => builder,
    select: () => builder,
    eq: () => builder,
    single: () => Promise.resolve(result),
  }
  return builder
}

describe("getOwnedAssessment", () => {
  it("returns null when the assessment doesn't exist", async () => {
    const supabase = makeFakeSupabase({ data: null, error: new Error("not found") })
    await expect(getOwnedAssessment(supabase, "assessment-1", "user-1")).resolves.toBeNull()
  })

  it("returns null when the assessment belongs to a different user", async () => {
    const supabase = makeFakeSupabase({
      data: { id: "assessment-1", user_profiles: { user_id: "someone-else" } },
      error: null,
    })
    await expect(getOwnedAssessment(supabase, "assessment-1", "user-1")).resolves.toBeNull()
  })

  it("returns null when the assessment has no linked profile", async () => {
    const supabase = makeFakeSupabase({ data: { id: "assessment-1", user_profiles: null }, error: null })
    await expect(getOwnedAssessment(supabase, "assessment-1", "user-1")).resolves.toBeNull()
  })

  it("returns the assessment when the caller owns the profile behind it", async () => {
    const assessment = { id: "assessment-1", user_profiles: { user_id: "user-1" } }
    const supabase = makeFakeSupabase({ data: assessment, error: null })
    await expect(getOwnedAssessment(supabase, "assessment-1", "user-1")).resolves.toEqual(assessment)
  })
})
