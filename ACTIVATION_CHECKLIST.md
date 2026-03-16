# 🚀 Phase 1 Activation Checklist

## Before You Deploy - Complete These Steps

### Step 1: Verify Local Setup ✅

```bash
# Check Node version (needs 18.x or 20.x)
node --version

# Install dependencies
npm install

# Verify all tests pass locally
npm run type-check
npm run lint
npm run build
npm test
npm run test:e2e
```

**Expected Output**:
- ✅ Build succeeds
- ✅ No TypeScript errors
- ✅ No ESLint violations
- ✅ 16 unit tests pass
- ✅ 10 E2E tests pass

### Step 2: Set Environment Variables ✅

**Option A: For Production (Real Supabase)**

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local with your real values
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-real-anon-key
```

**Option B: For Testing (Mock Auth)**

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local with mock auth
NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-key
NEXT_PUBLIC_MOCK_AUTH=true
```

### Step 3: Configure GitHub Secrets ✅

**Go to**: GitHub Repository → Settings → Secrets and variables → Actions

**Add These 6 Secrets** (Required):

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Get from: Supabase Dashboard → Settings → API → Project URL
   - Example: `https://xxxxxxxxxxxxx.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Get from: Supabase Dashboard → Settings → API → Anon key
   - Example: `eyJhbGciOiJIUzI1NiIsInR5c...`

3. **VERCEL_TOKEN**
   - Get from: Vercel Dashboard → Settings → Tokens → Create
   - Create new token with scope: `full`

4. **VERCEL_ORG_ID**
   - Get from: Vercel Dashboard → Settings → Account
   - Your organization/personal account ID

5. **VERCEL_PROJECT_ID**
   - Get from: Vercel Dashboard → Project Settings → General
   - Copy Project ID field

6. **SLACK_WEBHOOK_URL** (Optional)
   - Get from: Slack → Custom Integrations → Incoming Webhooks
   - Only needed if you want Slack notifications

**How to Add**:
1. Click "New repository secret"
2. Enter Name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
3. Paste Value
4. Click "Add secret"
5. Repeat for all 6 secrets

### Step 4: Test GitHub Workflows ✅

**Option A: Push to Main Branch**

```bash
# Commit and push (this will trigger all workflows)
git add .
git commit -m "feat: activate Phase 1 CI/CD infrastructure"
git push origin main
```

**Option B: Create Pull Request**

```bash
# Create feature branch
git checkout -b test/cicd-setup
git add .
git commit -m "test: activate Phase 1 CI/CD"
git push origin test/cicd-setup

# Create PR on GitHub
# Click "Pull requests" → "New pull request"
# Check that workflows run automatically
```

### Step 5: Verify Workflows Run ✅

**Check GitHub Actions Tab**:

1. Go to **Actions** tab on GitHub
2. You should see 4 workflows:
   - ✅ CI (Lint, Type, Build)
   - ✅ Unit Tests (Vitest, Coverage)
   - ✅ E2E Tests (Playwright)
   - ✅ Deploy (Vercel)

3. Click each workflow to verify:
   - ✅ Green checkmark = PASSING
   - ✅ Red X = FAILING (needs fix)

**Expected Status**:
- CI: ✅ PASSING
- Unit Tests: ✅ PASSING
- E2E Tests: ✅ PASSING
- Deploy: ✅ READY (manual)

### Step 6: Test Deployment (Optional) ✅

**Manual Deploy to Staging**:

1. Go to **Actions** tab
2. Select **Deploy** workflow
3. Click **Run workflow**
4. Choose `staging` from dropdown
5. Click **Run**
6. Watch deployment in Actions tab
7. Check Vercel for deployment URL

**Or Merge to Main** (automatic staging deploy)

---

## Verification Tests

### Local Test Suite

Run locally to verify everything:

```bash
# All checks (simulates CI)
npm run test:ci

