import { createBrowserClient } from "@supabase/ssr"

let supabaseClientInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (typeof window === "undefined") {
    throw new Error("createClient must be called from client side")
  }

  if (!supabaseClientInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      )
    }

    supabaseClientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseClientInstance
}
