// Opt-in newsletter (scripts/028). The privacy policy's "Newsletter" section describes it;
// keep the two in step. Sending happens only from /staff/newsletter.
import { COPYRIGHT_HOLDER } from "@/lib/legal"

const DEFAULT_SITE_URL = "https://neurafiki.becomechange.institute"

/** Public base URL for links in emails; ignores a malformed NEXT_PUBLIC_SITE_URL. */
export function siteUrl(): string {
  try {
    const u = new URL((process.env.NEXT_PUBLIC_SITE_URL ?? "").trim())
    if (u.protocol === "https:" || u.protocol === "http:") return u.origin
  } catch {}
  return DEFAULT_SITE_URL
}

/** Wording on the Account page; stored with each subscription made there. Sign-up stores the same text. */
export const NEWSLETTER_CONSENT =
  "Send me the NeuRafiki newsletter: news about NeuRafiki and DiBadili Institute programmes and services, new services being developed, and news and offers from partners. Optional; I can unsubscribe at any time."

export const unsubscribeUrl = (token: string) => `${siteUrl()}/api/newsletter/unsubscribe?token=${token}`

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)
}

const linkify = (escaped: string) =>
  escaped.replace(/https?:\/\/[^\s<]+[^\s<.,;:!?)]/g, (u) => `<a href="${u}" style="color:#171717;">${u}</a>`)

/**
 * The issue body is plain text written on /staff/newsletter: blank lines separate paragraphs,
 * "## " starts a heading, lines starting "- " are a list, and web addresses become links.
 * Everything is escaped first, so a body can't inject markup.
 */
export function bodyToHtml(body: string): string {
  return body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n")
      if (lines[0].startsWith("## ")) {
        const rest = lines.slice(1).join("\n")
        return `<h2 style="margin:24px 0 8px 0;font-size:18px;color:#111827;">${linkify(escapeHtml(lines[0].slice(3)))}</h2>${rest ? bodyToHtml(rest) : ""}`
      }
      if (lines.every((l) => l.startsWith("- "))) {
        return `<ul style="margin:0 0 16px 0;padding-left:20px;font-size:16px;line-height:1.55;color:#404040;">${lines
          .map((l) => `<li style="margin:0 0 6px 0;">${linkify(escapeHtml(l.slice(2)))}</li>`)
          .join("")}</ul>`
      }
      return `<p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#404040;">${lines
        .map((l) => linkify(escapeHtml(l)))
        .join("<br>")}</p>`
    })
    .join("")
}

/** Branded like the sign-up email (supabase/templates/confirm-signup.html). */
export function newsletterHtml(subject: string, body: string, unsubscribe: string): string {
  const base = siteUrl()
  const host = escapeHtml(base.replace(/^https?:\/\//, ""))
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#1f2937;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
      <tr><td style="height:6px;line-height:6px;font-size:0;background:#171717;">&nbsp;</td></tr>
      <tr><td style="padding:24px 32px 8px 32px;font-size:22px;font-weight:800;color:#171717;letter-spacing:0.3px;">NeuRafiki<span style="display:block;font-size:12px;font-weight:500;color:#6b7280;letter-spacing:0;">Newsletter</span></td></tr>
      <tr><td style="padding:16px 32px 8px 32px;">
        <h1 style="margin:0 0 16px 0;font-size:26px;line-height:1.25;color:#111827;">${escapeHtml(subject)}</h1>
        ${bodyToHtml(body)}
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 16px 0;"><tr>
          <td style="border-radius:8px;background:#171717;"><a href="${base}" style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">Visit NeuRafiki</a></td>
        </tr></table>
      </td></tr>
      <tr><td style="background:#1f2937;padding:20px 32px;">
        <p style="margin:0 0 6px 0;font-size:12px;line-height:1.5;color:#d1d5db;">You're getting this because you chose to receive the NeuRafiki newsletter on ${host}. <a href="${escapeHtml(unsubscribe)}" style="color:#e5e7eb;">Unsubscribe</a> at any time; it stops straight away.</p>
        <p style="margin:0;font-size:12px;line-height:1.5;color:#9ca3af;">NeuRafiki by ${escapeHtml(COPYRIGHT_HOLDER)} &middot; P.O. Box 2550, Festac Town, Lagos, Nigeria &middot; <a href="${base}/privacy" style="color:#e5e7eb;">Privacy</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}

export function newsletterText(subject: string, body: string, unsubscribe: string): string {
  return `${subject}\n\n${body.trim()}\n\nVisit NeuRafiki: ${siteUrl()}\n\nUnsubscribe: ${unsubscribe}`
}
