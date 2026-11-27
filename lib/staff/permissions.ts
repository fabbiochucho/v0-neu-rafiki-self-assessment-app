// Admin roles and what each may do. The one place permissions are defined: server checks
// (lib/staff.ts) and the links shown in the admin panel both read from here.

export const STAFF_ROLES = ["super_admin", "support", "finance", "engineering", "read_only", "clinical_reviewer"] as const
export type StaffRole = (typeof STAFF_ROLES)[number]

export const ROLE_LABELS: Record<StaffRole, string> = {
  super_admin: "Super admin",
  support: "Support",
  finance: "Finance",
  engineering: "Engineering",
  read_only: "Read-only",
  clinical_reviewer: "Clinical reviewer",
}

export const PERMISSIONS = [
  "dashboard.read",
  "audit.read",
  "staff.manage",
  "users.read",
  "users.reveal_pii",
  "users.view_as", // read-only "view as" only: no acting as a user on NeuRafiki (children's data)
  "users.suspend",
  "users.manage", // password reset, revoke sessions, verify email, soft-delete and restore
  "billing.read",
  "billing.refund",
  "features.edit",
  "content.edit",
  "content.publish",
  "newsletter.send",
  "newsletter.export",
  "translations.manage",
  "support.notes",
  "exports.run",
  "bulk.run",
  "health.read",
  "knowledge.edit", // add and edit draft sources and test questions
  "knowledge.approve", // editorial approval of a source; interim until a clinician joins (spec section 7)
  "clinical.approve", // clinical approval and answering questions sent to a clinician. Never super_admin: a named clinician only.
] as const
export type Permission = (typeof PERMISSIONS)[number]

const READ: Permission[] = ["dashboard.read", "users.read", "billing.read", "health.read"]

export const ROLE_PERMISSIONS: Record<StaffRole, readonly Permission[]> = {
  super_admin: PERMISSIONS.filter((p) => p !== "clinical.approve"),
  support: [...READ, "users.reveal_pii", "users.view_as", "users.suspend", "users.manage", "support.notes"],
  finance: [...READ, "billing.refund", "users.reveal_pii", "exports.run"],
  engineering: [...READ, "audit.read", "features.edit", "translations.manage"],
  read_only: READ,
  clinical_reviewer: ["dashboard.read", "health.read", "knowledge.edit", "clinical.approve"],
}

export function can(role: StaffRole | null | undefined, permission: Permission): boolean {
  return !!role && ROLE_PERMISSIONS[role].includes(permission)
}

export const isStaffRole = (v: unknown): v is StaffRole => STAFF_ROLES.includes(v as StaffRole)
