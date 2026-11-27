import Link from "next/link"
import { redirect } from "next/navigation"
import { StaffPage, fieldClass } from "@/components/staff/staff-page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { requireStaff, staffForAction } from "@/lib/staff"
import { logAdminAction } from "@/lib/staff/audit"
import { LANGUAGES } from "@/lib/ask/core"
import { ORIGINS, indexSource, validateSource } from "@/lib/ask/sources"

export const dynamic = "force-dynamic"
export const maxDuration = 300
export const metadata = { title: "Approved sources | NeuRafiki staff", robots: { index: false } }

async function create(form: FormData) {
  "use server"
  const staff = await staffForAction("knowledge.edit")
  if (!staff) return
  const v = validateSource(form)
  if (!v.ok) redirect(`/staff/knowledge?msg=${encodeURIComponent(v.error)}`)
  const db = createServiceRoleClient()
  const { data, error } = await db
    .from("kb_sources")
    .insert({ ...v.row, created_by: staff.userId, created_by_label: staff.email })
    .select("id")
    .single()
  if (error || !data) redirect(`/staff/knowledge?msg=${encodeURIComponent(error?.message ?? "Couldn't save.")}`)
  const idx = await indexSource(db, data.id, v.row.body)
  await logAdminAction(staff, "knowledge.create", { type: "kb_source", id: data.id, after: { key: v.row.key, ...idx } })
  redirect(`/staff/knowledge/${data.id}`)
}

/** Splits into passages (and embeds) every source that has none yet, e.g. the ones migration 032 adds. */
async function indexMissing() {
  "use server"
  const staff = await staffForAction("knowledge.edit")
  if (!staff) return
  const db = createServiceRoleClient()
  const { data: sources } = await db.from("kb_sources").select("id, body, kb_chunks(count)").neq("status", "retired").limit(300)
  let done = 0
  for (const s of sources ?? []) {
    const n = (s as { kb_chunks?: { count: number }[] }).kb_chunks?.[0]?.count ?? 0
    if (n > 0) continue
    await indexSource(db, s.id, s.body)
    done++
  }
  await logAdminAction(staff, "knowledge.index_missing", { after: { indexed: done } })
  redirect(`/staff/knowledge?msg=${encodeURIComponent(`Indexed ${done} source(s).`)}`)
}

const STATUS_LABEL = (s: { status: string; review: string }) =>
  s.status === "approved" ? (s.review === "clinical" ? "Approved, clinically reviewed" : "Approved (editorial)") : s.status === "draft" ? "Draft" : "Retired"

export default async function KnowledgePage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  await requireStaff("knowledge.edit")
  const p = await searchParams
  const { data: sources } = await createServiceRoleClient()
    .from("kb_sources")
    .select("id, key, title, publisher, licence, language, origin, status, review, created_by_label, updated_at")
    .order("status")
    .order("title")
    .limit(300)

  return (
    <StaffPage
      title="Approved sources"
      message={p.msg}
      wide
      intro={
        <p>
          The AI answers only from approved sources. Until a clinician joins, an owner approves each draft after reading it
          (editorial review), and answers say they haven&apos;t been reviewed by a clinician. A clinical reviewer can later
          upgrade a source. Approved sources can&apos;t be edited: retire and re-add instead. Licences must allow commercial use.
        </p>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sources ({sources?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 overflow-x-auto">
          <form action={indexMissing}>
            <Button type="submit" variant="outline" size="sm">
              Index sources that have no passages yet
            </Button>
          </form>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th scope="col">Title</th>
                <th scope="col">Publisher</th>
                <th scope="col">Kind</th>
                <th scope="col">Lang</th>
                <th scope="col">Status</th>
                <th scope="col">Added by</th>
              </tr>
            </thead>
            <tbody>
              {(sources ?? []).map((s) => (
                <tr key={s.id} className="border-t align-top">
                  <td className="py-1 pr-2">
                    <Link href={`/staff/knowledge/${s.id}`} className="underline">
                      {s.title}
                    </Link>
                  </td>
                  <td className="pr-2">{s.publisher}</td>
                  <td className="pr-2">{s.origin === "agency_text" ? "Agency text" : s.origin === "written_summary" ? "Summary" : "Expert answer"}</td>
                  <td className="pr-2">{s.language}</td>
                  <td className="pr-2">{STATUS_LABEL(s)}</td>
                  <td>{s.created_by_label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add a draft source</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={create} className="grid gap-3">
            {(
              [
                ["key", "Key (e.g. cdc-autism-signs)"],
                ["title", "Title"],
                ["publisher", "Publisher"],
                ["url", "Link to the original (https://)"],
                ["licence", "Licence (e.g. US federal public domain)"],
              ] as const
            ).map(([f, label]) => (
              <label key={f} htmlFor={`k-${f}`} className="space-y-1 text-sm">
                <span className="block">{label}</span>
                <Input id={`k-${f}`} name={f} required={f !== "url"} type={f === "url" ? "url" : "text"} />
              </label>
            ))}
            <label htmlFor="k-origin" className="space-y-1 text-sm">
              <span className="block">Kind</span>
              <select id="k-origin" name="origin" className={fieldClass} defaultValue="agency_text">
                {Object.entries(ORIGINS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="k-language" className="space-y-1 text-sm">
              <span className="block">Language</span>
              <select id="k-language" name="language" className={fieldClass} defaultValue="en">
                {Object.entries(LANGUAGES).map(([c, n]) => (
                  <option key={c} value={c}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="k-body" className="space-y-1 text-sm">
              <span className="block">Text (start each section with a # heading)</span>
              <Textarea id="k-body" name="body" rows={12} required />
            </label>
            <div>
              <Button type="submit">Save draft</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </StaffPage>
  )
}
