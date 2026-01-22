import type { UserRole } from "./roles";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isDemo?: boolean;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isDemo: boolean;
}
