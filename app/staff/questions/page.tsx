import { redirect } from "next/navigation"
import { StaffPage } from "@/components/staff/staff-page"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { requireStaff, staffForAction } from "@/lib/staff"
import { logAdminAction } from "@/lib/staff/audit"
import { sendEmail } from "@/lib/email/mailer"
import { expertSourceDraft } from "@/lib/ask/questions"
import { indexSource } from "@/lib/ask/sources"

export const dynamic = "force-dynamic"
export const metadata = { title: "Questions for a clinician | NeuRafiki staff", robots: { index: false } }

async function answer(form: FormData) {
  "use server"
  const staff = await staffForAction("clinical.approve")
  if (!staff) return
  const id = String(form.get("id"))
  const text = String(form.get("answer") ?? "").trim().slice(0, 6000)
  if (text.length < 10) redirect("/staff/questions?msg=Write%20an%20answer%20first.")
  const db = createServiceRoleClient()
  const { data: q, error } = await db
    .from("kb_questions")
    .update({
      status: "expert_answered",
      expert_answer: text,
      answered_by: staff.userId,
      answered_by_email: staff.email,
      answered_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "escalated")
    .select("id, user_id, question, language")
    .single()
  if (error || !q) redirect("/staff/questions?msg=Already%20answered%20or%20deleted.")
  await logAdminAction(staff, "questions.answer", { type: "kb_question", id })
  // The email carries only a link: health questions and answers stay out of inboxes.
  const { data: u } = await db.auth.admin.getUserById(q.user_id)
  if (u?.user?.email) {
    const site = (process.env.NEXT_PUBLIC_APP_URL ?? "https://neurafiki.becomechange.institute").replace(/\/+$/, "")
    await sendEmail({
      to: u.user.email,
      subject: "A clinician answered your NeuRafiki question",
      text: `A NeuRafiki clinician has answered the question you sent. Read it here: ${site}/ask`,
    })
  }
  if (form.get("save_as_source") === "on") {
    const row = expertSourceDraft(q, text, staff)
    const { data: src } = await db.from("kb_sources").insert(row).select("id").single()
    if (src) await indexSource(db, src.id, row.body)
  }
  redirect("/staff/questions?msg=Answered.")
}

export default async function QuestionsPage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  await requireStaff("clinical.approve")
  const p = await searchParams
  const { data: open } = await createServiceRoleClient()
    .from("kb_questions")
    .select("id, question, language, channel, created_at")
    .eq("status", "escalated")
    .order("created_at")
    .limit(100)

  return (
    <StaffPage
      title="Questions for a clinician"
      message={p.msg}
      intro={
        <p>
          Questions the AI had no approved answer for, oldest first. Your answer appears on the person&apos;s Ask page, and they get
          an email with a link only. Don&apos;t add identifying details. Questions are deleted after 3 months.
        </p>
      }
    >
      {!open?.length ? (
        <p>No open questions.</p>
      ) : (
        open.map((q) => (
          <Card key={q.id}>
            <CardContent className="space-y-2 pt-4">
              <p className="font-medium">{q.question}</p>
              <p className="text-xs text-muted-foreground">
                {q.language} · {q.channel} · {new Date(q.created_at).toLocaleDateString("en-GB")}
              </p>
              <form action={answer} className="space-y-2">
                <input type="hidden" name="id" value={q.id} />
                <label htmlFor={`a-${q.id}`} className="sr-only">
                  Your answer
                </label>
                <Textarea id={`a-${q.id}`} name="answer" rows={4} required minLength={10} maxLength={6000} />
                <label className="flex gap-2 text-sm">
                  <input type="checkbox" name="save_as_source" /> Also save as a draft source (someone else must approve it;
                  remove anything identifying first)
                </label>
                <Button type="submit">Send answer</Button>
              </form>
            </CardContent>
          </Card>
        ))
      )}
    </StaffPage>
  )
}
