"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { CompanionMode } from "@/lib/companion/prompts"

interface Turn {
  role: "user" | "assistant"
  content: string
}

interface Props {
  mode: CompanionMode
  assessmentId?: string
  /** During a screening: the current question's id. Only its wording is used, never the answer. */
  questionId?: string
  /** Called when the person chooses to go back to the question (during mode). */
  onReturn?: () => void
}

const INTRO: Record<CompanionMode, string> = {
  before:
    "Hi, I'm the NeuRafiki companion. I can explain the difference between screening and diagnosis, how this works, who can answer, how long it takes, and how your answers are kept private.",
  during:
    "I can explain the wording or any terms in this question. The answer is yours to choose, so I won't suggest one.",
  after:
    "I can walk you through what your results mean, area by area, and help you plan next steps and questions for a professional or educator.",
}

const IDLE_LABEL: Record<CompanionMode, string> = { before: "Ready", during: "Checking in", after: "Reflecting" }

/**
 * A purpose-built companion with a soft orb presence. The orb's state is
 * also given as visible text. The conversation exists only in this
 * component's memory: nothing is saved, and it's gone when the page closes.
 */
export function Companion({ mode, assessmentId, questionId, onReturn }: Props) {
  const [open, setOpen] = useState(false)
  const [turns, setTurns] = useState<Turn[]>([])
  const [draft, setDraft] = useState("")
  const [focused, setFocused] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // A new question means a fresh, wording-only conversation.
  useEffect(() => {
    if (mode === "during") setTurns([])
  }, [mode, questionId])

  // components/ui/textarea doesn't forward refs (React 18), so focus by id.
  useEffect(() => {
    if (open) document.getElementById(`companion-input-${mode}`)?.focus()
  }, [open, mode])

  const state = thinking ? "thinking" : focused && draft ? "listening" : "idle"
  const stateLabel = state === "thinking" ? "Thinking" : state === "listening" ? "Listening" : IDLE_LABEL[mode]

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text || thinking) return
    const next = [...turns, { role: "user" as const, content: text }]
    setTurns(next)
    setDraft("")
    setError(null)
    setThinking(true)
    try {
      const res = await fetch("/api/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, messages: next, assessment_id: assessmentId, question_id: questionId }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || "The companion is unavailable right now")
      setTurns([...next, { role: "assistant", content: body.reply }])
    } catch (err) {
      setTurns(turns) // drop the unanswered message so history stays alternating
      setDraft(text)
      setError(err instanceof Error ? err.message : "The companion is unavailable right now")
    } finally {
      setThinking(false)
    }
  }

  return (
    <section aria-label="NeuRafiki companion" className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="companion-orb h-10 w-10 shrink-0 rounded-full" data-state={state} aria-hidden="true" />
        <div className="flex-1">
          <p className="font-medium">Companion</p>
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {stateLabel}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? "Close" : mode === "during" ? "Explain this question" : "Ask the companion"}
        </Button>
      </div>

      {open && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">{INTRO[mode]}</p>
          <ol className="space-y-3" aria-live="polite">
            {turns.map((t, i) => (
              <li
                key={i}
                className={`rounded-lg p-3 text-sm whitespace-pre-wrap ${t.role === "user" ? "bg-muted ml-8" : "bg-primary/5 mr-8"}`}
              >
                <span className="sr-only">{t.role === "user" ? "You said: " : "Companion said: "}</span>
                {t.content}
              </li>
            ))}
          </ol>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <form onSubmit={send} className="space-y-2">
            <label htmlFor={`companion-input-${mode}`} className="sr-only">
              Your question for the companion
            </label>
            <Textarea
              id={`companion-input-${mode}`}
              rows={2}
              maxLength={1000}
              value={draft}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  e.currentTarget.form?.requestSubmit()
                }
              }}
              placeholder={mode === "during" ? "e.g. What does 'repetitive' mean here?" : "Type your question"}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" size="sm" disabled={thinking || !draft.trim()}>
                {thinking ? "Thinking…" : "Send"}
              </Button>
              {mode === "during" && onReturn && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setOpen(false)
                    onReturn()
                  }}
                >
                  Back to the question
                </Button>
              )}
            </div>
          </form>
          <p className="text-xs text-muted-foreground">
            AI explanation, not part of your results. It can&apos;t see or change your scores, and it doesn&apos;t give a
            diagnosis. Conversations aren&apos;t saved.
          </p>
        </div>
      )}
    </section>
  )
}
