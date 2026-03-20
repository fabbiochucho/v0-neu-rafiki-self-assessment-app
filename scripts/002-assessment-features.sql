-- Phase 2: Assessment Features Database Schema
-- Save/Resume, Comparison, Export functionality

-- Assessment Drafts Table (Save & Resume)
CREATE TABLE IF NOT EXISTS assessment_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  domain_ids TEXT[] NOT NULL,
  progress_data JSONB, -- Stores responses for each question
  progress_percentage INT DEFAULT 0,
  last_saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '30 days',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, profile_id)
);

CREATE INDEX idx_assessment_drafts_user_id ON assessment_drafts(user_id);
CREATE INDEX idx_assessment_drafts_profile_id ON assessment_drafts(profile_id);

-- Assessment Comparisons Table
CREATE TABLE IF NOT EXISTS assessment_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  baseline_assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  follow_up_assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  comparison_data JSONB, -- Stores score changes, trends
  improvement_areas TEXT[],
  decline_areas TEXT[],
  overall_change_percentage DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assessment_comparisons_user_id ON assessment_comparisons(user_id);
CREATE INDEX idx_assessment_comparisons_baseline ON assessment_comparisons(baseline_assessment_id);

-- Assessment Exports Table (PDF, JSON exports, sharing)
CREATE TABLE IF NOT EXISTS assessment_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  export_format VARCHAR(20), -- 'pdf', 'json', 'csv'
  file_url TEXT,
  is_professional_report BOOLEAN DEFAULT false,
  shared_with_emails TEXT[],
  shareable_token VARCHAR(255) UNIQUE,
  token_expires_at TIMESTAMP,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assessment_exports_assessment_id ON assessment_exports(assessment_id);
CREATE INDEX idx_assessment_exports_user_id ON assessment_exports(user_id);
CREATE INDEX idx_assessment_exports_token ON assessment_exports(shareable_token);

-- Enable Row Level Security (RLS)
ALTER TABLE assessment_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_exports ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY assessment_drafts_user_access ON assessment_drafts
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY assessment_comparisons_user_access ON assessment_comparisons
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY assessment_exports_user_access ON assessment_exports
  FOR ALL USING (user_id = auth.uid());

-- Allow anonymous access to shared exports via token
CREATE POLICY assessment_exports_shared_access ON assessment_exports
  FOR SELECT USING (shareable_token IS NOT NULL AND token_expires_at > NOW());

-- Indexes for performance
CREATE INDEX idx_assessment_drafts_expires_at ON assessment_drafts(expires_at);
CREATE INDEX idx_assessment_exports_created_at ON assessment_exports(created_at);
