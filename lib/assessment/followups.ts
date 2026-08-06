/**
 * Pure predicate for the followup-reminders cron
 * (app/api/cron/followup-reminders/route.ts): a schedule is due for a
 * reminder once its next_scheduled_date has arrived, as long as it hasn't
 * already been reminded today (so re-running the cron, or Vercel retrying a
 * slow invocation, doesn't double-send).
 */
export function isReminderDue(
  schedule: { last_reminder_sent_at: string | null },
  today: string,
): boolean {
  if (!schedule.last_reminder_sent_at) return true
  return schedule.last_reminder_sent_at.split("T")[0] !== today
}
