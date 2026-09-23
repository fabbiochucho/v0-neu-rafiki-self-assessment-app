// Loaded automatically into the client bundle by withSentryConfig's webpack
// plugin (see next.config.mjs). Leaving NEXT_PUBLIC_SENTRY_DSN unset makes
// Sentry.init a no-op, so this is safe to ship before a real DSN exists.
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
})
