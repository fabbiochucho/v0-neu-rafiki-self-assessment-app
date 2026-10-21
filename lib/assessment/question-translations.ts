import type { SupabaseClient } from "@supabase/supabase-js"
import { domainText, type ScreeningLanguage } from "@/lib/assessment/screening-i18n"

interface QuestionRow {
  id: string
  question_text: string
  assessment_domains: { name: string; description: string | null }
}

/**
 * Questions as shown in the screening's language. Only reviewed translations
 * are visible to signed-in users (RLS on question_translations); a question
 * without one stays in English and is flagged so the page can say so. Option
 * values and scoring are untouched.
 */
export async function localizeQuestions<Q extends QuestionRow>(
  supabase: SupabaseClient,
  questions: Q[],
  lang: ScreeningLanguage,
): Promise<(Q & { translated: boolean })[]> {
  if (lang === "en") return questions.map((q) => ({ ...q, translated: true }))

  const texts = new Map<string, string>()
  // ponytail: reads every reviewed row for the language (about 1,000), a page at a time.
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("question_translations")
      .select("question_id, question_text")
      .eq("lang", lang)
      .range(from, from + 999)
    if (error || !data?.length) break
    for (const r of data) texts.set(r.question_id, r.question_text)
    if (data.length < 1000) break
  }

  return questions.map((q) => {
    const text = texts.get(q.id)
    return {
      ...q,
      question_text: text ?? q.question_text,
      translated: Boolean(text),
      assessment_domains: { ...q.assessment_domains, ...domainText(lang, q.assessment_domains.name, q.assessment_domains.description) },
    }
  })
}
