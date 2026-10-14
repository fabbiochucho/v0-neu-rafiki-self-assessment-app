import Anthropic from "@anthropic-ai/sdk"
import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { getOwnedAssessment } from "@/lib/assessment/authorize"
import { AI_DAILY_LIMIT, AI_MIN_INTERVAL_SECONDS, getPlan, isCompanionConfigured } from "@/lib/entitlements"
import { CRISIS_REPLY, DIAGNOSTIC_FALLBACK, containsDiagnosticClaim, isCrisisMessage } from "@/lib/companion/safety"
import { systemPromptFor, type CompanionMode } from "@/lib/companion/prompts"

const MAX_TURNS = 12
const MAX_USER_CHARS = 1000
const MAX_ASSISTANT_CHARS = 4000

/**
 * POST: one companion turn. Body: { mode, messages, assessment_id?, question_id? }.
 *
 * Nothing about the conversation is stored: the client holds the history,
 * and the server only increments a per-day counter. In "during" mode the
 * server adds the current question's wording and options as context and
 * never the person's answers, which it doesn't load at all.
 */
export async function POST(request: NextRequest) {
  if (!isCompanionConfigured()) {
    return NextResponse.json({ error: "The companion is not enabled on this deployment" }, { status: 404 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  let body: { mode?: unknown; messages?: unknown; assessment_id?: unknown; question_id?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const mode = body.mode as CompanionMode
  if (!["before", "during", "after"].includes(mode)) {
    return NextResponse.json({ error: "mode must be before, during or after" }, { status: 400 })
  }

  const raw = Array.isArray(body.messages) ? body.messages.slice(-MAX_TURNS) : []
  const messages: Anthropic.MessageParam[] = []
  for (const [i, m] of raw.entries()) {
    const role = (m as { role?: unknown })?.role
    const content = (m as { content?: unknown })?.content
    const expected = (raw.length - 1 - i) % 2 === 0 ? "user" : "assistant" // alternate, ending on user
    if (role !== expected || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "messages must alternate user/assistant and end with user" }, { status: 400 })
    }
    if (content.length > (role === "user" ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS)) {
      return NextResponse.json({ error: "Message is too long" }, { status: 400 })
    }
    messages.push({ role: expected, content })
  }
  if (messages.length === 0) return NextResponse.json({ error: "messages is required" }, { status: 400 })
  if (messages[0].role !== "user") messages.shift()

  // Crisis pre-check BEFORE any model call or usage counting.
  const latest = messages[messages.length - 1].content as string
  if (isCrisisMessage(latest)) {
    return NextResponse.json({ reply: CRISIS_REPLY, crisis: true })
  }

  let context: string | undefined
  if (mode === "during" && typeof body.question_id === "string") {
    const { data: q } = await supabase
      .from("questions")
      .select("question_text, options, assessment_domains(name)")
      .eq("id", body.question_id)
      .maybeSingle()
    if (q) {
      const domain = (q as { assessment_domains?: { name?: string } | null }).assessment_domains?.name
      context = `Area: ${domain ?? "unknown"}\nCurrent question: "${q.question_text}"\nAnswer options shown: ${(q.options as string[]).join(" / ")}`
    }
  }
  if (mode === "after") {
    if (typeof body.assessment_id !== "string") {
      return NextResponse.json({ error: "assessment_id is required after a screening" }, { status: 400 })
    }
    const assessment = await getOwnedAssessment(supabase, body.assessment_id, user.id)
    if (!assessment || assessment.status !== "completed") {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }
    const { data: results } = await supabase
      .from("assessment_results")
      .select("domain_name, risk_level, percentage_score")
      .eq("assessment_id", assessment.id)
    context =
      "Validated screening results (calculated by NeuRafiki; do not change them):\n" +
      (results || [])
        .map((r) => `- ${r.domain_name}: ${r.risk_level} indication (${Number(r.percentage_score).toFixed(0)}% of the maximum score)`)
        .join("\n")
  }

  // Plan gating + per-user rate limit (counts and timestamps only).
  const plan = await getPlan(supabase, user.id)
  const { data: verdict, error: usageError } = await createServiceRoleClient().rpc("consume_ai_companion_message", {
    p_user_id: user.id,
    p_daily_limit: AI_DAILY_LIMIT[plan],
    p_min_interval_seconds: AI_MIN_INTERVAL_SECONDS,
  })
  if (usageError) {
    console.error("[api/companion] usage check failed:", usageError)
    return NextResponse.json({ error: "The companion is unavailable right now" }, { status: 503 })
  }
  if (verdict === "daily_limit") {
    return NextResponse.json(
      {
        error:
          plan === "free"
            ? `You've used today's ${AI_DAILY_LIMIT.free} free companion messages. They reset at midnight UTC, or Premium raises the limit.`
            : "You've reached today's companion limit. It resets at midnight UTC.",
        limit: true,
      },
      { status: 429 },
    )
  }
  if (verdict === "too_fast") {
    return NextResponse.json({ error: "Please wait a moment before sending another message." }, { status: 429 })
  }

  try {
    const client = new Anthropic()
    const response = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-haiku-5-5",
      max_tokens: 2048,
      output_config: { effort: "low" },
      system: systemPromptFor(mode, context),
      messages,
    })
    if (response.stop_reason === "refusal") {
      return NextResponse.json({ reply: "I can't help with that here. I can explain the screening, the questions, or your results." })
    }
    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim()
    const reply = !text ? "Sorry, I don't have an answer for that." : containsDiagnosticClaim(text) ? DIAGNOSTIC_FALLBACK : text
    return NextResponse.json({ reply })
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "The companion is busy. Please try again shortly." }, { status: 503 })
    }
    console.error("[api/companion] model call failed:", error instanceof Anthropic.APIError ? error.status : error)
    return NextResponse.json({ error: "The companion is unavailable right now" }, { status: 502 })
  }
}
