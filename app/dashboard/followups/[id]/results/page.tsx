"use client"

import { useParams } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface FollowupResult {
  id: string
  domain_id: string
  domain_name: string
  previous_score: number
  current_score: number
  score_change: number
  change_percentage: number
  behavioral_changes: string
  cognitive_progress: string
  sensory_improvements: string
  social_emotional_skills: string
  adaptive_skills: string
  recommendations: string
}

export default function FollowupResultsPage() {
  const params = useParams()
  const scheduleId = params.id as string

  const { data: results } = useSWR(`/api/followups/${scheduleId}/results`, async (url) => {
    const { data, error } = await supabase
      .from("assessment_followup_results")
      .select(
        `
        *,
        assessment_domains(name)
      `,
      )
      .eq("schedule_id", scheduleId)

    if (error) throw error
    return data?.map((result: any) => ({
      ...result,
      domain_name: result.assessment_domains?.name,
    }))
  })

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-600"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Follow-Up Assessment Results</h1>
        <p className="text-muted-foreground">Longitudinal progress tracking and change analysis</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {results?.map((result) => (
          <Card key={result.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{result.domain_name}</span>
                <div className="flex items-center gap-2">
                  {getTrendIcon(result.score_change)}
                  <span className={`text-sm font-semibold ${getTrendColor(result.score_change)}`}>
                    {result.change_percentage > 0 ? "+" : ""}
                    {result.change_percentage.toFixed(1)}%
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Previous Score</p>
                  <p className="text-2xl font-bold">{result.previous_score.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Score</p>
                  <p className="text-2xl font-bold">{result.current_score.toFixed(1)}</p>
                </div>
              </div>

              {result.behavioral_changes && (
                <div>
                  <p className="font-medium text-sm">Behavioral Changes</p>
                  <p className="text-sm text-muted-foreground">{result.behavioral_changes}</p>
                </div>
              )}

              {result.cognitive_progress && (
                <div>
                  <p className="font-medium text-sm">Cognitive Progress</p>
                  <p className="text-sm text-muted-foreground">{result.cognitive_progress}</p>
                </div>
              )}

              {result.social_emotional_skills && (
                <div>
                  <p className="font-medium text-sm">Social-Emotional Skills</p>
                  <p className="text-sm text-muted-foreground">{result.social_emotional_skills}</p>
                </div>
              )}

              {result.adaptive_skills && (
                <div>
                  <p className="font-medium text-sm">Adaptive Skills</p>
                  <p className="text-sm text-muted-foreground">{result.adaptive_skills}</p>
                </div>
              )}

              {result.recommendations && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium text-sm text-blue-900">Recommendations</p>
                  <p className="text-sm text-blue-800">{result.recommendations}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
