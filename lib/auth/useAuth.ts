"use client";

import { useMemo, useState, useEffect } from "react";
import { getMockUser, isMockModeEnabled } from "./mockAuth";
import type { AuthUser, UseAuthReturn } from "./types";
import type { UserRole } from "./roles";

export function useAuth(initialRole?: UserRole): UseAuthReturn {
  const [demoRole, setDemoRole] = useState<UserRole>(initialRole || "parent");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = useMemo(() => {
    if (!mounted) return null;

    if (isMockModeEnabled()) {
      return getMockUser(demoRole);
    }

    // TODO: Replace with real auth (Supabase, Clerk, etc.)
    return null;
  }, [mounted, demoRole]);

  return {
    user,
    isAuthenticated: !!user,
    isDemo: !!user?.isDemo,
  };
}

export function useDemoRole(initialRole?: UserRole) {
  const [demoRole, setDemoRole] = useState<UserRole>(
    initialRole || (process.env.NEXT_PUBLIC_DEFAULT_DEMO_ROLE as UserRole) || "parent"
  );

  const user = useMemo(() => getMockUser(demoRole), [demoRole]);

  return { user, setDemoRole };
}
