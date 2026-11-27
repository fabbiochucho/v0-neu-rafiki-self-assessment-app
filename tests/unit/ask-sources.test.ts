import { describe, it, expect } from "vitest"
import { canApproveEditorial, canReviewClinically, validateSource } from "@/lib/ask/sources"

const fd = (o: Record<string, string>) => {
  const f = new FormData()
  for (const [k, v] of Object.entries(o)) f.set(k, v)
  return f
}
const good = {
  key: "cdc-asd-signs",
  title: "Signs of autism",
  publisher: "CDC",
  url: "https://www.cdc.gov/autism/signs-symptoms/",
  licence: "US federal public domain",
  language: "en",
  origin: "agency_text",
  body: "# Signs\n\n" + "text ".repeat(20),
}

describe("canApproveEditorial", () => {
  it("an owner can approve a Claude draft", () =>
    expect(canApproveEditorial({ userId: "a", role: "super_admin" }, { status: "draft", created_by: null })).toBe(true))
  it("not a draft they added themselves (Review Focus 2)", () =>
    expect(canApproveEditorial({ userId: "a", role: "super_admin" }, { status: "draft", created_by: "a" })).toBe(false))
  it("support staff cannot", () =>
    expect(canApproveEditorial({ userId: "a", role: "support" }, { status: "draft", created_by: null })).toBe(false))
  it("only drafts", () =>
    expect(canApproveEditorial({ userId: "a", role: "super_admin" }, { status: "approved", created_by: null })).toBe(false))
})

describe("canReviewClinically", () => {
  const approved = { status: "approved", review: "editorial", created_by: "b" }
  it("a clinical reviewer can upgrade someone else's approved source", () =>
    expect(canReviewClinically({ userId: "a", role: "clinical_reviewer" }, approved)).toBe(true))
  it("not their own", () =>
    expect(canReviewClinically({ userId: "b", role: "clinical_reviewer" }, approved)).toBe(false))
  it("owners cannot give clinical review", () =>
    expect(canReviewClinically({ userId: "a", role: "super_admin" }, approved)).toBe(false))
  it("not twice, and not drafts", () => {
    expect(canReviewClinically({ userId: "a", role: "clinical_reviewer" }, { ...approved, review: "clinical" })).toBe(false)
    expect(canReviewClinically({ userId: "a", role: "clinical_reviewer" }, { ...approved, status: "draft" })).toBe(false)
  })
})

describe("validateSource", () => {
  it("accepts a complete source", () => expect(validateSource(fd(good)).ok).toBe(true))
  it("rejects non-commercial licences", () => {
    expect(validateSource(fd({ ...good, licence: "CC BY-NC-SA 3.0 IGO" })).ok).toBe(false)
    expect(validateSource(fd({ ...good, licence: "Non-commercial use only" })).ok).toBe(false)
  })
  it("rejects http links, bad keys and unknown origins", () => {
    expect(validateSource(fd({ ...good, url: "http://x.org" })).ok).toBe(false)
    expect(validateSource(fd({ ...good, key: "Bad Key" })).ok).toBe(false)
    expect(validateSource(fd({ ...good, origin: "blog" })).ok).toBe(false)
  })
})
