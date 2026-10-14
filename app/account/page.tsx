import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Minus } from "lucide-react"
import { AI_DAILY_LIMIT, entitlementsFor, getPlan } from "@/lib/entitlements"
import { SUBSCRIPTION_TIERS } from "@/lib/constants/subscriptions"
import { getSiblingAppUrl } from "@/lib/federation/config"
import { getActiveAllianceLink } from "@/lib/federation/authorize"
import { fetchAndaEntitlements } from "@/lib/federation/anda"

function EntitlementList({ items }: { items: [string, boolean][] }) {
  return (
    <ul className="space-y-2 text-sm">
      {items.map(([label, on]) => (
        <li key={label} className="flex items-center gap-2">
          {on ? (
            <Check className="h-4 w-4 text-primary" aria-hidden="true" />
          ) : (
            <Minus className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          )}
          <span>
            {label}
            <span className="sr-only">{on ? ": included" : ": not included"}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?redirect=%2Faccount")

  const plan = await getPlan(supabase, user.id)
  const ent = entitlementsFor(plan)
  const andaUrl = getSiblingAppUrl()
  const link = andaUrl ? await getActiveAllianceLink(supabase, user.id) : null
  const anda = link ? await fetchAndaEntitlements({ localUserId: user.id, remoteUserId: link.remote_user_id }) : null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Account</h1>
        <p className="text-muted-foreground">
          NeuRafiki and ANDA are billed separately. A plan in one never changes what you get in the other.
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              NeuRafiki <Badge variant="secondary">{SUBSCRIPTION_TIERS[plan].name}</Badge>
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <EntitlementList
              items={[
                ["Screening assessments", ent.assessment],
                [
                  ent.ai_companion
                    ? `AI companion (${AI_DAILY_LIMIT[plan]} messages a day)`
                    : "AI companion (not available on this site yet)",
                  ent.ai_companion,
                ],
                ["Check-ins", ent.check_ins],
                ["Follow-up tracking and reminders", ent.follow_up],
              ]}
            />
            <Link href="/dashboard/subscription">
              <Button variant="outline">Manage NeuRafiki plan</Button>
            </Link>
          </CardContent>
        </Card>

        {andaUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                ANDA {anda && <Badge variant="secondary" className="capitalize">{anda.plan}</Badge>}
              </CardTitle>
              <CardDescription>
                {!link
                  ? "Not linked. Linking is optional and only needed if you want to share results or check-ins with ANDA."
                  : anda
                    ? "Linked account. ANDA's plan is managed in ANDA."
                    : "Linked, but ANDA's plan couldn't be loaded right now."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {anda && (
                <EntitlementList
                  items={[
                    ["Support plans (IEP)", anda.entitlements.iep],
                    ["Goals", anda.entitlements.goals],
                    ["Progress tracking", anda.entitlements.progress],
                    ["Reports", anda.entitlements.reports],
                    ["Support team", anda.entitlements.support_team],
                  ]}
                />
              )}
              <div className="flex flex-wrap gap-3">
                {link ? (
                  <a href={`${andaUrl}/account`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">Manage ANDA</Button>
                  </a>
                ) : (
                  <Link href="/dashboard/connections">
                    <Button variant="outline">Link an ANDA account</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
