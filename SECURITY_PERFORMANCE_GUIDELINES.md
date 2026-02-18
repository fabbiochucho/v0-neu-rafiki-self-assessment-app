# NeuRafiki: Security & Performance Best Practices Guide

## Part 1: Security Guidelines

### 1.1 Authentication & Authorization

#### Password Security
```typescript
// lib/auth/password-validation.ts
import bcrypt from 'bcrypt'

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Password requirements
export const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`At least ${PASSWORD_REQUIREMENTS.minLength} characters`)
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('At least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('At least one lowercase letter')
  }
  if (!/\d/.test(password)) {
    errors.push('At least one number')
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('At least one special character (!@#$%^&*)')
  }
  
  return { valid: errors.length === 0, errors }
}
```

#### Session Management
```typescript
// lib/auth/session-management.ts
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000 // 24 hours
const ABSOLUTE_SESSION_LIMIT = 7 * 24 * 60 * 60 * 1000 // 7 days

export const sessionConfig = {
  timeout: SESSION_TIMEOUT,
  absoluteLimit: ABSOLUTE_SESSION_LIMIT,
  refreshThreshold: 60 * 60 * 1000, // Refresh if < 1 hour remaining
  maxActiveSessions: 3, // Max concurrent sessions per user
}

// Middleware to check session validity
export async function validateSession(token: string) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!)
    const createdAt = payload.iat as number
    const now = Math.floor(Date.now() / 1000)
    
    // Check absolute session limit
    if (now - createdAt > sessionConfig.absoluteLimit / 1000) {
      throw new Error('Session expired (absolute limit)')
    }
    
    return { valid: true, payload }
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : 'Invalid token' }
  }
}
```

#### JWT Best Practices
```typescript
// lib/auth/jwt.ts
import jwt from 'jsonwebtoken'

export interface TokenPayload {
  sub: string // User ID
  email: string
  iat: number // Issued at
  exp: number // Expiration
  aud: 'neurafiki-web' | 'neurafiki-mobile'
}

export function generateToken(userId: string, email: string, expiresIn = '24h'): string {
  return jwt.sign(
    {
      sub: userId,
      email,
      aud: 'neurafiki-web',
    },
    process.env.JWT_SECRET!,
    { expiresIn, algorithm: 'HS256' }
  )
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!, {
      audience: 'neurafiki-web',
    }) as TokenPayload
  } catch (error) {
    console.error('[Security] JWT verification failed:', error)
    return null
  }
}
```

### 1.2 Data Protection

#### Encryption at Rest
```typescript
// lib/encryption.ts
import crypto from 'crypto'

const algorithm = 'aes-256-gcm'
const saltLength = 64
const tagLength = 16
const iterations = 100000

export function encryptData(data: string, password: string): string {
  const salt = crypto.randomBytes(saltLength)
  const iv = crypto.randomBytes(16)
  
  // Derive key from password
  const key = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256')
  
  // Encrypt
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const tag = cipher.getAuthTag()
  
  // Return salt + iv + tag + encrypted data
  return [salt, iv, tag, encrypted].map(b => (typeof b === 'string' ? b : b.toString('hex'))).join(':')
}

export function decryptData(encryptedData: string, password: string): string {
  const parts = encryptedData.split(':')
  const salt = Buffer.from(parts[0], 'hex')
  const iv = Buffer.from(parts[1], 'hex')
  const tag = Buffer.from(parts[2], 'hex')
  const encrypted = parts[3]
  
  // Derive key
  const key = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256')
  
  // Decrypt
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  decipher.setAuthTag(tag)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}
```

#### PII Handling
```typescript
// lib/pii-handling.ts
export const PII_FIELDS = [
  'email',
  'full_name',
  'phone_number',
  'date_of_birth',
  'address',
  'medical_history',
]

export function isSensitiveField(fieldName: string): boolean {
  return PII_FIELDS.includes(fieldName)
}

export function sanitizeLogs(data: any): any {
  if (!data || typeof data !== 'object') return data
  
  const sanitized = { ...data }
  
  for (const field of PII_FIELDS) {
    if (field in sanitized) {
      sanitized[field] = `[REDACTED_${field.toUpperCase()}]`
    }
  }
  
  return sanitized
}

// Usage in error logging
export function logError(error: Error, context: any) {
  console.error('[Error]', {
    message: error.message,
    stack: error.stack,
    context: sanitizeLogs(context),
  })
}
```

### 1.3 API Security

