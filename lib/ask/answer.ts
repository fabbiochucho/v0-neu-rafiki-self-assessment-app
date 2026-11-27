// Finds approved passages and asks the model to answer from them only.
import { generate } from "@/lib/ai"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { decide, systemPrompt, usable, userPrompt, type Lang, type Outcome, type Passage } from "@/lib/ask/core"
import { embed } from "@/lib/ask/embed"

/** Usable passages from approved sources for this question (empty if none). */
export async function retrieve(question: string): Promise<Passage[]> {
  const vec = (await embed([question]))?.[0] ?? null
  const { data, error } = await createServiceRoleClient().rpc("kb_match", {
    p_embedding: vec ? JSON.stringify(vec) : null,
    p_query: question,
    p_count: 6,
  })
  if (error) {
    console.error("ask: kb_match failed", error.message)
    return []
  }
  return usable((data ?? []) as Passage[])
}

export async function askApproved(
  question: string,
  language: Lang,
  context?: string,
  deps: { retrieve: typeof retrieve; generate: typeof generate } = { retrieve, generate },
): Promise<Outcome> {
  const passages = await deps.retrieve(question)
  if (!passages.length) return { status: "escalated", reason: "No approved source matches this question", language }
  const r = await deps.generate({
    system: systemPrompt(language, context),
    messages: [{ role: "user", content: userPrompt(question, passages) }],
    maxTokens: 700,
  })
  if (!r.ok) return { status: "unavailable", reason: r.reason, language }
  return decide(r.text, passages, language)
}
