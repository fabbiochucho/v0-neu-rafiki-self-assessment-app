import Link from "next/link"
import { notFound } from "next/navigation"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { getTranslationReviewer } from "@/lib/auth/translation-reviewers"
import { SCREENING_UI_REVIEWED, fixedScreeningStrings } from "@/lib/assessment/screening-i18n"
import { Button } from "@/components/ui/button"
import { saveTranslation } from "./actions"

export const dynamic = "force-dynamic"
export const metadata = { title: "Review translations | NeuRafiki", robots: { index: false } }

const PAGE_SIZE = 25
const LANGS = { fr: "Français", pt: "Português" } as const
type Lang = keyof typeof LANGS
type Status = "draft" | "reviewed" | "missing" | "all"

interface Row {
  id: string
  question_id: string
  question_text: string
  age_group: string
  respondent_type: string
  domain: string
  translation: { question_text: string; status: string; source: string; reviewed_by: string | null } | null
}

async function loadRows(lang: Lang): Promise<Row[]> {
  const db = createServiceRoleClient()
  const questions: Omit<Row, "translation">[] = []
  const translations = new Map<string, Row["translation"]>()
  for (let from = 0; ; from += 1000) {
    const { data } = await db
      .from("questions")
      .select("id, question_id, question_text, age_group, respondent_type, assessment_domains(name)")
      .order("domain_id")
      .order("question_id")
      .range(from, from + 999)
    for (const q of data ?? []) {
      const d = q.assessment_domains as unknown as { name: string } | null
      questions.push({ ...q, domain: d?.name ?? "" })
    }
    if (!data || data.length < 1000) break
  }
  for (let from = 0; ; from += 1000) {
    const { data } = await db
      .from("question_translations")
      .select("question_id, question_text, status, source, reviewed_by")
      .eq("lang", lang)
      .range(from, from + 999)
    for (const t of data ?? []) translations.set(t.question_id, t)
    if (!data || data.length < 1000) break
  }
  return questions.map((q) => ({ ...q, translation: translations.get(q.id) ?? null }))
}

