# NeuRafiki - Comprehensive Product Requirements Document (PRD)

**Version**: 2.0  
**Date**: January 19, 2026  
**Status**: Active Development  
**Last Updated**: Comprehensive Review Phase

---

## 1. PRODUCT OVERVIEW

### 1.1 Vision Statement
To empower neurodivergent individuals and families across Africa with culturally-adapted, evidence-based self-assessment tools that provide clarity, reduce diagnostic barriers, and connect users to appropriate support resources.

### 1.2 Mission Statement
NeuRafiki provides a privacy-first, accessible platform for neurodivergent screening that respects African cultural contexts, integrates with local support networks, and enables longitudinal health monitoring for individuals, families, and institutions.

### 1.3 Product Tagline
"Understanding Your Neurodivergent Journey - Culturally Adapted for Africa"

### 1.4 Target Markets

#### Primary Market
- **Individual Users**: Ages 5-65, seeking neurodivergent assessment
- **Family Groups**: Parents/guardians assessing multiple family members
- **Educators**: Teachers assessing students for support needs
- **Geographic Focus**: Nigeria, Kenya, South Africa, Ghana, Uganda, Tanzania

#### Secondary Market
- **Healthcare Providers**: Clinics, therapy practices using platform for screening
- **NGOs**: Organizations serving neurodivergent communities
- **Researchers**: Academic institutions conducting neurodiversity studies
- **Governments**: Ministries of health/education using data for policy

---

## 2. PROBLEM STATEMENT

### 2.1 Core Problems

#### Problem 1: Diagnostic Gap in Africa
**Issue**: 85% of neurodivergent individuals in Africa lack proper screening and diagnosis
- Limited mental health professionals
- Long waitlists for assessment
- Geographic barriers in rural areas
- Cost prohibitive for most families

**Impact**: 
- Delayed educational support
- Increased social stigma
- Missed early intervention windows

#### Problem 2: Cultural Misalignment
**Issue**: Existing assessment tools not adapted for African cultural contexts
- Questions assume Western social/educational norms
- Don't account for religious beliefs about disability
- Miss cultural indicators of neurodivergence
- Ignore local support systems

**Impact**:
- Misdiagnosis due to cultural misunderstanding
- Low tool adoption in African communities
- Reduced validity of assessment outcomes

#### Problem 3: Limited Resource Mapping
**Issue**: No centralized directory of local support services
- Users don't know how to access help after screening
- Therapists not visible to potential clients
- Educational accommodations not standardized
- Support gaps remain unaddressed

**Impact**:
- Assessment results become unhelpful
- Users can't act on recommendations
- Support ecosystem remains fragmented

#### Problem 4: Longitudinal Monitoring Gap
**Issue**: No accessible way to track progress over time
- Schools lack tools to monitor student development
- Families can't quantify improvement with interventions
- Researchers need comparative data
- Treatment efficacy unclear

**Impact**:
- No evidence for intervention effectiveness
- Services can't be optimized
- Outcomes remain unmeasured

---

## 3. PROPOSED SOLUTION

### 3.1 Product Description

NeuRafiki is a comprehensive, culturally-adapted digital health platform that enables:

1. **Self-Assessment Tools**
   - Evidence-based screening for 6+ neurodivergent conditions
   - Age-appropriate questionnaires (toddlers to adults)
   - Branching logic based on initial responses
   - Average completion time: 15-45 minutes

2. **Culturally Adapted Framework**
   - Questions adapted for African cultural contexts
   - Support for local languages and cultural belief systems
   - Country-specific resources and recommendations
   - Religious sensitivity integrated throughout

3. **Multi-Profile Management**
   - Parents can assess multiple children from single account
   - Teachers can manage classroom assessments
   - Institutions can track cohorts longitudinally
   - Privacy controls for shared assessments

4. **Results & Insights**
   - Risk stratification (low, moderate, high)
   - Detailed domain scores with explanations
   - Culturally-sensitive recommendations
   - Downloadable reports for healthcare providers

