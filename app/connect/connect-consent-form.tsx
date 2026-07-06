"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const SCOPE_DESCRIPTIONS: Record<string, string> = {
  assessment_sync: "Share your completed Neu Rafiki assessment results (per-profile, only for profiles you approve)",
  directory_read: "Read Alliance's resource directory from within Neu Rafiki",
}

function describeScope(scope: string): string {
  return SCOPE_DESCRIPTIONS[scope] || scope
}

interface ConnectConsentFormProps {
  email: string
  remoteUserId: string
  scopes: string[]
}

export function ConnectConsentForm({ email, remoteUserId, scopes }: ConnectConsentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAccept = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/federation/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remote_user_id: remoteUserId, remote_email: email, scopes }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || "Failed to connect account")
      }

      router.push("/dashboard/connections")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while connecting your account")
      setIsLoading(false)
    }
  }

  const handleDecline = () => {
    router.push("/dashboard")
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Connect your Alliance account (<span className="font-medium">{email}</span>) to your Neu Rafiki account?
      </p>

      <div className="rounded-md border p-3 space-y-2">
        <p className="text-sm font-medium">This will allow:</p>
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
          {scopes.map((scope) => (
            <li key={scope}>{describeScope(scope)}</li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-muted-foreground">
        Nothing is shared automatically. You&apos;ll still need to explicitly allow sharing for each profile from{" "}
        <span className="font-medium">Dashboard &rarr; Connections</span>, and you can revoke this connection at any
        time.
      </p>

      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={handleDecline} disabled={isLoading}>
          Decline
        </Button>
        <Button className="flex-1" onClick={handleAccept} disabled={isLoading}>
          {isLoading ? "Connecting..." : "Connect"}
        </Button>
      </div>
    </div>
  )
}
