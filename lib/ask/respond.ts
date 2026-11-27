// The one entry point for an AI answer, used by the companion, /ask and the level 1-2 tests.
// Order: crisis check, medicine check, approved answer, then (companion only) a labelled general reply.
// Every answer ends with the diagnosis pointer; with no answer, people are pointed to qualified professionals.
import { generate, type ChatTurn } from "@/lib/ai"
import { CRISIS_REPLY, DIAGNOSTIC_FALLBACK, containsDiagnosticClaim, isCrisisMessage } from "@/lib/companion/safety"
import { DIAGNOSIS_POINTER, REFUSED_REPLY, isMedicationQuestion, noAnswerText, type Lang, type Reply } from "@/lib/ask/core"
import { askApproved } from "@/lib/ask/answer"

export interface RespondDeps { askApproved: typeof askApproved; generate: typeof generate }
export interface RespondOptions {
  context?: string
  /** The companion's own prompt and history; null on /ask and Telegram, which never use free-form. */
  freeform: { system: string; messages: ChatTurn[] } | null
  /** ai.ask.handoff: offer "Ask a clinician" (off until a clinician joins). */
  handoff: boolean
  /** ANDA directory link for the no-answer reply, or null. */
  directoryUrl: string | null
}

const withPointer = (text: string) => `${text}\n\n${DIAGNOSIS_POINTER}`

export async function respond(
  question: string,
  language: Lang,
  opts: RespondOptions,
  deps: RespondDeps = { askApproved, generate },
): Promise<Reply> {
  const noAnswer: Reply = { kind: "no_answer", text: noAnswerText(opts.handoff, opts.directoryUrl), citations: [], canEscalate: opts.handoff }
  if (isCrisisMessage(question)) return { kind: "crisis", text: CRISIS_REPLY, citations: [], canEscalate: false }
  if (isMedicationQuestion(question)) return noAnswer

  const o = await deps.askApproved(question, language, opts.context)
  if (o.status === "answered") return { kind: "approved", text: withPointer(o.answer), citations: o.citations, canEscalate: opts.handoff }
  if (o.status === "refused") return { kind: "refused", text: REFUSED_REPLY, citations: [], canEscalate: false }
  if (o.status === "unavailable") return { kind: "unavailable", text: "", citations: [], canEscalate: opts.handoff, reason: o.reason }
  if (!opts.freeform) return noAnswer

  const r = await deps.generate({ system: opts.freeform.system, messages: opts.freeform.messages, maxTokens: 1024 })
  if (!r.ok) return { kind: "unavailable", text: "", citations: [], canEscalate: opts.handoff, reason: r.reason }
  if (!r.text) return noAnswer
  const text = containsDiagnosticClaim(r.text) ? DIAGNOSTIC_FALLBACK : r.text
  return { kind: "general", text: withPointer(text), citations: [], canEscalate: opts.handoff }
}
