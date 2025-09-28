import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Heart, Plus, Users, BarChart3, Calendar } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get user profiles (for multi-profile support)
  const { data: userProfiles } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  // Get recent assessments
  const { data: recentAssessments } = await supabase
    .from("assessments")
    .select(`
      *,
      user_profiles(full_name, preferred_name)
    `)
    .in("profile_id", userProfiles?.map((p) => p.id) || [])
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">NeuRafiki</span>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/dashboard/profiles">
                <Button variant="ghost" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Profiles
                </Button>
              </Link>
              <Link href="/dashboard/reports">
                <Button variant="ghost" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Reports
                </Button>
              </Link>
              <form action="/auth/signout" method="post">
                <Button variant="ghost" size="sm" type="submit">
                  Sign Out
                </Button>
              </form>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.full_name || "User"}!</h1>
          <p className="text-muted-foreground">
            Continue your neurodivergent assessment journey or start a new evaluation.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Plus className="h-5 w-5 mr-2 text-primary" />
                New Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Start a comprehensive neurodivergent screening</CardDescription>
              <Link href="/assessment/start">
                <Button className="w-full">Begin Assessment</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2 text-accent" />
                Manage Profiles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Add or edit family member profiles</CardDescription>
              <Link href="/dashboard/profiles">
                <Button variant="outline" className="w-full bg-transparent">
                  View Profiles
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                View Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Review assessment results and progress</CardDescription>
              <Link href="/dashboard/reports">
                <Button variant="outline" className="w-full bg-transparent">
                  View Reports
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-accent" />
                Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Track appointments and follow-ups</CardDescription>
              <Link href="/dashboard/appointments">
                <Button variant="outline" className="w-full bg-transparent">
                  Manage
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Profiles Overview */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Profiles</CardTitle>
              <CardDescription>{userProfiles?.length || 0} profile(s) created</CardDescription>
            </CardHeader>
            <CardContent>
              {userProfiles && userProfiles.length > 0 ? (
                <div className="space-y-3">
                  {userProfiles.slice(0, 3).map((profile) => (
                    <div key={profile.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{profile.preferred_name || profile.full_name}</p>
                        <p className="text-sm text-muted-foreground">Age: {profile.age || "Not specified"}</p>
                      </div>
                      <Badge variant="secondary">{profile.is_primary ? "Primary" : "Family"}</Badge>
                    </div>
                  ))}
                  {userProfiles.length > 3 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      +{userProfiles.length - 3} more profiles
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No profiles created yet</p>
                  <Link href="/dashboard/profiles/new">
                    <Button>Create First Profile</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Assessments</CardTitle>
              <CardDescription>Your latest assessment activity</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAssessments && recentAssessments.length > 0 ? (
                <div className="space-y-3">
                  {recentAssessments.map((assessment) => (
                    <div key={assessment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {assessment.user_profiles?.preferred_name || assessment.user_profiles?.full_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{assessment.domains.join(", ")}</p>
                      </div>
                      <Badge variant={assessment.status === "completed" ? "default" : "secondary"}>
                        {assessment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No assessments yet</p>
                  <Link href="/assessment/start">
                    <Button>Start First Assessment</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