#### Input Validation & Sanitization
```typescript
// lib/validation/api-input.ts
import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

// Sanitize HTML input
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html)
}

// Validate assessment response
export const assessmentResponseSchema = z.object({
  assessment_id: z.string().uuid(),
  question_id: z.string().uuid(),
  response: z.number().min(1).max(5), // Likert scale
})

// Validate resource search
export const resourceSearchSchema = z.object({
  query: z.string().max(100).optional(),
  country: z.string().max(50).optional(),
  service_type: z.enum(['therapy', 'education', 'community']).optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
})

// API route example
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = assessmentResponseSchema.parse(body)
    
    // Process validated data
    return Response.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
```

#### CORS Configuration
```typescript
// lib/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true',
}

// Middleware
export function withCORS(handler: Function) {
  return async (req: Request) => {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }
    
    const response = await handler(req)
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  }
}
```

#### Rate Limiting
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const rateLimiters = {
  // 5 login attempts per 15 minutes
  login: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    analytics: true,
    prefix: 'ratelimit:login',
  }),
  
  // 3 password reset requests per 1 hour
  passwordReset: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    analytics: true,
    prefix: 'ratelimit:password-reset',
  }),
  
  // 100 API requests per 1 minute per user
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
    prefix: 'ratelimit:api',
  }),
}

// Usage in API routes
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  
  try {
    const { success } = await rateLimiters.login.limit(ip)
    
    if (!success) {
      return Response.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Process login
  } catch (error) {
    console.error('Rate limit error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
```

### 1.4 Database Security

#### Row-Level Security (RLS) Policies
```sql
-- profiles table - users can only see their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- assessments table - users can see own assessments and family member assessments
CREATE POLICY "Users can view own assessments"
  ON assessments FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM user_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- resources table - public read, admin write
CREATE POLICY "Anyone can view resources"
  ON resources FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify resources"
  ON resources FOR UPDATE, DELETE
  USING (auth.jwt() ->> 'role' = 'admin');
```

#### Query Protection
```typescript
// lib/db/safe-queries.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Server-side only
)

// Parameterized queries (already handled by Supabase client)
export async function getUserAssessments(userId: string) {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', userId) // Parameterized by Supabase
  
  if (error) throw error
  return data
}

// NEVER use string concatenation for queries
// ❌ BAD: `SELECT * FROM assessments WHERE user_id = '${userId}'`
// ✅ GOOD: `.eq('user_id', userId)`
```

### 1.5 Security Headers

```typescript
// next.config.mjs
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.vercel-insights.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.supabase.co https://cdn.vercel-insights.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(), microphone=(), camera=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
]

export default {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

---

## Part 2: Performance Guidelines

### 2.1 Frontend Optimization

#### Code Splitting & Lazy Loading
```typescript
// app/admin/page.tsx
import dynamic from 'next/dynamic'

// Lazy load admin analytics component
const AdminAnalytics = dynamic(() => import('@/components/admin/analytics'), {
  loading: () => <div>Loading analytics...</div>,
  ssr: false, // Don't server-render admin components
})

// Use in component
export default function AdminPage() {
  return (
    <div>
      <AdminAnalytics />
    </div>
  )
}
```

#### Image Optimization
```typescript
// components/profile-image.tsx
import Image from 'next/image'

export function ProfileImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={128}
      height={128}
      quality={85} // Reduce quality slightly
      placeholder="blur" // Blur while loading
      blurDataURL="data:image/svg+xml,%3Csvg..."
      loading="lazy" // Lazy load images
      priority={false} // Only set true for LCP images
    />
  )
}
```

#### Bundle Size Analysis
```bash
# Analyze bundle size
npm install --save-dev @next/bundle-analyzer

# next.config.mjs
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer({
  // ... rest of config
})

# Run analysis
ANALYZE=true npm run build
```

### 2.2 Database Optimization

#### Query Optimization
```typescript
// ❌ Inefficient: N+1 query problem
export async function getUserAssessmentsWithResults(userId: string) {
  const assessments = await db
    .from('assessments')
    .select('*')
    .eq('user_id', userId)
  
  // For each assessment, fetch results separately (slow!)
  const withResults = await Promise.all(
    assessments.map(async (assessment) => ({
      ...assessment,
      results: await db
        .from('assessment_responses')
        .select('*')
        .eq('assessment_id', assessment.id),
    }))
  )
  
  return withResults
}

// ✅ Efficient: Join in single query
export async function getUserAssessmentsWithResults(userId: string) {
  const assessments = await db
    .from('assessments')
    .select(`
      *,
      assessment_responses (*)
    `)
    .eq('user_id', userId)
  
  return assessments
}
```

#### Indexing Strategy
```sql
-- Create indexes on frequently queried columns
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX idx_assessment_responses_assessment_id ON assessment_responses(assessment_id);
CREATE INDEX idx_resources_country ON resources(country);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);

-- Composite indexes for common filters
CREATE INDEX idx_assessments_user_status ON assessments(user_id, status);
CREATE INDEX idx_resources_country_type ON resources(country, service_type);
```

#### Connection Pooling
```typescript
// lib/db/client.ts - Already handled by Supabase
// Supabase manages connection pooling automatically
// No additional configuration needed
```

### 2.3 API Optimization

#### Caching Strategy
```typescript
// lib/cache.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function getCachedData(key: string, fetcher: () => Promise<any>, ttl = 3600) {
  // Check cache
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached as string)
  
  // Fetch fresh data
  const data = await fetcher()
  
  // Store in cache
  await redis.setex(key, ttl, JSON.stringify(data))
  
  return data
}

// Usage
export async function getResourceDirectory() {
  return getCachedData(
    'resources:directory',
    async () => {
      return await supabase.from('resources').select('*')
    },
    3600 // Cache for 1 hour
  )
}
```

#### API Route Structure
```typescript
// app/api/assessments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { rateLimiters } from '@/lib/rate-limit'
import { validateSession } from '@/lib/auth/session-management'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check rate limit
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const { success } = await rateLimiters.api.limit(ip)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }
    
    // Validate session
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const session = validateSession(token)
    if (!session.valid) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }
    
    // Fetch data with caching
    const data = await getCachedData(
      `assessment:${params.id}`,
      async () => {
        return await supabase
          .from('assessments')
          .select('*')
          .eq('id', params.id)
          .single()
      }
    )
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('[API Error]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

### 2.4 Monitoring & Metrics

#### Performance Monitoring
```typescript
// lib/monitoring.ts
import { Analytics } from '@vercel/analytics'

// Track Core Web Vitals
export function trackWebVitals() {
  if (typeof window === 'undefined') return
  
  // First Contentful Paint
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('[FCP]', entry.startTime)
      Analytics?.track('fcp', { value: entry.startTime })
    }
  }).observe({ type: 'paint', buffered: true })
  
  // Largest Contentful Paint
  new PerformanceObserver((list) => {
    const lastEntry = list.getEntries()[list.getEntries().length - 1]
    console.log('[LCP]', lastEntry.startTime)
    Analytics?.track('lcp', { value: lastEntry.startTime })
  }).observe({ type: 'largest-contentful-paint', buffered: true })
  
  // Cumulative Layout Shift
  let clsValue = 0
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value
        console.log('[CLS]', clsValue)
        Analytics?.track('cls', { value: clsValue })
      }
    }
  }).observe({ type: 'layout-shift', buffered: true })
}

