import { NextResponse } from "next/server"
import { isCronRequest } from "@/lib/cron-auth"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { abuseSignals } from "@/lib/staff/abuse"

export const dynamic = "force-dynamic"
export const maxDuration = 120

// Daily: looks for abuse signals and puts them in the review queue on /staff/health.
// Never acts on its own; staff approve or suspend.
export async function GET(request: Request) {
  if (!isCronRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const db = createServiceRoleClient()
  const now = Date.now()
  const day = new Date(now - 86_400_000).toISOString()
  const week = new Date(now - 7 * 86_400_000).toISOString()
  const [{ data: signups }, { data: failed }] = await Promise.all([
    db.from("profiles").select("id, email").gte("created_at", day).limit(5000),
    db.from("payment_transactions").select("id, subscriptions(user_id)").eq("status", "failed").gte("created_at", week).limit(5000),
  ])
  const flags = abuseSignals({
    today: new Date(now).toISOString().slice(0, 10),
    signups: (signups ?? []).map((s) => ({ id: s.id, email: s.email })),
    failedPaymentUsers: (failed ?? []).flatMap((f) => {
      const sub = (Array.isArray(f.subscriptions) ? f.subscriptions[0] : f.subscriptions) as { user_id: string | null } | null
      return sub?.user_id ? [sub.user_id] : []
    }),
    postUsers: [], // NeuRafiki has no community posts
  })
  if (flags.length) {
    const { error } = await db.from("abuse_flags").upsert(flags, { onConflict: "dedupe_key", ignoreDuplicates: true })
    if (error) return NextResponse.json({ error: "Couldn't save flags." }, { status: 500 })
  }
  return NextResponse.json({ flagged: flags.length })
}
