"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function NewsletterToggle({ on }: { on: boolean }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
      <span>The newsletter is {on ? "on" : "off"}.</span>
      <span className="inline-flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={async () => {
            setBusy(true)
            setError(null)
            const res = await fetch("/api/newsletter", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ on: !on }),
            }).catch(() => null)
            setBusy(false)
            if (res?.ok) router.refresh()
            else setError("That didn't work. Try again.")
          }}
        >
          {on ? "Unsubscribe" : "Subscribe"}
        </Button>
        {error && (
          <span role="alert" className="text-destructive">
            {error}
          </span>
        )}
      </span>
    </div>
  )
}
