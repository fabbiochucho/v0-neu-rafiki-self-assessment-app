"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function DeleteAccount({ email }: { email: string }) {
  const [step, setStep] = useState<"start" | "confirm">("start")
  const [typed, setTyped] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (step === "start") {
    return (
      <Button variant="outline" onClick={() => setStep("confirm")}>
        Delete my account
      </Button>
    )
  }

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault()
        setBusy(true)
        setError(null)
        const res = await fetch("/api/account/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: typed }),
        }).catch(() => null)
        if (res?.ok) {
          window.location.href = "/?account=deleted"
          return
        }
        const data = await res?.json().catch(() => ({}))
        setError(data?.error || "Your account wasn't deleted. Your information is still here. Try again.")
        setBusy(false)
      }}
    >
      <label className="block text-sm space-y-1">
        <span>
          To confirm, type your email address: <strong className="break-all">{email}</strong>
        </span>
        <input
          type="email"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          autoComplete="off"
          className="w-full px-3 py-2 border rounded-lg bg-background"
        />
      </label>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="destructive" disabled={busy || typed.trim().toLowerCase() !== email.toLowerCase()}>
          {busy ? "Deleting..." : "Permanently delete my account"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setStep("start")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
