// NeuRafiki Check-ins (brief §13): question definitions, validation, the
// adaptive follow-up rule, the per-goal trend, and the structured summary
// sent to ANDA. Pure functions only, shared by the page, the API route and
// tests.
//
// RULES (documented here and in the PR):
//
// Meaningful change: follow-up questions are added when ANY of these hold:
//   1. The frequency answer moved by 2 or more points (on the 0-4 scale)
//      compared with the previous check-in for the same learner and goal.
//   2. There is no previous check-in and the frequency answer is "Never" or
//      "Rarely" (0-1), so a first check-in that is already going badly
//      still gets a closer look.
//   3. "Has anything changed recently?" is answered with any "Yes – …" option.
// When triggered, up to MAX_FOLLOW_UPS (3) follow-up questions are added.
//
// Trend per goal: uses the frequency scores of the check-ins for that goal,
// oldest first. Fewer than 2 check-ins gives "not_enough_data". Otherwise
// compare the latest score with the mean of up to 3 check-ins before it:
// a difference of +1 or more is "improving", -1 or less is "declining", and
// anything else is "steady". This describes reported frequency only. It is not
// a clinical measure.

export interface CheckInQuestion {
  key: string
  text: string
  options: string[]
  multi?: boolean
  /** Allows an optional short note. Notes stay in NeuRafiki and are never sent to ANDA. */
  note?: boolean
}

export const FREQUENCY_OPTIONS = ["Never", "Rarely", "Sometimes", "Often", "Almost always"]

export const CORE_QUESTIONS: CheckInQuestion[] = [
  { key: "frequency", text: "Over the past week, how often did this go well?", options: FREQUENCY_OPTIONS },
  {
    key: "helped",
    text: "What helped? Choose any that apply.",
    multi: true,
    note: true,
    options: [
      "Visual prompts or schedules",
      "A predictable routine",
      "Breaks",
      "A quiet space",
      "Support from an adult",
      "Support from peers",
      "Praise or rewards",
      "Something else",
      "Nothing in particular",
    ],
  },
  {
    key: "harder",
    text: "What made it harder? Choose any that apply.",
    multi: true,
    note: true,
    options: [
      "Tiredness",
      "Noise or a busy space",
      "A change in routine",
      "Unclear instructions",
      "Feeling unwell",
      "Moving between activities",
      "Something else",
      "Nothing in particular",
    ],
  },
  { key: "visual_prompts", text: "Did visual prompts help?", options: ["Yes, a lot", "A little", "No", "Not used"] },
  {
    key: "setting_difference",
    text: "Was there a difference between school and home?",
    options: ["Better at school", "About the same", "Better at home", "Not sure"],
  },
  {
    key: "recent_change",
    text: "Has anything changed recently?",
    options: [
      "No changes",
      "Yes – routine or schedule",
      "Yes – health or sleep",
      "Yes – home or family",
      "Yes – school or class",
      "Not sure",
    ],
  },
]

export const FOLLOW_UP_QUESTIONS: CheckInQuestion[] = [
  {
    key: "change_when",
    text: "When did you notice the change most?",
    options: ["Mornings", "Afternoons", "Evenings", "Throughout the day", "Not sure"],
  },
  { key: "change_duration", text: "Has it lasted more than a few days?", options: ["Yes", "No", "Not sure"] },
  {
    key: "review_plan",
    text: "Would it help to review the support plan for this goal?",
    options: ["Yes", "Not now"],
  },
]

export const MAX_FOLLOW_UPS = 3
export const NOTE_MAX_LENGTH = 140

export type Answers = Record<string, string | string[]>

export function frequencyScore(answers: Answers): number | null {
  const i = FREQUENCY_OPTIONS.indexOf(answers.frequency as string)
  return i === -1 ? null : i
}

export function isMeaningfulChange(answers: Answers, previousScore: number | null): boolean {
  const score = frequencyScore(answers)
  const recent = answers.recent_change
  if (typeof recent === "string" && recent.startsWith("Yes")) return true
  if (score === null) return false
  if (previousScore === null) return score <= 1
  return Math.abs(score - previousScore) >= 2
}

export function followUpsFor(answers: Answers, previousScore: number | null): CheckInQuestion[] {
  return isMeaningfulChange(answers, previousScore) ? FOLLOW_UP_QUESTIONS.slice(0, MAX_FOLLOW_UPS) : []
}

/** Validates answers against the definitions. Returns an error string, or null if valid. */
export function validateAnswers(answers: Answers, previousScore: number | null): string | null {
  const required = [...CORE_QUESTIONS, ...followUpsFor(answers, previousScore)]
  for (const q of required) {
    const a = answers[q.key]
    const values = Array.isArray(a) ? a : a === undefined ? [] : [a]
    if (values.length === 0) return `Please answer: ${q.text}`
    if (!q.multi && Array.isArray(a)) return `Only one answer allowed for: ${q.text}`
    if (values.some((v) => typeof v !== "string" || !q.options.includes(v))) return `Invalid answer for: ${q.text}`
  }
  const allowed = new Set(required.map((q) => q.key))
  for (const key of Object.keys(answers)) if (!allowed.has(key)) return `Unexpected answer: ${key}`
  return null
}

export type Trend = "improving" | "steady" | "declining" | "not_enough_data"

export function trendFor(scoresOldestFirst: number[]): Trend {
  if (scoresOldestFirst.length < 2) return "not_enough_data"
  const latest = scoresOldestFirst[scoresOldestFirst.length - 1]
  const prior = scoresOldestFirst.slice(-4, -1)
  const mean = prior.reduce((a, b) => a + b, 0) / prior.length
  if (latest - mean >= 1) return "improving"
  if (latest - mean <= -1) return "declining"
  return "steady"
}

export const TREND_LABELS: Record<Trend, string> = {
  improving: "Going well more often",
  steady: "About the same",
  declining: "Going well less often",
  not_enough_data: "Not enough check-ins yet",
}

const ALL_QUESTIONS = [...CORE_QUESTIONS, ...FOLLOW_UP_QUESTIONS]

/** Per-question structured answers: option values only, never notes or other free text. */
export function structuredAnswers(answers: Answers) {
  return ALL_QUESTIONS.filter((q) => answers[q.key] !== undefined).map((q) => ({
    question_key: q.key,
    question: q.text,
    answer: answers[q.key],
  }))
}

export function summaryText(goalTitle: string, answers: Answers): string {
  const list = (v: string | string[] | undefined) => (Array.isArray(v) ? v.join(", ") : v ?? "")
  const parts = [
    `Goal "${goalTitle}": went well ${String(answers.frequency ?? "").toLowerCase()} over the past week.`,
    `Helped: ${list(answers.helped)}.`,
    `Harder: ${list(answers.harder)}.`,
    `Visual prompts: ${list(answers.visual_prompts)}.`,
    `School vs home: ${list(answers.setting_difference)}.`,
    `Recent changes: ${list(answers.recent_change)}.`,
  ]
  return parts.join(" ")
}

export const CHECK_IN_SHARE_CONSENT_VERSION = "check-in-share-1.0"
export const CHECK_IN_SHARE_CONSENT_TEXT =
  "Send a structured summary of this check-in (the date, goal, and the options chosen above) to my linked ANDA account. Notes I typed are not sent."
