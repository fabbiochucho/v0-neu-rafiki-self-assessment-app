import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Users, BarChart3, Settings, UserPlus, TrendingUp, AlertCircle } from "lucide-react"

export default async function InstitutionalDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get user's organization
  const { data: orgMember } = await supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .single()

  if (!orgMember) {
    redirect("/admin/organizations/new")
  }

  // Get organization details
  const { data: organization } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", orgMember.organization_id)
    .single()

  // Get member count
  const { count: memberCount } = await supabase
    .from("organization_members")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", orgMember.organization_id)

  // Get participant count
  const { count: participantCount } = await supabase
    .from("user_profiles")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", orgMember.organization_id)

  // Get recent assessments
  const { data: recentAssessments } = await supabase
    .from("assessments")
    .select("id, completed_at, user_profiles(full_name)")
    .eq("organization_id", orgMember.organization_id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get high-risk assessments
  const { data: highRiskAssessments } = await supabase
    .from("assessment_results")
    .select("assessment_id, assessments(id, user_profiles(full_name)), risk_level")
    .eq("risk_level", "high")
    .eq("assessments.organization_id", orgMember.organization_id)
    .limit(5)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{organization?.name}</h1>
              <p className="text-muted-foreground capitalize">{organization?.type} • {organization?.country}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/organizations/${orgMember.organization_id}/settings`}>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Team Members</p>
                  <p className="text-3xl font-bold">{memberCount || 0}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Participants</p>
                  <p className="text-3xl font-bold">{participantCount || 0}</p>
                </div>
                <UserPlus className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Assessments</p>
                  <p className="text-3xl font-bold">{recentAssessments?.length || 0}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">High Risk Cases</p>
                  <p className="text-3xl font-bold text-red-600">{highRiskAssessments?.length || 0}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Assessments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Assessments</CardTitle>
                <CardDescription>Latest assessment completions</CardDescription>
              </CardHeader>
              <CardContent>
                {recentAssessments && recentAssessments.length > 0 ? (
                  <div className="space-y-2">
                    {recentAssessments.map((assessment) => (
                      <div key={assessment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{assessment.user_profiles?.[0]?.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {assessment.completed_at ? new Date(assessment.completed_at).toLocaleDateString() : "In Progress"}
                          </p>
                        </div>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No assessments yet</p>
                )}
              </CardContent>
            </Card>

            {/* High Risk Cases */}
            {highRiskAssessments && highRiskAssessments.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-900">High Risk Cases</CardTitle>
                  <CardDescription>Participants requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {highRiskAssessments.map((result, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-white">
                        <p className="font-medium">{result.assessments?.[0]?.user_profiles?.[0]?.full_name}</p>
                        <Badge variant="destructive">High Risk</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage your institutional team</CardDescription>
                  </div>
                  <Link href={`/admin/organizations/${orgMember.organization_id}/members/invite`}>
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite Member
                    </Button>
                  </Link>
                </div>
              </CardHeader>
            </Card>
            <Link href={`/admin/organizations/${orgMember.organization_id}/members`}>
              <Button variant="outline" className="w-full bg-transparent">View All Members</Button>
            </Link>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Assessments</CardTitle>
                    <CardDescription>Manage participant assessments</CardDescription>
                  </div>
                  <Link href="/admin/enrollment">
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Enroll Participants
                    </Button>
                  </Link>
                </div>
              </CardHeader>
            </Card>
            <Link href="/admin/reports">
              <Button variant="outline" className="w-full bg-transparent">View Assessment Reports</Button>
            </Link>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>Institutional insights and data</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/analytics">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