5. **Resource Directory**
   - Searchable database of local support services
   - Automatic recommendations based on assessment results
   - Direct booking integration for appointments
   - Community-contributed resource reviews

6. **Longitudinal Tracking**
   - Scheduled follow-up assessments
   - Progress visualization over time
   - Change detection algorithms
   - Intervention effectiveness measurement

7. **Institutional Features**
   - School enrollment and class management
   - Bulk assessment administration
   - Aggregate reporting and analytics
   - Role-based access and reporting

---

## 4. TARGET USERS & USE CASES

### 4.1 User Personas

#### Persona 1: Amara (Individual User)
- **Age**: 34, Lagos, Nigeria
- **Situation**: Suspected adult ADHD but no diagnosis
- **Goals**: Get clarity on symptoms, access support
- **Pain Points**: Long clinic waitlists, expensive private assessment
- **Technology**: Smartphone user, WhatsApp daily
- **Timeline**: Wants answer within 2 weeks

#### Persona 2: Chioma (Parent)
- **Age**: 42, Nairobi, Kenya
- **Situation**: Has 2 children, suspects both autistic
- **Goals**: Understand children's needs, advocate for school support
- **Pain Points**: Cultural stigma, limited school resources, time constraints
- **Technology**: Mobile + tablet, uses WhatsApp for community groups
- **Timeline**: Wants insights to share with child's teacher

#### Persona 3: Dr. Okonkwo (Healthcare Provider)
- **Age**: 38, Port Harcourt, Nigeria
- **Situation**: Runs small therapy practice
- **Goals**: Screen patients efficiently, monitor progress
- **Pain Points**: Manual assessment management, no progress tracking
- **Technology**: Laptop for admin, sees patients in office
- **Timeline**: Wants integration with clinical workflow

#### Persona 4: Mrs. Adekunle (Teacher)
- **Age**: 45, Accra, Ghana
- **Situation**: Teaches 40 students, some with suspected neurodivergence
- **Goals**: Identify students needing support, track progress
- **Pain Points**: No diagnostic resources, unclear how to help students
- **Technology**: Computer lab access, group iPad
- **Timeline**: Needs action plan by next term

### 4.2 Primary Use Cases

