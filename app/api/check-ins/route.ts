import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { isFederationEnabled } from "@/lib/federation/config"
import { getActiveAllianceLink } from "@/lib/federation/authorize"
import { sendCheckInSummary } from "@/lib/federation/anda"
import {
  CHECK_IN_SHARE_CONSENT_VERSION,
  NOTE_MAX_LENGTH,
  frequencyScore,
  followUpsFor,
  structuredAnswers,
  summaryText,
  validateAnswers,
  type Answers,
} from "@/lib/check-in/rules"

/**
 * POST: saves one completed check-in and, only if the user ticked the share
 * consent on this check-in, sends ANDA a structured summary (options chosen,
 * no notes or other free text).
 *
 * Body: { goal_title, learner_ref?, source?: "anda", answers, notes?, share_consent?: boolean }
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const goalTitle = typeof body.goal_title === "string" ? body.goal_title.trim() : ""
  if (!goalTitle || goalTitle.length > 300) {
    return NextResponse.json({ error: "A goal (up to 300 characters) is required" }, { status: 400 })
  }
  const learnerRef = typeof body.learner_ref === "string" && body.learner_ref.trim() ? body.learner_ref.trim() : null
  if (learnerRef && learnerRef.length > 200) {
    return NextResponse.json({ error: "learner_ref is too long" }, { status: 400 })
  }
  const source = body.source === "anda" && learnerRef ? "anda" : "neurafiki"
  const answers = (body.answers && typeof body.answers === "object" ? body.answers : {}) as Answers

  const notes: Record<string, string> = {}
  if (body.notes && typeof body.notes === "object") {
    for (const [k, v] of Object.entries(body.notes as Record<string, unknown>)) {
      if (!["helped", "harder"].includes(k) || typeof v !== "string") continue
      if (v.length > NOTE_MAX_LENGTH) {
        return NextResponse.json({ error: `Notes must be ${NOTE_MAX_LENGTH} characters or fewer` }, { status: 400 })
      }
      if (v.trim()) notes[k] = v.trim()
    }
  }

  // Previous check-in for the same goal (and learner) drives the adaptive rule.
  let prevQuery = supabase
    .from("check_ins")
    .select("frequency_score")
    .eq("user_id", user.id)
    .eq("goal_title", goalTitle)
    .order("created_at", { ascending: false })
    .limit(1)
  prevQuery = learnerRef ? prevQuery.eq("learner_ref", learnerRef) : prevQuery.is("learner_ref", null)
  const { data: prev } = await prevQuery.maybeSingle()
  const previousScore = prev?.frequency_score ?? null

  const invalid = validateAnswers(answers, previousScore)
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 })

  const shareConsent = body.share_consent === true
  const link = shareConsent ? await getActiveAllianceLink(supabase, user.id) : null
  if (shareConsent && (!learnerRef || !isFederationEnabled() || !link)) {
    return NextResponse.json(
      { error: "Sharing needs a linked ANDA account and a check-in opened from ANDA." },
      { status: 409 },
    )
  }

  const now = new Date().toISOString()
  const { data: row, error: insertError } = await supabase
    .from("check_ins")
    .insert({
      user_id: user.id,
      source,
      learner_ref: learnerRef,
      goal_title: goalTitle,
      answers,
      notes: Object.keys(notes).length ? notes : null,
      frequency_score: frequencyScore(answers),
      follow_up_triggered: followUpsFor(answers, previousScore).length > 0,
      share_consent_at: shareConsent ? now : null,
      share_consent_version: shareConsent ? CHECK_IN_SHARE_CONSENT_VERSION : null,
    })
    .select("id, created_at")
    .single()

  if (insertError || !row) {
    console.error("[api/check-ins] insert failed:", insertError)
    return NextResponse.json({ error: "Failed to save check-in" }, { status: 500 })
  }

  if (!shareConsent || !link || !learnerRef) return NextResponse.json({ id: row.id, shared: false })

  let shared = false
  try {
    shared = await sendCheckInSummary(
      { localUserId: user.id, remoteUserId: link.remote_user_id },
      {
        learner_ref: learnerRef,
        date: row.created_at,
        goal_title: goalTitle,
        summary: summaryText(goalTitle, answers),
        answers: structuredAnswers(answers),
      },
    )
  } catch (err) {
    console.error("[api/check-ins] ANDA summary send failed:", err)
  }

  if (shared) {
    await createServiceRoleClient().from("check_ins").update({ shared_at: new Date().toISOString() }).eq("id", row.id)
  }

  return NextResponse.json({ id: row.id, shared, share_failed: !shared })
}
