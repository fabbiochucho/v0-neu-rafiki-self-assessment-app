-- Add follow-up assessment scheduling tables and logic

-- Create follow-up assessment schedules
CREATE TABLE IF NOT EXISTS assessment_followup_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  initial_assessment_id UUID REFERENCES assessment_results(id),
  followup_type VARCHAR(50) NOT NULL, -- 'weekly', 'monthly', 'quarterly', 'biannual'
  schedule_start DATE NOT NULL,
  next_scheduled_date DATE NOT NULL,
  last_completed_date DATE,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'paused', 'completed'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create follow-up assessment responses
CREATE TABLE IF NOT EXISTS assessment_followup_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES assessment_followup_schedules(id) ON DELETE CASCADE,
  domain_id UUID REFERENCES assessment_domains(id),
  question_id UUID REFERENCES assessment_questions(id),
  response_value INTEGER,
  response_notes TEXT,
  change_category VARCHAR(50), -- 'improvement', 'decline', 'no_change'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create follow-up results tracking
CREATE TABLE IF NOT EXISTS assessment_followup_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES assessment_followup_schedules(id) ON DELETE CASCADE,
  initial_result_id UUID REFERENCES assessment_results(id),
  followup_number INTEGER,
  domain_id UUID REFERENCES assessment_domains(id),
  previous_score DECIMAL(5,2),
  current_score DECIMAL(5,2),
  score_change DECIMAL(5,2),
  change_percentage DECIMAL(5,2),
  behavioral_changes TEXT,
  cognitive_progress TEXT,
  sensory_improvements TEXT,
  social_emotional_skills TEXT,
  adaptive_skills TEXT,
  recommendations TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_followup_schedules_profile_id ON assessment_followup_schedules(profile_id);
CREATE INDEX idx_followup_schedules_next_date ON assessment_followup_schedules(next_scheduled_date);
CREATE INDEX idx_followup_results_schedule_id ON assessment_followup_results(schedule_id);

-- Enable RLS for follow-up tables
ALTER TABLE assessment_followup_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_followup_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_followup_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for follow-up schedules
CREATE POLICY "Users can view their own follow-up schedules"
  ON assessment_followup_schedules FOR SELECT
  USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create follow-up schedules for their profiles"
  ON assessment_followup_schedules FOR INSERT
  WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Similar policies for follow-up responses and results
CREATE POLICY "Users can view their own follow-up responses"
  ON assessment_followup_responses FOR SELECT
  USING (schedule_id IN (
    SELECT id FROM assessment_followup_schedules 
    WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  ));

CREATE POLICY "Users can create follow-up responses"
  ON assessment_followup_responses FOR INSERT
  WITH CHECK (schedule_id IN (
    SELECT id FROM assessment_followup_schedules 
    WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  ));

CREATE POLICY "Users can view their own follow-up results"
  ON assessment_followup_results FOR SELECT
  USING (schedule_id IN (
    SELECT id FROM assessment_followup_schedules 
    WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  ));
