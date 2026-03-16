# NeuRafiki Testing and CI/CD Guide

## Overview

This guide covers the comprehensive testing and CI/CD infrastructure implemented for NeuRafiki.

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run unit tests
npm run test

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests (requires dev server running)
npm run test:e2e

# Run all tests in CI mode
npm run test:ci
```

### Environment Setup

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

For local testing with mock auth:

```bash
NEXT_PUBLIC_MOCK_AUTH=true
```

## Testing Infrastructure

### 1. Unit Tests (Vitest)

**Location**: `**/__tests__/**/*.{test,spec}.ts{x}` or `**/*.{test,spec}.ts{x}`

**Configuration**: `vitest.config.ts`

**Features**:
- JSDOM environment for DOM testing
- Testing Library for React components
- 70%+ code coverage requirements
- Parallel test execution

**Running Tests**:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- auth-mock.test.ts

# Generate coverage report
npm run test:coverage

# View coverage in UI
npm run test:ui
```

**Coverage Requirements**:

```
Statements  : 70%
Branches    : 70%
Functions   : 70%
Lines       : 70%
```

### 2. E2E Tests (Playwright)

**Location**: `e2e/**/*.spec.ts`

**Configuration**: `playwright.config.ts`

**Features**:
- Multi-browser testing (Chrome, Firefox, Safari)
- Mobile device testing
- Video/screenshot capture on failure
- Automatic server startup

**Running Tests**:

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test e2e/auth.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run specific browser
npx playwright test --project=chromium

# Generate HTML report
npx playwright show-report
```

### 3. Type Checking

```bash
# Run TypeScript compiler
npm run type-check
```

### 4. Linting

```bash
# Run ESLint
npm run lint
```

## CI/CD Workflows

### GitHub Actions Workflows

Located in `.github/workflows/`:

#### 1. **ci.yml** - Code Quality Pipeline

Runs on every push and PR:

```
- Lint code (ESLint)
- Type check (TypeScript)
- Build Next.js app
- Test on Node 18.x and 20.x
```

**Triggers**: `push` (main), `pull_request` (main)

**Status Badge**:
```markdown
![CI](https://github.com/fabbiochucho/v0-neu-rafiki-self-assessment-app/workflows/CI/badge.svg)
```

#### 2. **test.yml** - Unit Test Pipeline

Runs on every push and PR:

```
- Run Vitest with coverage
- Upload coverage to Codecov
- Post coverage reports on PR
- Archive test results
```

**Triggers**: `push` (main), `pull_request` (main)

#### 3. **e2e.yml** - E2E Test Pipeline

Runs on push, PR, and daily schedule:

```
- Install Playwright browsers
- Build Next.js app
- Run E2E tests
- Upload test reports
- Test across browsers
```

**Triggers**: 
- `push` (main)
- `pull_request` (main)
- Daily at 2 AM UTC

#### 4. **deploy.yml** - Deployment Pipeline

Deploys to Vercel on successful CI:

```
- Verify all tests pass
- Build and optimize
- Deploy to staging or production
- Notify Slack on success/failure
```

**Manual Deployment**:
1. Go to **Actions** tab
2. Select **Deploy** workflow
3. Click **Run workflow**
4. Choose environment (staging/production)

## Environment Validation

**File**: `lib/env.schema.ts`

Validates all required environment variables at startup:

```typescript
const env = validateEnv() // Throws if validation fails
```

**Required Variables**:
```
NEXT_PUBLIC_SUPABASE_URL        (URL)
NEXT_PUBLIC_SUPABASE_ANON_KEY   (string)
```

**Optional Variables**:
```
NEXT_PUBLIC_MOCK_AUTH           (true/false, default: false)
NEXT_PUBLIC_DEMO_MODE           (true/false, default: false)
NEXT_PUBLIC_DEFAULT_DEMO_ROLE   (string, default: donor)
NODE_ENV                        (development/production/test)
```

## Build Configuration

### next.config.mjs Changes

**Before**:
```javascript
eslint: { ignoreDuringBuilds: true },
typescript: { ignoreBuildErrors: true },
```

