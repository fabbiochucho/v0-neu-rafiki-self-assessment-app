"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, CheckCircle, PauseCircle } from "lucide-react"
import Link from "next/link"
import { Companion } from "@/components/companion/companion"
import {
  buildSections,
  estimateMinutes,
  informantLabelForRespondentType,
  resumeIndex,
  sectionIndexFor,
  sectionTransitionMessage,
} from "@/lib/assessment/journey"
import { informantText, optionLabel, screeningText, type ScreeningKey, type ScreeningLanguage } from "@/lib/assessment/screening-i18n"

interface Question {
  id: string
  question_id: string
  question_text: string
  question_type: string
  options: string[]
  translated?: boolean
  domain_id: string
  subdomain?: string | null
  assessment_domains: { name: string; description: string | null }
}

interface Assessment {
  id: string
  domains: string[]
  respondent_type: string
  user_profiles: {
    full_name: string
    preferred_name: string | null
  }
}

interface AssessmentResponse {
  question_id: string
  response_value: string
}

interface AssessmentQuestionsProps {
  assessment: Assessment
  questions: Question[]
  existingResponses: AssessmentResponse[]
  companionEnabled?: boolean
  language?: ScreeningLanguage
}

type TextSize = "base" | "lg" | "xl"
const TEXT_SIZE_CLASS: Record<TextSize, string> = { base: "text-base", lg: "text-lg", xl: "text-xl" }
const PREFS_KEY = "neurafiki-assessment-display"

