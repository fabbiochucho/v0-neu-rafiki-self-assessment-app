"use client"

import type React from "react"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface FollowupSchedule {
  id: string
  profile_id: string
  followup_type: string
  next_scheduled_date: string
  status: string
  profile_name: string
  days_until: number
}

export default function FollowupsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState("")
  const [followupType, setFollowupType] = useState("monthly")

  const { data: schedules, mutate: mutateSchedules } = useSWR<FollowupSchedule[]>("/api/followups", async (url: string) => {
    const { data, error } = await supabase
      .from("assessment_followup_schedules")
      .select(
        `
          id,
          profile_id,
          followup_type,
          next_scheduled_date,
          status,
          user_profiles(full_name, preferred_name)
        `,
      )
      .order("next_scheduled_date", { ascending: true })

    if (error) throw error
    return data?.map((schedule: any) => ({
      ...schedule,
      profile_name: schedule.user_profiles?.preferred_name || schedule.user_profiles?.full_name,
      days_until: Math.ceil((new Date(schedule.next_scheduled_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    }))
  })

  const { data: profiles } = useSWR("/api/profiles", async (url) => {
    const { data, error } = await supabase.from("user_profiles").select("id, full_name, preferred_name")
    if (error) throw error
    return data?.map((p: any) => ({ id: p.id, name: p.preferred_name || p.full_name }))
  })

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const startDate = new Date()
      const nextDate = new Date(startDate)

      // Calculate next scheduled date based on type
      switch (followupType) {
        case "weekly":
          nextDate.setDate(nextDate.getDate() + 7)
          break
        case "monthly":
          nextDate.setMonth(nextDate.getMonth() + 1)
          break
        case "quarterly":
          nextDate.setMonth(nextDate.getMonth() + 3)
          break
        case "biannual":
          nextDate.setMonth(nextDate.getMonth() + 6)
          break
      }

      const { error } = await supabase.from("assessment_followup_schedules").insert([
        {
          profile_id: selectedProfile,
          followup_type: followupType,
          schedule_start: startDate.toISOString().split("T")[0],
          next_scheduled_date: nextDate.toISOString().split("T")[0],
          status: "active",
        },
      ])

      if (error) throw error
      mutateSchedules()
      setSelectedProfile("")
      setFollowupType("monthly")
      setIsOpen(false)
    } catch (error) {
      console.error("Error creating follow-up schedule:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700"
      case "paused":
        return "bg-yellow-500/10 text-yellow-700"
      case "completed":
        return "bg-blue-500/10 text-blue-700"
      default:
        return "bg-gray-500/10 text-gray-700"
    }
  }

  const getDueIndicator = (daysUntil: number) => {
    if (daysUntil < 0) return { label: "Overdue", color: "text-red-600" }
    if (daysUntil === 0) return { label: "Due Today", color: "text-orange-600" }
    if (daysUntil <= 7) return { label: `Due in ${daysUntil} days`, color: "text-yellow-600" }
    return { label: `Due in ${daysUntil} days`, color: "text-green-600" }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Follow-Up Assessments</h1>
          <p className="text-muted-foreground">Track longitudinal changes and schedule periodic assessments</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Clock className="mr-2 h-4 w-4" />
              Schedule Follow-Up
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Follow-Up Assessment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSchedule} className="space-y-4">
              <div>
                <Label htmlFor="profile">Select Profile</Label>
                <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles?.map((profile: any) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="frequency">Follow-Up Frequency</Label>
                <Select value={followupType} onValueChange={setFollowupType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly (3 months)</SelectItem>
                    <SelectItem value="biannual">Bi-Annual (6 months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={!selectedProfile}>
                Create Schedule
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming Follow-ups */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Upcoming Follow-Ups</h2>
        <div className="grid gap-4">
          {schedules
            ?.filter((s) => s.status === "active")
            ?.map((schedule) => {
              const dueInfo = getDueIndicator(schedule.days_until)
              return (
                <Card key={schedule.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{schedule.profile_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          <Calendar className="mb-1 inline h-4 w-4 mr-1" />
                          {new Date(schedule.next_scheduled_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className={`text-sm font-medium ${dueInfo.color}`}>{dueInfo.label}</p>
                          <Badge className="mt-1 capitalize">{schedule.followup_type}</Badge>
                        </div>
                        <Link href={`/assessment/new?followup=${schedule.id}`}>
                          <Button size="sm">Complete</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>
      </div>

      {/* Follow-Up History */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Follow-Up Results</h2>
        <div className="grid gap-4">
          {schedules
            ?.filter((s) => s.status === "completed")
            ?.map((schedule) => (
              <Card key={schedule.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{schedule.profile_name}</h3>
                      <p className="text-sm text-muted-foreground">Completed {schedule.followup_type} assessment</p>
                    </div>
                    <Link href={`/dashboard/followups/${schedule.id}/results`}>
                      <Button variant="outline" size="sm">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        View Results
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}
