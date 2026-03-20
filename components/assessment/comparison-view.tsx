'use client'

import { useMemo } from 'react'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AssessmentResult } from '@/lib/types/assessment'

interface ComparisonViewProps {
  firstAssessment: AssessmentResult
  secondAssessment: AssessmentResult
}

export function ComparisonView({
  firstAssessment,
  secondAssessment,
}: ComparisonViewProps) {
  const comparison = useMemo(() => {
    const changes: Record<string, any> = {}

    for (const [key, before] of Object.entries(firstAssessment.scores)) {
      const after = secondAssessment.scores[key] || 0
      const change = after - before
      const percentChange = before > 0 ? (change / before) * 100 : 0

      changes[key] = {
        name: key.replace(/_/g, ' '),
        before,
        after,
        change,
        percentChange: Math.round(percentChange),
      }
    }

    return Object.values(changes)
  }, [firstAssessment, secondAssessment])

  const calculateDaysBetween = () => {
    const first = new Date(firstAssessment.created_at)
    const second = new Date(secondAssessment.created_at)
    return Math.floor(
      (second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)
    )
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400'
    if (change < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />
    if (change < 0) return <TrendingDown className="h-4 w-4" />
    return <Minus className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Timeline</CardTitle>
          <CardDescription>
            {calculateDaysBetween()} days between assessments
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between">
          <div>
            <p className="text-sm font-medium">First Assessment</p>
            <p className="text-xs text-muted-foreground">
              {new Date(firstAssessment.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {calculateDaysBetween()} days
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Second Assessment</p>
            <p className="text-xs text-muted-foreground">
              {new Date(secondAssessment.created_at).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Score Comparison</CardTitle>
          <CardDescription>
            Visual comparison of scores across categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="before" fill="hsl(var(--muted))" name="First Assessment" />
              <Bar
                dataKey="after"
                fill="hsl(var(--primary))"
                name="Second Assessment"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Score Changes */}
      <Card>
        <CardHeader>
          <CardTitle>Changes in Detail</CardTitle>
          <CardDescription>
            Positive changes indicate improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comparison.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex-1">
                  <p className="font-medium capitalize">{item.name}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{item.before} → {item.after}</span>
                    <span>Change: {item.change > 0 ? '+' : ''}{item.change}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 ${getChangeColor(item.change)}`}>
                    {getChangeIcon(item.change)}
                    <span className="font-semibold">
                      {item.percentChange > 0 ? '+' : ''}
                      {item.percentChange}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Improvements and Areas for Attention */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              Improvements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {comparison.filter((c) => c.change > 0).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No improvements detected in this period
              </p>
            ) : (
              <ul className="space-y-2">
                {comparison
                  .filter((c) => c.change > 0)
                  .map((item) => (
                    <li key={item.name} className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span>{item.name} (+{item.change})</span>
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
              Areas Needing Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            {comparison.filter((c) => c.change < 0).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No declines detected in this period
              </p>
            ) : (
              <ul className="space-y-2">
                {comparison
                  .filter((c) => c.change < 0)
                  .map((item) => (
                    <li key={item.name} className="flex items-center gap-2 text-sm">
                      <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <span>{item.name} ({item.change})</span>
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
