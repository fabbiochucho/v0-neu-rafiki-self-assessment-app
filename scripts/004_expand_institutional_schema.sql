-- Expand database schema for institutional accounts and comprehensive assessment system
-- Based on pasted-text-3 (institutional features) and pasted-text-4 (question breakdown)

-- Add account types and organization support
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS account_type VARCHAR(20) DEFAULT 'individual' CHECK (account_type IN ('individual', 'organization'));
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS organization_name TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS organization_domain TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium'));

-- Create organizations table for institutional management
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT,
    admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
    max_profiles INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create organization members table for role-based access
CREATE TABLE IF NOT EXISTS organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'teacher', 'hr_staff', 'member')),
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- Expand assessment domains table with comprehensive framework
DROP TABLE IF EXISTS assessment_domains CASCADE;
CREATE TABLE assessment_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    age_group VARCHAR(20) NOT NULL CHECK (age_group IN ('toddler', 'child_adolescent', 'adult')),
    age_min INTEGER NOT NULL,
    age_max INTEGER NOT NULL,
    question_count INTEGER NOT NULL,
    description TEXT,
    cultural_adaptations JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comprehensive questions table based on pasted-text-4 breakdown
CREATE TABLE IF NOT EXISTS assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID REFERENCES assessment_domains(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'likert' CHECK (question_type IN ('likert', 'yes_no', 'multiple_choice', 'scale')),
    response_options JSONB NOT NULL,
    age_group VARCHAR(20) NOT NULL CHECK (age_group IN ('toddler', 'child_adolescent', 'adult')),
    respondent_type VARCHAR(20) DEFAULT 'self' CHECK (respondent_type IN ('self', 'parent', 'teacher', 'caregiver')),
    cultural_context JSONB DEFAULT '{}',
    scoring_weight DECIMAL(3,2) DEFAULT 1.0,
    order_index INTEGER NOT NULL,
    is_follow_up BOOLEAN DEFAULT FALSE,
    baseline_question_id UUID REFERENCES assessment_questions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create follow-up assessments table for longitudinal monitoring
CREATE TABLE IF NOT EXISTS follow_up_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    baseline_assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    follow_up_type VARCHAR(20) NOT NULL CHECK (follow_up_type IN ('weekly', 'monthly', 'quarterly', 'biannual')),
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'skipped')),
    progress_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create follow-up responses table
CREATE TABLE IF NOT EXISTS follow_up_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follow_up_assessment_id UUID REFERENCES follow_up_assessments(id) ON DELETE CASCADE,
    question_id UUID REFERENCES assessment_questions(id) ON DELETE CASCADE,
    response_value INTEGER NOT NULL,
    baseline_response_value INTEGER,
    change_score INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follow_up_assessment_id, question_id)
);

-- Create bulk enrollment table for organizations
CREATE TABLE IF NOT EXISTS bulk_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    total_records INTEGER NOT NULL,
    processed_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    error_log JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add organization_id to profiles for institutional management
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS class_group TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;

