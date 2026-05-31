-- Analytics events tracking
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  event_name TEXT NOT NULL,
  event_properties JSONB DEFAULT '{}'::jsonb,
  page_url TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Analytics: allow inserts from any user, restrict reads to authenticated users
CREATE POLICY "allow_analytics_insert" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "allow_analytics_read" ON analytics_events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at 
  ON analytics_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name 
  ON analytics_events(event_name);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id 
  ON analytics_events(user_id);
