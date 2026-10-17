# Rules for coding agents

Read these before changing NeuRafiki.

- **Data:** every table has RLS. A new table needs RLS on and policies that check ownership (`auth.uid()`), never just "signed in". Signed-out visitors have no grants (migration 025); grant `anon` explicitly only for content that is meant to be public.
- **Keys:** only `NEXT_PUBLIC_SUPABASE_ANON_KEY` and the Sentry DSN may reach the browser. The service role key, encryption key, payment, SMTP, AI, cron and federation secrets stay in server code; never put them in a `NEXT_PUBLIC_` variable.
- **Screening data is health data, often about children.** Answers and results stay encrypted and are scored on the server. No ad pixels, session replay (Sentry Replay stays off) or third-party SDKs that capture what people type. Analytics gets page paths only (`components/analytics.tsx`).
- **AI:** the companion needs consent, never receives answers or scores, and says it's an AI, not a person.
- **Not a companion chatbot:** the companion only explains screening questions and results. It has no persona, keeps no memory between sessions, and starts with an "AI, not a person" notice. Adding a persona, relationship features or memory makes it a companion chatbot under laws such as California SB 243, so re-check those first.
- **Sharing with ANDA:** summaries only, with the per-item consent box; never raw answers or free text.
- **New vendor, script, SDK or font:** update the processors list in `app/privacy/page.tsx` and the CSP in `lib/csp.ts` in the same PR, and bump `LEGAL_UPDATED`. Fonts stay self-hosted through `next/font`.
- **Accessibility:** build to WCAG 2.2 AA (see `/accessibility`).
- **Packages:** check every new package exists and is the one you meant before adding it. Commit the lockfile.
- **Legal text:** the DPO clause in `lib/dpo.ts` is verbatim and test-guarded; don't edit it.
- **Payments:** a plan is paid per month and never renews automatically. Don't add wording that says it does.
