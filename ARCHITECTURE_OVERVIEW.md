# NeuRafiki - CI/CD & Testing Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DEVELOPER WORKFLOW                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Local Development                                                   │
│  ┌──────────────────────┐                                           │
│  │ npm run dev          │  ← Start local dev server                │
│  │ npm test --watch     │  ← Run tests (watch mode)               │
│  │ npm run lint         │  ← Check code style                      │
│  │ npm run type-check   │  ← Check TypeScript types               │
│  └──────────────────────┘                                           │
│            │                                                         │
│            ↓                                                         │
│  Write Tests First → Implement Feature → Run Tests                 │
│            │                                                         │
│            ↓                                                         │
│  ┌──────────────────────┐                                           │
│  │ git push origin main │  ← Push to GitHub                        │
│  └──────────────────────┘                                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    GITHUB ACTIONS CI/CD PIPELINE                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  TRIGGER: push/PR to main branch                                   │
│                                                                      │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌────────────┐│
│  │   CI WORKFLOW        │  │  TEST WORKFLOW       │  │ E2E WORKFLOW││
│  ├──────────────────────┤  ├──────────────────────┤  ├────────────┤│
│  │ ✓ ESLint            │  │ ✓ Vitest             │  │ ✓ Playwright││
│  │ ✓ TypeScript        │  │ ✓ Coverage Report    │  │ ✓ Chrome   ││
│  │ ✓ Build             │  │ ✓ Codecov Upload     │  │ ✓ Firefox  ││
│  │ ✓ Multi-node (18,20)│  │ ✓ PR Comments        │  │ ✓ Safari   ││
│  │                      │  │ ✓ Archive Results    │  │ ✓ Mobile   ││
│  │ Time: 3-5 min       │  │ Time: 2-5 min        │  │ Time: 5-10 ││
│  └──────────────────────┘  └──────────────────────┘  └────────────┘│
│           │                        │                         │     │
│           ✅ PASS?                 ✅ PASS?                  ✅ PASS?│
│           │                        │                         │     │
│           └────────────────────────┴─────────────────────────┘     │
│                              │                                      │
│                              ↓                                      │
│                    ✅ ALL CHECKS PASSED                             │
│                    Ready for Deployment                             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT PIPELINE                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  AUTOMATIC: Merge to main → Deploy to Staging                      │
│  MANUAL: Click Deploy → Select Environment → Deploy to Production  │
│                                                                      │
│  ┌────────────────┐         ┌────────────────┐                     │
│  │ STAGING ENV    │         │ PRODUCTION ENV │                     │
│  ├────────────────┤         ├────────────────┤                     │
│  │ Vercel Deploy  │         │ Vercel Deploy  │                     │
│  │ Automatic      │────────→│ Manual (safe)  │                     │
│  │ Live in 3-5min │         │ Live in 3-5min │                     │
│  └────────────────┘         └────────────────┘                     │
│           │                        │                                │
│           ↓                        ↓                                │
│  Preview URL generated     Production live                         │
│  Posted on PR              Slack notification sent                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Testing Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    TESTING FRAMEWORK                            │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────┐  ┌─────────────────────────────┐ │
│  │    UNIT TESTS            │  │    E2E TESTS                │ │
│  │    (Vitest)              │  │    (Playwright)             │ │
│  ├──────────────────────────┤  ├─────────────────────────────┤ │
│  │                          │  │                             │ │
│  │ Location:                │  │ Location:                   │ │
│  │ lib/**/__tests__/*.test.ts  │ e2e/*.spec.ts               │ │
│  │                          │  │                             │ │
│  │ Environment:             │  │ Environment:                │ │
│  │ JSDOM (fake DOM)         │  │ Real browsers               │ │
│  │                          │  │ - Chrome                    │ │
│  │ Focus:                   │  │ - Firefox                   │ │
│  │ - Functions              │  │ - Safari                    │ │
│  │ - Utilities              │  │ - Mobile (Pixel 5)          │ │
│  │ - Validation             │  │                             │ │
│  │ - Edge cases             │  │ Focus:                      │ │
│  │                          │  │ - User workflows            │ │
│  │ Speed:                   │  │ - Form submission           │ │
│  │ <10 seconds              │  │ - Navigation                │ │
│  │                          │  │ - Protected routes          │ │
│  │ Coverage:                │  │                             │ │
│  │ Line, branch, function   │  │ Speed:                      │ │
│  │ Target: 70%              │  │ 30-60 seconds               │ │
│  │                          │  │                             │ │
│  │ Current: 16 tests        │  │ Current: 10 tests           │ │
│  │ - Auth module (100%)     │  │ - Auth flows                │ │
│  │                          │  │                             │ │
│  └──────────────────────────┘  └─────────────────────────────┘ │
│           │                              │                      │
│           └──────────────┬───────────────┘                      │
│                          │                                      │
│                    ✅ 26 TESTS TOTAL                            │
│                    ✅ 70%+ COVERAGE TARGET                     │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

---

## Build & Security Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│              BUILD & SECURITY CHECKS                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. CODE QUALITY                                            │
│     ┌──────────────────────────────────────────┐           │
│     │ ESLint: Checks code style & best practices │          │
│     │ ✓ No unused variables                    │           │
│     │ ✓ No console.log in production           │           │
│     │ ✓ Consistent naming & formatting         │           │
│     │ ❌ FAILS: Blocks deployment              │           │
│     └──────────────────────────────────────────┘           │
│                    ↓                                        │
│  2. TYPE SAFETY                                            │
│     ┌──────────────────────────────────────────┐           │
│     │ TypeScript: Checks type correctness      │           │
│     │ ✓ No implicit any                        │           │
│     │ ✓ No undefined access                    │           │
│     │ ✓ Correct function signatures            │           │
│     │ ❌ FAILS: Blocks deployment              │           │
│     └──────────────────────────────────────────┘           │
│                    ↓                                        │
│  3. BUILD VERIFICATION                                     │
│     ┌──────────────────────────────────────────┐           │
│     │ Next.js: Builds for production           │           │
│     │ ✓ All dependencies resolved              │           │
│     │ ✓ All pages compile                      │           │
│     │ ✓ Assets optimized                       │           │
│     │ ❌ FAILS: Blocks deployment              │           │
│     └──────────────────────────────────────────┘           │
│                    ↓                                        │
│  4. SECURITY HARDENING                                     │
│     ┌──────────────────────────────────────────┐           │
│     │ Headers Applied to All Responses:        │           │
│     │ • X-Content-Type-Options: nosniff        │           │
│     │ • X-Frame-Options: DENY                  │           │
│     │ • X-XSS-Protection: 1; mode=block        │           │
│     │ • Referrer-Policy: strict-origin-when..  │           │
│     │ • Permissions-Policy: (camera, mic off)  │           │
│     └──────────────────────────────────────────┘           │
│                    ↓                                        │
│         ✅ BUILD SUCCESSFUL & SECURE                       │
│         Ready to Deploy to Production                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Configuration & Environment

```
┌──────────────────────────────────────────────────────────────┐
│              ENVIRONMENT CONFIGURATION                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  DEVELOPMENT                PRODUCTION                       │
│  ┌──────────────────┐      ┌─────────────────────┐         │
│  │ .env.local       │      │ GitHub Secrets      │         │
│  ├──────────────────┤      ├─────────────────────┤         │
│  │ Mock auth: true  │      │ Real Supabase URL   │         │
│  │ Demo mode: true  │      │ Real Anon Key       │         │
│  │ Mock credentials │      │ Vercel Token        │         │
│  └──────────────────┘      │ Slack Webhook       │         │
│           │                 └─────────────────────┘         │
│           │                          │                      │
│           └──────────┬───────────────┘                      │
│                      ↓                                      │
│         ┌────────────────────────┐                          │
│         │  Environment Validation │                          │
│         │  (lib/env.schema.ts)   │                          │
│         ├────────────────────────┤                          │
│         │ Zod Schema             │                          │
│         │ - Validates types      │                          │
│         │ - Checks required vars │                          │
│         │ - Clear error messages │                          │
│         │                        │                          │
│         │ ❌ FAILS: App won't   │                          │
│         │ start (safe)          │                          │
│         └────────────────────────┘                          │
│                      ↓                                      │
│              ✅ VALIDATED & READY                           │
│         Type-safe environment access in app                │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## GitHub Actions Workflow Execution

```
┌────────────────────────────────────────────────────────────────┐
│            WORKFLOW: CI (Lint, Type-check, Build)             │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ TRIGGER: git push origin main (or PR)                         │
│                                                                 │
│ Step 1: Checkout code                                         │
│         $ git checkout <commit>                               │
│                                                                 │
│ Step 2: Setup Node.js environment                             │
│         $ nvm install 18.x                                    │
│         $ nvm install 20.x                                    │
│                                                                 │
│ Step 3: Install dependencies                                  │
│         $ npm ci  ← Exact versions (reproducible)            │
│                                                                 │
│ Step 4: Run ESLint                                            │
│         $ npm run lint                                        │
│         ✅ PASS or ❌ FAIL (blocks deployment)               │
│                                                                 │
│ Step 5: Run TypeScript check                                  │
│         $ npm run type-check                                  │
│         ✅ PASS or ❌ FAIL (blocks deployment)               │
│                                                                 │
│ Step 6: Build for production                                  │
│         $ npm run build                                       │
│         ✅ PASS or ❌ FAIL (blocks deployment)               │
│                                                                 │
│ RESULT: ✅ All checks passed → Next workflows run           │
│         ❌ Any failed → STOP, notify developer             │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Workflow Integration

```
┌─────────────────────────────────────────────────────────────┐
│            ALL WORKFLOWS WORK TOGETHER                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PARALLEL EXECUTION (all at once)                          │
│                                                             │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐       │
│  │ CI         │    │ Test       │    │ E2E        │       │
│  │ (5 min)    │    │ (2 min)    │    │ (10 min)   │       │
│  └────────────┘    └────────────┘    └────────────┘       │
│       │                  │                   │             │
│  Lint/Type/Build     Unit Tests          E2E Tests        │
│       │                  │                   │             │
│       └──────────────────┼───────────────────┘             │
│                          ↓                                 │
│                  ✅ ALL PASS?                             │
│                  (usually 5-10 min)                        │
│                          │                                 │
│        ┌─────────────────┴─────────────────┐              │
│        │                                   │               │
│        ✅ YES                              ❌ NO           │
│        │                                   │               │
│        ↓                                   ↓               │
│  Deploy available           Developer notified            │
│  (automatic staging)        (review errors)               │
│  (manual production)        (fix & push again)            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Test Execution Flow

```
┌─────────────────────────────────────────────────────────────┐
│        UNIT TEST EXECUTION (Vitest)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  $ npm test                                               │
│                                                             │
│  1. Setup                                                 │
│     ├─ Load vitest.setup.ts                              │
│     ├─ Mock Next.js router                               │
│     ├─ Mock environment                                  │
│     └─ Ready for tests                                   │
│                                                             │
│  2. Find tests                                            │
│     ├─ Scan: lib/**/__tests__/*.test.ts                 │
│     └─ Found: 16 test files                             │
│                                                             │
│  3. Execute tests                                         │
│     ├─ Test 1: mockSignIn (valid)      ✅ PASS          │
│     ├─ Test 2: mockSignIn (invalid)    ✅ PASS          │
│     ├─ Test 3: mockSignUp (valid)      ✅ PASS          │
│     ├─ ...                              ✅ PASS          │
│     └─ Test 16: isMockMode             ✅ PASS          │
│                                                             │
│  4. Generate reports                                      │
│     ├─ HTML report (coverage/index.html)                │
│     ├─ JSON report (coverage/coverage.json)             │
│     ├─ LCOV report (coverage/lcov.info)                │
│     └─ Terminal output                                  │
│                                                             │
│  RESULT: 16/16 tests passed ✅                           │
│  Coverage: auth-mock @ 100%                             │
│  Time: 5-10 seconds                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────────┐
│           DEPLOYMENT STRATEGY (Two-stage)                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  STAGE 1: STAGING (Automatic on main merge)                │
│  ┌────────────────────────────────────────────────────┐    │
│  │ git push main → All CI/CD pass                     │    │
│  │       ↓                                             │    │
│  │ Automatic Deploy to Staging                        │    │
│  │       ↓                                             │    │
│  │ Preview URL: staging-neu-rafiki.vercel.app        │    │
│  │ PR Comment: "🚀 Deployed to staging: <URL>"       │    │
│  │ Live: 3-5 minutes after push                       │    │
│  │                                                     │    │
│  │ SAFE: Can test before going live                  │    │
│  │ Slack: Deployment notification sent               │    │
│  └────────────────────────────────────────────────────┘    │
│                       ↓                                      │
│  STAGE 2: PRODUCTION (Manual approval)                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Manual Deploy Option 1:                            │    │
│  │ GitHub Actions tab → Deploy → Run workflow         │    │
│  │       ↓                                             │    │
│  │ Manual Deploy Option 2:                            │    │
│  │ Merge main → See staging works                     │    │
│  │       ↓ (after verification)                       │    │
│  │ GitHub Actions → Deploy → Production               │    │
│  │       ↓                                             │    │
│  │ Deploy to Production                               │    │
│  │ URL: neu-rafiki.vercel.app (real domain)          │    │
│  │ Live: 3-5 minutes after approval                   │    │
│  │                                                     │    │
│  │ SAFE: Requires manual approval                    │    │
│  │ Verified: Staging tested first                    │    │
│  │ Slack: Production deployment notification         │    │
│  └────────────────────────────────────────────────────┘    │
│                       ↓                                      │
│             ✅ LIVE IN PRODUCTION                          │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│         ERROR DETECTION & NOTIFICATION                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CODE ERROR → CI CATCHES IT                               │
│                                                             │
│  Scenario: Developer has TypeScript error                 │
│  ┌──────────────────────────────────────┐                │
│  │ $ npm run type-check                 │                │
│  │ Error: Property 'xxx' does not exist │                │
│  └──────────────────────────────────────┘                │
│           ↓                                               │
│  CI Workflow Stops                                       │
│  ┌──────────────────────────────────────┐                │
│  │ Build FAILS                          │                │
│  │ Deploy BLOCKED                       │                │
│  │ Developer NOTIFIED                   │                │
│  │ PR shows: ❌ Checks FAILED           │                │
│  └──────────────────────────────────────┘                │
│           ↓                                               │
│  Developer Fixes                                         │
│  ┌──────────────────────────────────────┐                │
│  │ $ npm run type-check                 │                │
│  │ ✅ No errors found                   │                │
│  │ $ git push origin main               │                │
│  │ → CI runs again                      │                │
│  └──────────────────────────────────────┘                │
│           ↓                                               │
│  CI Succeeds                                             │
│  ┌──────────────────────────────────────┐                │
│  │ ✅ All checks pass                   │                │
│  │ ✅ Deploy available                  │                │
│  │ ✅ PR can be merged                  │                │
│  └──────────────────────────────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary: End-to-End Flow

```
Developer Code                Build Check
    │                              │
    ├─→ npm run dev              ├─→ npm run lint
    │   (local testing)           ├─→ npm run type-check
    │                              ├─→ npm run build
    │   npm test ←────────────────→ Tests Pass?
    │   (16 tests)                 │
    │                              ├─→ ✅ YES
    │                              │
    └─→ git push main ──────────→ GitHub Actions
                                   │
                         ┌─────────┼─────────┐
                         │         │         │
                      CI Test   E2E Test  Deploy
                         │         │         │
                      ✅ PASS   ✅ PASS   ✅ READY
                         │         │         │
                         └─────────┼─────────┘
                                   │
                         ┌─────────┴─────────┐
                         │                   │
                    Staging (auto)    Production (manual)
                         │                   │
                    ✅ LIVE                ✅ LIVE
                    (3-5 min)              (3-5 min)
```

---

This architecture ensures:

✅ Code quality at every step
✅ Errors caught before deployment
✅ Safe, staged rollout process
✅ Full automation for repetitive tasks
✅ Manual approval for critical decisions
✅ Complete visibility into process
