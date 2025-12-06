"use client"

import { createBrowserClient } from "@supabase/ssr"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Users, BarChart3, FileText } from "lucide-react"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function AdminDashboard() {
  const { data: stats } = useSWR("/api/admin/stats", async (url) => {
    const [orgsRes, membersRes, assessmentsRes] = await Promise.all([
      supabase.from("organizations").select("count", { count: "exact" }),
      supabase.from("organization_members").select("count", { count: "exact" }),
      supabase.from("assessment_results").select("count", { count: "exact" }),
    ])

    return {
      organizations: orgsRes.count || 0,
      members: membersRes.count || 0,
      assessments: assessmentsRes.count || 0,
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and management</p>
      </div>

      {/* Key Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              Organizations
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.organizations || 0}</p>
            <p className="text-xs text-muted-foreground">Active institutions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              Members
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.members || 0}</p>
            <p className="text-xs text-muted-foreground">Total participants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              Assessments
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.assessments || 0}</p>
            <p className="text-xs text-muted-foreground">Completed assessments</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Link href="/admin/organizations">
            <Card className="cursor-pointer hover:bg-muted/50">
              <CardContent className="pt-6">
                <Users className="mb-4 h-8 w-8 text-primary" />
                <h3 className="font-semibold">Organizations</h3>
                <p className="text-sm text-muted-foreground">Manage institutions</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/enrollment">
            <Card className="cursor-pointer hover:bg-muted/50">
              <CardContent className="pt-6">
                <FileText className="mb-4 h-8 w-8 text-primary" />
                <h3 className="font-semibold">Bulk Enrollment</h3>
                <p className="text-sm text-muted-foreground">Import participants</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/reports">
            <Card className="cursor-pointer hover:bg-muted/50">
              <CardContent className="pt-6">
                <BarChart3 className="mb-4 h-8 w-8 text-primary" />
                <h3 className="font-semibold">Reports</h3>
                <p className="text-sm text-muted-foreground">View analytics</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/analytics">
            <Card className="cursor-pointer hover:bg-muted/50">
              <CardContent className="pt-6">
                <BarChart3 className="mb-4 h-8 w-8 text-primary" />
                <h3 className="font-semibold">Analytics</h3>
                <p className="text-sm text-muted-foreground">Deep insights</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