#### Use Case 1: Individual Self-Assessment
\`\`\`
User Story: As a neurodivergent individual, I want to self-assess my symptoms 
           to understand if I may have autism/ADHD/dyslexia so I can seek 
           appropriate support.

Flow:
1. User creates account and builds profile
2. Selects assessment domains and respondent type
3. Answers 40-60 questions adapted for age/context
4. Receives risk stratification and domain scores
5. Gets resource recommendations
6. Downloads assessment report to share with provider

Success Metrics:
- 90%+ completion rate
- <2 min average time per question
- 95%+ user satisfaction with clarity of results
\`\`\`

#### Use Case 2: Parent Multi-Child Assessment
\`\`\`
User Story: As a parent, I want to assess multiple children's neurodivergence 
           across different domains so I can understand each child's unique needs 
           and advocate effectively.

Flow:
1. Parent creates primary profile
2. Adds child 1 profile (age 8)
3. Starts child 1 autism domain assessment
4. Completes child 1 assessment, receives results
5. Switches to child 2 profile (age 13)
6. Starts child 2 ADHD domain assessment
7. Compares results across children
8. Gets customized family support plan

Success Metrics:
- Multi-profile support fully functional
- Results comparison available
- Recommendations for each child
\`\`\`

#### Use Case 3: School-Based Bulk Assessment
\`\`\`
User Story: As a school coordinator, I want to administer assessments to all 
           students in my class so I can identify who needs special support.

Flow:
1. School registers as organization
2. Enrolls students (bulk import via CSV)
3. Creates assessment batch for specific class
4. Generates unique assessment codes for each student
5. Distributes codes to students
6. Students complete self/parent-reported assessments
7. School receives aggregate data and individual reports
8. Identifies students for intervention

Success Metrics:
- Bulk enrollment <5 min for 50 students
- Student completion rate >80%
- Actionable insights for each student
\`\`\`

#### Use Case 4: Longitudinal Progress Tracking
\`\`\`
User Story: As a provider, I want to track assessment results over 6-12 months 
           so I can measure intervention effectiveness and adjust treatment.

Flow:
1. Provider enrolls patient
2. Patient completes baseline assessment at visit
3. Provider schedules 3-month follow-up
4. Automated reminders sent to patient
5. Patient completes follow-up assessment
6. Results compared to baseline
7. Progress visualized in dashboard
8. Provider adjusts intervention based on data

Success Metrics:
- Automated reminders deliver >90%
- Follow-up completion rate >75%
- Progress visualization clear and actionable
\`\`\`

---

## 5. FEATURE SPECIFICATIONS

### 5.1 Core Features (MVP)

#### Feature 1: Authentication & Profile Management
**Acceptance Criteria**:
- [ ] Email/password registration with validation
- [ ] Email verification required
- [ ] Secure session management with 30-day remember-me
- [ ] Profile creation with name, age, gender, country
- [ ] Profile editing and deletion
- [ ] Multi-profile support (up to 5 profiles per account)
- [ ] Delete account and data purging

**Technical Requirements**:
- Supabase Auth for authentication
- Password hashing with bcrypt
- JWT token management
- Rate limiting on login attempts
- GDPR-compliant data deletion

**Edge Cases**:
- User forgets password → password reset email
- Email verification expires → resend option
- Duplicate email → clear error message

#### Feature 2: Assessment Domains
**Domains to Support**:
1. Autism Spectrum Disorder (ASD)
2. Attention-Deficit/Hyperactivity Disorder (ADHD)
3. Dyslexia
4. Dyspraxia
5. Sensory Processing Disorder
6. Executive Function Difficulties
7. Combined/Other

**Acceptance Criteria**:
- [ ] 6+ assessment domains available
- [ ] Each domain has 40-80 questions
- [ ] Questions branching based on previous responses
- [ ] Age-appropriate question variants
- [ ] Respondent-type variants (self-report, parent, teacher)
- [ ] Estimated completion time displayed
- [ ] Progress indicator during assessment
- [ ] Ability to save and resume assessment

**Technical Requirements**:
- Database questions table with branching logic
- Question versioning for updates
- Response validation against question types
- Session state management for resumption

#### Feature 3: Assessment Flow & Scoring
**Acceptance Criteria**:
- [ ] Question presentation with clear instructions
- [ ] Response types: Likert scale, yes/no, multiple choice
- [ ] Real-time progress tracking (X of Y questions)
- [ ] Pause/resume functionality
- [ ] Auto-save of responses every 30 seconds
- [ ] Final review before submission
- [ ] Automatic scoring calculation
- [ ] Risk stratification: Low/Moderate/High

**Scoring Logic**:
\`\`\`
Risk Calculation:
- Low Risk: 0-33% of domain indicators present
- Moderate Risk: 34-66% of domain indicators present
- High Risk: 67%+ of domain indicators present

Indicators by Domain:
- ASD: Social communication + repetitive behaviors
- ADHD: Inattention + hyperactivity/impulsivity
- Dyslexia: Reading + writing + spelling patterns
- etc.
\`\`\`

#### Feature 4: Results & Insights
**Acceptance Criteria**:
- [ ] Results page with domain scores
- [ ] Risk level badge (Low/Moderate/High)
- [ ] Domain-specific insights and explanations
- [ ] Culturally-sensitive language
- [ ] Downloadable PDF report
- [ ] Share results with healthcare provider option
- [ ] Next steps recommendations
- [ ] Resource directory recommendations

**Technical Requirements**:
- Result calculation engine
- PDF generation library
- Email sharing with security token
- Analytics tracking (privacy-compliant)

#### Feature 5: Resource Directory
**Acceptance Criteria**:
- [ ] Searchable database of support services
- [ ] Filters: service type, location, language, cost
- [ ] Service ratings and reviews
- [ ] Direct contact information
- [ ] Appointment booking integration (where available)
- [ ] Resource matching to assessment results
- [ ] Community-contributed content with moderation
- [ ] Verification badge for verified providers

**Service Types**:
- Therapists/Psychologists
- Educational support specialists
- Special needs schools
- NGOs/support groups
- Online resources
- Government programs

#### Feature 6: Longitudinal Tracking
**Acceptance Criteria**:
- [ ] Follow-up assessment scheduling
- [ ] Intervals: weekly, monthly, quarterly, biannual
- [ ] Automated reminder emails and SMS
- [ ] Previous assessment results visible during follow-up
- [ ] Change detection algorithms
- [ ] Progress visualization (line charts, score changes)
- [ ] Historical data comparison
- [ ] Export progress report

**Technical Requirements**:
- Job queue for scheduled reminders
- SMS integration (Twilio/similar)
- Time-series data storage
- Visualization library (Recharts)

#### Feature 7: Institutional Features
**Acceptance Criteria**:
- [ ] Organization account creation
- [ ] Member invitations with role assignment
- [ ] Roles: Admin, Educator, Supervisor, Analyst
- [ ] Bulk student enrollment via CSV
- [ ] Class/cohort management
- [ ] Assessment batch creation
- [ ] Unique codes for student distribution
- [ ] Aggregate reporting and analytics
- [ ] Individual student result access
- [ ] Data export capabilities

**Technical Requirements**:
- Multi-tenancy support in database
- RLS policies for role-based access
- CSV parsing and validation
- Analytics aggregation engine

---

## 6. USER EXPERIENCE (UX) REQUIREMENTS

### 6.1 Design Principles
1. **Cultural Sensitivity**: All copy, imagery, and examples reflect African contexts
2. **Accessibility**: WCAG 2.1 AA compliance minimum
3. **Simplicity**: Non-technical users should understand assessment purpose
4. **Trustworthiness**: Medical accuracy and privacy transparency
5. **Responsive**: Mobile-first, works on all devices

### 6.2 Key Screens

#### Screen 1: Landing Page
- Clear value proposition
- Feature highlights
- Social proof (testimonials, statistics)
- CTA buttons: "Start Assessment", "Learn More"
- Navigation: About, FAQ, Pricing, Blog

#### Screen 2: Assessment Start
- Profile selection
- Domain selection with descriptions
- Respondent type selection (self, parent, teacher)
- Estimated completion time
- Start button

#### Screen 3: Question Screen
- Single question centered
- Response options clearly labeled
- Progress bar (X of Y)
- Pause/Resume buttons
- Next/Previous navigation
- Optional: Help icon with question explanation

#### Screen 4: Results Screen
- Domain scores visualization
- Overall risk level
- Explanation of scores
- Recommended resources
- Download/Share buttons
- Schedule follow-up option

#### Screen 5: Dashboard
- Welcome message personalized
- Quick action cards
- Recent assessments
- Profiles overview
- Upcoming follow-ups
- Navigation to full features

### 6.3 User Flow Diagrams

\`\`\`
Landing Page
    ↓
[Sign Up] or [Sign In]
    ↓
[Create Profile] or [Select Profile]
    ↓
[Start Assessment]
    ↓
[Select Domains] → [Select Respondent] → [Select Age Group]
    ↓
[Answer Questions] → [Save/Resume] → [Complete]
    ↓
[Review Responses] → [Submit]
    ↓
[View Results] → [Download Report]
    ↓
[Schedule Follow-up] or [Browse Resources]
    ↓
Dashboard → [Manage Profiles] / [View History] / [Track Progress]
\`\`\`

---

## 7. TECHNICAL ARCHITECTURE

### 7.1 Technology Stack

#### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **State Management**: React Hooks + Zustand (for complex state)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

#### Backend
- **API**: Next.js Route Handlers
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **File Storage**: Vercel Blob (for PDFs)
- **Job Queue**: Bull (for reminders)

#### Infrastructure
- **Hosting**: Vercel
- **CDN**: Vercel Edge Network
- **Monitoring**: Sentry
- **Analytics**: Mixpanel (privacy-compliant)
- **Email**: SendGrid
- **SMS**: Twilio

### 7.2 Database Schema

#### Core Tables
1. `users` - Authentication users (Supabase Auth)
2. `profiles` - User profile metadata
3. `user_profiles` - Multi-profile support
4. `assessment_domains` - Available domains
5. `assessment_questions` - Question bank (~838 questions)
6. `assessments` - Assessment sessions
7. `assessment_responses` - Individual question responses
8. `assessment_results` - Calculated results
9. `assessment_followups` - Follow-up scheduling
10. `organizations` - Institutional accounts
11. `organization_members` - Team members
12. `resources` - Support service directory
13. `appointments` - Scheduled follow-ups

#### Key Relationships
- User → Many user_profiles
- Assessment → Many assessment_responses
- Assessment → One assessment_result
- Organization → Many organization_members
- Assessment_result → Many assessment_followups

### 7.3 API Endpoints (Rest)

#### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `POST /api/auth/forgot-password` - Reset password

#### Assessments
- `POST /api/assessments` - Create new assessment
- `GET /api/assessments/:id` - Get assessment details
- `PUT /api/assessments/:id` - Update assessment
- `DELETE /api/assessments/:id` - Delete assessment
- `POST /api/assessments/:id/submit` - Submit completed assessment
- `GET /api/assessments/:id/results` - Get assessment results

#### Questions
- `GET /api/questions?domain=&age_group=` - Get questions
- `POST /api/questions/:id/answer` - Submit answer

#### Resources
- `GET /api/resources?type=&location=&distance=` - Search resources
- `GET /api/resources/:id` - Get resource details
- `POST /api/resources/:id/review` - Leave review

#### Profiles
- `POST /api/profiles` - Create profile
- `GET /api/profiles` - List user profiles
- `PUT /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile

