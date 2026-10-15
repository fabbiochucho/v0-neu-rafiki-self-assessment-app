"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ROLE_LABELS, type UserRole } from "@/lib/auth/roles"

interface Member {
  id: string
  user_id: string
  role: UserRole
  created_at: string
  email: string | null
  primary: boolean
  you: boolean
}

const ROLES = Object.keys(ROLE_LABELS) as UserRole[]

async function api(url: string, init?: RequestInit) {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init }).catch(() => null)
  const data = await res?.json().catch(() => ({}))
  if (!res?.ok) throw new Error((data?.error as string) || "That didn't work. Please try again.")
  return data
}

export default function OrganizationMembersPage() {
  const orgId = useParams().id as string
  const url = `/api/admin/organizations/${orgId}/members`
  const { data, error: loadError, mutate } = useSWR<{ members: Member[] }>(url, (u: string) => api(u))
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<UserRole>("member")
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null)
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)

  const run = async (fn: () => Promise<unknown>, ok?: string) => {
    setBusy(true)
    setMessage(null)
    try {
      await fn()
      await mutate()
      if (ok) setMessage({ kind: "ok", text: ok })
    } catch (e) {
      setMessage({ kind: "error", text: (e as Error).message })
    } finally {
      setBusy(false)
      setConfirmRemove(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Members</h1>
        <p className="text-muted-foreground">
          Invite people, change their role, or remove them. To hand the organisation to someone else, use your account page.
        </p>
      </div>

      <Card id="invite">
        <CardHeader>
          <CardTitle>Invite a member</CardTitle>
          <CardDescription>
            People who already have a NeuRafiki account are added straight away. Anyone new gets an email invitation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 sm:grid-cols-[1fr_1fr_12rem_auto] sm:items-end"
            onSubmit={(e) => {
              e.preventDefault()
              run(
                () => api(url, { method: "POST", body: JSON.stringify({ email, name, role }) }),
                `${email} has been added.`,
              ).then(() => {
                setEmail("")
                setName("")
                setRole("member")
              })
            }}
          >
            <div className="space-y-1">
              <Label htmlFor="member-email">Email</Label>
              <Input id="member-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="member-name">Name (optional)</Label>
              <Input id="member-name" maxLength={100} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="member-role">Role</Label>
              <select
                id="member-role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full h-9 px-3 border rounded-md bg-background"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" disabled={busy || !email}>
              {busy ? "Adding..." : "Invite"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {message && (
        <p role={message.kind === "error" ? "alert" : "status"} className={message.kind === "error" ? "text-sm text-destructive" : "text-sm"}>
          {message.text}
        </p>
      )}

      <div className="space-y-2">
        {loadError && <p className="text-sm text-destructive">{(loadError as Error).message}</p>}
        {!data && !loadError && <p className="text-sm text-muted-foreground">Loading members...</p>}
        {data?.members.map((m) => (
          <Card key={m.id}>
            <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium break-all">{m.email ?? "Member without an email"}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {m.primary && <Badge>Primary admin</Badge>}
                  {m.you && <Badge variant="secondary">You</Badge>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor={`role-${m.id}`}>
                  Role for {m.email ?? "member"}
                </label>
                <select
                  id={`role-${m.id}`}
                  value={m.role}
                  disabled={busy || m.primary}
                  onChange={(e) =>
                    run(() => api(url, { method: "PATCH", body: JSON.stringify({ memberId: m.id, role: e.target.value }) }), "Role updated.")
                  }
                  className="h-9 px-3 border rounded-md bg-background"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
                {!m.primary &&
                  (confirmRemove === m.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={busy}
                        onClick={() => run(() => api(`${url}?memberId=${m.id}`, { method: "DELETE" }), "Member removed.")}
                      >
                        Confirm remove
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setConfirmRemove(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => setConfirmRemove(m.id)}>
                      Remove
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
        {data && data.members.length === 0 && <p className="text-sm text-muted-foreground">No members yet.</p>}
      </div>
    </div>
  )
}
