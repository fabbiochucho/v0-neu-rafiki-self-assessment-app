import { NextResponse } from "next/server"
import { staffForApi } from "@/lib/staff"
import { can } from "@/lib/staff/permissions"
import { logAdminAction } from "@/lib/staff/audit"
import { toCsv } from "@/lib/staff/pii"
import { createServiceRoleClient } from "@/lib/supabase/service"

export const dynamic = "force-dynamic"

const STATUSES = ["failed", "pending", "successful", "refunded"]

// CSV of payments with one status.
export async function GET(request: Request) {
  const staff = await staffForApi("exports.run")
  if (staff instanceof NextResponse) return staff
  if (!can(staff.role, "billing.read")) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const status = new URL(request.url).searchParams.get("status") ?? "successful"
  if (!STATUSES.includes(status)) return NextResponse.json({ error: "Unknown status." }, { status: 400 })

  const rows: Record<string, unknown>[] = []
  for (let from = 0; rows.length < 20_000; from += 1000) {
    let q = createServiceRoleClient()
      .from("payment_transactions")
      .select("id, created_at, amount, currency, status, refunded_at, refund_amount, refund_reference, subscriptions(user_id, tier)")
      .order("created_at", { ascending: false })
      .range(from, from + 999)
    q = status === "refunded" ? q.not("refunded_at", "is", null) : q.eq("status", status)
    const { data, error } = await q
    if (error) return NextResponse.json({ error: "Couldn't load payments." }, { status: 500 })
    for (const t of data ?? []) {
      const sub = (Array.isArray(t.subscriptions) ? t.subscriptions[0] : t.subscriptions) as { user_id: string | null; tier: string } | null
      rows.push({ ...t, subscriptions: undefined, user_id: sub?.user_id ?? "", tier: sub?.tier ?? "" })
    }
    if (!data || data.length < 1000) break
  }
  await logAdminAction(staff, "billing.export", { type: "payment_transactions", after: { status, rows: rows.length } })
  const cols = ["id", "created_at", "amount", "currency", "status", "tier", "user_id", "refunded_at", "refund_amount", "refund_reference"]
  return new NextResponse(toCsv(cols, rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="neurafiki-payments-${status}-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}