// Call in app layout
trackWebVitals()
```

#### Error Tracking
```typescript
// lib/error-tracking.ts
import * as Sentry from '@sentry/nextjs'

export function initSentry() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    integrations: [
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    replaySessionSampleRate: 0.1,
    replayOnErrorSampleRate: 1.0,
  })
}

// Usage
export function captureException(error: Error, context: any = {}) {
  Sentry.captureException(error, {
    contexts: { app: context },
  })
}
```

---

## Security Checklist (Before Launch)

- [ ] All secrets removed from code and in environment variables
- [ ] Passwords hashed with bcrypt (12+ rounds)
- [ ] HTTPS enforced (Vercel handles this)
- [ ] Security headers configured and tested
- [ ] CORS properly configured
- [ ] Rate limiting on all sensitive endpoints
- [ ] Input validation with Zod on all API endpoints
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (sanitize HTML, use React's automatic escaping)
- [ ] CSRF tokens on form submissions
- [ ] Session timeout configured (24 hours)
- [ ] Database RLS policies enabled
- [ ] Encryption at rest for sensitive data
- [ ] Regular dependency updates (npm audit)
- [ ] No console.log of sensitive data
- [ ] Privacy policy and terms updated
- [ ] GDPR/NDPR compliance verified
- [ ] Penetration testing completed

---

## Performance Checklist (Before Launch)

- [ ] Lighthouse score > 85 (mobile)
- [ ] First Contentful Paint < 2 seconds
- [ ] Largest Contentful Paint < 2.5 seconds
- [ ] Cumulative Layout Shift < 0.1
- [ ] Total Bundle Size < 400KB (gzipped)
- [ ] Code splitting implemented for large features
- [ ] Images optimized (WebP, proper sizing)
- [ ] Caching headers configured
- [ ] CDN distribution verified
- [ ] Database queries < 100ms (p95)
- [ ] API responses < 200ms (p95)
- [ ] Load testing completed (1000+ concurrent users)
- [ ] Database indexes optimized
- [ ] Monitoring and alerting configured
- [ ] Error tracking set up (Sentry)
- [ ] Analytics tracking configured
