import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Heart, ArrowLeft, Users, Plus, Edit, BarChart3, Calendar } from "lucide-react"

export default async function ProfilesPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profiles with assessment counts
  const { data: userProfiles } = await supabase
    .from("user_profiles")
    .select(`
      *,
      assessments(id, status, completed_at)
    `)
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  const getAgeFromBirthDate = (birthDate: string | null) => {
    if (!birthDate) return null
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const getAgeGroup = (age: number | null) => {
    if (!age) return "Unknown"
    if (age <= 5) return "Toddler (2-5)"
    if (age <= 18) return "Child/Adolescent (6-18)"
    return "Adult (18+)"
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
            <Link href="/dashboard/profiles/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Profile
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Management</h1>
          <p className="text-muted-foreground">
            Manage profiles for family members, students, or individuals you're assessing.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Total Profiles</span>
              </div>
              <p className="text-2xl font-bold mt-1">{userProfiles?.length || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Assessed</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {userProfiles?.filter((p) => p.assessments && p.assessments.length > 0).length || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Adults</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {userProfiles?.filter((p) => {
                  const age = p.age || getAgeFromBirthDate(p.date_of_birth)
                  return age && age >= 18
                }).length || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Children</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {userProfiles?.filter((p) => {
                  const age = p.age || getAgeFromBirthDate(p.date_of_birth)
                  return age && age < 18
                }).length || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Profiles List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">All Profiles</h2>
            {userProfiles && userProfiles.length < 5 && (
              <Link href="/dashboard/profiles/new">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Profile
                </Button>
              </Link>
            )}
          </div>

          {userProfiles && userProfiles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProfiles.map((profile) => {
                const age = profile.age || getAgeFromBirthDate(profile.date_of_birth)
                const completedAssessments = profile.assessments?.filter((a) => a.status === "completed").length || 0
                const inProgressAssessments = profile.assessments?.filter((a) => a.status === "in_progress").length || 0

                return (
                  <Card key={profile.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{profile.preferred_name || profile.full_name}</CardTitle>
                        {profile.is_primary && <Badge variant="secondary">Primary</Badge>}
                      </div>
                      <CardDescription>
                        {age ? `${age} years old` : "Age not specified"} • {getAgeGroup(age)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Country:</span>
                          <p>{profile.country || "Not specified"}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Language:</span>
                          <p>{profile.language || "English"}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Education:</span>
                          <p>{profile.education_stage || "Not specified"}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Gender:</span>
                          <p>{profile.sex_gender || "Not specified"}</p>
                        </div>
                      </div>

                      {/* Assessment Summary */}
                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-medium">Assessments</span>
                          <span className="text-muted-foreground">
                            {completedAssessments + inProgressAssessments} total
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          {completedAssessments > 0 && (
                            <Badge variant="default" className="text-xs">
                              {completedAssessments} completed
                            </Badge>
                          )}
                          {inProgressAssessments > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {inProgressAssessments} in progress
                            </Badge>
                          )}
                          {completedAssessments === 0 && inProgressAssessments === 0 && (
                            <Badge variant="outline" className="text-xs">
                              No assessments yet
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-2">
                        <Link href={`/dashboard/profiles/${profile.id}/edit`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <Link href={`/assessment/start?profile=${profile.id}`} className="flex-1">
                          <Button size="sm" className="w-full">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Assess
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Profiles Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first profile to begin assessments. You can add up to 5 profiles for family members or
                  students.
                </p>
                <Link href="/dashboard/profiles/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Profile Limit Notice */}
        {userProfiles && userProfiles.length >= 5 && (
          <Card className="mt-6 border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <p className="text-amber-800 text-sm">
                You've reached the maximum of 5 profiles for individual accounts. Consider upgrading to an organization
                account for unlimited profiles and additional features.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
