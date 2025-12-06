"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Download } from "lucide-react"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface ReportData {
  domain: string
  completed: number
  average_score: number
  participants: number
}

export default function ReportsPage() {
  const [organizationId, setOrganizationId] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const [reportType, setReportType] = useState("domain_summary")

  const { data: organizations } = useSWR("/api/organizations", async (url) => {
    const { data, error } = await supabase.from("organizations").select("id, name")
    if (error) throw error
    return data
  })

  const { data: reportData } = useSWR(
    organizationId && reportType ? `/api/reports?org=${organizationId}&type=${reportType}` : null,
    async (url) => {
      const { data, error } = await supabase
        .from("assessment_results")
        .select(
          `
          id,
          assessment_domains(name),
          risk_level,
          created_at,
          profiles(organization_id)
        `,
        )
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString())

      if (error) throw error

      // Aggregate data by domain
      const domainStats: { [key: string]: any } = {}
      data?.forEach((result: any) => {
        const domainName = result.assessment_domains?.name || "Unknown"
        if (!domainStats[domainName]) {
          domainStats[domainName] = {
            domain: domainName,
            completed: 0,
            average_score: 0,
            participants: new Set(),
            total_score: 0,
          }
        }
        domainStats[domainName].completed += 1
        domainStats[domainName].participants.add(result.profiles?.organization_id)
        domainStats[domainName].total_score += Number.parseFloat(result.risk_level || "0")
      })

      return Object.values(domainStats).map((stat: any) => ({
        domain: stat.domain,
        completed: stat.completed,
        average_score: (stat.total_score / stat.completed).toFixed(2),
        participants: stat.participants.size,
      }))
    },
  )

  const handleExportReport = () => {
    if (!reportData) return

    const csv = [
      ["Domain", "Completed Assessments", "Average Score", "Participants"],
      ...reportData.map((row: ReportData) => [row.domain, row.completed, row.average_score, row.participants]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const element = document.createElement("a")
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv))
    element.setAttribute("download", `report_${new Date().toISOString().split("T")[0]}.csv`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Generate and analyze institutional assessment reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="org">Organization</Label>
              <Select value={organizationId} onValueChange={setOrganizationId}>
                <SelectTrigger>
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
              <Label htmlFor="type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="domain_summary">Domain Summary</SelectItem>
                  <SelectItem value="risk_distribution">Risk Distribution</SelectItem>
                  <SelectItem value="progress_tracking">Progress Tracking</SelectItem>
                  <SelectItem value="demographic_analysis">Demographic Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleExportReport} disabled={!reportData} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <Card>
          <CardHeader>
            <CardTitle>Assessment Results by Domain</CardTitle>
            <CardDescription>Completed assessments and average scores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="domain" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
                <Bar dataKey="average_score" fill="#10b981" name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {reportData.map((row: ReportData) => (
                <Card key={row.domain} className="bg-muted/50">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-muted-foreground">{row.domain}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Completed</p>
                        <p className="text-lg font-bold">{row.completed}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Avg Score</p>
                        <p className="text-lg font-bold">{row.average_score}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
