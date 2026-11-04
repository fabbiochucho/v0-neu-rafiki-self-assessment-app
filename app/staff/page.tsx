import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { allowed, requireStaff } from "@/lib/staff"
import { ROLE_LABELS, type Permission } from "@/lib/staff/permissions"

export const dynamic = "force-dynamic"
export const metadata = { title: "Staff | NeuRafiki", robots: { index: false } }

// Platform staff panel. Separate from /admin, which is for organisation admins.
const SECTIONS: { href: string; label: string; description: string; permission: Permission }[] = [
  { href: "/staff/newsletter", label: "Newsletter", description: "Write and send the opt-in newsletter.", permission: "newsletter.send" },
  { href: "/translations", label: "Translations", description: "Review screening translations (reviewer list).", permission: "translations.manage" },
  { href: "/staff/team", label: "Staff and roles", description: "Who can use this panel, and with which role.", permission: "staff.manage" },
  { href: "/staff/audit", label: "Audit log", description: "Every staff action, with before and after.", permission: "audit.read" },
]

export default async function StaffDashboardPage() {
  const staff = await requireStaff("dashboard.read")
  const can = allowed(staff, SECTIONS.map((s) => s.permission))

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 max-w-4xl">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Staff dashboard</h1>
          <p className="text-muted-foreground">
            Signed in as {staff.email} ({ROLE_LABELS[staff.role]}).
          </p>
        </header>
        <nav aria-label="Staff sections" className="grid sm:grid-cols-2 gap-4">
          {SECTIONS.filter((s) => can.has(s.permission)).map((s) => (
            <Link key={s.href} href={s.href} className="rounded-lg focus-visible:outline-2 focus-visible:outline-primary">
              <Card className="h-full hover:border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">{s.label}</CardTitle>
                  <CardDescription>{s.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  )
}
