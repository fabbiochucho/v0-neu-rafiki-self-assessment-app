// Loaded by instrumentation.ts's register() when NEXT_RUNTIME === "edge"
// (covers middleware.ts, which runs on the edge runtime). Leaving SENTRY_DSN
// unset makes Sentry.init a no-op.
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
})
