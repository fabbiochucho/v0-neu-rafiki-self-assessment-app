# NeuRafiki: Product Requirements Specification (PRD)

## 1. Executive Overview

### Project Vision
**NeuRafiki** is a culturally-adapted, privacy-first digital self-assessment platform for neurodivergent individuals across African communities. It provides accessible screening tools for autism, ADHD, dyslexia, and other neurodivergent conditions, with results that connect users to local support resources.

### Mission Statement
To empower African individuals and families to understand neurodiversity, obtain evidence-based assessments, and access appropriate support—breaking down barriers of stigma, affordability, and cultural misalignment in neurodiversity screening.

### Target Market
- **Primary**: Individuals 18+ in African countries seeking neurodiversity self-assessment
- **Secondary**: Parents/caregivers assessing family members, educators managing diverse learners, clinical professionals supporting diagnosis
- **Geographic Focus**: Sub-Saharan Africa initially (Nigeria, Kenya, South Africa, Ghana, Uganda)
- **Languages**: English (primary), Swahili, Pidgin, French (future)

### Success Metrics (KPIs)
- 10,000+ registered users in Year 1
- 50,000+ assessments completed in Year 1
- 85%+ completion rate on started assessments
- 90%+ user satisfaction rating (NPS > 50)
- <2s average page load time
- 99.9% platform uptime

---

## 2. Product Scope & Features

### Core Features (Tier 1 - MVP)

#### 2.1 User Authentication & Profiles
**Feature**: Multi-account support with flexible profile management
- Email/password registration with verification
- OAuth support (Google, Apple - future)
- Create and manage multiple profiles (self + family members)
- Profile types: Self, Child (Age 5-12), Teen (Age 13-18), Adult proxy
- Primary and secondary profile designation
- Edit profile information (name, age, demographics)

**Requirements**:
- [ ] Secure password hashing (bcrypt)
- [ ] Email verification before assessment access
- [ ] Session timeout (24 hours)
- [ ] Device trust option for home devices
- [ ] Profile data encrypted at rest

#### 2.2 Assessment System
**Feature**: Comprehensive screening across multiple domains
- 6 assessment domains: Autism, ADHD, Dyslexia, Dyspraxia, Sensory Processing, Executive Function
- Age-appropriate questionnaires (children, teens, adults)
- 20-30 questions per domain assessment (10-15 min completion time)
- Progress saving (resume incomplete assessments)
- Culturally-adapted questions reflecting African contexts

**Assessment Flow**:
1. Select profile to assess
2. Choose domain(s) to screen
3. Answer questions (5-point Likert scale)
4. Receive instant results with visual charts
5. Get resource recommendations

