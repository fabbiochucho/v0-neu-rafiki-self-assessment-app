"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function AnalyticsDashboard() {
  const [organizationId, setOrganizationId] = useState("")
  const [dateRange, setDateRange] = useState("30days")

  // Calculate date range
  const getDateRange = () => {
    const today = new Date()
    const from = new Date()

    switch (dateRange) {
      case "7days":
        from.setDate(today.getDate() - 7)
        break
      case "30days":
        from.setDate(today.getDate() - 30)
        break
      case "90days":
        from.setDate(today.getDate() - 90)
        break
      case "1year":
        from.setFullYear(today.getFullYear() - 1)
        break
    }

    return { from: from.toISOString(), to: today.toISOString() }
  }

  const { data: organizations } = useSWR("/api/organizations", async (url) => {
    const { data, error } = await supabase.from("organizations").select("id, name")
    if (error) throw error
    return data
  })

  const { data: dashboardMetrics } = useSWR(
    organizationId ? `/api/analytics/metrics?org=${organizationId}` : null,
    async (url) => {
      const { from, to } = getDateRange()
      const { data, error } = await supabase
        .from("assessment_results")
        .select(
          `
          id,
          risk_level,
          created_at,
          assessment_domains(name),
          profiles(organization_id)
        `,
        )
        .gte("created_at", from)
        .lte("created_at", to)

      if (error) throw error

      const metrics = {
        total_assessments: data?.length || 0,
        high_risk_count: data?.filter((r: any) => r.risk_level === "high").length || 0,
        medium_risk_count: data?.filter((r: any) => r.risk_level === "medium").length || 0,
        low_risk_count: data?.filter((r: any) => r.risk_level === "low").length || 0,
        unique_participants: new Set(data?.map((r: any) => r.profiles?.organization_id)).size,
      }

      return metrics
    },
  )

  const { data: timelineData } = useSWR(
    organizationId ? `/api/analytics/timeline?org=${organizationId}` : null,
    async (url) => {
      const { from, to } = getDateRange()
      const { data, error } = await supabase
        .from("assessment_results")
        .select("created_at, risk_level")
        .gte("created_at", from)
        .lte("created_at", to)
        .order("created_at", { ascending: true })

      if (error) throw error

      // Aggregate by day
      const timeline: { [key: string]: any } = {}
      data?.forEach((result: any) => {
        const date = new Date(result.created_at).toLocaleDateString()
        if (!timeline[date]) {
          timeline[date] = { date, high: 0, medium: 0, low: 0, total: 0 }
        }
        timeline[date][result.risk_level || "low"]++
        timeline[date].total++
      })

      return Object.values(timeline)
    },
  )

  const { data: domainAnalytics } = useSWR(
    organizationId ? `/api/analytics/domains?org=${organizationId}` : null,
    async (url) => {
      const { from, to } = getDateRange()
      const { data, error } = await supabase
        .from("assessment_results")
        .select("assessment_domains(name), risk_level")
        .gte("created_at", from)
        .lte("created_at", to)

      if (error) throw error

      const domains: { [key: string]: any } = {}
      data?.forEach((result: any) => {
        const domainName = result.assessment_domains?.name || "Unknown"
        if (!domains[domainName]) {
          domains[domainName] = { name: domainName, high: 0, medium: 0, low: 0 }
        }
        domains[domainName][result.risk_level || "low"]++
      })

      return Object.values(domains)
    },
  )

  const { data: demographicData } = useSWR(
    organizationId ? `/api/analytics/demographics?org=${organizationId}` : null,
    async (url) => {
      const { data, error } = await supabase.from("profiles").select("age_group").eq("organization_id", organizationId)

      if (error) throw error

      const demographics: { [key: string]: number } = {}
      data?.forEach((profile: any) => {
        const ageGroup = profile.age_group || "Unknown"
        demographics[ageGroup] = (demographics[ageGroup] || 0) + 1
      })

      return Object.entries(demographics).map(([name, value]) => ({ name, value }))
    },
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Real-time insights and institutional metrics</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label htmlFor="organization-filter" className="text-sm font-medium">
                Organization
              </label>
              <Select value={organizationId} onValueChange={setOrganizationId}>
                <SelectTrigger id="organization-filter">
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations?.map((org: any) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="date-range-filter" className="text-sm font-medium">
                Date Range
              </label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger id="date-range-filter" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {organizationId && (
        <>
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{dashboardMetrics?.total_assessments || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-600">Low Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">{dashboardMetrics?.low_risk_count || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-yellow-600">Medium Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-yellow-600">{dashboardMetrics?.medium_risk_count || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-red-600">High Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">{dashboardMetrics?.high_risk_count || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{dashboardMetrics?.unique_participants || 0}</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Tabs defaultValue="timeline" className="space-y-4">
            <TabsList>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="domains">By Domain</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="risk">Risk Distribution</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Assessments Over Time</CardTitle>
                  <CardDescription>Daily assessment completion trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="high" stroke="#ef4444" name="High Risk" />
                      <Line type="monotone" dataKey="medium" stroke="#f59e0b" name="Medium Risk" />
                      <Line type="monotone" dataKey="low" stroke="#10b981" name="Low Risk" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="domains">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Results by Domain</CardTitle>
                  <CardDescription>Risk distribution across different assessment domains</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={domainAnalytics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="high" fill="#ef4444" name="High Risk" />
                      <Bar dataKey="medium" fill="#f59e0b" name="Medium Risk" />
                      <Bar dataKey="low" fill="#10b981" name="Low Risk" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="demographics">
              <Card>
                <CardHeader>
                  <CardTitle>Participant Demographics</CardTitle>
                  <CardDescription>Distribution by age group</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={demographicData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {demographicData?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Risk Distribution</CardTitle>
                  <CardDescription>Proportion of participants by risk level</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Low Risk", value: dashboardMetrics?.low_risk_count || 0 },
                          { name: "Medium Risk", value: dashboardMetrics?.medium_risk_count || 0 },
                          { name: "High Risk", value: dashboardMetrics?.high_risk_count || 0 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
