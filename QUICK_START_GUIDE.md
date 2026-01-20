# NeuRafiki - Quick Start Guide for Development Team

## Getting Started (First Time)

### Prerequisites
- Node.js 18+
- npm or pnpm package manager
- Supabase account (already configured)
- Git access to repository

### Initial Setup

```bash
# 1. Clone the repository
git clone https://github.com/fabbiochucho/v0-neu-rafiki-self-assessment-app.git
cd v0-neu-rafiki-self-assessment-app

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
# Copy .env.example to .env.local
cp .env.example .env.local

# 4. Run database migrations (if not already done)
# Instructions in DEPLOYMENT_GUIDE.md

# 5. Start development server
pnpm dev

# 6. Open in browser
# Navigate to http://localhost:3000
```

---

## Project Structure

```
├── app/                          # Next.js app router pages
│   ├── auth/                    # Authentication pages
│   ├── assessment/              # Assessment flow pages
│   ├── dashboard/               # User dashboard
│   ├── admin/                   # Institutional features
│   ├── support/                 # Support resources
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── assessment/              # Assessment components
│   ├── form/                    # Form components
│   └── profiles/                # Profile components
├── lib/                         # Utilities and helpers
│   ├── supabase/                # Supabase client setup
│   ├── validation/              # Zod validation schemas
│   ├── utils/                   # Utility functions
│   └── types/                   # TypeScript types
├── scripts/                     # Database migration scripts
├── public/                      # Static assets
└── styles/                      # Global styles
```

---

## Common Tasks

### Running the Development Server
```bash
pnpm dev
# Server starts at http://localhost:3000
```

### Building for Production
```bash
pnpm build
pnpm start
```

### Running Type Checking
```bash
pnpm tsc --noEmit
```

### Formatting Code
```bash
pnpm format
```

### Running Linting
```bash
pnpm lint
```

---

## Key Features & How to Test

### 1. Assessment Flow
1. Go to `/auth/sign-up` - Create account
2. Go to `/dashboard` - View dashboard
3. Click "Start Assessment" - Begin assessment
4. Answer 10-15 sample questions
5. View results at `/assessment/[id]/results`

### 2. Multi-Profile Support
1. In dashboard, navigate to "Profiles"
2. Click "Create New Profile"
3. Fill in profile details
4. Save and select for assessment

### 3. Institutional Features
1. Create account with "Organization" type
2. Go to `/admin/institutional-dashboard`
3. View team metrics and member management
4. Invite team members via email
5. Enroll participants via CSV

### 4. Resource Directory
1. Go to `/support/resources`
2. Filter by category, country, service type
3. View contact information
4. Click to call, email, or visit website

### 5. Assessment Results
1. Complete an assessment
2. View detailed results page with:
   - Domain scores
   - Risk level distribution
   - Interactive charts
   - Personalized recommendations

---

## Database Operations

### Viewing Database Data
Use Supabase dashboard:
1. Go to https://app.supabase.com
2. Select your project
3. Navigate to "Table Editor"
4. Browse tables

### Running a Database Migration
```bash
# View available migrations
ls scripts/

# Run a specific migration via Supabase SQL Editor
# Copy script content and execute in Supabase console
```

### Checking RLS Policies
1. In Supabase dashboard
2. Go to Authentication > Policies
3. Review Row Level Security settings

---

## Common Issues & Solutions

### Issue: "Tenant or user not found" error
**Solution**: 
- Check Supabase RLS policies are correct
- Verify authentication token is valid
- Ensure user is logged in

### Issue: "Cannot find module" error
**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: CSS styles not loading
**Solution**:
- Rebuild CSS: `pnpm dev`
- Clear cache: `.next` folder
- Check Tailwind configuration

### Issue: Database connection fails
**Solution**:
1. Verify Supabase URL in .env.local
2. Check Supabase anon key
3. Verify network connectivity
4. Test with Supabase SQL editor

---

## Useful Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run linting |
| `pnpm format` | Format code |
| `pnpm type-check` | Run TypeScript check |
| `pnpm test` | Run tests (when available) |

---

## Environment Variables

Required variables in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]

# Database
POSTGRES_URL=postgresql://...
POSTGRES_PRISMA_URL=postgresql://...

# Optional
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

---

## Code Style & Conventions

