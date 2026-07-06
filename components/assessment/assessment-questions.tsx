"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Save, CheckCircle } from "lucide-react"
import Link from "next/link"

interface Question {
  id: string
  question_id: string
  question_text: string
  question_type: string
  options: string[]
  domain_id: string
  score_weight: number
  assessment_domains: { name: string }
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
  id: string
  question_id: string
  response_value: string
  score: number | null
}

interface AssessmentQuestionsProps {
  assessment: Assessment
  questions: Question[]
  existingResponses: AssessmentResponse[]
}

export function AssessmentQuestions({ assessment, questions, existingResponses }: AssessmentQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  // Initialize responses from existing data
  useEffect(() => {
    const initialResponses: Record<string, string> = {}
    existingResponses.forEach((response) => {
      initialResponses[response.question_id] = response.response_value
    })
    setResponses(initialResponses)
  }, [existingResponses])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const isFirstQuestion = currentQuestionIndex === 0

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
    setError(null)
  }

  const handleNext = async () => {
    const currentQ = questions[currentQuestionIndex]
    const response = responses[currentQ.id]

    // Validate response
    if (!response) {
      setError("Please select an answer before proceeding")
      return
    }

    // Save the response server-side (score is computed there, not trusted from the client)
    const saved = await saveResponse(currentQ.id, response)
    if (!saved) return

    if (isLastQuestion) {
      // Ask the server to compute final domain results and mark the
      // assessment completed, then redirect.
      try {
        setIsLoading(true)
        const res = await fetch(`/api/assessments/${assessment.id}/complete`, {
          method: "POST",
        })
        const body = await res.json().catch(() => ({}))

        if (!res.ok) {
          throw new Error(body.error || "Failed to complete assessment")
        }

        router.push(`/assessment/${assessment.id}/results`)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to complete assessment")
        setIsLoading(false)
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1)
      setError(null)
    }
  }

  /**
   * Persists a single question's response via the server-side API. All
   * scoring happens on the server (see app/api/assessments/[id]/responses/route.ts
   * and lib/assessment/scoring.ts) -- the client only ever sends the raw
   * response value, never a score.
   */
  const saveResponse = async (questionId: string, responseValue: string): Promise<boolean> => {
    try {
      setIsSaving(true)
      setError(null)

      const res = await fetch(`/api/assessments/${assessment.id}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question_id: questionId, response_value: responseValue }),
      })

      const body = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(body.error || "Failed to save response")
      }

      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save response"
      setError(message)
      console.error("[v0] Error saving response:", err)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>No questions available for this assessment.</p>
            <Link href="/dashboard">
              <Button className="mt-4">Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="font-semibold">
                  Assessment for {assessment.user_profiles.preferred_name || assessment.user_profiles.full_name}
                </h1>
                <p className="text-sm text-muted-foreground">{assessment.domains.join(", ")}</p>
              </div>
            </div>
            <Badge variant="secondary">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline">{currentQuestion.assessment_domains.name}</Badge>
              <span className="text-sm text-muted-foreground">{currentQuestion.question_id}</span>
            </div>
            <CardTitle className="text-lg leading-relaxed">{currentQuestion.question_text}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={responses[currentQuestion.id] || ""}
              onValueChange={(value) => handleResponseChange(currentQuestion.id, value)}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {error && (
          <div className="mb-6 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={isFirstQuestion}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button onClick={handleNext} disabled={!responses[currentQuestion.id] || isLoading || isSaving}>
            {isSaving ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Saving...
              </>
            ) : isLastQuestion ? (
              isLoading ? (
                "Completing..."
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Assessment
                </>
              )
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
