'use client'

import { useEffect, useState } from 'react'
import { Loader2, TrendingUp, Users, Target } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

const COLORS = ['#8b5a3c', '#d4a574', '#2a8659', '#4a9b7f']

interface FunnelData {
  signup: number
  assessmentStarted: number
  assessmentCompleted: number
  resultsViewed: number
  conversionRate: number
}

interface CohortData {
  userCountry: string
  totalUsers: number
  signups: number
  assessmentsStarted: number
  assessmentsCompleted: number
  completionRatePercent: number
}

interface DailyActiveUserData {
  date: string
  activeUsers: number
}

export function AnalyticsDashboard() {
  const [funnel, setFunnel] = useState<FunnelData | null>(null)
  const [cohorts, setCohorts] = useState<CohortData[]>([])
  const [dau, setDau] = useState<DailyActiveUserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch funnel data
      const funnelRes = await fetch('/api/analytics/events?endpoint=funnel')
      if (funnelRes.ok) {
        const funnelData = await funnelRes.json()
        setFunnel(funnelData.data)
      }

      // Fetch cohort data
      const cohortRes = await fetch('/api/analytics/events?endpoint=cohort')
      if (cohortRes.ok) {
        const cohortData = await cohortRes.json()
        setCohorts(cohortData.data)
      }

      // Fetch daily active users
      const dauRes = await fetch('/api/analytics/events?endpoint=daily-active-users')
      if (dauRes.ok) {
        const dauData = await dauRes.json()
        setDau(dauData.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  // Prepare funnel chart data
  const funnelChartData = funnel
    ? [
        { stage: 'Signups', users: funnel.signup },
        { stage: 'Started', users: funnel.assessmentStarted },
        { stage: 'Completed', users: funnel.assessmentCompleted },
        { stage: 'Viewed Results', users: funnel.resultsViewed },
      ]
    : []

  // Prepare pie chart data for conversion
  const conversionPieData = funnel
    ? [
        { name: 'Converted', value: funnel.assessmentCompleted },
        { name: 'Not Converted', value: Math.max(0, funnel.signup - funnel.assessmentCompleted) },
      ]
    : []

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{funnel?.signup || 0}</div>
            <p className="text-xs text-muted-foreground">New users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Started</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{funnel?.assessmentStarted || 0}</div>
            <p className="text-xs text-muted-foreground">Assessment initiations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{funnel?.assessmentCompleted || 0}</div>
            <p className="text-xs text-muted-foreground">Full assessments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{funnel?.conversionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">Signup to completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>User journey from signup to results viewed</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Conversion Rate Pie Chart */}
      {funnel && (
        <Card>
          <CardHeader>
            <CardTitle>Overall Conversion</CardTitle>
            <CardDescription>Signup to assessment completion</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={conversionPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Daily Active Users */}
      {dau.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Active Users</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dau}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="hsl(var(--primary))"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Cohort Analysis by Country */}
      {cohorts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cohort Analysis by Country</CardTitle>
            <CardDescription>Top performing regions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 px-2">Country</th>
                    <th className="text-right py-2 px-2">Total Users</th>
                    <th className="text-right py-2 px-2">Signups</th>
                    <th className="text-right py-2 px-2">Started</th>
                    <th className="text-right py-2 px-2">Completed</th>
                    <th className="text-right py-2 px-2">Completion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {cohorts
                    .sort((a, b) => b.totalUsers - a.totalUsers)
                    .slice(0, 10)
                    .map((cohort, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-2">{cohort.userCountry}</td>
                        <td className="text-right py-2 px-2">{cohort.totalUsers}</td>
                        <td className="text-right py-2 px-2">{cohort.signups}</td>
                        <td className="text-right py-2 px-2">
                          {cohort.assessmentsStarted}
                        </td>
                        <td className="text-right py-2 px-2">
                          {cohort.assessmentsCompleted}
                        </td>
                        <td className="text-right py-2 px-2 font-semibold">
                          {cohort.completionRatePercent.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
