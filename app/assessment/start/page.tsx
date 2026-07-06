import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Heart, ArrowLeft, CheckCircle } from "lucide-react"
import { AssessmentStartForm } from "@/components/assessment/assessment-start-form"

export default async function AssessmentStartPage() {
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

  // Get assessment domains
  const { data: domains } = await supabase.from("assessment_domains").select("*").order("name")

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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Start New Assessment</h1>
          <p className="text-muted-foreground">Choose who you&apos;re assessing and which domains to evaluate.</p>
        </div>

        {userProfiles && userProfiles.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Create a Profile First</CardTitle>
              <CardDescription>You need to create at least one profile before starting an assessment.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/profiles/new">
                <Button>Create Profile</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Assessment Form */}
            <div className="lg:col-span-2">
              <AssessmentStartForm userProfiles={userProfiles || []} domains={domains || []} />
            </div>

            {/* Information Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assessment Domains</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {domains?.map((domain) => (
                    <div key={domain.id} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{domain.name}</p>
                        <p className="text-xs text-muted-foreground">{domain.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assessment Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Badge className="mb-2">Baseline Assessment</Badge>
                    <p className="text-sm text-muted-foreground">
                      Initial comprehensive screening across selected domains.
                    </p>
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Follow-up Assessment
                    </Badge>
                    <p className="text-sm text-muted-foreground">Track progress and changes over time.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Privacy & Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    All assessment data is encrypted and stored securely. Your responses are anonymized for research
                    purposes while maintaining your privacy.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
