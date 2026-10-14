import { describe, it, expect } from "vitest"
import {
  ageBandForAge,
  buildSections,
  dbAgeGroupForProfile,
  estimateMinutes,
  profileAge,
  resumeIndex,
  sectionIndexFor,
  sectionTransitionMessage,
} from "@/lib/assessment/journey"

describe("age bands", () => {
  it("maps ages onto the four product bands and the stored question-bank labels", () => {
    expect(ageBandForAge(3).key).toBe("2-5")
    expect(ageBandForAge(5).dbAgeGroup).toBe("Toddlers (2-5)")
    expect(ageBandForAge(6).key).toBe("6-12")
    expect(ageBandForAge(12).key).toBe("6-12")
    expect(ageBandForAge(13).key).toBe("13-17")
    expect(ageBandForAge(17).dbAgeGroup).toBe("Children/Adolescents (6-18)")
    // 18 is an adult band (previously mapped to the child set, which has no self-report questions)
    expect(ageBandForAge(18).dbAgeGroup).toBe("Adults (18+)")
  })

  it("falls back to date_of_birth when age is missing", () => {
    const now = new Date("2026-06-01")
    expect(profileAge({ age: null, date_of_birth: "2016-07-01" }, now)).toBe(9)
    expect(profileAge({ age: 30, date_of_birth: "2016-07-01" }, now)).toBe(30)
    expect(profileAge(null)).toBe(0)
    expect(dbAgeGroupForProfile({ age: 40 })).toBe("Adults (18+)")
  })
})

describe("sections", () => {
  const qs = [
    { id: "a1", domain_name: "ADHD" },
    { id: "a2", domain_name: "ADHD" },
    { id: "b1", domain_name: "Autism Spectrum" },
    { id: "c1", domain_name: "Sensory Processing" },
    { id: "c2", domain_name: "Sensory Processing" },
  ]

  it("groups contiguous questions by domain", () => {
    const sections = buildSections(qs)
    expect(sections.map((s) => [s.domain_name, s.startIndex, s.count])).toEqual([
      ["ADHD", 0, 2],
      ["Autism Spectrum", 2, 1],
      ["Sensory Processing", 3, 2],
    ])
    expect(sectionIndexFor(sections, 4)).toBe(2)
  })

  it("resumes at the first unanswered question", () => {
    expect(resumeIndex(qs, {})).toBe(0)
    expect(resumeIndex(qs, { a1: "x", a2: "y" })).toBe(2)
    expect(resumeIndex(qs, { a1: "x", a2: "y", b1: "z", c1: "1", c2: "2" })).toBe(4)
  })

  it("words the between-sections message", () => {
    expect(sectionTransitionMessage(2)).toBe("That's one area explored. You have 2 more areas to go.")
    expect(sectionTransitionMessage(1)).toBe("That's one area explored. You have 1 more area to go.")
  })

  it("estimates time conservatively", () => {
    expect(estimateMinutes(0)).toBe(0)
    expect(estimateMinutes(1)).toBe(1)
    expect(estimateMinutes(42)).toBe(7)
  })
})
