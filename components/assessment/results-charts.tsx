"use client"

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartsProps {
  chartData: Array<{
    domain: string
    percentage: number
    score: number
    maxScore: number
    riskLevel: string
  }>
  riskPieData: Array<{
    name: string
    value: number
    fill: string
  }>
}

export function ResultsCharts({ chartData, riskPieData }: ChartsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      {/* Score Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Domain Score Distribution</CardTitle>
          <CardDescription>Percentage scores across assessed domains</CardDescription>
        </CardHeader>
        <CardContent>
          {/*
            The chart itself is a purely visual (SVG) presentation of
            chartData and has no accessible text equivalent, which fails
            WCAG 1.1.1 for anyone who can't perceive it (screen reader
            users, and low-vision users who can't resolve the bars/colors).
            aria-hidden here so assistive tech skips straight past the
            decorative chart to the table alternative below.
          */}
          <div aria-hidden="true">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="domain" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="percentage" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <details className="mt-2 group">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground w-fit">
              View as table
            </summary>
            <table className="w-full mt-3 text-sm border-collapse">
              <caption className="sr-only">Domain score distribution: percentage score per assessed domain</caption>
              <thead>
                <tr className="border-b">
                  <th scope="col" className="text-left py-2 pr-4 font-medium">
                    Domain
                  </th>
                  <th scope="col" className="text-left py-2 pr-4 font-medium">
                    Score
                  </th>
                  <th scope="col" className="text-left py-2 pr-4 font-medium">
                    Percentage
                  </th>
                  <th scope="col" className="text-left py-2 font-medium">
                    Risk level
                  </th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row) => (
                  <tr key={row.domain} className="border-b last:border-0">
                    <td className="py-2 pr-4">{row.domain}</td>
                    <td className="py-2 pr-4">
                      {row.score} / {row.maxScore}
                    </td>
                    <td className="py-2 pr-4">{row.percentage}%</td>
                    <td className="py-2">{row.riskLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </CardContent>
      </Card>

      {/* Risk Level Distribution */}
      {riskPieData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
            <CardDescription>Summary of assessment findings</CardDescription>
          </CardHeader>
          <CardContent>
            <div aria-hidden="true">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <details className="mt-2 group">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground w-fit">
                View as table
              </summary>
              <table className="w-full mt-3 text-sm border-collapse">
                <caption className="sr-only">Risk level distribution: number of domains at each risk level</caption>
                <thead>
                  <tr className="border-b">
                    <th scope="col" className="text-left py-2 pr-4 font-medium">
                      Risk level
                    </th>
                    <th scope="col" className="text-left py-2 font-medium">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {riskPieData.map((row) => (
                    <tr key={row.name} className="border-b last:border-0">
                      <td className="py-2 pr-4">{row.name}</td>
                      <td className="py-2">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
