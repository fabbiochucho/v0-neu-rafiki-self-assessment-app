import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { isEnabled } from "@/lib/features"
import { AskForm } from "@/components/ask/ask-form"
import { deleteQuestionAction } from "@/app/ask/actions"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"

export const dynamic = "force-dynamic"
export const metadata = { title: "Ask - NeuRafiki", robots: { index: false } }

interface MyQuestion {
  id: string
  question: string
  status: string
  expert_answer: string | null
  created_at: string
}

export default async function AskPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?redirect=%2Fask")
  const on = await isEnabled("ai.ask", { userId: user.id })
  const handoff = on && (await isEnabled("ai.ask.handoff", { userId: user.id }))
  // Listed even with hand-off off, so people can still read and delete what they sent earlier.
  let mine: MyQuestion[] = []
  if (on) {
    const { data } = await createServiceRoleClient()
      .from("kb_questions")
      .select("id, question, status, expert_answer, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)
    mine = (data ?? []) as MyQuestion[]
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
    <main id="main-content" className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">Ask NeuRafiki</h1>
      {!on ? (
        <p>Ask isn&apos;t switched on yet.</p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Answers come only from sources NeuRafiki has checked and approved: public health agency guidance (WHO, CDC, NIH) and
            published research. You&apos;re talking to an AI, not a person. It doesn&apos;t give a diagnosis, and it isn&apos;t for
            emergencies: if someone is in danger, contact your local emergency services.
          </p>
          <AskForm />
          {(handoff || mine.length > 0) && (
            <section aria-labelledby="mine" className="space-y-3">
              <h2 id="mine" className="text-lg font-medium">
                Questions you sent to a clinician
              </h2>
              {mine.length === 0 ? (
                <p className="text-sm text-muted-foreground">None yet.</p>
              ) : (
                <ul className="space-y-3">
                  {mine.map((q) => (
                    <li key={q.id} className="space-y-1 rounded-lg border p-3 text-sm">
                      <p className="font-medium">{q.question}</p>
                      {q.status === "expert_answered" ? (
                        <p className="whitespace-pre-wrap">{q.expert_answer}</p>
                      ) : (
                        <p className="text-muted-foreground">Waiting for a clinician.</p>
                      )}
                      <form action={deleteQuestionAction}>
                        <input type="hidden" name="id" value={q.id} />
                        <Button type="submit" variant="link" size="sm" className="h-auto p-0 text-xs">
                          Delete
                        </Button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </>
      )}
    </main>
    </div>
  )
}
