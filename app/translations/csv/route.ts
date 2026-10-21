import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { getTranslationReviewer } from "@/lib/auth/translation-reviewers"
import { fixedScreeningStrings } from "@/lib/assessment/screening-i18n"
import { translationsCsv, type CsvRow } from "@/lib/assessment/translation-csv"

export const dynamic = "force-dynamic"

// Every question and fixed screening string, for translators who prefer a spreadsheet.
export async function GET() {
  if (!(await getTranslationReviewer())) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const db = createServiceRoleClient()

  const questions: { id: string; question_id: string; question_text: string; age_group: string; respondent_type: string }[] = []
  for (let from = 0; ; from += 1000) {
    const { data } = await db
      .from("questions")
      .select("id, question_id, question_text, age_group, respondent_type")
      .order("domain_id")
      .order("question_id")
      .range(from, from + 999)
    questions.push(...(data ?? []))
    if (!data || data.length < 1000) break
  }
  const tr = new Map<string, { text: string; status: string }>()
  for (let from = 0; ; from += 1000) {
    const { data } = await db.from("question_translations").select("question_id, lang, question_text, status").range(from, from + 999)
    for (const t of data ?? []) tr.set(`${t.question_id}|${t.lang}`, { text: t.question_text, status: t.status })
    if (!data || data.length < 1000) break
  }

  const rows: CsvRow[] = fixedScreeningStrings().map((r) => ({ ...r, fr_status: "", pt_status: "" }))
  for (const q of questions) {
    const fr = tr.get(`${q.id}|fr`)
    const pt = tr.get(`${q.id}|pt`)
    rows.push({
      key: `question.${q.id}`,
      en: q.question_text,
      fr: fr?.text ?? "",
      fr_status: fr?.status ?? "missing",
      pt: pt?.text ?? "",
      pt_status: pt?.status ?? "missing",
    })
  }
  return new NextResponse(translationsCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="neurafiki-screening-translations.csv"',
    },
  })
}
