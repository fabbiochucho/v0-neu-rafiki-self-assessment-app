import type { SupabaseClient } from "@supabase/supabase-js"

// NeuRafiki's own plan and entitlements. Billing is NeuRafiki-only
// (Flutterwave -> public.subscriptions); ANDA's plan never grants anything here.

export type Plan = "free" | "premium"

/** Companion messages per user per UTC day, by plan. Owner decision; see PR. */
export const AI_DAILY_LIMIT: Record<Plan, number> = { free: 10, premium: 100 }
/** Minimum gap between companion messages from one user (burst protection). */
export const AI_MIN_INTERVAL_SECONDS = 3

export interface Entitlements {
  assessment: boolean
  ai_companion: boolean
  check_ins: boolean
  follow_up: boolean
}

/** Same rule as app/dashboard/subscription: the latest row decides, premium only while active. */
export async function getPlan(supabase: SupabaseClient, userId: string): Promise<Plan> {
  const { data } = await supabase
    .from("subscriptions")
    .select("tier, status")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  return data?.status === "active" && data.tier === "premium" ? "premium" : "free"
}

export function isCompanionConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

export function entitlementsFor(plan: Plan): Entitlements {
  return {
    assessment: true,
    // Free gets a limited daily allowance (AI_DAILY_LIMIT), so it is still entitled.
    ai_companion: isCompanionConfigured(),
    check_ins: true,
    // Follow-up tracking and reminders are a Premium feature (lib/constants/subscriptions.ts).
    follow_up: plan === "premium",
  }
}
