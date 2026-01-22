export type UserRole =
  | "parent"
  | "teacher"
  | "policymaker"
  | "health_professional"
  | "admin";

export const ROLE_LABELS: Record<UserRole, string> = {
  parent: "Parent / Caregiver",
  teacher: "Teacher / Tutor",
  policymaker: "Policymaker",
  health_professional: "Health Professional",
  admin: "Administrator",
};
