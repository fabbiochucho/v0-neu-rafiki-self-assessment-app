import { NextResponse, type NextRequest } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { sendEmail } from "@/lib/email/mailer"
import { isReminderDue } from "@/lib/assessment/followups"

// Reads no cookies()/headers() from next/headers (createServiceRoleClient()
// doesn't touch the request at all), so without this Next.js would treat it
// as static and prerender+cache a single snapshot at build time instead of
// re-running it on every cron invocation.
export const dynamic = "force-dynamic"

/**
 * Runs on a Vercel Cron schedule (see vercel.json) to email a reminder for
 * every active follow-up schedule whose next_scheduled_date has arrived.
 * Uses the service-role client because this has no user session to scope
 * RLS to -- it's a trusted backend job, not a user request.
 *
 * Vercel automatically sends `Authorization: Bearer ${CRON_SECRET}` on cron
 * invocations when CRON_SECRET is set, so checking it here is enough to
 * reject requests that didn't come from Vercel's scheduler.
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const supabase = createServiceRoleClient()
  const today = new Date().toISOString().split("T")[0]

  const { data: schedules, error } = await supabase
    .from("assessment_followup_schedules")
    .select(
      `
        id,
        followup_type,
        next_scheduled_date,
        last_reminder_sent_at,
        user_profiles (
          full_name,
          preferred_name,
          profiles ( email )
        )
      `,
    )
    .eq("status", "active")
    .lte("next_scheduled_date", today)

  if (error) {
    console.error("[cron/followup-reminders] failed to load due schedules:", error)
    return NextResponse.json({ error: "Failed to load due schedules" }, { status: 500 })
  }

  const due = (schedules || []).filter((schedule: any) => isReminderDue(schedule, today))

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "")
  const results: { scheduleId: string; sent: boolean }[] = []

  for (const schedule of due as any[]) {
    const profile = schedule.user_profiles
    const email = profile?.profiles?.email
    if (!email) {
      console.warn(`[cron/followup-reminders] schedule ${schedule.id} has no resolvable account email, skipping`)
      continue
    }

    const respondentName = profile?.preferred_name || profile?.full_name || "your profile"
    const dashboardLink = siteUrl ? `${siteUrl}/dashboard/followups` : "/dashboard/followups"

    const { sent } = await sendEmail({
      to: email,
      subject: `Your ${schedule.followup_type} follow-up assessment is due`,
      text: `It's time for ${respondentName}'s ${schedule.followup_type} follow-up assessment on NeuRafiki.\n\nComplete it here: ${dashboardLink}\n\nIf you no longer wish to receive these reminders, you can pause or cancel this follow-up schedule from your dashboard.`,
    })

    if (sent) {
      const { error: updateError } = await supabase
        .from("assessment_followup_schedules")
        .update({ last_reminder_sent_at: new Date().toISOString() })
        .eq("id", schedule.id)

      if (updateError) {
        console.error(`[cron/followup-reminders] sent email but failed to mark schedule ${schedule.id}:`, updateError)
      }
    }

    results.push({ scheduleId: schedule.id, sent })
  }

  return NextResponse.json({ checked: due.length, sent: results.filter((r) => r.sent).length, results })
}
