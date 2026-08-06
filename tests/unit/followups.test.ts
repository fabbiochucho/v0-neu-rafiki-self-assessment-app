import { describe, it, expect } from "vitest"
import { isReminderDue } from "@/lib/assessment/followups"

describe("isReminderDue", () => {
  it("is due when no reminder has ever been sent", () => {
    expect(isReminderDue({ last_reminder_sent_at: null }, "2026-07-26")).toBe(true)
  })

  it("is not due when already reminded today", () => {
    expect(isReminderDue({ last_reminder_sent_at: "2026-07-26T08:00:00.000Z" }, "2026-07-26")).toBe(false)
  })

  it("is due again the day after the last reminder", () => {
    expect(isReminderDue({ last_reminder_sent_at: "2026-07-25T08:00:00.000Z" }, "2026-07-26")).toBe(true)
  })
})
