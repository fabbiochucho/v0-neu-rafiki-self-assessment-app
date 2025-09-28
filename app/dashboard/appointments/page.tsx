import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Heart, ArrowLeft, Calendar, Plus, Clock, MapPin, Phone } from "lucide-react"

export default async function AppointmentsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profiles
  const { data: userProfiles } = await supabase.from("user_profiles").select("*").eq("user_id", data.user.id)

  // Get appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      *,
      user_profiles(full_name, preferred_name)
    `)
    .in("profile_id", userProfiles?.map((p) => p.id) || [])
    .order("appointment_date", { ascending: true })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "rescheduled":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const upcomingAppointments =
    appointments?.filter((apt) => {
      const aptDate = new Date(apt.appointment_date)
      const now = new Date()
      return aptDate > now && apt.status === "scheduled"
    }) || []

  const pastAppointments =
    appointments?.filter((apt) => {
      const aptDate = new Date(apt.appointment_date)
      const now = new Date()
      return aptDate <= now || apt.status !== "scheduled"
    }) || []

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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Appointments</h1>
          <p className="text-muted-foreground">Manage appointments and follow-ups for your assessment results.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Upcoming</span>
              </div>
              <p className="text-2xl font-bold mt-1">{upcomingAppointments.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">This Week</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {
                  upcomingAppointments.filter((apt) => {
                    const aptDate = new Date(apt.appointment_date)
                    const now = new Date()
                    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                    return aptDate <= weekFromNow
                  }).length
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Completed</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {appointments?.filter((apt) => apt.status === "completed").length || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Providers</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {new Set(appointments?.map((apt) => apt.provider_name).filter(Boolean)).size || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            {appointment.user_profiles.preferred_name || appointment.user_profiles.full_name}
                          </h3>
                          <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(appointment.appointment_date).toLocaleDateString()} at{" "}
                              {new Date(appointment.appointment_date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{appointment.provider_name || "Provider TBD"}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Heart className="h-4 w-4" />
                            <span className="capitalize">{appointment.appointment_type}</span>
                          </div>
                        </div>

                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                            {appointment.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Past Appointments</h2>
            <div className="space-y-4">
              {pastAppointments.slice(0, 5).map((appointment) => (
                <Card key={appointment.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            {appointment.user_profiles.preferred_name || appointment.user_profiles.full_name}
                          </h3>
                          <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{appointment.provider_name || "Provider TBD"}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Heart className="h-4 w-4" />
                            <span className="capitalize">{appointment.appointment_type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {appointments?.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Appointments Scheduled</h3>
              <p className="text-muted-foreground mb-6">
                Schedule appointments with healthcare professionals based on your assessment results.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule First Appointment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
