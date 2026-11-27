import { describe, it, expect } from "vitest"
import { can, STAFF_ROLES, ROLE_LABELS } from "@/lib/staff/permissions"

describe("clinical roles", () => {
  it("only clinical reviewers can give clinical approval", () => {
    expect(can("clinical_reviewer", "clinical.approve")).toBe(true)
    for (const role of STAFF_ROLES.filter((r) => r !== "clinical_reviewer")) {
      expect(can(role, "clinical.approve")).toBe(false)
    }
  })
  it("super admins give editorial approval until a clinician joins (spec §7)", () => {
    expect(can("super_admin", "knowledge.approve")).toBe(true)
    expect(can("support", "knowledge.approve")).toBe(false)
    expect(can("engineering", "knowledge.approve")).toBe(false)
  })
  it("super admins and clinical reviewers can edit drafts", () => {
    expect(can("super_admin", "knowledge.edit")).toBe(true)
    expect(can("clinical_reviewer", "knowledge.edit")).toBe(true)
    expect(can("support", "knowledge.edit")).toBe(false)
  })
  it("clinical reviewers see nothing else sensitive", () => {
    expect(can("clinical_reviewer", "users.reveal_pii")).toBe(false)
    expect(can("clinical_reviewer", "billing.read")).toBe(false)
    expect(ROLE_LABELS.clinical_reviewer).toBe("Clinical reviewer")
  })
})
