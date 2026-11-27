"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { isEnabled } from "@/lib/features"
import { AI_DAILY_LIMIT, AI_MIN_INTERVAL_SECONDS, getPlan } from "@/lib/entitlements"
import { respond } from "@/lib/ask/respond"
import { askSettings } from "@/lib/ask/settings"
import { isLang, type Reply } from "@/lib/ask/core"
import { escalateQuestion } from "@/lib/ask/questions"

export interface AskState {
  question: string
  language: string
  reply?: Reply
  error?: string
  crisis?: boolean
  sent?: boolean
}

async function signedIn() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

/** Ask a question. /ask never uses free-form: approved answers only (spec 3.2). */
export async function askAction(_prev: AskState | null, form: FormData): Promise<AskState> {
  const question = String(form.get("question") ?? "").trim().slice(0, 1000)
  const language = String(form.get("language") ?? "en")
  const base = { question, language }
  const { supabase, user } = await signedIn()
  if (!user) return { ...base, error: "Please sign in again." }
  if (!(await isEnabled("ai.ask", { userId: user.id }))) return { ...base, error: "Ask isn't switched on yet." }
  if (question.length < 3 || !isLang(language)) return { ...base, error: "Type a question (at least 3 characters)." }
  const plan = await getPlan(supabase, user.id)
  const { data: verdict, error } = await createServiceRoleClient().rpc("consume_ai_companion_message", {
    p_user_id: user.id,
    p_daily_limit: AI_DAILY_LIMIT[plan],
    p_min_interval_seconds: AI_MIN_INTERVAL_SECONDS,
  })
  if (error) return { ...base, error: "Ask is unavailable right now." }
  if (verdict === "daily_limit") return { ...base, error: "You've reached today's limit. It resets at midnight UTC." }
  if (verdict === "too_fast") return { ...base, error: "Please wait a moment before asking again." }
  const reply = await respond(question, language, { freeform: null, ...(await askSettings({ userId: user.id, plan })) })
  if (reply.kind === "unavailable") return { ...base, error: "Ask is busy right now. Please try again later." }
  return { ...base, reply }
}

export async function escalateAction(_prev: AskState | null, form: FormData): Promise<AskState> {
  const base = { question: String(form.get("question") ?? ""), language: String(form.get("language") ?? "en") }
  const { user } = await signedIn()
  if (!user) return { ...base, error: "Please sign in again." }
  if (!(await isEnabled("ai.ask", { userId: user.id })) || !(await isEnabled("ai.ask.handoff", { userId: user.id }))) {
    return { ...base, error: "Sending questions to a clinician isn't switched on yet." }
  }
  const r = await escalateQuestion(user.id, { ...base, consent: form.get("consent") })
  if (!r.ok) return "crisis" in r ? { ...base, crisis: true } : { ...base, error: r.error }
  revalidatePath("/ask")
  return { ...base, sent: true }
}

export async function deleteQuestionAction(form: FormData) {
  const { user } = await signedIn()
  if (!user) return
  // Filtered by the signed-in user's id: people can only delete their own questions.
  await createServiceRoleClient().from("kb_questions").delete().eq("id", String(form.get("id") ?? "")).eq("user_id", user.id)
  revalidatePath("/ask")
}
