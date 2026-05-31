-- Assessment features tables
CREATE TABLE IF NOT EXISTS assessment_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  assessment_id TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  responses JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, assessment_id)
);

CREATE TABLE IF NOT EXISTS assessment_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  assessment_ids TEXT[] NOT NULL,
  comparison_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  assessment_id TEXT NOT NULL,
  format TEXT CHECK (format IN ('pdf', 'csv', 'json')),
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE assessment_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_exports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "user_drafts_isolation" ON assessment_drafts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "user_comparisons_isolation" ON assessment_comparisons
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "user_exports_isolation" ON assessment_exports
  FOR ALL USING (auth.uid() = user_id);
