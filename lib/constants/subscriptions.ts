// NeuRafiki subscription tiers. Matches the existing CHECK constraint on
// auth.users.subscription_tier / organizations.subscription_tier
// ('free', 'premium' only) from scripts/004_expand_institutional_schema.sql.

export const SUBSCRIPTION_TIERS = {
  free: {
    name: "Free",
    price: 0,
    period: null as string | null,
    features: ["Full self-assessment", "Single profile", "Basic results summary"],
  },
  premium: {
    name: "Premium",
    price: 4.99,
    period: "month",
    features: ["Downloadable PDF reports", "Follow-up tracking and reminders", "Multiple profiles"],
  },
} as const

export type SubscriptionTierKey = keyof typeof SUBSCRIPTION_TIERS
