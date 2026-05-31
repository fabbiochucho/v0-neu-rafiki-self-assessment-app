-- Security audit table for RLS monitoring
CREATE TABLE IF NOT EXISTS security_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  table_name TEXT,
  user_id UUID REFERENCES auth.users,
  ip_address TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for audit table
ALTER TABLE security_audit ENABLE ROW LEVEL SECURITY;

-- Only allow service role to write, no one can read
CREATE POLICY "service_only" ON security_audit
  FOR ALL USING (false);

-- User feedback table
CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  feedback_type TEXT CHECK (feedback_type IN ('general', 'bug', 'feature')),
  message TEXT NOT NULL,
  contact_email TEXT,
  page_url TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for feedback table
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert feedback
CREATE POLICY "allow_feedback_insert" ON user_feedback
  FOR INSERT WITH CHECK (true);

-- Only admins can read feedback
CREATE POLICY "admin_read_feedback" ON user_feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (
        auth.users.user_metadata->>'role' = 'admin'
        OR auth.users.app_metadata->>'role' = 'admin'
        OR auth.users.email LIKE '%@neurafiki.africa'
      )
    )
  );

-- Monthly RLS violation check query
-- Run this periodically to monitor for suspicious activity:
-- SELECT count(*) FROM security_audit
-- WHERE created_at > now() - interval '30 days'
-- AND event_type LIKE '%violation%';
