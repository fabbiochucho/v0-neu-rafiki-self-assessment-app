import { defineConfig, devices } from "@playwright/test"

// These end-to-end tests exercise real sign-up/login/assessment flows
// against a running app instance, which in turn talks to a real Supabase
// project (there is no mock-auth fallback anymore -- see
// lib/supabase/middleware.ts). They require:
//   - the app running locally (`pnpm dev`) or at PLAYWRIGHT_BASE_URL
//   - a Supabase project configured via the standard NEXT_PUBLIC_SUPABASE_*
//     env vars, with the schema in scripts/ applied and at least the
//     comprehensive question bank seeded
//   - email confirmation disabled (or a way to auto-confirm) in that
//     Supabase project's auth settings, since these tests sign up a fresh
//     user and log in immediately
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "pnpm dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
      },
})
