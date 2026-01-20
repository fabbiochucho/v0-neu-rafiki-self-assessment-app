let supabaseClientInstance: ReturnType<typeof createBrowserClient> | null = null

import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  if (typeof window === "undefined") {
    throw new Error("createClient must be called from client side")
  }

  if (!supabaseClientInstance) {
    supabaseClientInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }

  return supabaseClientInstance
}
