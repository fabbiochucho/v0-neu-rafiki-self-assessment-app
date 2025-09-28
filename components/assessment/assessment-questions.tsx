"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
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
  const supabase = createClient()

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
  }

  const calculateScore = (question: Question, responseValue: string): number => {
    const options = question.options
    const responseIndex = options.indexOf(responseValue)

    // Basic scoring logic - can be enhanced based on specific assessment needs
    if (question.question_type === "likert") {
      return responseIndex * question.score_weight
    } else if (question.question_type === "yes_no" || question.question_type === "multiple_choice") {
      // For yes/no and multiple choice, assign scores based on response
      return responseIndex * question.score_weight
    }

    return 0
  }

  const saveResponse = async (questionId: string, responseValue: string) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question) return

    const score = calculateScore(question, responseValue)

    try {
      const { error } = await supabase.from("assessment_responses").upsert(
        {
          assessment_id: assessment.id,
          question_id: questionId,
          response_value: responseValue,
          score: score,
        },
        {
          onConflict: "assessment_id,question_id",
        },
      )

      if (error) throw error
    } catch (error) {
      console.error("Error saving response:", error)
    }
  }

  const handleNext = async () => {
    if (currentQuestion && responses[currentQuestion.id]) {
      setIsSaving(true)
      await saveResponse(currentQuestion.id, responses[currentQuestion.id])
      setIsSaving(false)
    }

    if (isLastQuestion) {
      await completeAssessment()
    } else {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const completeAssessment = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Mark assessment as completed
      const { error: updateError } = await supabase
        .from("assessments")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", assessment.id)

      if (updateError) throw updateError

      // Calculate and save results
      await calculateResults()

      router.push(`/assessment/${assessment.id}/results`)
    } catch (error) {
      console.error("Error completing assessment:", error)
      setError(error instanceof Error ? error.message : "Failed to complete assessment")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateResults = async () => {
    // Group responses by domain
    const domainScores: Record<string, { total: number; max: number; count: number }> = {}

    questions.forEach((question) => {
      const domainName = question.assessment_domains.name
      const response = responses[question.id]

      if (response) {
        const score = calculateScore(question, response)
        const maxScore = (question.options.length - 1) * question.score_weight

        if (!domainScores[domainName]) {
          domainScores[domainName] = { total: 0, max: 0, count: 0 }
        }

        domainScores[domainName].total += score
        domainScores[domainName].max += maxScore
        domainScores[domainName].count += 1
      }
    })

    // Save results for each domain
    for (const [domainName, scores] of Object.entries(domainScores)) {
      const percentage = (scores.total / scores.max) * 100
      let riskLevel = "low"

      if (percentage >= 70) riskLevel = "high"
      else if (percentage >= 40) riskLevel = "moderate"

      await supabase.from("assessment_results").insert({
        assessment_id: assessment.id,
        domain_name: domainName,
        total_score: scores.total,
        max_possible_score: scores.max,
        percentage_score: percentage,
        risk_level: riskLevel,
      })
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
