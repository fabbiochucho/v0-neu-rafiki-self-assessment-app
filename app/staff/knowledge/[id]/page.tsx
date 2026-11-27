import { notFound, redirect } from "next/navigation"
import { StaffPage } from "@/components/staff/staff-page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { requireStaff, staffForAction } from "@/lib/staff"
import { logAdminAction } from "@/lib/staff/audit"
import { canApproveEditorial, canReviewClinically, indexSource } from "@/lib/ask/sources"

export const dynamic = "force-dynamic"
export const maxDuration = 120
export const metadata = { title: "Source | NeuRafiki staff", robots: { index: false } }

const back = (id: string, msg: string): never => redirect(`/staff/knowledge/${id}?msg=${encodeURIComponent(msg)}`)
const noteFrom = (form: FormData) => String(form.get("note") ?? "").trim().slice(0, 500)

async function approve(form: FormData) {
  "use server"
  const staff = await staffForAction("knowledge.approve")
  const id = String(form.get("id"))
  if (!staff) return
  const note = noteFrom(form)
  if (note.length < 3) back(id, "Add a short approval note (what you checked).")
  const db = createServiceRoleClient()
  const { data: before } = await db.from("kb_sources").select("status, review, created_by").eq("id", id).single()
  if (!before || !canApproveEditorial(staff, before)) back(id, "You can't approve this source.")
  const { error } = await db
    .from("kb_sources")
    .update({ status: "approved", approved_by: staff.userId, approved_by_email: staff.email, approved_at: new Date().toISOString(), approval_note: note })
    .eq("id", id)
    .eq("status", "draft")
  if (error) back(id, error.message)
  await logAdminAction(staff, "knowledge.approve", { type: "kb_source", id, before, after: { status: "approved", note } })
  back(id, "Approved (editorial). The AI can now answer from it, labelled as not yet reviewed by a clinician.")
}

async function clinicalReview(form: FormData) {
  "use server"
  const staff = await staffForAction("clinical.approve")
  const id = String(form.get("id"))
  if (!staff) return
  const note = noteFrom(form)
  if (note.length < 3) back(id, "Add a short note on what you checked.")
  const db = createServiceRoleClient()
  const { data: before } = await db.from("kb_sources").select("status, review, created_by, approval_note").eq("id", id).single()
  if (!before || !canReviewClinically(staff, before)) back(id, "You can't review this source.")
  const { error } = await db
    .from("kb_sources")
    .update({
      review: "clinical",
      clinical_reviewer_id: staff.userId,
      clinical_reviewer_email: staff.email,
      clinically_reviewed_at: new Date().toISOString(),
      approval_note: `${before!.approval_note ?? ""} | Clinical: ${note}`.slice(0, 500),
    })
    .eq("id", id)
  if (error) back(id, error.message)
  await logAdminAction(staff, "knowledge.clinical_review", { type: "kb_source", id, before, after: { review: "clinical", note } })
  back(id, "Clinically reviewed. Answers from this source no longer carry the 'not yet reviewed' label.")
}

async function retire(form: FormData) {
  "use server"
  const staff = await staffForAction("knowledge.edit")
  const id = String(form.get("id"))
  if (!staff) return
  const { error } = await createServiceRoleClient().from("kb_sources").update({ status: "retired" }).eq("id", id)
  if (error) back(id, error.message)
  await logAdminAction(staff, "knowledge.retire", { type: "kb_source", id })
  back(id, "Retired. The AI no longer uses it.")
}

async function reindex(form: FormData) {
  "use server"
  const staff = await staffForAction("knowledge.edit")
  const id = String(form.get("id"))
  if (!staff) return
  const db = createServiceRoleClient()
  const { data } = await db.from("kb_sources").select("body").eq("id", id).single()
  if (!data) back(id, "Not found.")
  const r = await indexSource(db, id, data!.body)
  await logAdminAction(staff, "knowledge.reindex", { type: "kb_source", id, after: r })
  back(id, `${r.passages} passages${r.embedded ? ", embedded" : " (no embeddings: Cloudflare isn't set up, so full-text search only)"}.`)
}

