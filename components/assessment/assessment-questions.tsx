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

interface Question {
  id: string
  question_id: string
  question_text: string
  question_type: string
  options: string[]
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
}

type TextSize = "base" | "lg" | "xl"
const TEXT_SIZE_CLASS: Record<TextSize, string> = { base: "text-base", lg: "text-lg", xl: "text-xl" }
const PREFS_KEY = "neurafiki-assessment-display"

export function AssessmentQuestions({
  assessment,
  questions,
  existingResponses,
  companionEnabled = false,
}: AssessmentQuestionsProps) {
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
        if (!res.ok) throw new Error(body.error || "Failed to save your answer")
        setSaveState("saved")
        return true
      } catch (err) {
        setSaveState("error")
        setError(err instanceof Error ? err.message : "Failed to save your answer")
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
      setError("Please choose an answer before moving on")
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
      if (!res.ok) throw new Error(body.error || "Failed to complete assessment")
      router.push(`/assessment/${assessment.id}/results`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete assessment")
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
            <p>No questions are available for this combination of age group, respondent and areas.</p>
            <Link href="/dashboard">
              <Button className="mt-4">Return to Dashboard</Button>
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
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="font-semibold">Screening for {name}</h1>
                <p className="text-sm text-muted-foreground">
                  Answered by: {informantLabelForRespondentType(assessment.respondent_type)}
                </p>
              </div>
            </div>
            <Link href="/dashboard?paused=1">
              <Button variant="outline" size="sm">
                <PauseCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                Save and continue later
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className={`container mx-auto px-4 py-8 max-w-3xl ${contentClass}`}>
        {/* Accessibility / display controls */}
        <div role="group" aria-label="Display options" className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Text size:</span>
          {(["base", "lg", "xl"] as TextSize[]).map((size, i) => (
            <Button
              key={size}
              type="button"
              size="sm"
              variant={textSize === size ? "default" : "outline"}
              aria-pressed={textSize === size}
              onClick={() => setTextSize(size)}
            >
              {["Standard", "Large", "Larger"][i]}
            </Button>
          ))}
          <Button
            type="button"
            size="sm"
            variant={spacious ? "default" : "outline"}
            aria-pressed={spacious}
            onClick={() => setSpacious((v) => !v)}
          >
            Extra spacing
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-sm">
            <span className="font-medium">
              Area {sectionIdx + 1} of {sections.length}: {section.domain_name}
            </span>
            <span className="text-muted-foreground">
              <span aria-label={`Question ${currentQuestionIndex + 1} of ${questions.length}`}>
                {currentQuestionIndex + 1} / {questions.length}
              </span>
              {remainingMinutes > 0 && <> · about {remainingMinutes} min left</>}
            </span>
          </div>
          <Progress value={progress} className="h-2" aria-label={`${answeredCount} of ${questions.length} answered`} />
          <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
            {saveState === "saving"
              ? "Saving…"
              : saveState === "saved"
                ? "Saved. Your answers save automatically, so you can pause at any time."
                : "Your answers save automatically, so you can pause at any time."}
          </p>
        </div>

        {showIntro ? (
          <Card className="mb-6">
            <CardHeader>
              <div ref={focusRef} tabIndex={-1} className="outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
                {sectionIdx > 0 && (
                  <p className="text-sm font-medium text-primary mb-2">
                    {sectionTransitionMessage(sections.length - sectionIdx)}
                  </p>
                )}
                {sectionIdx === 0 && isResuming && <p className="text-sm text-muted-foreground mb-2">Welcome back.</p>}
                <CardTitle className="text-2xl">{section.domain_name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium">Let&apos;s explore how this feels for you.</p>
              {section.description && <p className="text-muted-foreground">{section.description}</p>}
              <p className="text-sm text-muted-foreground">
                {section.count} {section.count === 1 ? "question" : "questions"} · about {estimateMinutes(section.count)}{" "}
                min. There are no right or wrong answers: choose what fits best most of the time.
              </p>
              <Button
                onClick={() => setIntroducedSections((prev) => new Set(prev).add(sectionIdx))}
                className="w-full sm:w-auto"
              >
                Begin this area
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
                  <CardTitle id={`question-heading-${currentQuestion.id}`} className="text-[1.15em] leading-relaxed mt-2">
                    {currentQuestion.question_text}
                  </CardTitle>
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
                        {option}
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
                Previous
              </Button>
              <Button onClick={handleNext} disabled={!responses[currentQuestion.id] || isCompleting}>
                {isLastQuestion ? (
                  isCompleting ? (
                    "Completing…"
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                      Finish
                    </>
                  )
                ) : (
                  <>
                    Next
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
          This is structured screening and referral support. It does not provide a diagnosis.
        </p>
      </main>
    </div>
  )
}
