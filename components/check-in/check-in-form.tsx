"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  CHECK_IN_SHARE_CONSENT_TEXT,
  CORE_QUESTIONS,
  NOTE_MAX_LENGTH,
  followUpsFor,
  type Answers,
  type CheckInQuestion,
} from "@/lib/check-in/rules"

interface Props {
  initialGoal: string
  learnerRef: string | null
  fromAnda: boolean
  previousScore: number | null
  canShare: boolean
}

export function CheckInForm({ initialGoal, learnerRef, fromAnda, previousScore, canShare }: Props) {
  const router = useRouter()
  const [goal, setGoal] = useState(initialGoal)
  const [answers, setAnswers] = useState<Answers>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [share, setShare] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  const followUps = followUpsFor(answers, previousScore)
  const questions = [...CORE_QUESTIONS, ...followUps]

  const choose = (q: CheckInQuestion, option: string, checked: boolean) => {
    setAnswers((prev) => {
      if (!q.multi) return { ...prev, [q.key]: option }
      const current = Array.isArray(prev[q.key]) ? (prev[q.key] as string[]) : []
      const next = checked ? [...current, option] : current.filter((o) => o !== option)
      const copy = { ...prev }
      if (next.length) copy[q.key] = next
      else delete copy[q.key]
      return copy
    })
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    // Drop answers to follow-ups that are no longer shown.
    const keys = new Set(questions.map((q) => q.key))
    const payloadAnswers = Object.fromEntries(Object.entries(answers).filter(([k]) => keys.has(k)))
    setSubmitting(true)
    try {
      const res = await fetch("/api/check-ins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal_title: goal,
          learner_ref: learnerRef,
          source: fromAnda ? "anda" : undefined,
          answers: payloadAnswers,
          notes,
          share_consent: canShare && share,
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || "Could not save the check-in")
      setDone(
        body.shared
          ? "Check-in saved, and a summary was sent to ANDA."
          : body.share_failed
            ? "Check-in saved. We couldn't reach ANDA just now, so the summary wasn't sent."
            : "Check-in saved.",
      )
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the check-in")
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <p role="status" className="font-medium">
            {done}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setDone(null)
              setAnswers({})
              setNotes({})
              setShare(false)
            }}
          >
            Start another check-in
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="space-y-2">
        {initialGoal ? (
          <>
            <p className="text-sm font-medium">Goal{fromAnda ? " (from ANDA)" : ""}</p>
            <p className="text-lg font-medium">{initialGoal}</p>
          </>
        ) : (
          <>
          <Label htmlFor="goal">Which goal is this about?</Label>
          <Input
            id="goal"
            value={goal}
            maxLength={300}
            required
            placeholder="e.g. Getting ready for school on time"
            onChange={(e) => setGoal(e.target.value)}
          />
          </>
        )}
      </div>

      {questions.map((q, qi) => (
        <Card key={q.key}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold" id={`q-${q.key}`}>
              {qi + 1}. {q.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <fieldset aria-labelledby={`q-${q.key}`} className="space-y-2">
              {q.options.map((option, oi) => {
                const id = `${q.key}-${oi}`
                const value = answers[q.key]
                const checked = q.multi ? Array.isArray(value) && value.includes(option) : value === option
                return (
                  <div key={option} className="flex items-center gap-2">
                    <input
                      id={id}
                      type={q.multi ? "checkbox" : "radio"}
                      name={q.key}
                      className="h-4 w-4 accent-primary"
                      checked={checked}
                      onChange={(e) => choose(q, option, e.target.checked)}
                    />
                    <Label htmlFor={id} className="font-normal cursor-pointer">
                      {option}
                    </Label>
                  </div>
                )
              })}
            </fieldset>
            {q.note && (
              <div className="mt-3 space-y-1">
                <Label htmlFor={`${q.key}-note`} className="text-sm text-muted-foreground font-normal">
                  Short note (optional, stays in NeuRafiki)
                </Label>
                <Input
                  id={`${q.key}-note`}
                  maxLength={NOTE_MAX_LENGTH}
                  value={notes[q.key] || ""}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [q.key]: e.target.value }))}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <p aria-live="polite" className="text-sm text-muted-foreground">
        {followUps.length > 0 ? `This looks like a change, so we've added ${followUps.length} short follow-up questions.` : ""}
      </p>

      {canShare && (
        <div className="flex items-start gap-2 rounded-lg border p-4">
          <input
            id="share"
            type="checkbox"
            className="mt-1 h-4 w-4 accent-primary"
            checked={share}
            onChange={(e) => setShare(e.target.checked)}
          />
          <Label htmlFor="share" className="font-normal leading-snug">
            {CHECK_IN_SHARE_CONSENT_TEXT}
          </Label>
        </div>
      )}

      {error && (
        <div role="alert" className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          {error}
        </div>
      )}

      <Button type="submit" disabled={submitting || !goal.trim()} className="w-full sm:w-auto">
        {submitting ? "Saving…" : "Save check-in"}
      </Button>
    </form>
  )
}
