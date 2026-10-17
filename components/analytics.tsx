"use client"

import { Analytics as VercelAnalytics } from "@vercel/analytics/next"
import { scrubUrl } from "@/lib/analytics-url"

export function Analytics() {
  return <VercelAnalytics beforeSend={(event) => ({ ...event, url: scrubUrl(event.url) })} />
}
