import type React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LayoutDashboard, Users, Settings, BarChart3 } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ADMIN_PANEL_ROLES } from "@/lib/auth/roles"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Ground truth for roles is organization_members.role (see
  // scripts/004_expand_institutional_schema.sql / lib/auth/roles.ts). A user
  // may administer more than one organization; they only need an 'admin'
  // role on at least one to reach this panel.
  const { data: adminMemberships } = await supabase
    .from("organization_members")
    .select("id")
    .eq("user_id", user.id)
    .in("role", ADMIN_PANEL_ROLES)
    .limit(1)

  if (!adminMemberships || adminMemberships.length === 0) {
    redirect("/")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card">
        <div className="p-6">
          <h2 className="text-lg font-bold">NeuRafiki Admin</h2>
        </div>
        <nav className="space-y-2 px-3">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/organizations"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <Users className="h-4 w-4" />
            Organizations
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