**Requirements**:
- [ ] Question bank: 200+ questions across domains
- [ ] Validation: Internal consistency > 0.75 (Cronbach's alpha)
- [ ] Scoring algorithm documented and validated
- [ ] Results saved to database
- [ ] Assessment history maintained
- [ ] Export results as PDF

#### 2.3 Results & Insights
**Feature**: Clear, actionable assessment results
- Domain-specific scores (0-100%)
- Overall neurodiversity risk profile
- Interpretation of scores with clinical context
- Historical trends (comparing multiple assessments)
- Comparative data (how does user compare to population?)
- Recommendations for next steps

**Result Sections**:
1. **Overview**: One-page summary of findings
2. **Domain Breakdown**: Detailed scores per domain
3. **Interpretation**: What scores mean (clinical language simplified)
4. **Recommendations**: Suggested actions (professional evaluation, self-help, resources)
5. **Resources**: Links to support services, therapists, educational materials

**Requirements**:
- [ ] Results display with charts (Recharts)
- [ ] Export to PDF capability
- [ ] Print-friendly formatting
- [ ] Share results (secure link with password)
- [ ] Revisit historical results

#### 2.4 Resource Directory
**Feature**: Curated database of local support services
- Search by country, service type, language
- Therapists, psychiatrists, psychologists specializing in neurodiversity
- Educational support services
- Community organizations and support groups
- Online resources and tools
- Hotlines and crisis services

**Data Fields Per Resource**:
- Name, location, contact info
- Service types offered
- Languages spoken
- Cost/affordability info
- Hours of operation
- Online/in-person/hybrid
- User reviews and ratings

**Requirements**:
- [ ] 500+ resources curated for launch
- [ ] Location-based filtering
- [ ] Cost indicator (free, affordable, expensive)
- [ ] Vetted by clinical advisors
- [ ] Reviews and ratings from users
- [ ] Monthly updates to resource list

#### 2.5 Appointment Scheduling & Follow-ups
**Feature**: Integrated appointment management
- Schedule follow-up appointments with professionals
- Reminder emails (24h, 7d before appointment)
- Assessment re-take scheduling
- Track completed vs. pending appointments
- Calendar integration (Google Calendar, Outlook)

**Requirements**:
- [ ] Built-in calendar view
- [ ] Appointment notifications
- [ ] Integration with calendar services
- [ ] Reminder preferences customizable
- [ ] Appointment history

### Secondary Features (Tier 2 - Post-MVP)

#### 2.6 Educational Resources
**Feature**: Blog and resource hub
- Articles on neurodiversity topics
- Self-help strategies and coping techniques
- Parent guides
- Teacher resources
- Video tutorials
- Search and tagging system

#### 2.7 Admin Dashboard
**Feature**: Platform management tools
- User and assessment analytics
- Resource management (CRUD for resource directory)
- Organization/institution management
- Bulk user management
- Analytics dashboards
- System monitoring

#### 2.8 Organization Accounts
**Feature**: School and institutional support
- Multi-user accounts for institutions
- Bulk assessments for students
- Institutional dashboards and reporting
- Custom branding for organizations
- Team member management
- Pricing: Enterprise model (TBD)

#### 2.9 Accessibility Features
**Feature**: Support for diverse users
- Screen reader optimization (WCAG 2.1 AA)
- Keyboard-only navigation
- High contrast mode
- Text resizing options
- Simplified language option
- Video captions (all educational content)

#### 2.10 Privacy & Data Protection
**Feature**: GDPR & NDPR compliance
- Data minimization (collect only what's needed)
- User consent management
- Data export (download all personal data)
- Deletion request fulfillment (30 days)
- Privacy policy clearly stated
- No third-party ad tracking
- Data residency in EU/Africa where possible

**Requirements**:
- [ ] Privacy policy reviewed by legal
- [ ] Data processing agreements with Supabase
- [ ] Encryption in transit (TLS 1.3+) and at rest
- [ ] No personally identifiable information in logs
- [ ] Regular security audits
- [ ] Incident response plan

---

## 3. User Personas & Use Cases

### Persona 1: Sarah (Individual Seeking Self-Understanding)
- Age: 28, works in tech, suspects autism
- Goal: Understand neurodiversity, confirm suspicions, find support
- Pain Points: Expensive professional evaluations, cultural stigma around mental health
- Journey: Sign up → Complete autism screening → View results → Find therapist → Book appointment

### Persona 2: Chioma (Parent Evaluating Child)
- Age: 45, parent of two, concerned about son's school performance
- Goal: Screen child for ADHD and learning disabilities, access educational support
- Pain Points: Limited resources in her country, don't know where to start
- Journey: Create child profile → Complete ADHD & dyslexia assessments → Get teacher resources → Access school support network

### Persona 3: Dr. Okonkwo (Clinical Psychologist)
- Age: 55, runs private practice in Lagos
- Goal: Use assessments to support clients, access patient population insights
- Pain Points: Manual assessment administration, expensive formal testing tools
- Journey: Create organization account → Use platform for client screening → Review analytics → Track outcomes

### Persona 4: Kofi (Educational Administrator)
- Age: 38, manages special education at secondary school
- Goal: Screen large student population, track outcomes, get institutional insights
- Pain Points: Limited school budget, many students not identified early
- Journey: Bulk import students → Distribute assessments → Review analytics dashboard → Plan interventions

---

## 4. Non-Functional Requirements

### Performance Requirements
- **Page Load Time**: < 2 seconds (First Contentful Paint)
- **Assessment Load Time**: < 500ms
- **Results Generation**: < 1 second
- **Database Queries**: < 100ms (p95)
- **API Response Time**: < 200ms (p95)
- **Concurrent Users**: Support 1,000+ simultaneous users
- **Uptime SLA**: 99.9% (Vercel handles infrastructure)

### Scalability Requirements
- Database: PostgreSQL (Supabase) - auto-scale
- File Storage: Vercel Blob or Supabase Storage
- API: Next.js serverless functions (auto-scale)
- CDN: Vercel Edge Network
- Estimated Year 1 Data: 50,000 assessments × 500 bytes = 25GB

### Security Requirements
- **Data Encryption**: AES-256 at rest, TLS 1.3+ in transit
- **Authentication**: JWT tokens with 24-hour expiry
- **Authorization**: Row-Level Security (RLS) on sensitive data
- **Vulnerability Scanning**: Monthly automated scans
- **Penetration Testing**: Annual professional testing
- **Incident Response**: < 4-hour response time for critical issues

### Compliance Requirements
- **GDPR**: Full compliance (EU users)
- **NDPR** (Nigeria Data Protection Regulation): Full compliance
- **HIPAA**: Not required (not healthcare provider), but implement similar safeguards
- **Medical Device Regulations**: Not a medical device (screening tool, not diagnostic)
- **Accessibility**: WCAG 2.1 Level AA compliance
- **Data Residency**: User data in EU or Africa preferred

---

## 5. User Interface & Experience

### Navigation Structure
```
Home (/)
├── Landing Page (features, CTA, navigation)
├── Auth
│   ├── /auth/login
│   ├── /auth/sign-up
│   └── /auth/sign-up-success
├── Dashboard (/dashboard)
│   ├── Overview (profiles, recent assessments)
│   ├── /profiles (manage profiles)
│   ├── /reports (view results history)
│   ├── /appointments (schedule & track)
│   └── /followups (follow-up assessments)
├── Assessment (/assessment)
│   ├── /start (select profile & domain)
│   ├── /[id]/questions (take assessment)
│   ├── /[id]/results (view results)
│   └── Share results (encrypted link)
├── Resources (/resources)
│   ├── /directory (search services)
│   ├── /articles (educational content)
│   └── /how-it-works (onboarding guide)
├── Admin (/admin) - Private
│   ├── /analytics
│   ├── /users
│   ├── /resources (manage directory)
│   ├── /organizations
│   └── /reports
└── Footer
    ├── About
    ├── Privacy Policy
    ├── Terms of Service
    └── Contact
```

### Design System
- **Color Palette**: Primary (blue), Accent (orange), Neutrals (grays)
- **Typography**: Inter (body), plus font for headings
- **Components**: shadcn/ui (Radix UI + Tailwind)
- **Responsive**: Mobile-first, tested on iOS/Android
- **Accessibility**: WCAG 2.1 AA, keyboard navigation, screen reader support

---

## 6. Technical Architecture

### Technology Stack
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js 14 (App Router) | Fast, SSR, built-in optimization |
| Styling | Tailwind CSS v4 | Utility-first, fast development |
| Components | shadcn/ui + Radix | Accessible, unstyled, customizable |
| Forms | React Hook Form + Zod | Type-safe, performant, flexible |
| Database | PostgreSQL (Supabase) | ACID compliance, RLS support |
| Auth | Supabase Auth | Built-in, JWT-based, no vendor lock |
| File Storage | Supabase Storage | Integrated, affordable, reliable |
| Deployment | Vercel | Edge network, auto-scaling, great DX |
| Monitoring | Vercel Analytics + Sentry | Performance + error tracking |
| Testing | Vitest + React Testing Library | Fast, modern, ecosystem support |

### Data Model (High-Level)
```sql
-- Auth (Supabase built-in)
auth.users (id, email, password_hash, created_at, last_sign_in_at)

-- App tables
profiles (id, user_id, full_name, email, account_type, created_at)
user_profiles (id, user_id, full_name, age, preferred_name, is_primary, created_at)
assessments (id, profile_id, domains[], status, score, created_at, completed_at)
assessment_responses (id, assessment_id, question_id, response, created_at)
organizations (id, name, country, subscription_tier, created_at)
resources (id, name, type, country, contact_info, description, created_at)
appointments (id, user_id, resource_id, scheduled_date, status, notes, created_at)
```

---

## 7. Success Criteria & Milestones

### Soft Launch (Private Beta) - March 2025
- ✅ Core features (auth, assessments, results) fully functional
- ✅ 100+ beta testers enrolled
- ✅ Zero critical bugs
- ✅ < 2s page load times
- ✅ GDPR/NDPR compliance verified
- **Exit Criteria**: All P0 and P1 implementation roadmap items complete

### Public Launch - April 2025
- ✅ 1,000+ users registered
- ✅ 5,000+ assessments completed
- ✅ > 80% completion rate
- ✅ >= 4.5/5 user satisfaction rating
- ✅ Mobile app download available (iOS/Android)
- ✅ 10+ languages available

### Year 1 Growth - 2025
- 10,000+ registered users
- 50,000+ assessments completed
- 15 countries with resources in directory
- $100K+ revenue (B2B institutions)
- 90%+ user retention at 6 months
- Industry partnerships with 3+ major organizations

---

## 8. Revenue Model (Long-term)

### Freemium Model
- **Free Tier**: Unlimited assessments, access to results, basic resources
- **Premium Tier** ($4.99/month): Extended results insights, offline access, premium resources
- **Professional Tier** ($19.99/month): For clinicians and educators
- **Enterprise** (custom pricing): For institutions and organizations

### B2B Model
- **School Licenses**: $500-5,000/year depending on student count
- **Clinic Licenses**: White-label platform with custom branding
- **Corporate Wellness**: Employee neurodiversity screening programs

---

## 9. Launch Checklist

### Pre-Launch (2-4 weeks before)
- [ ] All P0 and P1 tasks completed
- [ ] Security audit passed
- [ ] Load testing completed
- [ ] User acceptance testing with target users
- [ ] Content review (copy, resources, educational materials)
- [ ] Legal review (privacy policy, terms, compliance)
- [ ] Marketing materials ready (demo video, blog posts, social content)
- [ ] Support setup (email, help docs, FAQ)

### Launch Day
- [ ] Announce on social media
- [ ] Send press release to African tech media
- [ ] Email announcement to beta users
- [ ] Monitor for issues in real-time
- [ ] Support team on standby

### Post-Launch (First 7 Days)
- [ ] Daily check-ins on key metrics
- [ ] Rapid response to user feedback
- [ ] Bugs fixed within 24 hours
- [ ] User onboarding optimized based on feedback

---

## 10. Product Roadmap (12 Months)

### Q1 2025 (Jan-Mar)
- Soft launch with beta testers
- Refine based on feedback
- Add more assessment domains
- Expand resource directory

### Q2 2025 (Apr-Jun)
- Public launch
- Mobile app launch
- Second language support (Swahili)
- B2B pilot with schools

### Q3 2025 (Jul-Sep)
- Expand to 10+ countries
- Add AI-powered recommendations
- Integration with healthcare providers
- Third language support (French)

### Q4 2025 (Oct-Dec)
- Advanced analytics for users
- Affiliate program launch
- Community features (forums, peer support)
- Corporate wellness program launch

---

## 11. Assumptions & Dependencies

### Key Assumptions
1. Target users have internet access and basic digital literacy
2. Users willing to share health/neurodiversity information if privacy assured
3. Market demand exists for culturally-adapted assessments
4. Clinical validity achievable through community validation
5. Revenue from B2B institutional sales is viable

### External Dependencies
- Supabase infrastructure stability
- Vercel deployment platform
- Internet connectivity in target markets
- Partnerships with local health/education organizations
- Regulatory approval (if required by countries)

---

## 12. Open Questions & Decisions

### Questions for Stakeholders
1. Should we pursue medical device certification for diagnostic capability?
2. Pricing strategy: freemium vs. subscription vs. institutional licensing?
3. Geographic expansion: focus on one country first or multiple?
4. Language priority: which languages first after English?
5. Partnership strategy: work with existing health NGOs or build independent?

### Technical Decisions Pending
1. Payment processing: Stripe, Flutterwave, or local providers?
2. Video hosting: YouTube, Vimeo, or self-hosted?
3. Notification system: Email only or SMS/push notifications?
4. Chat/support: In-app chat or external helpdesk?

---

## Appendix: Feature Detailed Specifications

(To be expanded with wireframes, user flows, and detailed interaction specs in product design documentation)