export default async function TranslationsPage(props: {
  searchParams: Promise<{ lang?: string; status?: string; page?: string; q?: string }>
}) {
  const reviewer = await getTranslationReviewer()
  if (!reviewer) notFound()

  const sp = await props.searchParams
  const lang: Lang = sp.lang === "pt" ? "pt" : "fr"
  const status: Status = (["draft", "reviewed", "missing", "all"] as const).find((s) => s === sp.status) ?? "draft"
  const query = (sp.q ?? "").trim().toLowerCase()
  const rows = await loadRows(lang)

  const counts = {
    reviewed: rows.filter((r) => r.translation?.status === "reviewed").length,
    draft: rows.filter((r) => r.translation?.status === "draft").length,
    missing: rows.filter((r) => !r.translation).length,
  }
  const filtered = rows.filter(
    (r) =>
      (status === "all" ||
        (status === "missing" ? !r.translation : r.translation?.status === status)) &&
      (!query || r.question_text.toLowerCase().includes(query) || r.question_id.toLowerCase().includes(query)),
  )
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(pages, Math.max(1, Number(sp.page) || 1))
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const href = (over: Record<string, string | number>) => {
    const p = new URLSearchParams({ lang, status, page: String(page), ...(query && { q: query }) })
    for (const [k, v] of Object.entries(over)) p.set(k, String(v))
    return `/translations?${p}`
  }

  return (
    <main className="container mx-auto max-w-5xl px-4 py-10 space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">Review screening translations</h1>
        <p className="text-muted-foreground">
          Signed in as {reviewer}. People taking a screening only ever see translations marked <strong>reviewed</strong>;
          anything else is shown in English. Check each question means exactly the same as the English, in plain words a
          parent or teacher would use. Answer choices are scored from the English, so wording here doesn&apos;t change
          scores.
        </p>
        <nav aria-label="Language" className="flex flex-wrap gap-2">
          {(Object.keys(LANGS) as Lang[]).map((l) => (
            <Button key={l} asChild size="sm" variant={l === lang ? "default" : "outline"}>
              <Link href={`/translations?lang=${l}&status=${status}`} aria-current={l === lang ? "page" : undefined}>
                {LANGS[l]}
              </Link>
            </Button>
          ))}
          <Button asChild size="sm" variant="outline">
            <a href="/translations/csv">Download CSV (all languages)</a>
          </Button>
        </nav>
        <p className="text-sm">
          {LANGS[lang]}: {counts.reviewed} reviewed · {counts.draft} drafts · {counts.missing} not translated · of{" "}
          {rows.length} questions.
        </p>
        <nav aria-label="Filter" className="flex flex-wrap items-center gap-2 text-sm">
          {(["draft", "reviewed", "missing", "all"] as const).map((s) => (
            <Link key={s} href={href({ status: s, page: 1 })} className={s === status ? "font-semibold underline" : "underline text-muted-foreground"}>
              {s === "draft" ? "Drafts" : s === "reviewed" ? "Reviewed" : s === "missing" ? "Not translated" : "All"}
            </Link>
          ))}
          <form action="/translations" className="ml-auto flex gap-2">
            <input type="hidden" name="lang" value={lang} />
            <input type="hidden" name="status" value={status} />
            <label htmlFor="q" className="sr-only">
              Search questions
            </label>
            <input id="q" name="q" defaultValue={query} placeholder="Search English text or ID" className="rounded-md border px-2 py-1" />
            <Button type="submit" size="sm" variant="outline">
              Search
            </Button>
          </form>
        </nav>
      </header>

      {shown.length === 0 ? (
        <p className="text-muted-foreground">Nothing here.</p>
      ) : (
        <ol className="space-y-6" start={(page - 1) * PAGE_SIZE + 1}>
          {shown.map((r) => (
            <li key={r.id} className="rounded-lg border p-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                {r.question_id} · {r.domain} · {r.age_group} · {r.respondent_type}
                {r.translation && (
                  <>
                    {" "}
                    · {r.translation.status === "reviewed" ? `reviewed by ${r.translation.reviewed_by}` : "draft"} ·{" "}
                    {r.translation.source === "machine" ? "machine translation" : "edited by a person"}
                  </>
                )}
              </p>
              <p lang="en" className="font-medium">
                {r.question_text}
              </p>
              <form action={saveTranslation} className="space-y-2">
                <input type="hidden" name="question_id" value={r.id} />
                <input type="hidden" name="lang" value={lang} />
                <label htmlFor={`t-${r.id}`} className="text-sm">
                  {LANGS[lang]}
                </label>
                <textarea
                  id={`t-${r.id}`}
                  name="question_text"
                  lang={lang}
                  required
                  maxLength={1000}
                  rows={2}
                  defaultValue={r.translation?.question_text ?? ""}
                  className="w-full rounded-md border p-2"
                />
                <div className="flex gap-2">
                  <Button type="submit" name="intent" value="approve" size="sm">
                    {r.translation?.status === "reviewed" ? "Save (stays reviewed)" : "Approve"}
                  </Button>
                  <Button type="submit" name="intent" value="draft" size="sm" variant="outline">
                    Save as draft
                  </Button>
                </div>
              </form>
            </li>
          ))}
        </ol>
      )}

      {pages > 1 && (
        <nav aria-label="Pages" className="flex items-center justify-between text-sm">
          {page > 1 ? <Link href={href({ page: page - 1 })} className="underline">Previous</Link> : <span />}
          <span>
            Page {page} of {pages}
          </span>
          {page < pages ? <Link href={href({ page: page + 1 })} className="underline">Next</Link> : <span />}
        </nav>
      )}

      <section aria-labelledby="fixed-heading" className="space-y-3">
        <h2 id="fixed-heading" className="text-2xl font-semibold">
          Buttons, answer choices and area names
        </h2>
        <p className="text-muted-foreground text-sm">
          These are in the code (lib/assessment/screening-i18n.ts). Send corrections with the CSV. A language is offered
          to people only after this list has been reviewed for it. Reviewed so far:{" "}
          {SCREENING_UI_REVIEWED.length ? SCREENING_UI_REVIEWED.join(", ") : "none"}.
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="p-2">English</th>
                <th className="p-2">Français</th>
                <th className="p-2">Português</th>
              </tr>
            </thead>
            <tbody>
              {fixedScreeningStrings().map((r) => (
                <tr key={r.key} className="border-t align-top">
                  <td className="p-2" lang="en">{r.en || r.key}</td>
                  <td className="p-2" lang="fr">{r.fr}</td>
                  <td className="p-2" lang="pt">{r.pt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
