"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"

/**
 * App Router's top-level error boundary -- catches errors that escape every
 * route segment's own error.tsx (or occur in the root layout itself), which
 * is why it has to render its own <html>/<body> rather than relying on
 * layout.tsx. Sentry's Next.js SDK relies on this file existing to capture
 * that class of error; see instrumentation.ts's onRequestError for
 * server-side errors.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ maxWidth: 420, textAlign: "center" }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Something went wrong</h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              An unexpected error occurred. Please refresh the page or contact support if the problem persists.
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}
