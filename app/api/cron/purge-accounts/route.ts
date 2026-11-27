import { NextResponse } from "next/server"
import { isCronRequest } from "@/lib/cron-auth"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { deleteAccountData, isOrganisationAdmin } from "@/lib/account-deletion"
import { logAdminAction } from "@/lib/staff/audit"
import { retentionCutoff } from "@/lib/ask/questions"

export const dynamic = "force-dynamic"
export const maxDuration = 300

// Daily: permanently deletes accounts staff soft-deleted more than 30 days ago and didn't restore,
// and questions sent to a clinician that are older than 3 months (verified answers spec 3.3).
export async function GET(request: Request) {
  if (!isCronRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const db = createServiceRoleClient()
  const { count: questionsDeleted, error: qErr } = await db
    .from("kb_questions")
    .delete({ count: "exact" })
    .lt("created_at", retentionCutoff().toISOString())
  if (qErr) console.error("Purge: kb_questions delete failed", qErr.message)
  const { data: due, error } = await db
    .from("account_admin_status")
    .select("user_id, deleted_at, deleted_reason, updated_by")
    .not("deleted_at", "is", null)
    .lte("delete_after", new Date().toISOString())
    .limit(100)
  if (error) return NextResponse.json({ error: "Couldn't load accounts to purge." }, { status: 500 })

  let purged = 0
  for (const row of due ?? []) {
    // An organisation's primary admin must hand it over first; staff see these on /staff/health.
    if (await isOrganisationAdmin(db, row.user_id)) {
      console.error("Purge skipped: account is an organisation's primary admin", row.user_id)
      continue
    }
    try {
      await deleteAccountData(db, row.user_id)
      purged++
      await logAdminAction({ userId: null, email: "system:purge" }, "users.purge", {
        type: "user",
        id: row.user_id,
        before: { deleted_at: row.deleted_at, deleted_by: row.updated_by, reason: row.deleted_reason },
      })
    } catch (e) {
      console.error("Purge failed for one account:", e)
    }
  }
  return NextResponse.json({ due: due?.length ?? 0, purged, questionsDeleted: questionsDeleted ?? 0 })
}
