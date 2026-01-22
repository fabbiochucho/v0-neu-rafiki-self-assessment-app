"use client";

import { ROLE_LABELS } from "@/lib/auth/roles";
import type { UserRole } from "@/lib/auth/roles";

export function RoleSwitcher({
  onChange,
}: {
  onChange: (role: UserRole) => void;
}) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg p-4 rounded-lg z-50 border border-gray-200">
      <p className="text-xs font-semibold mb-3 text-gray-600">
        Demo Role Switcher
      </p>
      <select
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => onChange(e.target.value as UserRole)}
        defaultValue="parent"
      >
        {Object.entries(ROLE_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
