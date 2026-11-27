// Questions a person chose to send to a clinician (switch ai.ask.handoff, off until a clinician joins).
// Stored only after they tick the consent line; deleted after 3 months (purge-accounts cron) or whenever
// they delete them on /ask.
import { createServiceRoleClient } from "@/lib/supabase/service"
import { isCrisisMessage } from "@/lib/companion/safety"
import { isLang, type Lang } from "@/lib/ask/core"

export const MAX_PER_DAY = 5

export type EscalationResult = { ok: true } | { ok: false; error: string } | { ok: false; crisis: true }

export function validateEscalation(input: {
  question: unknown
  language: unknown
  consent: unknown
}): { ok: true; question: string; language: Lang } | { ok: false; error: string } | { ok: false; crisis: true } {
  if (input.consent !== true && input.consent !== "on") return { ok: false, error: "Please tick the box to agree before sending." }
  const question = typeof input.question === "string" ? input.question.trim() : ""
  if (question.length < 3 || question.length > 1000) return { ok: false, error: "Questions need 3 to 1,000 characters." }
  if (!isLang(input.language)) return { ok: false, error: "Unknown language." }
  if (isCrisisMessage(question)) return { ok: false, crisis: true }
  return { ok: true, question, language: input.language }
}

export async function escalateQuestion(
  userId: string,
  input: { question: unknown; language: unknown; consent: unknown },
  db = createServiceRoleClient(),
): Promise<EscalationResult> {
  const v = validateEscalation(input)
  if (!v.ok) return v
  const since = new Date(Date.now() - 24 * 3600_000).toISOString()
  const { count } = await db
    .from("kb_questions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since)
  if ((count ?? 0) >= MAX_PER_DAY) return { ok: false, error: `You can send up to ${MAX_PER_DAY} questions a day.` }
  const { error } = await db.from("kb_questions").insert({ user_id: userId, channel: "web", language: v.language, question: v.question })
  if (error) {
    console.error("ask: escalate insert failed", error.message)
    return { ok: false, error: "Couldn't send your question. Please try again." }
  }
  return { ok: true }
}
