# NeuRafiki - Developer Quick Reference

## Quick Commands

### Development

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm run start            # Run production build
npm run lint             # Check code style
npm run type-check       # Check TypeScript types
npm run format           # Format code with Prettier
```

### Testing

```bash
npm test                 # Run tests (watch mode)
npm run test:coverage    # See what's tested
npm run test:ui          # Open test dashboard
npm run test:e2e         # Test user flows
npm run test:ci          # Full CI suite (local)
```

---

## Before Creating Files

### Create Tests First

For any new feature, create tests:

```bash
# Unit test
touch lib/my-module/__tests__/my-module.test.ts

# Component test
touch components/__tests__/MyComponent.test.tsx

# E2E test
touch e2e/my-feature.spec.ts
```

### Environment Setup

```bash
# Copy example env file
cp .env.example .env.local

# For local testing with mock auth
echo "NEXT_PUBLIC_MOCK_AUTH=true" >> .env.local
```

---

## Code Quality Gates

All of these must pass before deploying:

- ✅ **ESLint** - Code style `npm run lint`
- ✅ **TypeScript** - Type safety `npm run type-check`
- ✅ **Build** - Production build `npm run build`
- ✅ **Unit Tests** - 70%+ coverage `npm test`
- ✅ **E2E Tests** - User flows `npm run test:e2e`
- ✅ **Security** - Headers, validation, CORS

---

## File Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page
├── auth/
│   ├── login/
│   ├── sign-up/
│   └── sign-up-success/
├── dashboard/
├── admin/
└── api/

components/
├── ui/                     # Reusable UI (button, card, etc.)
├── demo/                   # Demo mode components
└── assessment/             # Feature components

lib/
├── auth/
│   ├── useAuth.ts         # Auth hook
│   ├── mockAuth.ts        # Mock auth (dev/preview)
│   └── __tests__/         # Auth tests
├── supabase/
│   ├── client.ts
│   └── server.ts
├── env.schema.ts          # Environment validation
└── auth-mock.ts

e2e/
└── auth.spec.ts           # E2E tests

.github/workflows/
├── ci.yml                 # Lint, type-check, build
├── test.yml               # Unit tests, coverage
├── e2e.yml                # E2E tests, browsers
└── deploy.yml             # Deploy to Vercel
```

---

## Writing Tests

### Unit Test Example

```typescript
// lib/my-module/__tests__/my-module.test.ts
import { describe, it, expect } from 'vitest'
import { myFunction } from '../my-module'

describe('myFunction', () => {
  it('should return expected value', () => {
    const result = myFunction('input')
    expect(result).toBe('output')
  })

  it('should handle edge cases', () => {
    const result = myFunction('')
    expect(result).toThrow()
  })
})
```

### E2E Test Example

```typescript
// e2e/my-feature.spec.ts
import { test, expect } from '@playwright/test'

test.describe('My Feature', () => {
  test('should work as expected', async ({ page }) => {
    await page.goto('/my-page')
    await page.fill('input[type="text"]', 'Hello')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/success')
  })
})
```

---

## Common Tasks

### Add a New Feature

1. **Create branch**: `git checkout -b feature/my-feature`
2. **Write tests first** (unit + E2E)
3. **Implement feature** to pass tests
4. **Run tests**: `npm run test:ci`
5. **Create PR**: Tests run automatically
6. **Merge when passing**: Deploy automatically

### Fix a Bug

1. **Write failing test** for the bug
2. **Fix code** to make test pass
3. **Verify existing tests** still pass
4. **Create PR** with test + fix

### Check Test Coverage

```bash
npm run test:coverage
open coverage/index.html
```

Look for red/uncovered lines. Add tests for critical paths.

### Debug Tests

```bash
# Unit test debugging
npm test -- --reporter=verbose my-test.ts

# E2E test debugging
npm run test:e2e:debug

# In debug mode, step through tests interactively
```

---

## Environment Variables

