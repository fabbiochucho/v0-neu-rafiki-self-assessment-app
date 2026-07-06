// Ground truth for roles is the `organization_members.role` column defined in
// scripts/004_expand_institutional_schema.sql:
//   role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'teacher', 'hr_staff', 'member'))
//
// This used to diverge from a second, unrelated role type
// (parent | teacher | policymaker | health_professional | admin) that only
// existed to support the now-deleted mock-auth/demo-role-switcher system.
// That type is gone; this file now mirrors the real database enum so the
// values used for institutional access control (e.g. app/admin/layout.tsx)
// can never drift from what's actually enforceable in the database.
export type UserRole = "admin" | "teacher" | "hr_staff" | "member"

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  teacher: "Teacher / Educator",
  hr_staff: "HR Staff",
  member: "Member",
}

/** Roles allowed to access the /admin institutional dashboard. */
export const ADMIN_PANEL_ROLES: UserRole[] = ["admin"]
