import { Tooltip } from "@/components/ui/tooltip"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Heart, ArrowLeft, Download, Calendar, TrendingUp, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react"
import { ResultsCharts } from "@/components/assessment/results-charts"
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar, PieChart, Pie, Cell } from "recharts"

interface AssessmentResultsPageProps {
  params: Promise<{ id: string }>
}

export default async function AssessmentResultsPage({ params }: AssessmentResultsPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get assessment details with results
  const { data: assessment, error: assessmentError } = await supabase
    .from("assessments")
    .select(`
      *,
      user_profiles(*),
      assessment_results(*)
    `)
    .eq("id", id)
    .single()

  if (assessmentError || !assessment) {
    redirect("/dashboard")
  }

  // Verify user owns this assessment
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("id", assessment.profile_id)
    .single()

  if (!profile || profile.user_id !== data.user.id) {
    redirect("/dashboard")
  }

  const results = assessment.assessment_results || []
  const completedDate = new Date(assessment.completed_at).toLocaleDateString()

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "moderate":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getRecommendations = (domainName: string, riskLevel: string) => {
    const baseRecommendations = {
      "Autism Spectrum": {
        high: "Consider consultation with a developmental pediatrician or autism specialist for comprehensive evaluation.",
        moderate: "Monitor social communication patterns and consider educational support strategies.",
        low: "Continue supporting social development through structured activities and peer interactions.",
      },
      ADHD: {
        high: "Recommend evaluation by a pediatrician or psychiatrist specializing in ADHD for potential diagnosis and treatment options.",
        moderate: "Implement organizational strategies and consider classroom accommodations if applicable.",
        low: "Continue with current support strategies and monitor attention patterns over time.",
      },
      "Dyslexia/Learning Differences": {
        high: "Seek educational assessment and consider specialized reading intervention programs.",
        moderate: "Implement reading support strategies and monitor academic progress closely.",
        low: "Continue with current educational support and celebrate reading achievements.",
      },
      "Sensory Processing": {
        high: "Consider occupational therapy evaluation for sensory integration strategies.",
        moderate: "Implement sensory accommodations in daily routines and environments.",
        low: "Continue supporting sensory preferences with environmental modifications as needed.",
      },
    }

    return (
      baseRecommendations[domainName as keyof typeof baseRecommendations]?.[
        riskLevel as keyof (typeof baseRecommendations)["Autism Spectrum"]
      ] || "Consult with healthcare professionals for personalized guidance based on these results."
    )
  }

  // Prepare data for charts
  const chartData = results.map((result: any) => ({
    domain: result.domain_name,
    percentage: result.percentage_score,
    score: result.total_score,
    maxScore: result.max_possible_score,
    riskLevel: result.risk_level,
  }))

  const riskDistribution = {
    high: results.filter((r: any) => r.risk_level === "high").length,
    moderate: results.filter((r: any) => r.risk_level === "moderate").length,
    low: results.filter((r: any) => r.risk_level === "low").length,
  }

  const riskPieData = [
    { name: "High Risk", value: riskDistribution.high, fill: "#dc2626" },
    { name: "Moderate Risk", value: riskDistribution.moderate, fill: "#f59e0b" },
    { name: "Low Risk", value: riskDistribution.low, fill: "#10b981" },
  ].filter((item) => item.value > 0)

  const overallRiskLevel =
    riskDistribution.high > 0 ? "high" : riskDistribution.moderate > 0 ? "moderate" : "low"

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
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <Heart className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">NeuRafiki</span>
              </div>
            </div>
            <a href={`/api/assessments/${id}/report`} download={`neurafiki-assessment-report-${id}.pdf`}>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Assessment Results</h1>
              <p className="text-muted-foreground">
                Results for {assessment.user_profiles.preferred_name || assessment.user_profiles.full_name}
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              Completed {completedDate}
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Assessment Type</span>
                </div>
                <p className="text-lg font-semibold capitalize mt-1">{assessment.assessment_type.replace("_", " ")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Domains Assessed</span>
                </div>
                <p className="text-lg font-semibold mt-1">{results.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Respondent</span>
                </div>
                <p className="text-lg font-semibold capitalize mt-1">{assessment.respondent_type.replace("_", " ")}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results by Domain */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Domain Results</h2>

          {results.map((result: any) => (
            <Card key={result.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{result.domain_name}</CardTitle>
                  <Badge className={getRiskColor(result.risk_level)}>
                    {result.risk_level.toUpperCase()} INDICATION
                  </Badge>
                </div>
                <CardDescription>
                  Score: {result.total_score} out of {result.max_possible_score} ({result.percentage_score.toFixed(1)}%)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Score Distribution</span>
                    <span className="text-sm text-muted-foreground">{result.percentage_score.toFixed(1)}%</span>
                  </div>
                  <Progress value={result.percentage_score} className="h-3" />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {getRecommendations(result.domain_name, result.risk_level)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <ResultsCharts chartData={chartData} riskPieData={riskPieData} />

        {/* Overall Risk Assessment Summary */}
        <Card className={`mt-8 border-2 ${overallRiskLevel === "high" ? "border-red-200 bg-red-50" : overallRiskLevel === "moderate" ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50"}`}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              {overallRiskLevel === "high" ? (
                <AlertCircle className="h-6 w-6 text-red-600" />
              ) : overallRiskLevel === "moderate" ? (
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              ) : (
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              )}
              <CardTitle className={overallRiskLevel === "high" ? "text-red-900" : overallRiskLevel === "moderate" ? "text-yellow-900" : "text-green-900"}>
                Overall Assessment Summary
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className={`text-sm leading-relaxed ${overallRiskLevel === "high" ? "text-red-800" : overallRiskLevel === "moderate" ? "text-yellow-800" : "text-green-800"}`}>
              {overallRiskLevel === "high"
                ? "This assessment indicates HIGH indicators across one or more domains. We strongly recommend scheduling a consultation with qualified healthcare professionals for comprehensive evaluation and personalized support planning."
                : overallRiskLevel === "moderate"
                  ? "This assessment indicates MODERATE indicators that warrant attention. Consider follow-up evaluations and implementing targeted support strategies while monitoring for changes."
                  : "This assessment indicates LOW indicators of concern. Continue with current support approaches and maintain regular monitoring."}
            </p>
          </CardContent>
        </Card>

        {/* Important Disclaimer */}
        <Card className="mt-8 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800">Important Disclaimer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700 text-sm leading-relaxed">
              These results are for screening purposes only and do not constitute a medical diagnosis. The assessment is
              designed to identify areas that may benefit from further professional evaluation. Please consult with
              qualified healthcare professionals, psychologists, or educational specialists for comprehensive assessment
              and diagnosis. Cultural factors and individual circumstances should always be considered when interpreting
              these results.
            </p>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Recommended actions based on your assessment results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/dashboard/appointments">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Professional Consultation
                </Button>
              </Link>

              <Link href="/support/resources">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Heart className="h-4 w-4 mr-2" />
                  Find Local Support Services
                </Button>
              </Link>

              <Link href="/assessment/start">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Schedule Follow-up Assessment
                </Button>
              </Link>

              <Link href="/dashboard/reports">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  View All Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