---

## 8. DATA & PRIVACY REQUIREMENTS

### 8.1 GDPR & NDPR Compliance
- User consent obtained at sign-up
- Privacy policy clear and accessible
- Right to access implemented
- Right to delete implemented (with 30-day grace)
- Data breach notification procedure
- Automated data protection impact assessment

### 8.2 Data Encryption
- HTTPS only (enforced by Vercel)
- PII fields encrypted at rest
- Assessment responses encrypted using field-level encryption
- Backups encrypted

### 8.3 Data Retention
- User request data: 7 years
- Assessment data: Per user preference (default 2 years)
- Deleted account data: Purged within 30 days
- Backup data: 90-day retention policy

### 8.4 Research & Anonymization
- Aggregated data available for research (with consent)
- PII removed for research dataset
- De-identification algorithm ensures no re-identification
- Data access agreements for research partners

---

## 9. SUCCESS METRICS & KPIs

### 9.1 User Acquisition
| Metric | Target | Timeline |
|--------|--------|----------|
| Sign-ups | 1,000 | Month 1 |
| Monthly Active Users | 500 | Month 3 |
| User Growth Rate | 25% MoM | Q1 |

### 9.2 Engagement
| Metric | Target | Benchmark |
|--------|--------|-----------|
| Assessment Completion Rate | 85% | 70% for similar tools |
| Session Duration | 35 min avg | Domain-dependent |
| Follow-up Rate | 60% | Similar platforms |
| Resource Directory Usage | 40% | TBD |

