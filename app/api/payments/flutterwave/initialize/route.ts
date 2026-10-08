import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { initializeFlutterwavePayment } from "@/lib/payments/flutterwave"
import { SUBSCRIPTION_TIERS, type SubscriptionTierKey } from "@/lib/constants/subscriptions"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { tier } = await request.json()

    const plan =
      tier && Object.prototype.hasOwnProperty.call(SUBSCRIPTION_TIERS, tier)
        ? SUBSCRIPTION_TIERS[tier as SubscriptionTierKey]
        : null

    if (!plan || !plan.price) {
      return NextResponse.json({ error: "Invalid subscription tier" }, { status: 400 })
    }

    const amount = plan.price
    const currency = "USD"

    const { data: profile } = await supabase.from("profiles").select("email, full_name").eq("id", user.id).single()

    const transactionRef = `NEURAFIKI-SUB-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const appUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin

    // Create subscription record (RLS: subscriptions_insert_own allows this)
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: user.id,
        tier,
        status: "pending",
      })
      .select()
      .single()

    if (subError) {
      console.error(subError)
      return NextResponse.json({ error: "Failed to create subscription record" }, { status: 500 })
    }

    // payment_transactions has no anon/user insert policy by design — write
    // it with the service role client instead of relaxing RLS.
    const service = createServiceRoleClient()

    const { error: txError } = await service.from("payment_transactions").insert({
      subscription_id: subscription.id,
      transaction_id: transactionRef,
      amount,
      currency,
      status: "pending",
    })

    if (txError) {
      console.error(txError)
      return NextResponse.json({ error: "Failed to create payment record" }, { status: 500 })
    }

    const result = await initializeFlutterwavePayment({
      tx_ref: transactionRef,
      amount,
      currency,
      payment_options: "card,mobilemoney,ussd",
      redirect_url: `${appUrl}/api/payments/flutterwave/verify`,
      meta: {
        consumer_id: user.id,
        subscription_id: subscription.id,
      },
      customer: {
        email: profile?.email || user.email || "",
        name: profile?.full_name || undefined,
      },
      customizations: {
        title: `NeuRafiki ${plan.name} Subscription`,
        description: `${plan.name} tier subscription for NeuRafiki`,
      },
    })

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 502 })
    }

    return NextResponse.json(
      {
        transactionRef,
        subscriptionId: subscription.id,
        paymentLink: result.link,
      },
      { status: 201 },
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
