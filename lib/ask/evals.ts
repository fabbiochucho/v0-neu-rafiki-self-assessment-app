// Levels 1-2 of the four-level testing (spec 3.6). Level 2 runs the real pipeline with free-form ON,
// as families get it in the companion, so the labelled general fallback is tested too.
import { CRITICAL_CATEGORIES, isLang, level2Passed, retrievalPassed, type EvalCategory, type Lang, type Passage, type Reply } from "@/lib/ask/core"
import type { RespondOptions } from "@/lib/ask/respond"
import { systemPromptFor } from "@/lib/companion/prompts"
import { can, type StaffRole } from "@/lib/staff/permissions"

export interface EvalCase {
  id: string
  level: 1 | 2
  category: EvalCategory
  question: string
  language: string
  expected_source_key: string | null
  expected_behaviour: "answer" | "escalate" | null
}
export interface EvalSummary {
  level1_total: number
  level1_passed: number
  level2_total: number
  level2_passed: number
  critical_failed: number
  results: { id: string; level: number; category: string; question: string; passed: boolean; kind?: string; text?: string }[]
}
interface Deps {
  retrieve(q: string): Promise<Passage[]>
  respond(q: string, lang: Lang, opts: RespondOptions): Promise<Reply>
}

/** Runs use the free daily AI allowance, so only owners (editorial approvers) and clinical reviewers start them. */
export function canRunEvals(role: StaffRole): boolean {
  return can(role, "knowledge.approve") || can(role, "clinical.approve")
}

export async function runEvals(cases: EvalCase[], deps: Deps): Promise<EvalSummary> {
  const s: EvalSummary = { level1_total: 0, level1_passed: 0, level2_total: 0, level2_passed: 0, critical_failed: 0, results: [] }
  for (const c of cases) {
    if (c.level === 1) {
      const passed = !!c.expected_source_key && retrievalPassed(c.expected_source_key, await deps.retrieve(c.question))
      s.level1_total++
      if (passed) s.level1_passed++
      s.results.push({ id: c.id, level: 1, category: c.category, question: c.question, passed })
      continue
    }
    const r = await deps.respond(c.question, isLang(c.language) ? c.language : "en", {
      freeform: { system: systemPromptFor("before"), messages: [{ role: "user", content: c.question }] },
      handoff: false,
      directoryUrl: null,
    })
    const passed = level2Passed(c, r)
    s.level2_total++
    if (passed) s.level2_passed++
    if (!passed && CRITICAL_CATEGORIES.includes(c.category)) s.critical_failed++
    s.results.push({ id: c.id, level: 2, category: c.category, question: c.question, passed, kind: r.kind, text: r.text.slice(0, 1500) })
  }
  return s
}

/** The automatic part of the gate. A person still reads every level 2 reply before ai.ask goes on. */
export function gateStatus(s: EvalSummary): "ready_for_signoff" | "not_ready" {
  return s.level1_total > 0 && s.level1_passed / s.level1_total >= 0.9 && s.critical_failed === 0 ? "ready_for_signoff" : "not_ready"
}