### 9.3 Quality
| Metric | Target | Measurement |
|--------|--------|-------------|
| Assessment Accuracy | 85% | Clinical validation study |
| User Satisfaction | 4.5/5 | In-app surveys |
| System Uptime | 99.9% | Monitoring dashboard |
| Response Time | <2s | Page load tests |

### 9.4 Business
| Metric | Target | Timeline |
|--------|--------|----------|
| Cost per Assessment | <$2 | AWS/Supabase costs |
| Revenue per User | $5 (if freemium) | Subscription model TBD |
| Churn Rate | <5% MoM | Retention cohorts |

---

## 10. IMPLEMENTATION ROADMAP

### Phase 1: MVP (Weeks 1-4)
**Focus**: Core assessment functionality
- Complete assessment flow implementation
- Results calculation and basic visualization
- Multi-profile management
- Basic resource directory

**Deliverables**:
- Functional assessment platform
- 100+ questions per domain
- Results reports (PDF)
- Stable authentication

### Phase 2: Enhancement (Weeks 5-8)
**Focus**: Institutional features and tracking
- Institutional account creation
- Bulk enrollment and management
- Follow-up assessment scheduling
- Progress visualization

**Deliverables**:
- Multi-tenant support
- Institutional dashboard
- Reminder system
- Progress tracking UI

