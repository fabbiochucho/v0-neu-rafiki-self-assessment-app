import { NextResponse } from "next/server"
import { z } from "zod"
import { staffForApi } from "@/lib/staff"
import { logAdminAction } from "@/lib/staff/audit"
import { sendEmail } from "@/lib/email/mailer"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { newsletterHtml, newsletterText, unsubscribeUrl } from "@/lib/newsletter"

// ponytail: sends one SMTP message at a time inside one request. Fine for hundreds of
// subscribers; shared-host SMTP also caps messages per hour, so move to Resend's batch API
// or a queue before the list reaches the thousands.
export const maxDuration = 300

const bodySchema = z.object({
  subject: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(50000),
  mode: z.enum(["preview", "test", "all"]),
  confirm: z.string().optional(),
})

export async function POST(request: Request) {
  const staff = await staffForApi("newsletter.send")
  if (staff instanceof NextResponse) return staff
  const admin = staff.email

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: "Add a subject and some text." }, { status: 400 })
  const { subject, body, mode, confirm } = parsed.data
  if (mode === "preview") return NextResponse.json({ html: newsletterHtml(subject, body, "#unsubscribe") })
  if (mode === "all" && confirm !== "SEND") {
    return NextResponse.json({ error: "Type SEND to confirm sending to every subscriber." }, { status: 400 })
  }

  const send = (to: string, token: string, subjectLine: string) => {
    const unsubscribe = unsubscribeUrl(token)
    return sendEmail({
      to,
      subject: subjectLine,
      html: newsletterHtml(subject, body, unsubscribe),
      text: newsletterText(subject, body, unsubscribe),
      headers: { "List-Unsubscribe": `<${unsubscribe}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
    })
  }

  if (mode === "test") {
    // The unsubscribe link in a test is a dummy token, so clicking it changes nothing.
    const { sent } = await send(admin, "00000000-0000-0000-0000-000000000000", `[Test] ${subject}`).catch(() => ({ sent: false }))
    if (!sent) return NextResponse.json({ error: "Test not sent: check the SMTP settings." }, { status: 502 })
    await logAdminAction(staff, "newsletter.test", { type: "newsletter", after: { subject } })
    return NextResponse.json({ message: `Test sent to ${admin}.` })
  }

  const service = createServiceRoleClient()
  // Active subscribers only, read in pages (the API returns at most 1,000 rows at a time).
  const recipients: { email: string; token: string }[] = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await service
      .from("newsletter_subscribers")
      .select("email, token")
      .is("unsubscribed_at", null)
      .order("created_at")
      .range(from, from + 999)
    if (error) return NextResponse.json({ error: "Couldn't load subscribers." }, { status: 500 })
    recipients.push(...(data ?? []))
    if (!data || data.length < 1000) break
  }
  if (!recipients.length) return NextResponse.json({ error: "There are no subscribers yet." }, { status: 400 })

  let sent = 0
  let failed = 0
  for (const r of recipients) {
    const result = await send(r.email, r.token, subject).catch((e) => {
      console.error("Newsletter send failed:", e)
      return { sent: false }
    })
    if (result.sent) sent++
    else failed++
  }

  const { data: issue } = await service
    .from("newsletter_issues")
    .insert({ subject, body, sent_by: admin, recipients: sent, failed })
    .select("id")
    .single()
  await logAdminAction(staff, "newsletter.send", { type: "newsletter_issues", id: issue?.id ?? null, after: { subject, sent, failed } })
  return NextResponse.json({
    message: failed ? `Sent to ${sent}; ${failed} failed (see logs).` : `Sent to ${sent} subscriber${sent === 1 ? "" : "s"}.`,
  })
}
