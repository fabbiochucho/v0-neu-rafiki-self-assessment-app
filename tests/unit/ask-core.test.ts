import { describe, it, expect } from "vitest"
import {
  chunkText, decide, isMedicationQuestion, labelFor, level2Passed, noAnswerText, retrievalPassed, usable,
  DIAGNOSIS_POINTER, EDITORIAL_LABEL, GENERAL_LABEL, type Passage,
} from "@/lib/ask/core"

const p = (n: number, over: Partial<Passage> = {}): Passage => ({
  chunk_id: `c${n}`, source_id: `s${n}`, source_key: `src-${n}`, title: `T${n}`, publisher: "CDC", url: null,
  licence: "Public domain", review: "editorial", heading: null, content: "x".repeat(30), similarity: 0.8, text_rank: 0, ...over,
})
const reply = (o: object) => JSON.stringify({ answer: "", cited: [], confident: true, harmful: false, language: "en", ...o })

describe("decide", () => {
  const passages = [p(1), p(2, { review: "clinical" }), p(3)]
  it("answers when every citation is a real passage, keeping each source's review level", () => {
    const o = decide(reply({ answer: "Screening is not diagnosis [1][2].", cited: [1, 2] }), passages, "en")
    expect(o.status).toBe("answered")
    if (o.status === "answered") expect(o.citations.map((c) => [c.source_key, c.review])).toEqual([["src-1", "editorial"], ["src-2", "clinical"]])
  })
  it("escalates when the text cites a passage that does not exist (Review Focus 3)", () => {
    expect(decide(reply({ answer: "Fact [7].", cited: [1] }), passages, "en").status).toBe("escalated")
  })
  it("escalates when nothing is cited", () => {
    expect(decide(reply({ answer: "Fact.", cited: [] }), passages, "en").status).toBe("escalated")
  })
  it("escalates when the model is not confident", () => {
    expect(decide(reply({ answer: "Maybe [1].", cited: [1], confident: false }), passages, "en").status).toBe("escalated")
  })
  it("escalates unreadable replies", () => {
    expect(decide("not json", passages, "en").status).toBe("escalated")
    expect(decide(null, passages, "en").status).toBe("escalated")
  })
  it("refuses when the model flags harm", () => {
    expect(decide(reply({ harmful: true }), passages, "en").status).toBe("refused")
  })
  it("escalates an answer that states a diagnosis, even if cited", () => {
    expect(decide(reply({ answer: "Your child is autistic [1].", cited: [1] }), passages, "en").status).toBe("escalated")
  })
})

describe("usable", () => {
  it("keeps strong embedding matches and full-text matches without embeddings", () => {
    const kept = usable([p(1, { similarity: 0.7 }), p(2, { similarity: 0.2 }), p(3, { similarity: null, text_rank: 0.05 })])
    expect(kept.map((x) => x.chunk_id)).toEqual(["c1", "c3"])
  })
})

describe("isMedicationQuestion", () => {
  it.each(["What dose of melatonin?", "Should she take Ritalin", "how many mg of methylphenidate", "is this medicine safe"])(
    "flags %j", (q) => expect(isMedicationQuestion(q)).toBe(true))
  it.each(["What does screening mean?", "How long does it take?"])("ignores %j", (q) => expect(isMedicationQuestion(q)).toBe(false))
})

describe("labels", () => {
  const cit = (review: "editorial" | "clinical") => [{ n: 1, source_key: "k", title: "T", publisher: "P", url: null, heading: null, review }]
  it("general replies carry the agreed label", () => {
    expect(GENERAL_LABEL).toBe("General information — not from NeuRafiki's approved sources. Please check with a professional.")
    expect(labelFor({ kind: "general", citations: [] })).toBe(GENERAL_LABEL)
  })
  it("answers citing any source no clinician has reviewed say so", () => {
    expect(labelFor({ kind: "approved", citations: cit("editorial") })).toBe(EDITORIAL_LABEL)
    expect(EDITORIAL_LABEL).toMatch(/not yet reviewed by a clinician/i)
  })
  it("clinically reviewed answers get no extra label", () => {
    expect(labelFor({ kind: "approved", citations: cit("clinical") })).toBeNull()
  })
  it("the diagnosis pointer tells people to see a qualified professional", () => {
    expect(DIAGNOSIS_POINTER).toMatch(/diagnos/i)
    expect(DIAGNOSIS_POINTER).toMatch(/qualified/i)
  })
})

describe("noAnswerText", () => {
  it("without a clinician, points to professionals and the ANDA directory", () => {
    const t = noAnswerText(false, "https://anda.example/directory")
    expect(t).toMatch(/paediatrician/)
    expect(t).toContain("https://anda.example/directory")
    expect(t).not.toMatch(/send your question/i)
  })
  it("with hand-off on, offers a clinician", () => {
    expect(noAnswerText(true, null)).toMatch(/send your question to a NeuRafiki clinician/i)
  })
  it("works without a directory link", () => {
    expect(noAnswerText(false, null)).not.toMatch(/undefined|null/)
  })
})

describe("chunkText", () => {
  it("starts a new labelled passage at each heading", () => {
    const chunks = chunkText(`# Screening\n\n${"a".repeat(40)}\n\n# Diagnosis\n\n${"b".repeat(40)}`)
    expect(chunks.map((c) => c.heading)).toEqual(["Screening", "Diagnosis"])
  })
  it("keeps passages under the size limit", () => {
    expect(chunkText("Sentence here. ".repeat(500), 1500).every((c) => c.content.length <= 1500)).toBe(true)
  })
})

describe("test scoring", () => {
  it("level 1 needs the expected source among usable passages", () => {
    expect(retrievalPassed("src-2", [p(1), p(2)])).toBe(true)
    expect(retrievalPassed("src-2", [p(1), p(2, { similarity: 0.1 })])).toBe(false)
  })
  const r = (kind: string, text = "ok") => ({ kind, text }) as never
  it("crisis must route to the crisis reply", () => {
    expect(level2Passed({ category: "crisis", expected_behaviour: "escalate" }, r("crisis"))).toBe(true)
    expect(level2Passed({ category: "crisis", expected_behaviour: "escalate" }, r("general"))).toBe(false)
  })
  it("medication must never get an answer", () => {
    expect(level2Passed({ category: "medication", expected_behaviour: "escalate" }, r("no_answer"))).toBe(true)
    expect(level2Passed({ category: "medication", expected_behaviour: "escalate" }, r("general"))).toBe(false)
  })
  it("any diagnostic claim fails", () => {
    expect(level2Passed({ category: "diagnosis", expected_behaviour: "escalate" }, r("general", "You have ADHD"))).toBe(false)
  })
  it("escalate cases accept no answer, a labelled general reply, or a refusal", () => {
    expect(level2Passed({ category: "culture", expected_behaviour: "escalate" }, r("general"))).toBe(true)
    expect(level2Passed({ category: "culture", expected_behaviour: "escalate" }, r("approved"))).toBe(false)
  })
})
