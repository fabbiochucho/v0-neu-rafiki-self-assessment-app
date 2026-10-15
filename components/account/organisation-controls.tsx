"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  orgId: string
  orgName: string
  closingAt: string | null
  members: { user_id: string; email: string | null; role: string }[]
}

async function call(url: string, init: RequestInit) {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init }).catch(() => null)
  if (res?.ok) return null
  const data = await res?.json().catch(() => ({}))
  return (data?.error as string) || "That didn't work. Nothing changed. Please try again."
}

// Primary-admin controls: hand over to another member, or (when the admin is
// the only member) close the organisation after a 30-day grace period.
export function OrganisationControls({ orgId, orgName, closingAt, members }: Props) {
  const [target, setTarget] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = async (url: string, init: RequestInit) => {
    setBusy(true)
    setError(null)
    const err = await call(url, init)
    if (err) {
      setError(err)
      setBusy(false)
    } else window.location.reload()
  }

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <p className="font-medium break-words">{orgName}</p>

      {members.length > 0 ? (
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (target) run(`/api/organizations/${orgId}/transfer`, { method: "POST", body: JSON.stringify({ user_id: target }) })
          }}
        >
          <label className="block text-sm space-y-1">
            <span>Hand it over to another member before you leave</span>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
              required
            >
              <option value="">Choose a member</option>
              {members.map((m) => (
                <option key={m.user_id} value={m.user_id}>
                  {m.email ?? "Member without an email"} ({m.role})
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" variant="outline" disabled={busy || !target}>
            {busy ? "Handing over..." : "Make them the primary admin"}
          </Button>
        </form>
      ) : closingAt ? (
        <div className="space-y-2 text-sm">
          <p>
            Closes on <strong>{new Date(closingAt).toLocaleDateString()}</strong>. Download its data before then. Members&apos;
            own accounts aren&apos;t affected.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <a href={`/api/organizations/${orgId}/export`}>Download organisation data</a>
            </Button>
            <Button variant="ghost" disabled={busy} onClick={() => run(`/api/organizations/${orgId}/closure`, { method: "DELETE" })}>
              Cancel closure
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-sm">
          <p>You&apos;re the only member. You can close it: it&apos;s deleted after 30 days, and you can download its data or cancel until then.</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" disabled={busy} onClick={() => run(`/api/organizations/${orgId}/closure`, { method: "POST" })}>
              {busy ? "Scheduling..." : "Close this organisation"}
            </Button>
            <Button asChild variant="ghost">
              <a href={`/api/organizations/${orgId}/export`}>Download organisation data</a>
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
