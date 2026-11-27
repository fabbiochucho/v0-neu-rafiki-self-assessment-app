import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { FEATURE_OFF_MESSAGE, isEnabled } from "@/lib/features"
import { escalateQuestion } from "@/lib/ask/questions"
import { CRISIS_REPLY } from "@/lib/companion/safety"

/** POST { question, language, consent }: send one question to a clinician (ai.ask.handoff must be on). */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  if (!(await isEnabled("ai.ask", { userId: user.id })) || !(await isEnabled("ai.ask.handoff", { userId: user.id }))) {
    return NextResponse.json({ error: FEATURE_OFF_MESSAGE }, { status: 503 })
  }
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  const r = await escalateQuestion(user.id, body)
  if (r.ok) return NextResponse.json({ ok: true })
  if ("crisis" in r) return NextResponse.json({ crisis: true, reply: CRISIS_REPLY })
  return NextResponse.json({ error: r.error }, { status: 400 })
}
