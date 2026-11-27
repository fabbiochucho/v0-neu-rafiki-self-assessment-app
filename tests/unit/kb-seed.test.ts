import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import path from "node:path"
import { containsDiagnosticClaim } from "@/lib/companion/safety"
import { chunkText, isMedicationQuestion } from "@/lib/ask/core"

// Guards the draft sources in migration 032: each must cite its sources, use a licence that allows paid plans,
// never state a diagnosis, never name a medicine, and every level 1 test must point at a real source.
// Windows checkouts may have CRLF line endings; CI (Linux) has LF.
const sql = readFileSync(path.join(__dirname, "../../scripts/032_seed_reviewed_sources.sql"), "utf8").replace(/\r/g, "")
const sources = [
  ...sql.matchAll(
    /\('(nr-[a-z0-9-]+)', '((?:[^']|'')+)', '((?:[^']|'')+)',\s*'(https:[^']+)',\s*'((?:[^']|'')+)', '(\w\w)', '(\w+)',\s*\$b\$([\s\S]*?)\$b\$/g,
  ),
].map((m) => ({ key: m[1], licence: m[5], body: m[8] }))
const testKeys = [...sql.matchAll(/\(1, 'retrieval', '(?:[^']|'')+', '(nr-[a-z0-9-]+)'/g)].map((m) => m[1])

describe("migration 032 seed sources", () => {
  it("parses all sixteen sources", () => expect(sources).toHaveLength(16))
  it.each(sources.map((s) => [s.key, s] as const))("%s cites sources and stays safe", (_key, s) => {
    expect(s.body).toMatch(/\n# Sources\n- /)
    expect(s.licence).not.toMatch(/\bNC\b|non[-\s]?commercial/i)
    expect(containsDiagnosticClaim(s.body)).toBe(false)
    expect(s.body).not.toMatch(/ritalin|methylphenidate|risperidone|melatonin|stimulant|\bdose/i)
    expect(chunkText(s.body).length).toBeGreaterThan(1)
  })
  it("every level 1 question points at a seeded source", () => {
    const keys = new Set(sources.map((s) => s.key))
    expect(testKeys.length).toBeGreaterThanOrEqual(30)
    for (const k of testKeys) expect(keys).toContain(k)
  })
  it("no level 1 question would be blocked as a medicine question", () => {
    const questions = [...sql.matchAll(/\(1, 'retrieval', '((?:[^']|'')+)'/g)].map((m) => m[1])
    expect(questions.length).toBeGreaterThanOrEqual(30)
    for (const q of questions) expect(isMedicationQuestion(q)).toBe(false)
  })
})
