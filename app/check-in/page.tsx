import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { CheckInForm } from "@/components/check-in/check-in-form"
import { FREQUENCY_OPTIONS, TREND_LABELS, trendFor } from "@/lib/check-in/rules"
import { isFederationEnabled } from "@/lib/federation/config"
import { getActiveAllianceLink } from "@/lib/federation/authorize"

interface PageProps {
  searchParams: Promise<{ from?: string; learner?: string; goal?: string }>
}

interface HistoryRow {
  id: string
  goal_title: string
  learner_ref: string | null
  frequency_score: number | null
  created_at: string
  shared_at: string | null
}

export default async function CheckInPage({ searchParams }: PageProps) {
  const { from, learner, goal } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    const qs = new URLSearchParams(Object.entries({ from, learner, goal }).filter(([, v]) => v) as [string, string][])
    const query = qs.toString()
    redirect(`/auth/login?redirect=${encodeURIComponent(`/check-in${query ? `?${query}` : ""}`)}`)
  }

  const fromAnda = from === "anda"
  const learnerRef = fromAnda && learner ? learner.slice(0, 200) : null
  const goalTitle = goal ? goal.slice(0, 300) : ""

  const { data } = await supabase
    .from("check_ins")
    .select("id, goal_title, learner_ref, frequency_score, created_at, shared_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(200)
  const rows = (data || []) as HistoryRow[]

  // Group by goal (and learner) for history + trend.
  const groups = new Map<string, HistoryRow[]>()
  for (const r of rows) {
    const key = `${r.learner_ref ?? ""}|${r.goal_title}`
    groups.set(key, [...(groups.get(key) || []), r])
  }
  const current = groups.get(`${learnerRef ?? ""}|${goalTitle}`) || []
  const previousScore = current.length ? current[current.length - 1].frequency_score : null
  const canShare = !!learnerRef && isFederationEnabled() && !!(await getActiveAllianceLink(supabase, user.id))

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Check-in</h1>
        <p className="text-muted-foreground mb-8">
          A short look at how one goal is going. It takes about two minutes and helps you spot patterns over time.
        </p>

        <CheckInForm
          initialGoal={goalTitle}
          learnerRef={learnerRef}
          fromAnda={fromAnda}
          previousScore={previousScore}
          canShare={canShare}
        />

        <section aria-labelledby="history-heading" className="mt-12 space-y-4">
          <h2 id="history-heading" className="text-2xl font-semibold">
            Your check-in history
          </h2>
          {groups.size === 0 ? (
            <p className="text-muted-foreground">No check-ins yet.</p>
          ) : (
            [...groups.values()].reverse().map((items) => {
              const scores = items.map((i) => i.frequency_score).filter((s): s is number => s !== null)
              return (
                <Card key={items[0].id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{items[0].goal_title}</CardTitle>
                    <CardDescription>Trend: {TREND_LABELS[trendFor(scores)]}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      {items
                        .slice(-5)
                        .reverse()
                        .map((i) => (
                          <li key={i.id} className="flex justify-between gap-4">
                            <span>{new Date(i.created_at).toLocaleDateString()}</span>
                            <span>
                              Went well: {i.frequency_score !== null ? FREQUENCY_OPTIONS[i.frequency_score] : "n/a"}
                              {i.shared_at && <span className="text-muted-foreground"> · shared with ANDA</span>}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })
          )}
        </section>
      </div>
    </div>
  )
}