# Or individually:
npm run lint              # ✅ No lint errors
npm run type-check        # ✅ No type errors
npm run build             # ✅ Build succeeds
npm test                  # ✅ Unit tests pass
npm run test:e2e          # ✅ E2E tests pass
```

### GitHub Workflow Checks

Wait for workflows to complete (5-10 minutes):

1. ✅ CI workflow passes (lint, type, build)
2. ✅ Test workflow passes (unit tests, coverage)
3. ✅ E2E workflow passes (browser tests)
4. ✅ Deploy workflow ready

---

## Troubleshooting

### Workflows Not Running?

**Problem**: Actions tab shows no workflows

**Solution**:
1. Check GitHub Actions is enabled
   - Go to: Settings → Actions → Allow all actions
2. Check branch is `main` (not `develop` or `master`)
3. Verify secrets are set
4. Try pushing to main again

### Secrets Not Working?

**Problem**: Workflows fail with "missing secret"

**Solution**:
1. Go to: Settings → Secrets and variables → Actions
2. Verify all 6 secrets are present
3. Check spelling is exact (case-sensitive)
4. Verify values are not empty
5. Restart workflow: Actions tab → re-run

### Tests Failing Locally?

**Problem**: `npm test` shows failures

**Solution**:
```bash
# Clear cache
rm -rf .next node_modules coverage

# Reinstall
npm install

# Try again
npm test

# If still failing, check .env.local has Supabase credentials
cat .env.local
```

### Build Failures?

**Problem**: `npm run build` fails

**Solution**:
```bash
# Check types
npm run type-check

# Check lint
npm run lint -- --fix

# Try build again
npm run build
```

---

## Post-Activation

### After Workflows Pass ✅

1. **Code is automatically tested** on every PR
2. **Deployments are automatic** when merging to main
3. **Coverage is tracked** with each test run
4. **Security headers are enforced** on all responses

### Ongoing Maintenance

**Weekly**:
- Monitor test coverage (target: 70%+)
- Review failing tests
- Update dependencies if needed

**Monthly**:
- Review security headers
- Check Codecov reports
- Plan Phase 2 expansion

---

## Success Criteria

### All These Should Be True ✅

| Item | Status |
|------|--------|
| Environment variables set | ✅ |
| GitHub secrets configured | ✅ |
| All 4 workflows visible in Actions | ✅ |
| CI workflow passing | ✅ |
| Test workflow passing | ✅ |
| E2E workflow passing | ✅ |
| Deploy workflow ready | ✅ |
| Local tests pass | ✅ |
| Build succeeds locally | ✅ |
| No TypeScript errors | ✅ |
| No ESLint violations | ✅ |

**If all checked** → **Phase 1 is ACTIVATED** ✅

---

## Next Steps: Phase 2

Once Phase 1 is activated, Phase 2 includes:

1. **Expand unit tests** (target: 70%+ coverage)
2. **Add component tests** for UI components
3. **Test API routes** and server actions
4. **E2E test edge cases** and error scenarios
5. **Performance benchmarks** and monitoring

---

## Quick Reference

### Common Commands (After Activation)

```bash
npm run dev              # Local development
npm test                 # Run tests
npm run test:coverage    # See coverage
npm run build            # Build for production
npm run lint -- --fix    # Fix lint issues
npm run type-check       # Check types
```

### GitHub Workflow Links

After activation, visit these links:

- **Workflows**: `https://github.com/fabbiochucho/v0-neu-rafiki-self-assessment-app/actions`
- **Coverage**: `https://app.codecov.io/gh/fabbiochucho/v0-neu-rafiki-self-assessment-app`
- **Vercel Deploys**: `https://vercel.com/your-org/v0-neu-rafiki`

---

## Support

### If Something Goes Wrong

1. **Check logs**: GitHub Actions tab → click failed workflow
2. **Read guide**: `TESTING_AND_CI_CD_GUIDE.md`
3. **Quick ref**: `DEVELOPER_QUICK_REFERENCE.md`
4. **Detailed plan**: `IMPLEMENTATION_ROADMAP.md`

---

## Checklist Summary

- ⬜ Step 1: Verify local setup
- ⬜ Step 2: Set environment variables
- ⬜ Step 3: Configure GitHub secrets (6 required)
- ⬜ Step 4: Test GitHub workflows
- ⬜ Step 5: Verify workflows run
- ⬜ Step 6: Test deployment (optional)

**Once all steps complete** → Phase 1 is LIVE ✅

---

**Estimated Time to Complete**: 15-20 minutes

**Ready to activate?** Start with Step 1! 🚀