### TypeScript
- Use `interface` for component props
- Type all function parameters
- Use `as const` for literal types
- Avoid `any` type

### Component Structure
```tsx
// Prefer this structure:
interface MyComponentProps {
  title: string
  onAction: () => void
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return <div>{title}</div>
}
```

### Validation
- Use Zod for form validation
- Define schemas in `lib/validation/forms.ts`
- Import and use in components

### Database Operations
- Use Supabase client from `lib/supabase/client.ts` (browser)
- Use Supabase server from `lib/supabase/server.ts` (server)
- Always handle errors with try-catch
- Use proper TypeScript types

---

## Testing the Full Flow

### Complete Assessment Walkthrough
1. Open http://localhost:3000
2. Sign up with test email
3. Verify email (or skip in dev)
4. Create test profile
5. Start assessment
6. Answer 5+ questions
7. Complete assessment
8. View results with charts
9. Download/export results
10. Schedule follow-up

### Admin Flow
1. Sign up with organization account type
2. Access `/admin/institutional-dashboard`
3. View metrics and member management
4. Create team members
5. Enroll participants via CSV
6. View reports and analytics

---

## Debugging Tips

### View Console Logs
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for `[v0]` prefixed messages

### Check Network Requests
1. In DevTools, go to Network tab
2. Filter by XHR/Fetch
3. Check status codes and response payloads

### Database Query Debugging
1. Check Supabase logs
2. Use browser DevTools Network tab
3. Add console.log statements in code

### Performance Profiling
1. In DevTools, go to Performance tab
2. Record and check for bottlenecks
3. Look for long tasks and slow renders

---

## Deployment Checklist

Before deploying to production:
- [ ] Run `pnpm build` successfully
- [ ] No TypeScript errors: `pnpm tsc --noEmit`
- [ ] All tests pass
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Security audit passed
- [ ] Performance tested

---

## Getting Help

### Documentation
- **Architecture**: See `COMPREHENSIVE_PROJECT_ASSESSMENT.md`
- **Requirements**: See `PRODUCT_REQUIREMENTS_DOCUMENT.md`
- **Deployment**: See `DEPLOYMENT_GUIDE.md`
- **Checklist**: See `LAUNCH_READINESS_CHECKLIST.md`

### Common Questions
- **How does authentication work?**: Check `lib/supabase/server.ts`
- **How are results calculated?**: Check `components/assessment/assessment-questions.tsx`
- **How is data structured?**: Check database schema in Supabase
- **How are forms validated?**: Check `lib/validation/forms.ts`

### Team Resources
- **Code Review Guidelines**: See `.github/PULL_REQUEST_TEMPLATE.md`
- **Contributing**: See `CONTRIBUTING.md`
- **Issue Templates**: See `.github/ISSUE_TEMPLATE/`

---

## Quick Reference

### Assessment Flow Files
- Start: `app/assessment/start/page.tsx`
- Questions: `components/assessment/assessment-questions.tsx`
- Results: `app/assessment/[id]/results/page.tsx`

### Dashboard Files
- User Dashboard: `app/dashboard/page.tsx`
- Admin Dashboard: `app/admin/institutional-dashboard/page.tsx`
- Analytics: `app/admin/analytics/page.tsx`

### Utility Files
- Validation: `lib/validation/forms.ts`
- Analytics: `lib/utils/analytics.ts`
- Supabase: `lib/supabase/client.ts`, `lib/supabase/server.ts`

---

## Tips for New Developers

1. **Start small**: Make one small change and test thoroughly
2. **Use TypeScript**: Let the type system guide you
3. **Read existing code**: Pattern matching helps
4. **Test locally first**: Always test before pushing
5. **Check the docs**: Most answers are in documentation
6. **Use DevTools**: Browser DevTools are your friend
7. **Ask questions**: Team is here to help

---

## Performance Tips

### Client-Side
- Use `React.memo` for expensive components
- Lazy load images with Next.js Image component
- Code-split pages with dynamic imports
- Minimize re-renders with proper state management

### Server-Side
- Use database indexes for common queries
- Cache frequently accessed data
- Optimize database queries (use indexes)
- Use pagination for large datasets

### Network
- Minimize bundle size
- Enable gzip compression
- Use CDN for static assets
- Implement request caching

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Maintained By**: NeuRafiki Development Team

For questions, contact the development team or refer to comprehensive documentation.
