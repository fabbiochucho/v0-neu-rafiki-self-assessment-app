import { NextResponse, type NextRequest } from "next/server"
import { contactSchema } from "@/lib/validation/forms"
import { sendEmail } from "@/lib/email/mailer"

/**
 * POST: validates a public contact-form submission and forwards it by email
 * to CONTACT_INBOX_EMAIL via the same SMTP transport used for follow-up
 * reminders (lib/email/mailer.ts). No auth required -- this is a public
 * "get in touch" form, not an authenticated app feature.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data", details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { name, email, subject, message } = parsed.data
  const inbox = process.env.CONTACT_INBOX_EMAIL || process.env.SMTP_FROM

  if (!inbox) {
    console.warn("[api/contact] CONTACT_INBOX_EMAIL/SMTP_FROM not configured -- dropping message from", email)
    return NextResponse.json(
      { error: "Contact form isn't configured yet. Please try again later." },
      { status: 503 },
    )
  }

  const { sent } = await sendEmail({
    to: inbox,
    subject: `[NeuRafiki contact] ${subject}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  })

  if (!sent) {
    return NextResponse.json(
      { error: "Contact form isn't configured yet. Please try again later." },
      { status: 503 },
    )
  }

  return NextResponse.json({ success: true })
}
