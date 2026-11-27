"use client"

import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { CONSENT_TEXT } from "@/lib/ask/core"

/** "Ask a clinician" under a reply: consent first, then one POST. Shown only while ai.ask.handoff is on. */
export function AskClinician({ question, language = "en" }: { question: string; language?: string }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle")
  const [msg, setMsg] = useState<string | null>(null)

  if (state === "sent") {
    return (
      <span className="mt-2 block text-xs" role="status">
        Sent. A clinician&apos;s answer will appear on <a href="/ask" className="underline">your Ask page</a>.
      </span>
    )
  }
  if (!open) {
    return (
      <Button type="button" variant="link" size="sm" className="mt-1 h-auto p-0 text-xs" onClick={() => setOpen(true)}>
        Ask a clinician
      </Button>
    )
  }
  const send = async () => {
    setState("sending")
    setMsg(null)
    const res = await fetch("/api/ask/escalate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, language, consent }),
    })
    const body = await res.json().catch(() => ({}))
    if (body.ok) return setState("sent")
    setState("idle")
    setMsg(body.reply ?? body.error ?? "Couldn't send your question.")
  }
  return (
    <span className="mt-2 block space-y-2 rounded-md border p-2 text-xs">
      <label htmlFor={id} className="flex gap-2">
        <input id={id} type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>{CONSENT_TEXT}</span>
      </label>
      <Button type="button" size="sm" disabled={!consent || state === "sending"} onClick={send}>
        {state === "sending" ? "Sending…" : "Send to a clinician"}
      </Button>
      {msg && (
        <span role="alert" className="block">
          {msg}
        </span>
      )}
    </span>
  )
}
