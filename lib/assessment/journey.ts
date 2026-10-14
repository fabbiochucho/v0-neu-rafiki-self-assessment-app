// Pure helpers for the guided assessment journey (age bands, informants,
// sections, resume point, time estimate). No I/O here so it can be unit
// tested and shared by server routes and client components alike.
//
// The live question bank (974 rows, see scripts/018) stores age_group as one
// of three legacy labels and respondent_type as one of four legacy values.
// The bands/informants below are the product-facing vocabulary; each maps
// onto those stored values so the existing data and scoring keep working
// unchanged.

export const AGE_BANDS = [
  { key: "2-5", label: "Ages 2–5", dbAgeGroup: "Toddlers (2-5)" },
  { key: "6-12", label: "Ages 6–12", dbAgeGroup: "Children/Adolescents (6-18)" },
  { key: "13-17", label: "Ages 13–17", dbAgeGroup: "Children/Adolescents (6-18)" },
  { key: "18+", label: "Ages 18+", dbAgeGroup: "Adults (18+)" },
] as const

export type AgeBand = (typeof AGE_BANDS)[number]

export function ageBandForAge(age: number): AgeBand {
  if (age <= 5) return AGE_BANDS[0]
  if (age <= 12) return AGE_BANDS[1]
  if (age <= 17) return AGE_BANDS[2]
  return AGE_BANDS[3]
}

/** Age in whole years from a profile's `age` column, falling back to date_of_birth. 0 when unknown. */
export function profileAge(profile: { age?: number | null; date_of_birth?: string | null } | null, now = new Date()) {
  if (!profile) return 0
  if (typeof profile.age === "number" && profile.age > 0) return profile.age
  if (!profile.date_of_birth) return 0
  const birth = new Date(profile.date_of_birth)
  if (Number.isNaN(birth.getTime())) return 0
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return Math.max(0, age)
}

/** The stored questions.age_group label for a profile. */
export function dbAgeGroupForProfile(profile: { age?: number | null; date_of_birth?: string | null } | null) {
  return ageBandForAge(profileAge(profile)).dbAgeGroup
}

// Parent and caregiver share the stored 'parent_caregiver' question set.
export const INFORMANTS = [
  { key: "individual", label: "The person themselves (self-report)", respondentType: "self" },
  { key: "parent", label: "Parent", respondentType: "parent_caregiver" },
  { key: "caregiver", label: "Caregiver or guardian", respondentType: "parent_caregiver" },
  { key: "teacher", label: "Teacher or educator", respondentType: "teacher" },
  { key: "professional", label: "Professional (therapist, clinician)", respondentType: "therapist" },
] as const

export type InformantKey = (typeof INFORMANTS)[number]["key"]

export function informantLabelForRespondentType(respondentType: string): string {
  if (respondentType === "parent_caregiver") return "Parent or caregiver"
  return INFORMANTS.find((i) => i.respondentType === respondentType)?.label ?? respondentType
}

export interface SectionQuestion {
  id: string
  domain_name: string
  domain_description?: string | null
}

export interface Section {
  domain_name: string
  description: string | null
  startIndex: number
  count: number
}

/** Groups an ordered question list into contiguous per-domain sections. */
export function buildSections(questions: SectionQuestion[]): Section[] {
  const sections: Section[] = []
  questions.forEach((q, i) => {
    const last = sections[sections.length - 1]
    if (last && last.domain_name === q.domain_name) {
      last.count++
    } else {
      sections.push({ domain_name: q.domain_name, description: q.domain_description ?? null, startIndex: i, count: 1 })
    }
  })
  return sections
}

export function sectionIndexFor(sections: Section[], questionIndex: number): number {
  return sections.findIndex((s) => questionIndex >= s.startIndex && questionIndex < s.startIndex + s.count)
}

/** Index to resume at: the first unanswered question, or the last question if all are answered. */
export function resumeIndex(questions: { id: string }[], answered: Record<string, string>): number {
  const i = questions.findIndex((q) => !answered[q.id])
  return i === -1 ? Math.max(0, questions.length - 1) : i
}

// ponytail: rough planning figure (~10s per single-choice item), not a
// measured completion time. Replace with real median timings once collected.
export const SECONDS_PER_QUESTION = 10

export function estimateMinutes(questionCount: number): number {
  if (questionCount <= 0) return 0
  return Math.max(1, Math.ceil((questionCount * SECONDS_PER_QUESTION) / 60))
}

export function sectionTransitionMessage(areasRemaining: number): string {
  if (areasRemaining <= 0) return "That's one area explored. This is the last area."
  return `That's one area explored. You have ${areasRemaining} more ${areasRemaining === 1 ? "area" : "areas"} to go.`
}
