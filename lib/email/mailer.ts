import nodemailer from "nodemailer"

/**
 * Generic SMTP sender for app-originated notification emails (follow-up
 * reminders, etc). Deliberately separate from Supabase Auth's email sending,
 * which only covers auth-flow templates (confirmations, magic links,
 * invites, password resets) and has no API for arbitrary custom content.
 * Point these env vars at whatever SMTP provider you like -- the same
 * credentials you'd otherwise put in Supabase's Auth > SMTP Settings work
 * fine here too.
 */

interface SendEmailInput {
  to: string
  subject: string
  text: string
  html?: string
}

function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.SMTP_FROM)
}

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

/**
 * Sends an email if SMTP_* env vars are configured; otherwise logs and
 * returns { sent: false } rather than throwing, so callers (e.g. the
 * followup-reminders cron) can run safely before a provider is wired up.
 */
export async function sendEmail(input: SendEmailInput): Promise<{ sent: boolean }> {
  if (!isEmailConfigured()) {
    console.warn(`[mailer] SMTP not configured -- skipping email to ${input.to}: "${input.subject}"`)
    return { sent: false }
  }

  const transport = getTransport()
  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  })

  return { sent: true }
}