### Required for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
```

### For Development/Testing

```env
NEXT_PUBLIC_MOCK_AUTH=true              # Use mock auth
NEXT_PUBLIC_DEMO_MODE=true              # Enable demo
NEXT_PUBLIC_DEFAULT_DEMO_ROLE=donor     # Default role
```

### Get Values From

- **Supabase**: Supabase Dashboard → Settings → API
- **Vercel**: Vercel Dashboard → Project Settings
- **GitHub Secrets**: Repository Settings → Secrets

---

## TypeScript Tips

### Strict Mode Is On

```typescript
// ❌ Will fail
const user = response.data
const email = user.email

// ✅ Will pass
const user = response.data as User
const email = user?.email ?? ''
```

### Types Everywhere

```typescript
// ✅ Good: Explicit types
function validateEmail(email: string): boolean {
  return email.includes('@')
}

// ❌ Bad: Implicit any
function validateEmail(email) {
  return email.includes('@')
}
```

---

## Common Errors & Fixes

### `ESLint error: unused variable`
```bash
# Fix all automatically
npm run lint -- --fix
```

### `TypeScript error: Property 'xxx' does not exist`
```typescript
// Add type annotation
interface User {
  name: string
  email: string
}

const user: User = { name: 'John', email: 'john@example.com' }
```

### `Build fails: Cannot find module`
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

### `E2E test timeout`
```typescript
// Increase timeout
test('slow test', async ({ page }) => {
  // ...
}, { timeout: 60000 }) // 60 seconds
```

---

## Debugging Techniques

### Log in Tests
```typescript
test('my test', async ({ page }) => {
  console.log('Page URL:', page.url())
  console.log('Content:', await page.content())
})
```

### Check Element Visibility
```typescript
const element = page.locator('button')
if (await element.isVisible()) {
  await element.click()
}
```

### Wait for Elements
```typescript
// Wait for element with timeout
await page.waitForSelector('button', { timeout: 5000 })

// Wait for navigation
await page.goto('/login')
await page.click('button')
await page.waitForURL('/dashboard')
```

---

## Deployment

### Automatic (CI/CD)

1. Code passes all tests
2. Create PR to `main`
3. All checks pass automatically
4. Merge to `main`
5. Automatically deploys to production

### Manual (Emergency)

1. Go to GitHub Actions
2. Select "Deploy" workflow
3. Click "Run workflow"
4. Choose environment
5. Click "Run"

---

## Getting Help

### Documentation

- **Testing**: `TESTING_AND_CI_CD_GUIDE.md`
- **Implementation**: `IMPLEMENTATION_ROADMAP.md`
- **Product**: `PRODUCT_REQUIREMENTS_SPECIFICATION.md`
- **Security**: `SECURITY_PERFORMANCE_GUIDELINES.md`

### Logs & Errors

- **Local**: Check terminal output
- **CI**: GitHub Actions tab → Workflow → Step details
- **Deployed**: Vercel Dashboard → Deployments → Logs

### Common Issues

- **Tests failing?** Check `.env.local` has required variables
- **Build failing?** Run `npm run type-check` and `npm run lint`
- **E2E timeout?** Make sure `npm run dev` is running

---

## Standards & Best Practices

### Code Style

```typescript
// ✅ Good
const getUserById = async (id: string): Promise<User> => {
  const response = await fetchUser(id)
  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }
  return response.data
}

// ❌ Bad
const get_user_by_id = function(id) {
  return fetchUser(id).then(r => r.data)
}
```

### Error Handling

```typescript
// ✅ Good
try {
  const user = await validateAndFetchUser(userId)
  return { success: true, user }
} catch (error) {
  console.error('User fetch failed:', error)
  return { success: false, error: error.message }
}

// ❌ Bad
try {
  return await validateAndFetchUser(userId)
} catch {}
```

### Testing

```typescript
// ✅ Good
it('should validate email format correctly', () => {
  expect(validateEmail('test@example.com')).toBe(true)
  expect(validateEmail('invalid')).toBe(false)
})

// ❌ Bad
it('works', () => {
  expect(true).toBe(true)
})
```

---

## Before Committing

```bash
# Format code
npm run format

# Check types
npm run type-check

# Run linter
npm run lint -- --fix

# Run tests
npm test

# Test build
npm run build
```

All should pass ✅ before pushing!

---

## Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vitest Docs](https://vitest.dev)
- [Playwright Docs](https://playwright.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Keep this handy while developing!** 🚀