async function addTest(form: FormData) {
  "use server"
  const staff = await staffForAction("knowledge.edit")
  const id = String(form.get("id"))
  if (!staff) return
  const question = String(form.get("question") ?? "").trim().slice(0, 1000)
  if (question.length < 3) back(id, "Type a test question.")
  const { error } = await createServiceRoleClient()
    .from("kb_eval_cases")
    .insert({
      level: 1,
      category: "retrieval",
      question,
      language: String(form.get("language") ?? "en"),
      expected_source_key: String(form.get("key")),
      created_by_label: staff.email,
    })
  back(id, error ? error.message : "Test question added (level 1).")
}

export default async function SourcePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ msg?: string }>
}) {
  const staff = await requireStaff("knowledge.edit")
  const { id } = await params
  const p = await searchParams
  const db = createServiceRoleClient()
  const { data: s } = await db.from("kb_sources").select("*").eq("id", id).maybeSingle()
  if (!s) notFound()
  const [{ count: passages }, { count: embedded }, { data: tests }] = await Promise.all([
    db.from("kb_chunks").select("id", { count: "exact", head: true }).eq("source_id", id),
    db.from("kb_chunks").select("id", { count: "exact", head: true }).eq("source_id", id).not("embedding", "is", null),
    db.from("kb_eval_cases").select("id, question").eq("expected_source_key", s.key),
  ])
  const status =
    s.status === "approved"
      ? `Approved by ${s.approved_by_email}${s.review === "clinical" ? `, clinically reviewed by ${s.clinical_reviewer_email}` : " (editorial, not yet clinically reviewed)"}`
      : s.status

  return (
    <StaffPage
      title={s.title}
      message={p.msg}
      back={{ href: "/staff/knowledge", label: "Approved sources" }}
      intro={
        <p>
          {s.publisher} · {s.licence} · {s.language} · {status} · added by {s.created_by_label}
          {s.url && (
            <>
              {" "}
              ·{" "}
              <a href={s.url} className="underline" target="_blank" rel="noreferrer">
                original
              </a>
            </>
          )}
        </p>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Text</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {passages ?? 0} passages, {embedded ?? 0} embedded. Approval note: {s.approval_note ?? "none yet"}
          </p>
          <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap text-sm">{s.body}</pre>
        </CardContent>
      </Card>

      {canApproveEditorial(staff, s) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Approve (editorial)</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={approve} className="space-y-2">
              <input type="hidden" name="id" value={id} />
              <label htmlFor="a-note" className="block text-sm">
                What you checked: read in full, matches the original, suitable for families, licence allows commercial use
              </label>
              <Input id="a-note" name="note" required minLength={3} maxLength={500} />
              <Button type="submit">Approve for the AI</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {canReviewClinically(staff, s) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clinical review</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={clinicalReview} className="space-y-2">
              <input type="hidden" name="id" value={id} />
              <label htmlFor="c-note" className="block text-sm">
                What you checked (clinical accuracy, safe for families)
              </label>
              <Input id="c-note" name="note" required minLength={3} maxLength={500} />
              <Button type="submit">Mark clinically reviewed</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Level 1 test questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="list-disc pl-5 text-sm">
            {(tests ?? []).map((t) => (
              <li key={t.id}>{t.question}</li>
            ))}
          </ul>
          <form action={addTest} className="flex flex-wrap items-end gap-2">
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="key" value={s.key} />
            <input type="hidden" name="language" value={s.language} />
            <label htmlFor="t-q" className="flex-1 space-y-1 text-sm">
              <span className="block">A question this source should answer</span>
              <Input id="t-q" name="question" required />
            </label>
            <Button type="submit" variant="outline">
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      {s.status !== "retired" && (
        <div className="flex flex-wrap gap-2">
          <form action={reindex}>
            <input type="hidden" name="id" value={id} />
            <Button type="submit" variant="outline">
              Re-index passages
            </Button>
          </form>
          <form action={retire}>
            <input type="hidden" name="id" value={id} />
            <Button type="submit" variant="destructive">
              Retire
            </Button>
          </form>
        </div>
      )}
    </StaffPage>
  )
}
