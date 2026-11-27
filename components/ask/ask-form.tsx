"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { askAction, escalateAction, type AskState } from "@/app/ask/actions"
import { CONSENT_TEXT, LANGUAGES, labelFor } from "@/lib/ask/core"
import { CRISIS_REPLY } from "@/lib/companion/safety"

/** Works without JavaScript too: React 19 runs the server action and re-renders with its result. */
export function AskForm() {
  const [state, ask, asking] = useActionState<AskState | null, FormData>(askAction, null)
  const [sent, escalate, sending] = useActionState<AskState | null, FormData>(escalateAction, null)
  const r = state?.reply
  const label = r ? labelFor(r) : null
  return (
    <div className="space-y-4">
      <form action={ask} className="space-y-2">
        <label htmlFor="ask-q" className="block text-sm font-medium">
          Your question
        </label>
        <Textarea id="ask-q" name="question" rows={3} maxLength={1000} required defaultValue={state?.question} />
        <label htmlFor="ask-lang" className="block text-sm">
          Answer in
        </label>
        <select
          id="ask-lang"
          name="language"
          defaultValue={state?.language ?? "en"}
          className="rounded-md border bg-background px-2 py-1 text-sm"
        >
          {Object.entries(LANGUAGES).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        <div>
          <Button type="submit" disabled={asking}>
            {asking ? "Finding an answer…" : "Ask"}
          </Button>
        </div>
      </form>
      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      {r && (
        <section aria-live="polite" className="space-y-2 rounded-lg border p-3 text-sm" dir={state?.language === "ar" ? "rtl" : undefined}>
          {label && <p className="text-xs font-medium text-muted-foreground">{label}</p>}
          <p className="whitespace-pre-wrap">{r.text}</p>
          {!!r.citations.length && (
            <div className="text-xs text-muted-foreground">
              <p className="font-medium">Sources</p>
              <ol>
                {r.citations.map((c) => (
                  <li key={c.n}>
                    [{c.n}]{" "}
                    {c.url ? (
                      <a href={c.url} className="underline" target="_blank" rel="noreferrer">
                        {c.title}
                      </a>
                    ) : (
                      c.title
                    )}{" "}
                    ({c.publisher})
                  </li>
                ))}
              </ol>
            </div>
          )}
          {r.canEscalate && !sent?.sent && (
            <form action={escalate} className="space-y-2 border-t pt-2">
              <input type="hidden" name="question" value={state?.question ?? ""} />
              <input type="hidden" name="language" value={state?.language ?? "en"} />
              <label className="flex gap-2 text-xs">
                <input type="checkbox" name="consent" required /> <span>{CONSENT_TEXT}</span>
              </label>
              <Button type="submit" size="sm" variant="outline" disabled={sending}>
                Send to a clinician
              </Button>
            </form>
          )}
          {sent?.sent && (
            <p role="status" className="text-xs">
              Sent. The answer will appear below when a clinician replies.
            </p>
          )}
          {sent?.crisis && (
            <p role="alert" className="text-xs">
              {CRISIS_REPLY}
            </p>
          )}
          {sent?.error && (
            <p role="alert" className="text-xs text-destructive">
              {sent.error}
            </p>
          )}
        </section>
      )}
    </div>
  )
}
