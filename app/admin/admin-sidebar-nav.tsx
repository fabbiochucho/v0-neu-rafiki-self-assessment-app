"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Settings, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/organizations", label: "Organizations", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

/**
 * Sidebar navigation for the admin panel. This is a client component (rather
 * than being inlined in the server-rendered app/admin/layout.tsx) so it can
 * use usePathname() to mark the active link with aria-current="page" --
 * without this, screen reader / keyboard users have no way to tell which
 * section of the admin panel they're currently in.
 */
export function AdminSidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-2 px-3">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        // "/admin" should only be active on an exact match; nested routes
        // (e.g. /admin/organizations/[id]/members) should keep their parent
        // link marked current.
        const isActive = href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href)

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted",
              isActive && "bg-muted",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
