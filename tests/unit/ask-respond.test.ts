import { describe, it, expect, vi } from "vitest"
import { respond } from "@/lib/ask/respond"
import { embeddingsFrom } from "@/lib/ask/embed"
import { askApproved } from "@/lib/ask/answer"
import { DIAGNOSIS_POINTER } from "@/lib/ask/core"
import { CRISIS_REPLY } from "@/lib/companion/safety"

const freeform = { system: "sys", messages: [{ role: "user" as const, content: "q" }] }
const base = { freeform, handoff: false, directoryUrl: "https://anda.example/directory" }
const deps = (over: object = {}) => ({
  askApproved: vi.fn(async () => ({ status: "escalated", reason: "none", language: "en" }) as never),
  generate: vi.fn(async () => ({ ok: true, text: "Screening looks at traits." }) as never),
  ...over,
})

describe("respond", () => {
  it("crisis messages get the crisis reply and never reach the model", async () => {
    const d = deps()
    const r = await respond("I want to die", "en", base, d)
    expect(r).toMatchObject({ kind: "crisis", text: CRISIS_REPLY, canEscalate: false })
    expect(d.askApproved).not.toHaveBeenCalled()
  })
  it("medicine questions never get a free-form answer (Review Focus 5)", async () => {
    const d = deps()
    const r = await respond("What dose of melatonin for my son?", "en", base, d)
    expect(r.kind).toBe("no_answer")
    expect(r.text).toMatch(/paediatrician/)
    expect(d.generate).not.toHaveBeenCalled()
  })
  it("returns the approved answer with citations and the diagnosis pointer", async () => {
    const cit = [{ n: 1, source_key: "cdc-asd", title: "T", publisher: "CDC", url: null, heading: null, review: "editorial" as const }]
    const d = deps({ askApproved: vi.fn(async () => ({ status: "answered", answer: "A [1].", citations: cit, language: "en" })) })
    const r = await respond("What is screening?", "en", base, d)
    expect(r).toMatchObject({ kind: "approved", citations: cit })
    expect(r.text).toBe(`A [1].\n\n${DIAGNOSIS_POINTER}`)
  })
  it("falls back to a general reply when free-form is on, also with the pointer", async () => {
    const r = await respond("What is screening?", "en", base, deps())
    expect(r.kind).toBe("general")
    expect(r.text.endsWith(DIAGNOSIS_POINTER)).toBe(true)
  })
  it("says there is no approved answer when free-form is off", async () => {
    expect((await respond("What is screening?", "en", { ...base, freeform: null }, deps())).kind).toBe("no_answer")
  })
  it("offers a clinician only when hand-off is on", async () => {
    expect((await respond("What is screening?", "en", { ...base, freeform: null }, deps())).canEscalate).toBe(false)
    expect((await respond("What is screening?", "en", { ...base, freeform: null, handoff: true }, deps())).canEscalate).toBe(true)
  })
  it("replaces a free-form diagnosis", async () => {
    const r = await respond("Tell me", "en", base, deps({ generate: vi.fn(async () => ({ ok: true, text: "Your child has ADHD." })) }))
    expect(r.text).not.toMatch(/has ADHD/)
  })
  it("reports the AI being unavailable", async () => {
    const d = deps({ askApproved: vi.fn(async () => ({ status: "unavailable", reason: "busy", language: "en" })) })
    expect(await respond("What is screening?", "en", base, d)).toMatchObject({ kind: "unavailable", reason: "busy" })
  })
})

describe("askApproved", () => {
  const passage = { chunk_id: "c", source_id: "s", source_key: "k", title: "T", publisher: "CDC", url: null, licence: "PD", review: "editorial" as const, heading: null, content: "x".repeat(30), similarity: 0.9, text_rank: 0 }
  it("escalates without calling the model when no approved passage matches", async () => {
    const generate = vi.fn()
    const o = await askApproved("q", "en", undefined, { retrieve: async () => [], generate: generate as never })
    expect(o.status).toBe("escalated")
    expect(generate).not.toHaveBeenCalled()
  })
  it("answers from passages", async () => {
    const generate = vi.fn(async () => ({ ok: true as const, text: '{"answer":"Yes [1].","cited":[1],"confident":true,"harmful":false,"language":"en"}' }))
    const o = await askApproved("q", "en", undefined, { retrieve: async () => [passage], generate })
    expect(o.status).toBe("answered")
  })
})

describe("embeddingsFrom", () => {
  it("reads Workers AI bge-m3 output", () => {
    const v = Array(1024).fill(0.1)
    expect(embeddingsFrom({ result: { shape: [1, 1024], data: [v] } })).toEqual([v])
  })
  it("rejects the wrong size", () => {
    expect(embeddingsFrom({ result: { data: [[0.1, 0.2]] } })).toBeNull()
  })
})
