import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isFederationEnabled } from "@/lib/federation/config"
import { verifySiblingLinkToken } from "@/lib/federation/jwt"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { ConnectConsentForm } from "./connect-consent-form"

interface ConnectPageProps {
  searchParams: Promise<{ token?: string }>
}

/**
 * Receiving side of the cross-app "Connect account" handshake: Alliance
 * redirects the user's browser here with a link token it signed
 * (?token=...). This page verifies that token was really issued by Alliance
 * (verifySiblingLinkToken, checked against FEDERATION_ALLIANCE_PUBLIC_KEY),
 * requires the user to already be logged into Neu Rafiki, and then shows a
 * consent screen naming the Alliance email and the scopes being requested
 * before creating anything.
 */
export default async function ConnectPage({ searchParams }: ConnectPageProps) {
  const { token } = await searchParams

  if (!isFederationEnabled()) {
    return (
      <ConnectMessage title="Federation is not available">
        This deployment does not have cross-app account linking enabled.
      </ConnectMessage>
    )
  }

  if (!token) {
    return (
      <ConnectMessage title="Missing link token">
        This page expects a `token` query parameter from an Alliance &quot;Connect account&quot; link. Please
        start the connection from Alliance again.
      </ConnectMessage>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?redirect=${encodeURIComponent(`/connect?token=${token}`)}`)
  }

  let payload
  try {
    payload = await verifySiblingLinkToken(token)
  } catch (error) {
    return (
      <ConnectMessage title="Invalid or expired link">
        This connection link is no longer valid. Link tokens expire 5 minutes after they&apos;re issued -- please
        go back to Alliance and start the connection again.
      </ConnectMessage>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-background to-muted">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">NeuRafiki</span>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Connect Alliance Account</CardTitle>
              <CardDescription className="text-center">
                Review what you&apos;re sharing before you connect
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConnectConsentForm email={payload.email} remoteUserId={payload.sub} scopes={payload.scopes} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ConnectMessage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-background to-muted">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">{children}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
