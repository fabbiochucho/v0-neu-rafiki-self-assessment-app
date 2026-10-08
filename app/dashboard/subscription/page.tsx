"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { SUBSCRIPTION_TIERS, type SubscriptionTierKey } from "@/lib/constants/subscriptions"
import { ArrowLeft, Check } from "lucide-react"

interface SubscriptionRow {
  tier: SubscriptionTierKey
  status: string
  renewal_date: string | null
}

function SubscriptionStatusBanner() {
  const searchParams = useSearchParams()
  const success = searchParams.get("success")
  const error = searchParams.get("error")

  if (success === "payment_completed") {
    return (
      <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-lg text-sm">
        Payment completed successfully. Your subscription has been updated.
      </div>
    )
  }

  if (error) {
    return (
      <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
        There was a problem processing your payment ({error.replace(/_/g, " ")}). Please try again.
      </div>
    )
  }

  return null
}

export default function SubscriptionPage() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgradingTier, setUpgradingTier] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data } = await supabase
        .from("subscriptions")
        .select("tier, status, renewal_date")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      setSubscription(data)
      setLoading(false)
    }
    load()
  }, [router])

  const currentTier: SubscriptionTierKey = subscription?.status === "active" ? subscription.tier : "free"

  const handleUpgrade = async (tier: SubscriptionTierKey) => {
    const plan = SUBSCRIPTION_TIERS[tier]
    if (!plan.price) return

    setUpgradingTier(tier)
    setError(null)

    try {
      const res = await fetch("/api/payments/flutterwave/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed to start checkout")
      if (!data.paymentLink) throw new Error("No payment link returned")

      window.location.href = data.paymentLink
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start checkout")
      setUpgradingTier(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-2">Subscription</h1>
        <p className="text-muted-foreground mb-8">Manage your NeuRafiki plan and billing.</p>

        <Suspense fallback={null}>
          <SubscriptionStatusBanner />
        </Suspense>

        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading subscription...</p>
            ) : (
              <div className="flex items-center gap-4">
                <Badge className="bg-primary/10 text-primary text-base px-3 py-1 capitalize">
                  {SUBSCRIPTION_TIERS[currentTier]?.name || currentTier}
                </Badge>
                <span className="text-sm text-muted-foreground capitalize">
                  Status: {subscription?.status || "active"}
                </span>
                {subscription?.renewal_date && (
                  <span className="text-sm text-muted-foreground">
                    Renews {new Date(subscription.renewal_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.keys(SUBSCRIPTION_TIERS) as SubscriptionTierKey[]).map((tier) => {
            const plan = SUBSCRIPTION_TIERS[tier]
            const isCurrent = tier === currentTier

            return (
              <Card key={tier} className={isCurrent ? "border-2 border-primary" : ""}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    ${plan.price}
                    {plan.period ? `/${plan.period}` : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent || tier === "free" || upgradingTier === tier}
                    onClick={() => handleUpgrade(tier)}
                  >
                    {isCurrent ? "Current Plan" : upgradingTier === tier ? "Redirecting..." : "Choose Plan"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
