"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface LinkedAccount {
  id: string
  remote_app: string
  remote_email: string | null
  scopes: string[]
  status: string
  created_at: string | null
}

interface ProfileRow {
  id: string
  name: string
  hasFederationSyncConsent: boolean
}

interface ConnectionsManagerProps {
  linkedAccounts: LinkedAccount[]
  profiles: ProfileRow[]
  hasAssessmentSyncLink: boolean
  siblingAppUrl: string | null
}

export function ConnectionsManager({
  linkedAccounts,
  profiles,
  hasAssessmentSyncLink,
  siblingAppUrl,
}: ConnectionsManagerProps) {
  const router = useRouter()
  const [connecting, setConnecting] = useState(false)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [togglingProfileId, setTogglingProfileId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const activeLinks = linkedAccounts.filter((la) => la.status === "active")

  const handleConnect = async () => {
    if (!siblingAppUrl) return
    setConnecting(true)
    setError(null)
    try {
      const response = await fetch("/api/federation/link-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scopes: ["assessment_sync"] }),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || "Failed to start connection")
      }
      const { token } = await response.json()
      window.location.href = `${siblingAppUrl}/connect?token=${encodeURIComponent(token)}`
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start connection")
      setConnecting(false)
    }
  }

  const handleRevoke = async (id: string) => {
    setRevokingId(id)
    setError(null)
    try {
      const response = await fetch(`/api/federation/link/${id}`, { method: "PATCH" })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || "Failed to revoke connection")
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke connection")
    } finally {
      setRevokingId(null)
    }
  }

  const handleToggleProfileConsent = async (profileId: string, grant: boolean) => {
    setTogglingProfileId(profileId)
    setError(null)
    try {
      const response = await fetch("/api/federation/profile-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_id: profileId, grant }),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || "Failed to update sharing preference")
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update sharing preference")
    } finally {
      setTogglingProfileId(null)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Linked accounts</CardTitle>
          <CardDescription>Accounts connected to your Neu Rafiki account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {linkedAccounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No accounts connected yet.</p>
          ) : (
            <div className="space-y-3">
              {linkedAccounts.map((la) => (
                <div key={la.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium capitalize">
                      {la.remote_app} {la.remote_email ? `– ${la.remote_email}` : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Scopes: {la.scopes.join(", ") || "none"}
                      {la.created_at ? ` • Connected ${new Date(la.created_at).toLocaleDateString()}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={la.status === "active" ? "default" : "secondary"}>{la.status}</Badge>
                    {la.status === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevoke(la.id)}
                        disabled={revokingId === la.id}
                      >
                        {revokingId === la.id ? "Revoking..." : "Revoke"}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button onClick={handleConnect} disabled={connecting || !siblingAppUrl}>
            {connecting ? "Connecting..." : "Connect to Alliance"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Share assessment results per profile</CardTitle>
          <CardDescription>
            Allow a specific profile&apos;s completed assessment results to be shared with your linked Alliance
            account. This is separate from the connection above -- turning it on for a profile is required before
            that profile&apos;s data can ever be shared, and you can turn it off at any time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {profiles.length === 0 ? (
            <p className="text-sm text-muted-foreground">No profiles yet.</p>
          ) : (
            profiles.map((profile) => (
              <div key={profile.id} className="flex items-center justify-between p-3 border rounded-lg gap-4">
                <div>
                  <Label htmlFor={`consent-${profile.id}`} className="font-medium">
                    {profile.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {hasAssessmentSyncLink
                      ? "Allow this profile's assessment results to be shared with my linked Alliance account."
                      : "Connect an Alliance account with assessment sharing above to enable this."}
                  </p>
                </div>
                <Switch
                  id={`consent-${profile.id}`}
                  checked={profile.hasFederationSyncConsent}
                  disabled={!hasAssessmentSyncLink || togglingProfileId === profile.id}
                  onCheckedChange={(checked) => handleToggleProfileConsent(profile.id, checked)}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
