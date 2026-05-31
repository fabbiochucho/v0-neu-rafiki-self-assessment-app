# NeuRafiki Production Deployment Checklist

## Phase 1: Database & Security (30 minutes)

### 1. Execute SQL Migrations in Supabase Dashboard

Run the following SQL in your Supabase SQL Editor:

**Copy from:** `supabase/002-assessment-features.sql` and `supabase/003-analytics-events.sql`

**Also run:** `supabase/rls-monitor.sql` for security audit tables

**Verify RLS is enabled:**
```sql
SELECT table_name, row_security 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

All tables should show `row_security = YES`.

---

## Phase 2: Environment Variables

Add these to your Vercel project settings (Settings → Environment Variables):

```
NEXT_PUBLIC_ENABLE_EXPORT=true
NEXT_PUBLIC_ENABLE_COMPARE=true
LOGSNAG_API_KEY=<your-logsnag-key>
LOGSNAG_PROJECT=neurafiki-app
```

Add these to GitHub Secrets (Settings → Secrets and variables → Actions):

```
SLACK_SECURITY_WEBHOOK=<your-slack-webhook-url>
SUPABASE_PROJECT_REF=<your-project-ref>
```

---

## Phase 3: Component Integration

### Update Dashboard (optional)
Add ANDA navigation to your dashboard:
```tsx
import { ANDANavigation } from '@/components/anda-navigation'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <ANDANavigation />
      {/* existing content */}
    </div>
  )
}
```

### Add User Feedback Widget
Add to your root layout:
```tsx
import { UserFeedback } from '@/components/user-feedback'

export default function RootLayout() {
  return (
    <html>
      <body>
        {/* existing content */}
        <UserFeedback />
      </body>
    </html>
  )
}
```

---

## Phase 4: Pre-Flight Checks

| Check | Command | Expected |
|-------|---------|----------|
| TypeScript Build | `npm run build` | ✅ Zero errors |
| Supabase RLS | Manual check in SQL | ✅ `row_security = YES` |
| Env Vars | `vercel env list` | ✅ All vars present |
| Middleware | Visit `/admin/analytics` as non-admin | ✅ Redirects to `/unauthorized` |
| Error Boundary | Trigger error in dev | ✅ Fallback UI renders |
| Feature Flags | Toggle in localStorage | ✅ Components appear/disappear |

---

## Phase 5: Deployment Commands

```bash
# 1. Verify everything builds
npm run build

# 2. Commit changes
git add .
git commit -m "feat: production polish - error boundaries, admin analytics, CI gate, monitoring, feedback"

# 3. Push to main (auto-deploys to Vercel)
git push origin main

# 4. Verify deployment
# - Visit https://your-app.vercel.app
# - Login as demo user
# - Test assessment flow → export → results
# - Visit /admin/analytics (should show dashboard)
# - Visit /admin/test as non-admin (should redirect to /unauthorized)
```

---

## Phase 6: Post-Launch Smoke Tests (Day 1)

1. **Auth Flow**
   - Login with demo user ✅
   - Logout ✅
   - Try to access /admin without login → redirects ✅

2. **Assessment Flow**
   - Start assessment ✅
   - Complete assessment ✅
   - View results ✅
   - Export results ✅

3. **Admin Features**
   - Login as admin ✅
   - Visit /admin/analytics ✅
   - See charts rendering ✅
   - View recent events ✅

4. **Error Handling**
   - Verify error boundaries work ✅
   - Check console logs (should not show `[v0]` debug logs) ✅

5. **User Feedback**
   - Click feedback button ✅
   - Submit feedback ✅
   - Verify data in Supabase `user_feedback` table ✅

---

## Phase 7: Monitoring Setup (Post-Deploy)

### Vercel Alerts
1. Go to Vercel Dashboard → Settings → Alerts
2. Enable:
   - Deployment Failure → Email/Slack
   - Error Rate > 5% → Email
   - Response Time > 3s (p95) → Email

### Supabase Monitoring
1. Go to Supabase Dashboard → Settings → Integrations
2. Enable Log Drains to Vercel or Datadog

### GitHub Actions
- CI/CD runs automatically on PR and push
- Security monitor runs daily at midnight & noon UTC

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| RLS errors on export/comparison | Check that Supabase migrations were executed |
| Admin page shows 403 | Verify user has `@neurafiki.africa` email or admin role in metadata |
| Analytics page is empty | Check that `analytics_events` table exists and has data |
| Feedback widget not appearing | Check `user_feedback` table was created |
| Middleware errors | Ensure Supabase credentials are in env vars |

---

## Ready for Production ✅

All components are production-ready. This checklist ensures:
- ✅ Security (RLS policies, admin protection)
- ✅ Monitoring (error boundaries, CI/CD, analytics)
- ✅ User Experience (feedback, clear error messages)
- ✅ Operations (structured logging, audit trails)