-- Add organization_id to assessments
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_organizations_admin ON organizations(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_domain ON assessment_questions(domain_id);
CREATE INDEX IF NOT EXISTS idx_questions_age_group ON assessment_questions(age_group);
CREATE INDEX IF NOT EXISTS idx_follow_up_baseline ON follow_up_assessments(baseline_assessment_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_profile ON follow_up_assessments(profile_id);
CREATE INDEX IF NOT EXISTS idx_profiles_org ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_assessments_org ON assessments(organization_id);

-- Enable RLS on new tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Users can view their own organization" ON organizations
    FOR SELECT USING (admin_user_id = auth.uid());

CREATE POLICY "Users can update their own organization" ON organizations
    FOR UPDATE USING (admin_user_id = auth.uid());

CREATE POLICY "Users can insert organizations they admin" ON organizations
    FOR INSERT WITH CHECK (admin_user_id = auth.uid());

-- RLS Policies for organization members
CREATE POLICY "Organization members can view their membership" ON organization_members
    FOR SELECT USING (
        user_id = auth.uid() OR 
        organization_id IN (
            SELECT id FROM organizations WHERE admin_user_id = auth.uid()
        )
    );

CREATE POLICY "Organization admins can manage members" ON organization_members
    FOR ALL USING (
        organization_id IN (
            SELECT id FROM organizations WHERE admin_user_id = auth.uid()
        )
    );

-- RLS Policies for assessment domains (public read)
CREATE POLICY "Anyone can view assessment domains" ON assessment_domains
    FOR SELECT USING (true);

-- RLS Policies for assessment questions (public read)
CREATE POLICY "Anyone can view assessment questions" ON assessment_questions
    FOR SELECT USING (true);

-- RLS Policies for follow-up assessments
CREATE POLICY "Users can view follow-ups for their profiles" ON follow_up_assessments
    FOR SELECT USING (
        profile_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        ) OR
        profile_id IN (
            SELECT p.id FROM profiles p
            JOIN organizations o ON p.organization_id = o.id
            WHERE o.admin_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage follow-ups for their profiles" ON follow_up_assessments
    FOR ALL USING (
        profile_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        ) OR
        profile_id IN (
            SELECT p.id FROM profiles p
            JOIN organizations o ON p.organization_id = o.id
            WHERE o.admin_user_id = auth.uid()
        )
    );

-- RLS Policies for follow-up responses
CREATE POLICY "Users can view follow-up responses for their assessments" ON follow_up_responses
    FOR SELECT USING (
        follow_up_assessment_id IN (
            SELECT fa.id FROM follow_up_assessments fa
            JOIN profiles p ON fa.profile_id = p.id
            WHERE p.user_id = auth.uid()
        ) OR
        follow_up_assessment_id IN (
            SELECT fa.id FROM follow_up_assessments fa
            JOIN profiles p ON fa.profile_id = p.id
            JOIN organizations o ON p.organization_id = o.id
            WHERE o.admin_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage follow-up responses for their assessments" ON follow_up_responses
    FOR ALL USING (
        follow_up_assessment_id IN (
            SELECT fa.id FROM follow_up_assessments fa
            JOIN profiles p ON fa.profile_id = p.id
            WHERE p.user_id = auth.uid()
        ) OR
        follow_up_assessment_id IN (
            SELECT fa.id FROM follow_up_assessments fa
            JOIN profiles p ON fa.profile_id = p.id
            JOIN organizations o ON p.organization_id = o.id
            WHERE o.admin_user_id = auth.uid()
        )
    );

-- RLS Policies for bulk enrollments
CREATE POLICY "Organization admins can view their bulk enrollments" ON bulk_enrollments
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations WHERE admin_user_id = auth.uid()
        )
    );

CREATE POLICY "Organization admins can manage their bulk enrollments" ON bulk_enrollments
    FOR ALL USING (
        organization_id IN (
            SELECT id FROM organizations WHERE admin_user_id = auth.uid()
        )
    );

-- Update existing RLS policies for profiles to include organization access
DROP POLICY IF EXISTS "Users can view their own profiles" ON profiles;
CREATE POLICY "Users can view their own profiles" ON profiles
    FOR SELECT USING (
        user_id = auth.uid() OR
        organization_id IN (
            SELECT id FROM organizations WHERE admin_user_id = auth.uid()
        ) OR
        assigned_to = auth.uid()
    );

DROP POLICY IF EXISTS "Users can update their own profiles" ON profiles;
CREATE POLICY "Users can update their own profiles" ON profiles
    FOR UPDATE USING (
        user_id = auth.uid() OR
        organization_id IN (
            SELECT id FROM organizations WHERE admin_user_id = auth.uid()
        ) OR
        assigned_to = auth.uid()
    );

DROP POLICY IF EXISTS "Users can insert their own profiles" ON profiles;
CREATE POLICY "Users can insert their own profiles" ON profiles
    FOR INSERT WITH CHECK (
        user_id = auth.uid() OR
        organization_id IN (
            SELECT id FROM organizations WHERE admin_user_id = auth.uid()
        )
    );

-- Update existing RLS policies for assessments to include organization access
DROP POLICY IF EXISTS "Users can view their own assessments" ON assessments;
CREATE POLICY "Users can view their own assessments" ON assessments
    FOR SELECT USING (
        profile_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        ) OR
        organization_id IN (
            SELECT id FROM organizations WHERE admin_user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update their own assessments" ON assessments;
CREATE POLICY "Users can update their own assessments" ON assessments
    FOR UPDATE USING (
        profile_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        ) OR
        organization_id IN (
            SELECT id FROM organizations WHERE admin_user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert their own assessments" ON assessments;
CREATE POLICY "Users can insert their own assessments" ON assessments
    FOR INSERT WITH CHECK (
        profile_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        ) OR
        organization_id IN (
            SELECT id FROM organizations WHERE admin_user_id = auth.uid()
        )
    );
