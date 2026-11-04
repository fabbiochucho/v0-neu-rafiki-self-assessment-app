import Link from "next/link"
import { notFound } from "next/navigation"
import { StaffPage } from "@/components/staff/staff-page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { requireStaff } from "@/lib/staff"
import { logAdminAction } from "@/lib/staff/audit"
import { getPlan } from "@/lib/entitlements"

export const dynamic = "force-dynamic"
export const metadata = { title: "View as | NeuRafiki staff", robots: { index: false } }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const date = (d: string | null) => (d ? d.slice(0, 10) : "–")

// Read-only "view as": staff see what the account holds, to help them, without signing in as
// them or being able to change anything. Screening answers, results and check-in answers are
// encrypted health data and never shown; nor are dates of birth, ethnicity or religion.
export default async function ViewAsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ reason?: string }>
}) {
  const staff = await requireStaff("users.view_as")
  const { id } = await params
  const reason = (await searchParams).reason?.trim().slice(0, 300) ?? ""
  if (!UUID.test(id)) notFound()
  const back = { href: `/staff/users/${id}`, label: "Back to the account" }

  if (reason.length < 5) {
    return (
      <StaffPage title="View as this user (read-only)" back={back}>
        <form method="get" className="space-y-3 max-w-lg">
          <p>Say why you need to see this account. The reason is saved in the audit log with your name.</p>
          <label htmlFor="reason" className="block text-sm">Reason (for example a support request)</label>
          <Input id="reason" name="reason" required minLength={5} maxLength={300} />
          <Button type="submit">Continue</Button>
        </form>
      </StaffPage>
    )
  }

  const db = createServiceRoleClient()
  const { data: auth } = await db.auth.admin.getUserById(id)
  if (!auth.user) notFound()
  await logAdminAction(staff, "users.view_as", { type: "user", id, after: { reason } })

  const [{ data: account }, plan, { data: people }, { data: checkIns }, { data: memberships }] = await Promise.all([
    db.from("profiles").select("preferred_name, full_name, account_type").eq("id", id).maybeSingle(),
    getPlan(db, id),
    db.from("user_profiles").select("id, preferred_name, full_name, age, is_primary, created_at").eq("user_id", id).order("created_at"),
    db.from("check_ins").select("id, goal_title, source, created_at").eq("user_id", id).order("created_at", { ascending: false }).limit(20),
    db.from("organization_members").select("id, role, organizations(name)").eq("user_id", id),
  ])
  const profileIds = (people ?? []).map((p) => p.id)
  const { data: screenings } = profileIds.length
    ? await db
        .from("assessments")
        .select("id, profile_id, assessment_type, respondent_type, status, started_at, completed_at")
        .in("profile_id", profileIds)
        .order("started_at", { ascending: false })
    : { data: [] }
  const firstName = account?.preferred_name || account?.full_name?.split(" ")[0] || "this account"

  return (
    <div>
      <div role="status" className="sticky top-0 z-50 bg-amber-300 text-black px-4 py-3 text-sm font-medium flex flex-wrap justify-between gap-2">
        <span>Viewing {firstName}&apos;s account as {staff.email}. Read-only. Reason: {reason}</span>
        <Link href={`/staff/users/${id}`} className="underline font-semibold">Exit</Link>
      </div>
      <StaffPage
        title={`${firstName}'s NeuRafiki`}
        back={back}
        intro={<p>Plan: {plan}{account?.account_type ? ` · ${account.account_type} account` : ""}</p>}
      >
        {!people?.length && <p className="text-muted-foreground">No profiles added yet.</p>}
        {(people ?? []).map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {p.preferred_name || p.full_name?.split(" ")[0] || "Profile"}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {[p.age != null && `${p.age} years`, p.is_primary && "account holder"].filter(Boolean).join(" · ")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {!(screenings ?? []).some((s) => s.profile_id === p.id) ? (
                <p className="text-muted-foreground">No screenings yet.</p>
              ) : (
                <ul className="list-disc pl-6">
                  {(screenings ?? []).filter((s) => s.profile_id === p.id).map((s) => (
                    <li key={s.id}>
                      {s.assessment_type} ({s.respondent_type}) · {s.status} · started {date(s.started_at)}
                      {s.completed_at ? ` · completed ${date(s.completed_at)}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardHeader><CardTitle className="text-lg">Check-ins and organisations</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              Recent check-ins: {(checkIns ?? []).map((c) => `${c.goal_title} (${date(c.created_at)}${c.source ? `, from ${c.source}` : ""})`).join("; ") || "none"}
            </p>
            <p>
              Organisations:{" "}
              {(memberships ?? [])
                .map((m) => {
                  const org = (Array.isArray(m.organizations) ? m.organizations[0] : m.organizations) as { name: string } | null
                  return `${org?.name ?? "organisation"} (${m.role})`
                })
                .join("; ") || "none"}
            </p>
          </CardContent>
        </Card>
      </StaffPage>
    </div>
  )
}
