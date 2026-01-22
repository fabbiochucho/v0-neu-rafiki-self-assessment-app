import type { AuthUser } from "./types";
import type { UserRole } from "./roles";

export function getMockUser(role?: UserRole): AuthUser {
  const demoRole =
    role ||
    (process.env.NEXT_PUBLIC_DEFAULT_DEMO_ROLE as UserRole) ||
    "parent";

  return {
    id: `demo-${demoRole}`,
    name: `Demo ${demoRole.charAt(0).toUpperCase()}${demoRole.slice(1).replace("_", " ")}`,
    email: `demo-${demoRole}@neurafiki.org`,
    role: demoRole,
    isDemo: true,
  };
}

export function isMockModeEnabled(): boolean {
  if (typeof process === "undefined") return false;
  return process.env.NEXT_PUBLIC_MOCK_AUTH === "true";
}

export function isDemoModeEnabled(): boolean {
  if (typeof process === "undefined") return false;
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}
