import { revalidatePath } from "next/cache"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { staffForAction } from "@/lib/staff"
import { logAdminAction } from "@/lib/staff/audit"
import { retrieve } from "@/lib/ask/answer"
import { respond } from "@/lib/ask/respond"
import { canRunEvals, gateStatus, runEvals, type EvalCase, type EvalSummary } from "@/lib/ask/evals"

async function run() {
  "use server"
  const staff = await staffForAction("health.read")
  if (!staff || !canRunEvals(staff.role)) return
  const db = createServiceRoleClient()
  const { data: cases } = await db
    .from("kb_eval_cases")
    .select("id, level, category, question, language, expected_source_key, expected_behaviour")
    .order("level")
    .limit(200)
  const s = await runEvals((cases ?? []) as EvalCase[], { retrieve, respond })
  await db.from("kb_eval_runs").insert({ started_by_email: staff.email, ...s })
  await logAdminAction(staff, "ask.evals.run", {
    after: { level1: `${s.level1_passed}/${s.level1_total}`, level2: `${s.level2_passed}/${s.level2_total}`, critical: s.critical_failed },
  })
  revalidatePath("/staff/health")
}

/** Levels 1-2 of the four-level testing. The run button needs an owner or a clinical reviewer. */
export async function AskEvals({ canRun }: { canRun: boolean }) {
  const { data: last } = await createServiceRoleClient()
    .from("kb_eval_runs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  const s = last as (EvalSummary & { created_at: string; started_by_email: string }) | null
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI tests (levels 1–2)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          Switch on <code>ai.ask</code> for families only when this says ready <em>and</em> you have read every level 2 reply
          below (a clinical reviewer, once you have one). A run uses the free daily AI allowance and takes a few minutes.
        </p>
        {s ? (
          <>
            <p>
              Last run {new Date(s.created_at).toLocaleString("en-GB")} by {s.started_by_email}: level 1 {s.level1_passed}/
              {s.level1_total}, level 2 {s.level2_passed}/{s.level2_total}, critical failures {s.critical_failed}.{" "}
              <strong>{gateStatus(s) === "ready_for_signoff" ? "Ready for sign-off" : "Not ready"}</strong>
            </p>
            <details>
              <summary className="cursor-pointer">Every result</summary>
              <ul className="mt-2 space-y-2">
                {s.results.map((r) => (
                  <li key={r.id} className={r.passed ? "" : "text-destructive"}>
                    {r.passed ? "Pass" : "FAIL"} · L{r.level} · {r.category} · {r.question}
                    {r.kind && (
                      <>
                        {" "}
                        → <em>{r.kind}</em>
                      </>
                    )}
                    {r.text && <pre className="whitespace-pre-wrap text-xs text-muted-foreground">{r.text}</pre>}
                  </li>
                ))}
              </ul>
            </details>
          </>
        ) : (
          <p>No runs yet.</p>
        )}
        {canRun && (
          <form action={run}>
            <Button type="submit" variant="outline">
              Run tests now
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
