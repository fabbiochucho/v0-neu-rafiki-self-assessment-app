import { createClient } from "@/lib/supabase/server"
import { isListedEmail } from "@/lib/auth/translation-reviewers"

/**
 * The signed-in user's email if they're a platform admin (ADMIN_EMAILS, comma-separated),
 * else null. Not the organisation-admin role: the newsletter goes to every subscriber.
 */
export async function getPlatformAdmin(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return isListedEmail(user?.email, process.env.ADMIN_EMAILS) ? user!.email!.toLowerCase() : null
}
