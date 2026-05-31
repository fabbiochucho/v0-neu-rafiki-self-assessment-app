import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AnalyticsChart } from './analytics-chart'

export default async function AdminAnalyticsPage() {
  const supabase = createClient()

  // Admin check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login?redirectedFrom=/admin/analytics')
  }

  // Optional: Check role if you store it in user_metadata
  const isAdmin =
    user.user_metadata?.role === 'admin' ||
    user.app_metadata?.role === 'admin' ||
    user.email?.endsWith('@neurafiki.africa')

  if (!isAdmin) {
    redirect('/unauthorized')
  }

  // Fetch aggregated analytics
  const { data: events, error } = await supabase
    .from('analytics_events')
    .select('event_name, created_at')
    .order('created_at', { ascending: true })
    .limit(5000)

  if (error) {
    console.error('Analytics fetch error:', error)
  }

  // Transform data for charts
  const dailyEvents = events?.reduce(
    (acc, curr) => {
      const day = new Date(curr.created_at).toISOString().split('T')[0]
      acc[day] = (acc[day] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  ) || {}

  const funnelData = [
    {
      name: 'Started',
      value: events?.filter((e) => e.event_name === 'assessment_started').length || 0,
    },
    {
      name: 'Completed',
      value: events?.filter((e) => e.event_name === 'assessment_completed').length || 0,
    },
    {
      name: 'Exported',
      value: events?.filter((e) => e.event_name === 'results_exported').length || 0,
    },
  ]

  return (
    <main className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <span className="text-sm text-muted-foreground">Last 30 days (sampled)</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AnalyticsChart
          title="Daily Engagement"
          data={Object.entries(dailyEvents).map(([date, count]) => ({ date, count }))}
          type="line"
        />
        <AnalyticsChart title="Assessment Funnel" data={funnelData} type="bar" />
      </div>

      <div className="rounded-lg border p-4 bg-card">
        <h2 className="font-semibold mb-2">Recent Events</h2>
        <div className="max-h-64 overflow-auto space-y-2">
          {events && events.length > 0 ? (
            events
              .slice(-20)
              .reverse()
              .map((e, i) => (
                <div key={i} className="text-sm p-2 rounded bg-muted/30 flex justify-between">
                  <span className="font-medium">{e.event_name.replace(/_/g, ' ')}</span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(e.created_at).toLocaleString()}
                  </span>
                </div>
              ))
          ) : (
            <p className="text-muted-foreground text-sm">No events recorded yet.</p>
          )}
        </div>
      </div>
    </main>
  )
}