**After**:
```javascript
eslint: { ignoreDuringBuilds: false }, // ✅ Fail on lint errors
typescript: { ignoreBuildErrors: false }, // ✅ Fail on type errors
headers: async () => [...], // ✅ Security headers
```

## Security Headers

Configured in `next.config.mjs`:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Package Management

### Pinned Versions

Critical dependencies are pinned to prevent breaking changes:

```json
{
  "@supabase/ssr": "0.4.0",
  "@supabase/supabase-js": "2.39.1",
  "recharts": "2.10.3"
}
```

### Dependency Installation

```bash
# Install exact versions (reproducible builds)
npm ci

# Update to latest compatible versions
npm install
```

## GitHub Secrets Required

For CI/CD to work, add these secrets to your GitHub repository:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Format: `https://xxxxxxxxxxxx.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anonymous key
   - Get from: Supabase Dashboard → Settings → API

3. **VERCEL_TOKEN**
   - Vercel authentication token
   - Get from: Vercel Dashboard → Settings → Tokens

4. **VERCEL_ORG_ID**
   - Your Vercel organization ID
   - Get from: Vercel Dashboard → Settings

5. **VERCEL_PROJECT_ID**
   - Your Vercel project ID
   - Get from: Vercel Dashboard → Project Settings

6. **SLACK_WEBHOOK_URL** (Optional)
   - Slack webhook for deployment notifications
   - Get from: Slack App → Incoming Webhooks

**To Add Secrets**:
1. Go to GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Enter name and value
4. Click **Add secret**

## Test Coverage Goals

### Phase 1: Foundation (70% coverage)
- ✅ Auth module tests
- ✅ Validation schemas
- ✅ Environment validation
- ⏳ Mock auth flows

### Phase 2: Expansion (75% coverage)
- ⏳ UI component tests
- ⏳ API route tests
- ⏳ Server action tests

### Phase 3: Full (85%+ coverage)
- ⏳ Complex logic tests
- ⏳ Edge case tests
- ⏳ Integration tests

## Debugging Tests

### Unit Tests

```bash
# Run with debugging
node --inspect-brk ./node_modules/vitest/vitest.mjs run

# Run specific test in isolation
npm test -- --reporter=verbose auth-mock.test.ts
```

### E2E Tests

```bash
# Run in debug mode (interactive)
npm run test:e2e:debug

# Run with slow motion
npx playwright test --headed --headed-slow-motion=2000

# Keep browser open after test
npx playwright test --headed --setup
```

### Console Logging

Tests can use:
```typescript
console.log('Debug output')  // Shown with --reporter=verbose
test.step('Step name', async () => {}) // Named test steps
```

## Continuous Integration Status

View CI/CD status:

- **Actions Tab**: https://github.com/fabbiochucho/v0-neu-rafiki-self-assessment-app/actions
- **All Workflows**: Shows status of each workflow
- **Pull Requests**: Shows required status checks

## Troubleshooting

### Tests Failing Locally

1. **Clear cache and reinstall**
   ```bash
   rm -rf node_modules .next
   npm install
   ```

2. **Update Playwright browsers**
   ```bash
   npx playwright install --with-deps
   ```

3. **Check environment variables**
   ```bash
   cat .env.local
   ```

### CI Failures

1. Check **Actions** tab for workflow logs
2. Look for failed step details
3. Review artifact uploads (test results, coverage)
4. Check GitHub secrets are set correctly

### E2E Tests Timing Out

1. Increase timeout in `playwright.config.ts`
2. Add explicit waits: `page.waitForSelector()`
3. Use `test.slow()` for slower tests
4. Check server is running: `npm run dev`

### Coverage Not Meeting Goals

1. Generate detailed coverage report
   ```bash
   npm run test:coverage
   open coverage/index.html
   ```

2. Identify uncovered files
3. Add tests for critical paths
4. Use `/* c8 ignore next */` to skip non-critical code

## Next Steps

1. **Phase 2**: Add more unit tests (70%+ coverage on all modules)
2. **Phase 3**: Add security tests and performance benchmarks
3. **Phase 4**: Add visual regression tests
4. **Phase 5**: Set up continuous monitoring and alerting

## References

- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Build & Test Guide](https://nextjs.org/docs/testing)
