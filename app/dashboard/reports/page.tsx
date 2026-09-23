import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Heart, ArrowLeft, BarChart3, Calendar, Download, TrendingUp, Eye } from "lucide-react"

export default async function ReportsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profiles
  const { data: userProfiles } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  // Get all assessments with results
  const { data: assessments } = await supabase
    .from("assessments")
    .select(`
      *,
      user_profiles(full_name, preferred_name),
      assessment_results(*)
    `)
    .in("profile_id", userProfiles?.map((p) => p.id) || [])
    .eq("status", "completed")
    .order("completed_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskSummary = (results: any[]) => {
    if (!results || results.length === 0) return "No results"

    const highRisk = results.filter((r) => r.risk_level === "high").length
    const moderateRisk = results.filter((r) => r.risk_level === "moderate").length
    const lowRisk = results.filter((r) => r.risk_level === "low").length

    if (highRisk > 0) return `${highRisk} High, ${moderateRisk} Moderate, ${lowRisk} Low`
    if (moderateRisk > 0) return `${moderateRisk} Moderate, ${lowRisk} Low`
    return `${lowRisk} Low risk indicators`
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
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <Heart className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">NeuRafiki</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Assessment Reports</h1>
          <p className="text-muted-foreground">View and manage all assessment reports for your profiles.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Total Assessments</span>
              </div>
              <p className="text-2xl font-bold mt-1">{assessments?.length || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Profiles</span>
              </div>
              <p className="text-2xl font-bold mt-1">{userProfiles?.length || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">This Month</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {assessments?.filter((a) => {
                  const completedDate = new Date(a.completed_at)
                  const now = new Date()
                  return (
                    completedDate.getMonth() === now.getMonth() && completedDate.getFullYear() === now.getFullYear()
                  )
                }).length || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Follow-ups Due</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {assessments?.filter((a) => a.assessment_type === "baseline").length || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Assessment Reports List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">All Reports</h2>
            <Link href="/assessment/start">
              <Button>
                <BarChart3 className="h-4 w-4 mr-2" />
                New Assessment
              </Button>
            </Link>
          </div>

          {assessments && assessments.length > 0 ? (
            <div className="space-y-4">
              {assessments.map((assessment) => (
                <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            {assessment.user_profiles.preferred_name || assessment.user_profiles.full_name}
                          </h3>
                          <Badge className={getStatusColor(assessment.status)}>{assessment.status}</Badge>
                          <Badge variant="outline" className="capitalize">
                            {assessment.assessment_type.replace("_", " ")}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Domains:</span> {assessment.domains.join(", ")}
                          </div>
                          <div>
                            <span className="font-medium">Completed:</span>{" "}
                            {new Date(assessment.completed_at).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Risk Summary:</span>{" "}
                            {getRiskSummary(assessment.assessment_results)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Link href={`/assessment/${assessment.id}/results`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        <a href={`/api/assessments/${assessment.id}/report`} download={`neurafiki-assessment-report-${assessment.id}.pdf`}>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Reports Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start your first assessment to generate reports and track progress over time.
                </p>
                <Link href="/assessment/start">
                  <Button>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Start First Assessment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
