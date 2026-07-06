import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isFederationEnabled, getSiblingAppUrl } from "@/lib/federation/config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, ArrowLeft } from "lucide-react"
import { ConnectionsManager } from "./connections-manager"

/**
 * Lists the current user's linked Alliance account(s) and lets them manage
 * per-profile federation_sync consent -- the separate, explicit gate that
 * decides whether a given profile's assessment results may actually be
 * shared with a linked Alliance account (see
 * app/api/federation/assessment-results/route.ts).
 */
export default async function ConnectionsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/connections")
  }

  const federationEnabled = isFederationEnabled()

  const [{ data: linkedAccounts }, { data: profiles }, { data: consents }] = federationEnabled
    ? await Promise.all([
        supabase
          .from("linked_accounts")
          .select("*")
          .eq("local_user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("user_profiles")
          .select("id, full_name, preferred_name")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("consents")
          .select("profile_id")
          .eq("user_id", user.id)
          .eq("consent_type", "federation_sync")
          .is("revoked_at", null),
      ])
    : [{ data: null }, { data: null }, { data: null }]

  const consentedProfileIds = new Set((consents || []).map((c) => c.profile_id))
  const hasAssessmentSyncLink = (linkedAccounts || []).some(
    (la) => la.status === "active" && la.scopes?.includes("assessment_sync"),
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">NeuRafiki</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Connections</h1>
          <p className="text-muted-foreground">
            Optionally link your Alliance account so your assessment results can be shared into an Alliance IEP
            learner profile -- nothing is shared automatically, and you can disconnect at any time.
          </p>
        </div>

        {!federationEnabled ? (
          <Card>
            <CardHeader>
              <CardTitle>Cross-app connections are not available</CardTitle>
              <CardDescription>
                This deployment does not have Alliance federation configured. Nothing here affects your existing
                assessment data.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <ConnectionsManager
            linkedAccounts={linkedAccounts || []}
            profiles={(profiles || []).map((p) => ({
              id: p.id,
              name: p.preferred_name || p.full_name,
              hasFederationSyncConsent: consentedProfileIds.has(p.id),
            }))}
            hasAssessmentSyncLink={hasAssessmentSyncLink}
            siblingAppUrl={getSiblingAppUrl()}
          />
        )}
      </div>
    </div>
  )
}