export function AssessmentQuestions({
  assessment,
  questions,
  existingResponses,
  companionEnabled = false,
  language = "en",
}: AssessmentQuestionsProps) {
  const tr = (key: ScreeningKey, vars?: Record<string, string | number>) => screeningText(language, key, vars)
  const initialResponses = useMemo(
    () => Object.fromEntries(existingResponses.map((r) => [r.question_id, r.response_value])) as Record<string, string>,
    [existingResponses],
  )
  const sections = useMemo(
    () =>
      buildSections(
        questions.map((q) => ({
          id: q.id,
          domain_name: q.assessment_domains.name,
          domain_description: q.assessment_domains.description,
        })),
      ),
    [questions],
  )

  const startIndex = resumeIndex(questions, initialResponses)
  const isResuming = existingResponses.length > 0
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(startIndex)
  const [responses, setResponses] = useState<Record<string, string>>(initialResponses)
  // Show a section intro whenever we land on the first question of a section
  // we haven't introduced yet (and on first load, unless resuming mid-section).
  const [introducedSections, setIntroducedSections] = useState<Set<number>>(() => {
    const s = new Set<number>()
    const idx = sectionIndexFor(sections, startIndex)
    if (isResuming && sections[idx] && sections[idx].startIndex !== startIndex) s.add(idx)
    return s
  })
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [isCompleting, setIsCompleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [textSize, setTextSize] = useState<TextSize>("base")
  const [spacious, setSpacious] = useState(false)

  const router = useRouter()
  const saveChain = useRef<Promise<boolean>>(Promise.resolve(true))
  const focusRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  // Display preferences are a per-browser convenience only.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PREFS_KEY) || "{}")
      if (saved.textSize in TEXT_SIZE_CLASS) setTextSize(saved.textSize)
      if (typeof saved.spacious === "boolean") setSpacious(saved.spacious)
    } catch {}
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ textSize, spacious }))
    } catch {}
  }, [textSize, spacious])

  const sectionIdx = sectionIndexFor(sections, currentQuestionIndex)
  const section = sections[sectionIdx]
  const showIntro = !!section && section.startIndex === currentQuestionIndex && !introducedSections.has(sectionIdx)

  // Move focus to the new heading on every step so keyboard and screen-reader
  // users land on the new content (skipped on first render).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    focusRef.current?.focus()
  }, [currentQuestionIndex, showIntro])

  const currentQuestion = questions[currentQuestionIndex]
  const answeredCount = questions.filter((q) => responses[q.id]).length
  const remainingMinutes = estimateMinutes(questions.length - answeredCount)
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const isFirstQuestion = currentQuestionIndex === 0

  /**
   * Autosave: every answer is persisted as soon as it's chosen. Saves are
   * chained so a quick change of mind can't land out of order. Scoring
   * happens on the server (app/api/assessments/[id]/responses) -- the client
   * only ever sends the raw option.
   */
  const saveResponse = (questionId: string, responseValue: string) => {
    setSaveState("saving")
    saveChain.current = saveChain.current.then(async () => {
      try {
        const res = await fetch(`/api/assessments/${assessment.id}/responses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question_id: questionId, response_value: responseValue }),
        })
        const body = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(body.error || tr("saveFailed"))
        setSaveState("saved")
        return true
      } catch (err) {
        setSaveState("error")
        setError(err instanceof Error ? err.message : tr("saveFailed"))
        return false
      }
    })
    return saveChain.current
  }

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }))
    setError(null)
    void saveResponse(questionId, value)
  }

  const handleNext = async () => {
    if (!responses[currentQuestion.id]) {
      setError(tr("chooseAnswer"))
      return
    }
    // Wait for any in-flight autosave before moving on.
    const ok = await saveChain.current
    if (!ok) {
      // Retry the current answer once so a transient failure doesn't strand the user.
      const retried = await saveResponse(currentQuestion.id, responses[currentQuestion.id])
      if (!retried) return
    }

    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1)
      return
    }

    try {
      setIsCompleting(true)
      const res = await fetch(`/api/assessments/${assessment.id}/complete`, { method: "POST" })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || tr("completeFailed"))
      router.push(`/assessment/${assessment.id}/results`)
    } catch (err) {
      setError(err instanceof Error ? err.message : tr("completeFailed"))
      setIsCompleting(false)
    }
  }

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1)
      setError(null)
    }
  }

  if (!currentQuestion || !section) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>{tr("noQuestions")}</p>
            <Link href="/dashboard">
              <Button className="mt-4">{tr("backToDashboard")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const name = assessment.user_profiles.preferred_name || assessment.user_profiles.full_name
  const progress = (answeredCount / questions.length) * 100
  const contentClass = `${TEXT_SIZE_CLASS[textSize]} ${spacious ? "leading-loose tracking-wide" : ""}`

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                  {tr("dashboard")}
                </Button>
              </Link>
              <div>
                <h1 className="font-semibold">{tr("screeningFor", { name })}</h1>
                <p className="text-sm text-muted-foreground">
                  {tr("answeredBy", {
                    who: informantText(language, assessment.respondent_type, informantLabelForRespondentType(assessment.respondent_type)),
                  })}
                </p>
              </div>
            </div>
            <Link href="/dashboard?paused=1">
              <Button variant="outline" size="sm">
                <PauseCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                {tr("saveLater")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main lang={language === "en" ? undefined : language} className={`container mx-auto px-4 py-8 max-w-3xl ${contentClass}`}>
        {/* Accessibility / display controls */}
        <div role="group" aria-label={tr("displayOptions")} className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">{tr("textSize")}</span>
          {(["base", "lg", "xl"] as TextSize[]).map((size, i) => (
            <Button
              key={size}
              type="button"
              size="sm"
              variant={textSize === size ? "default" : "outline"}
              aria-pressed={textSize === size}
              onClick={() => setTextSize(size)}
            >
              {tr((["sizeStandard", "sizeLarge", "sizeLarger"] as const)[i])}
            </Button>
          ))}
          <Button
            type="button"
            size="sm"
            variant={spacious ? "default" : "outline"}
            aria-pressed={spacious}
            onClick={() => setSpacious((v) => !v)}
          >
            {tr("extraSpacing")}
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-sm">
            <span className="font-medium">
              {tr("areaOf", { n: sectionIdx + 1, total: sections.length, name: section.domain_name })}
            </span>
            <span className="text-muted-foreground">
              <span aria-label={tr("questionOf", { n: currentQuestionIndex + 1, total: questions.length })}>
                {currentQuestionIndex + 1} / {questions.length}
              </span>
              {remainingMinutes > 0 && <> · {tr("minLeft", { n: remainingMinutes })}</>}
            </span>
          </div>
          <Progress value={progress} className="h-2" aria-label={tr("answeredOf", { n: answeredCount, total: questions.length })} />
          <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
            {saveState === "saving"
              ? tr("saving")
              : saveState === "saved"
                ? tr("saved")
                : tr("autosave")}
          </p>
        </div>

        {showIntro ? (
          <Card className="mb-6">
            <CardHeader>
              <div ref={focusRef} tabIndex={-1} className="outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
                {sectionIdx > 0 && (
                  <p className="text-sm font-medium text-primary mb-2">
                    {language === "en"
                      ? sectionTransitionMessage(sections.length - sectionIdx)
                      : sections.length - sectionIdx <= 0
                        ? tr("lastArea")
                        : sections.length - sectionIdx === 1
                          ? tr("oneMoreArea")
                          : tr("moreAreas", { n: sections.length - sectionIdx })}
                  </p>
                )}
                {sectionIdx === 0 && isResuming && <p className="text-sm text-muted-foreground mb-2">{tr("welcomeBack")}</p>}
                <CardTitle className="text-2xl">{section.domain_name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium">{tr("explore")}</p>
              {section.description && <p className="text-muted-foreground">{section.description}</p>}
              <p className="text-sm text-muted-foreground">
                {tr(section.count === 1 ? "areaInfoOne" : "areaInfo", { n: section.count, min: estimateMinutes(section.count) })}
              </p>
              <Button
                onClick={() => setIntroducedSections((prev) => new Set(prev).add(sectionIdx))}
                className="w-full sm:w-auto"
              >
                {tr("beginArea")}
                <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <div ref={focusRef} tabIndex={-1} className="outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{currentQuestion.subdomain || section.domain_name}</Badge>
                  </div>
                  <CardTitle
                    id={`question-heading-${currentQuestion.id}`}
                    lang={language !== "en" && currentQuestion.translated === false ? "en" : undefined}
                    className="text-[1.15em] leading-relaxed mt-2"
                  >
                    {currentQuestion.question_text}
                  </CardTitle>
                  {language !== "en" && currentQuestion.translated === false && (
                    <p className="mt-2 text-sm text-muted-foreground">{tr("inEnglish")}</p>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={responses[currentQuestion.id] || ""}
                  onValueChange={(value) => handleResponseChange(currentQuestion.id, value)}
                  aria-labelledby={`question-heading-${currentQuestion.id}`}
                  aria-invalid={!!error}
                  aria-describedby={error ? "question-error" : undefined}
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-[1em]">
                        {optionLabel(language, option)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {error && (
              <div
                id="question-error"
                role="alert"
                className="mb-6 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md"
              >
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handlePrevious} disabled={isFirstQuestion}>
                <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                {tr("previous")}
              </Button>
              <Button onClick={handleNext} disabled={!responses[currentQuestion.id] || isCompleting}>
                {isLastQuestion ? (
                  isCompleting ? (
                    tr("completing")
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                      {tr("finish")}
                    </>
                  )
                ) : (
                  <>
                    {tr("next")}
                    <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>

            {companionEnabled && (
              <div className="mt-8">
                {/* Only the question id goes to the server, never the chosen answer. */}
                <Companion mode="during" questionId={currentQuestion.id} onReturn={() => focusRef.current?.focus()} />
              </div>
            )}
          </>
        )}

        <p className="mt-10 text-xs text-muted-foreground">
          {tr("notDiagnosis")}
        </p>
      </main>
    </div>
  )
}
