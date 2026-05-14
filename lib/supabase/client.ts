import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase configuration", {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey,
    });
    throw new Error(
      "Supabase is not properly configured. Please check your environment variables."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