### Phase 3: Expansion (Weeks 9-12)
**Focus**: Content, integrations, and polish
- Additional domains and question variants
- Resource directory full implementation
- Third-party integrations (calendars, email)
- Mobile app (React Native)

**Deliverables**:
- Complete resource directory
- Mobile app launch
- API for partner integrations
- Advanced analytics

### Phase 4: Scale (Q2+)
**Focus**: Growth, partnerships, sustainability
- Healthcare provider integrations
- Government partnerships
- Community building
- Sustainability model (freemium/enterprise)

**Deliverables**:
- Partner integrations
- Subscription model
- Community platform
- Research collaborations

---

## 11. RISK MANAGEMENT

### 11.1 Known Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Low clinical accuracy | Medium | High | Validate with psychologists |
| Cultural adaptation gaps | Medium | Medium | Community testing, iterative improvement |
| User churn | Medium | Medium | In-app engagement, follow-up reminders |
| Data privacy breach | Low | Critical | Security audit, encryption, monitoring |
| Regulatory changes | Low | Medium | Legal review, compliance team |

### 11.2 Assumptions
1. Users have access to smartphones/computers
2. Internet connectivity available in target markets
3. Users willing to complete 40-60 question assessments
4. Mental health stigma not barrier to adoption
5. Healthcare providers receptive to digital screening tools

---

## 12. SUCCESS CRITERIA FOR LAUNCH

- [ ] All critical features implemented and tested
- [ ] 500+ questions across all domains
- [ ] 95%+ unit test coverage for critical paths
- [ ] Security audit passed
- [ ] GDPR/NDPR compliance verified
- [ ] Clinical validation study completed
- [ ] Accessibility audit WCAG 2.1 AA passed
- [ ] 50+ resources in directory
- [ ] User onboarding guide/tutorial
- [ ] Customer support system in place
- [ ] Analytics and monitoring configured
- [ ] Backup and disaster recovery plan tested

---

## APPENDICES

### Appendix A: Assessment Domain Specifications
[Detailed specifications for each domain with sample questions, scoring logic, and risk thresholds]

### Appendix B: Cultural Adaptation Framework
[Guidelines for adapting questions to different African countries and cultural contexts]

### Appendix C: Resource Directory Taxonomy
[Complete classification system for support services]

### Appendix D: Data Dictionary
[Complete database schema documentation with field definitions]

### Appendix E: API Documentation
[Full OpenAPI specification for all endpoints]

### Appendix F: Security Checklist
[OWASP Top 10 compliance checklist]

---

**Document Control**:
- Version: 2.0
- Status: Active Development
- Next Review: After Phase 1 Completion
- Last Updated: January 19, 2026
- Owner: Product Team
