// Approved sources: who may approve what (mirrors the kb_sources_guard trigger, so buttons only show when the
// database will accept them), form checks, and indexing a source into passages.
import type { SupabaseClient } from "@supabase/supabase-js"
import { can, type StaffRole } from "@/lib/staff/permissions"
import { chunkText, isLang } from "@/lib/ask/core"
import { embed } from "@/lib/ask/embed"

type Who = { userId: string; role: StaffRole }

/** Editorial approval (interim, spec section 7): an owner who didn't add the draft. */
export function canApproveEditorial(staff: Who, source: { status: string; created_by: string | null }): boolean {
  return can(staff.role, "knowledge.approve") && source.status === "draft" && source.created_by !== staff.userId
}

/** Clinical review: a clinical reviewer who didn't add the source, on an approved source not yet reviewed. */
export function canReviewClinically(staff: Who, source: { status: string; review: string; created_by: string | null }): boolean {
  return (
    staff.role === "clinical_reviewer" &&
    can(staff.role, "clinical.approve") &&
    source.status === "approved" &&
    source.review === "editorial" &&
    source.created_by !== staff.userId
  )
}

export const ORIGINS = {
  agency_text: "Agency text, word for word (public domain)",
  written_summary: "Plain-language summary written by NeuRafiki, citing sources",
} as const

const NON_COMMERCIAL = /\bNC\b|non[-\s]?commercial/i

export interface SourceRow {
  key: string
  title: string
  publisher: string
  url: string | null
  licence: string
  language: string
  origin: keyof typeof ORIGINS
  body: string
}

export function validateSource(form: FormData): { ok: true; row: SourceRow } | { ok: false; error: string } {
  const s = (k: string) => String(form.get(k) ?? "").trim()
  const origin = s("origin")
  if (!(origin in ORIGINS)) return { ok: false, error: "Choose what kind of source this is." }
  const row: SourceRow = {
    key: s("key"),
    title: s("title"),
    publisher: s("publisher"),
    url: s("url") || null,
    licence: s("licence"),
    language: s("language") || "en",
    origin: origin as SourceRow["origin"],
    body: s("body"),
  }
  if (!/^[a-z0-9][a-z0-9_-]{2,80}$/.test(row.key)) return { ok: false, error: "Key: lower-case letters, numbers, - or _ (3-81 characters)." }
  if (row.title.length < 3 || row.publisher.length < 2) return { ok: false, error: "Give a title and a publisher." }
  if (row.url && !row.url.startsWith("https://")) return { ok: false, error: "Links must start with https://" }
  if (row.licence.length < 2) return { ok: false, error: "Say what licence the source is under." }
  if (NON_COMMERCIAL.test(row.licence)) {
    return {
      ok: false,
      error: "Non-commercial licences can't be used: NeuRafiki has paid plans. Summarise the facts in your own words and cite it instead, or get written permission.",
    }
  }
  if (!isLang(row.language)) return { ok: false, error: "Unknown language." }
  if (row.body.length < 20 || row.body.length > 200_000) return { ok: false, error: "Paste the source text (20 to 200,000 characters)." }
  return { ok: true, row }
}

/** Replaces a source's passages and embeds them (embeddings skipped if Cloudflare isn't set up). */
export async function indexSource(db: SupabaseClient, sourceId: string, body: string): Promise<{ passages: number; embedded: boolean }> {
  const chunks = chunkText(body)
  const vecs = await embed(chunks.map((c) => (c.heading ? `${c.heading}\n${c.content}` : c.content)))
  const { error: delError } = await db.from("kb_chunks").delete().eq("source_id", sourceId)
  if (delError) throw new Error(`Couldn't clear old passages: ${delError.message}`)
  const { error } = await db.from("kb_chunks").insert(
    chunks.map((c, i) => ({
      source_id: sourceId,
      position: i,
      heading: c.heading,
      content: c.content,
      embedding: vecs ? JSON.stringify(vecs[i]) : null,
    })),
  )
  if (error) throw new Error(`Couldn't save passages: ${error.message}`)
  return { passages: chunks.length, embedded: !!vecs }
}
