import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Service-role Supabase client. Bypasses Row Level Security entirely, so it
 * must only ever be constructed inside server-only code (API route handlers
 * under app/api/**) that has already authenticated the caller and checked
 * ownership/authorization itself. Never import this from a Client Component,
 * and never send SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Service role Supabase client is not configured. Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
    )
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/** Reads the server-only assessment encryption key, failing loudly if unset. */
export function getAssessmentEncryptionKey(): string {
  const key = process.env.ASSESSMENT_ENCRYPTION_KEY
  if (!key) {
    throw new Error("ASSESSMENT_ENCRYPTION_KEY is not configured on the server.")
  }
  return key
}
