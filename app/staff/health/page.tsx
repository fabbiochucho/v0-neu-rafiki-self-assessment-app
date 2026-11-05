import Link from "next/link"
import { redirect } from "next/navigation"
import { StaffPage } from "@/components/staff/staff-page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { allowed, requireStaff, staffForAction } from "@/lib/staff"
import { logAdminAction } from "@/lib/staff/audit"
import { suspendUser } from "@/lib/staff/user-actions"
import { aiProvider } from "@/lib/ai"
import vercel from "@/vercel.json"

export const dynamic = "force-dynamic"
export const metadata = { title: "System health | NeuRafiki staff", robots: { index: false } }

const KIND_LABELS: Record<string, string> = {
  signup_burst_domain: "Many sign-ups from one email domain",
  repeated_failed_payments: "Repeated failed payments",
}

async function review(formData: FormData) {
  "use server"
  const decision = String(formData.get("decision") ?? "")
  const staff = await staffForAction(decision === "suspend" ? "users.suspend" : "health.read")
  const id = String(formData.get("id") ?? "")
  if (!staff || !["dismiss", "suspend"].includes(decision)) return
  const db = createServiceRoleClient()
  const { data: flag } = await db.from("abuse_flags").select("kind, user_id, detail, status").eq("id", id).maybeSingle()
  if (!flag || flag.status !== "open") return
  let msg = "Dismissed."
  if (decision === "suspend") {
    if (!flag.user_id) redirect("/staff/health?msg=This%20flag%20isn't%20about%20one%20account.")
    msg = (await suspendUser(staff, flag.user_id, `Abuse review: ${KIND_LABELS[flag.kind] ?? flag.kind}`)).message
  }
  await db
    .from("abuse_flags")
    .update({ status: decision === "suspend" ? "actioned" : "dismissed", reviewed_by: staff.email, reviewed_at: new Date().toISOString() })
    .eq("id", id)
  await logAdminAction(staff, `abuse.${decision}`, { type: "abuse_flag", id, before: { status: "open", kind: flag.kind }, after: { decision } })
  redirect(`/staff/health?msg=${encodeURIComponent(msg)}`)
}

const set = (v: string | undefined) => Boolean(v && v.trim())

export default async function HealthPage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const staff = await requireStaff("health.read")
  const { msg } = await searchParams
  const can = allowed(staff, ["users.suspend"])
  const db = createServiceRoleClient()
  const day = new Date(Date.now() - 86_400_000).toISOString()
  const week = new Date(Date.now() - 7 * 86_400_000).toISOString()
  const head = { count: "exact" as const, head: true }

  const [signups, failed, screenings, flags, toPurge] = await Promise.all([
    db.from("profiles").select("id", head).gte("created_at", week),
    db.from("payment_transactions").select("id", head).eq("status", "failed").gte("created_at", week),
    db.from("assessments").select("id", head).gte("started_at", day),
    db.from("abuse_flags").select("id, kind, user_id, detail, created_at").eq("status", "open").order("created_at", { ascending: false }).limit(50),
    db.from("account_admin_status").select("user_id", head).not("deleted_at", "is", null),
  ])

  const config: [string, boolean][] = [
    ["Email sending (SMTP_*)", set(process.env.SMTP_HOST) && set(process.env.SMTP_FROM)],
    ["AI provider", !!aiProvider()],
    ["Flutterwave", set(process.env.FLUTTERWAVE_SECRET_KEY)],
    ["Scheduled jobs (CRON_SECRET)", set(process.env.CRON_SECRET)],
    ["Error reporting (Sentry)", set(process.env.NEXT_PUBLIC_SENTRY_DSN) || set(process.env.SENTRY_DSN)],
  ]
  return (
    <StaffPage
      title="System health"
      message={msg}
      intro={<p>What&apos;s set up, what ran recently, and accounts flagged for review. Errors and response times are in Sentry.</p>}
    >
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Set up</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {config.map(([label, ok]) => (
                <li key={label} className="flex justify-between gap-2">
                  <span>{label}</span>
                  <span className={ok ? "text-primary" : "text-destructive"}>{ok ? "configured" : "missing"}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Activity</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              <li className="flex justify-between"><span>Sign-ups, last 7 days</span><span>{signups.count ?? 0}</span></li>
              <li className="flex justify-between"><span>Failed payments, last 7 days</span><span><Link href="/staff/payments?status=failed" className="underline">{failed.count ?? 0}</Link></span></li>
              <li className="flex justify-between"><span>Screenings started, last 24 hours</span><span>{screenings.count ?? 0}</span></li>
              <li className="flex justify-between"><span>Accounts waiting to be purged</span><span>{toPurge.count ?? 0}</span></li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Scheduled jobs</CardTitle>
          <CardDescription>Run by Vercel Cron (times in UTC). Vercel&apos;s Cron Jobs page shows each run&apos;s log.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y text-sm">
            {vercel.crons.map((c) => (
              <li key={c.path} className="py-2 flex flex-wrap justify-between gap-2">
                <code>{c.path}</code>
                <span className="text-muted-foreground">
                  {c.schedule}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Review queue</CardTitle>
          <CardDescription>Flagged daily. Nothing happens to an account until someone decides here.</CardDescription>
        </CardHeader>
        <CardContent>
          {!flags.data?.length ? <p className="text-sm text-muted-foreground">Nothing to review.</p> : (
            <ul className="divide-y text-sm">
              {flags.data.map((f) => (
                <li key={f.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                  <span>
                    <strong>{KIND_LABELS[f.kind] ?? f.kind}</strong> · {Object.entries(f.detail as Record<string, unknown>).map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`).join(", ")} · {f.created_at.slice(0, 10)}
                    {f.user_id && <> · <Link href={`/staff/users/${f.user_id}`} className="text-primary underline">account</Link></>}
                  </span>
                  <span className="flex gap-2">
                    <form action={review}>
                      <input type="hidden" name="id" value={f.id} />
                      <input type="hidden" name="decision" value="dismiss" />
                      <Button type="submit" size="sm" variant="outline">Looks fine</Button>
                    </form>
                    {f.user_id && can.has("users.suspend") && (
                      <form action={review}>
                        <input type="hidden" name="id" value={f.id} />
                        <input type="hidden" name="decision" value="suspend" />
                        <Button type="submit" size="sm" variant="destructive">Suspend account</Button>
                      </form>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </StaffPage>
  )
}
