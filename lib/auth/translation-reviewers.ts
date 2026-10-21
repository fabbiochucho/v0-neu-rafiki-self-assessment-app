import { createClient } from "@/lib/supabase/server"

/** Pure check, for tests: is this email in a comma-separated allow-list? */
export function isListedEmail(email: string | null | undefined, list: string | undefined): boolean {
  const allowed = (list ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
  return Boolean(email) && allowed.includes(email!.toLowerCase())
}

/**
 * The signed-in user's email if they may review screening translations
 * (TRANSLATION_REVIEWER_EMAILS, comma-separated), else null. Deliberately not
 * the organisation-admin role: approving a translation changes what every
 * screening shows, so it's a platform-level permission.
 */
export async function getTranslationReviewer(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return isListedEmail(user?.email, process.env.TRANSLATION_REVIEWER_EMAILS) ? user!.email!.toLowerCase() : null
}
