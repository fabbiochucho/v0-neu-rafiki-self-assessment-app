import { describe, expect, it } from "vitest"
import {
  SCREENING_UI_REVIEWED,
  domainText,
  fixedScreeningStrings,
  offeredScreeningLanguages,
  optionLabel,
  screeningText,
} from "@/lib/assessment/screening-i18n"
import { isListedEmail } from "@/lib/auth/translation-reviewers"
import { translationsCsv } from "@/lib/assessment/translation-csv"

describe("screening languages", () => {
  it("offers only English until a language's fixed text is reviewed", () => {
    expect(offeredScreeningLanguages().map((l) => l.code)).toEqual(["en", ...SCREENING_UI_REVIEWED])
  })

  it("translates labels but never the stored answer values", () => {
    expect(optionLabel("fr", "Sometimes")).toBe("Parfois")
    expect(optionLabel("en", "Sometimes")).toBe("Sometimes")
    expect(optionLabel("pt", "Unknown option")).toBe("Unknown option")
  })

  it("fills placeholders and falls back to English", () => {
    expect(screeningText("fr", "questionOf", { n: 2, total: 9 })).toBe("Question 2 sur 9")
    expect(screeningText("xx", "next")).toBe("Next")
    expect(domainText("pt", "ADHD", "x").name).toBe("PHDA")
    expect(domainText("en", "ADHD", "x")).toEqual({ name: "ADHD", description: "x" })
  })

  it("has French and Portuguese for every fixed string, with matching placeholders", () => {
    const vars = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join()
    for (const r of fixedScreeningStrings()) {
      expect(r.fr, r.key).toBeTruthy()
      expect(r.pt, r.key).toBeTruthy()
      if (r.key.startsWith("ui.")) {
        expect(vars(r.fr), r.key).toBe(vars(r.en))
        expect(vars(r.pt), r.key).toBe(vars(r.en))
      }
    }
  })
})

describe("translation reviewers", () => {
  it("matches the allow-list case-insensitively", () => {
    expect(isListedEmail("A@B.org", "x@y.org, a@b.org")).toBe(true)
    expect(isListedEmail("a@b.org", "")).toBe(false)
    expect(isListedEmail(null, "a@b.org")).toBe(false)
  })
})

describe("translations CSV", () => {
  it("quotes cells and starts with a BOM", () => {
    const csv = translationsCsv([{ key: "k", en: 'a "b"', fr: "é", fr_status: "draft", pt: "", pt_status: "missing" }])
    expect(csv.startsWith("﻿key,english,french")).toBe(true)
    expect(csv).toContain('"k","a ""b""","é","draft","","missing","",""')
  })
})
