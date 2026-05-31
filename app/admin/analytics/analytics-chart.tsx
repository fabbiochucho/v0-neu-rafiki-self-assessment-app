'use client'

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type ChartData = { date?: string; count?: number; name?: string; value?: number }

export function AnalyticsChart({
  title,
  data,
  type,
}: {
  title: string
  data: ChartData[]
  type: 'line' | 'bar'
}) {
  const Chart = type === 'line' ? LineChart : BarChart
  const DataComponent = type === 'line' ? Line : Bar

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <Chart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey={type === 'line' ? 'date' : 'name'} className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
            }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <DataComponent
            type="monotone"
            dataKey={type === 'line' ? 'count' : 'value'}
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary)/0.2)"
            strokeWidth={2}
          />
        </Chart>
      </ResponsiveContainer>
    </div>
  )
}
