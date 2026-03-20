-- Phase 3: Analytics Events Database Schema
-- Conversion funnel, engagement tracking, cohort analysis

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  event_category VARCHAR(50) NOT NULL, -- 'funnel', 'engagement', 'error', 'performance'
  event_value DECIMAL(10,2),
  event_properties JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_country VARCHAR(100),
  user_language VARCHAR(10),
  user_agent TEXT,
  ip_address VARCHAR(45),
  page_url TEXT,
  referrer_url TEXT
);

CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp DESC);
CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_category ON analytics_events(event_category);
CREATE INDEX idx_analytics_events_country ON analytics_events(user_country);

-- Conversion Funnel View
CREATE OR REPLACE VIEW conversion_funnel AS
SELECT
  event_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT session_id) as sessions,
  DATE(timestamp) as event_date
FROM analytics_events
WHERE event_category = 'funnel'
GROUP BY event_type, DATE(timestamp)
ORDER BY DATE(timestamp) DESC, event_type;

-- Cohort Analysis View - by Country
CREATE OR REPLACE VIEW cohort_analysis_country AS
SELECT
  user_country,
  COUNT(DISTINCT user_id) as total_users,
  COUNT(CASE WHEN event_type = 'signup_completed' THEN 1 END) as signups,
  COUNT(CASE WHEN event_type = 'assessment_started' THEN 1 END) as assessments_started,
  COUNT(CASE WHEN event_type = 'assessment_completed' THEN 1 END) as assessments_completed,
  ROUND(
    100.0 * COUNT(CASE WHEN event_type = 'assessment_completed' THEN 1 END) /
    NULLIF(COUNT(CASE WHEN event_type = 'assessment_started' THEN 1 END), 0),
    2
  ) as completion_rate_percent,
  DATE(MIN(timestamp)) as first_event_date,
  DATE(MAX(timestamp)) as last_event_date
FROM analytics_events
WHERE user_country IS NOT NULL
GROUP BY user_country
ORDER BY total_users DESC;

-- Engagement Heatmap - by Hour and Day
CREATE OR REPLACE VIEW engagement_heatmap AS
SELECT
  EXTRACT(DOW FROM timestamp) as day_of_week,
  EXTRACT(HOUR FROM timestamp) as hour_of_day,
  event_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users
FROM analytics_events
WHERE event_category = 'engagement'
GROUP BY
  EXTRACT(DOW FROM timestamp),
  EXTRACT(HOUR FROM timestamp),
  event_type
ORDER BY day_of_week, hour_of_day;

-- User Journey Summary View
CREATE OR REPLACE VIEW user_journey_summary AS
SELECT
  user_id,
  session_id,
  MIN(timestamp) as session_start,
  MAX(timestamp) as session_end,
  COUNT(*) as total_events,
  COUNT(DISTINCT event_type) as unique_event_types,
  MAX(CASE WHEN event_type = 'assessment_completed' THEN 1 ELSE 0 END) as completed_assessment,
  EXTRACT(EPOCH FROM (MAX(timestamp) - MIN(timestamp))) / 60 as session_duration_minutes
FROM analytics_events
GROUP BY user_id, session_id;

-- Question-Level Analytics
CREATE TABLE IF NOT EXISTS question_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
  domain_id UUID NOT NULL REFERENCES assessment_domains(id) ON DELETE CASCADE,
  answered_count INT DEFAULT 0,
  skipped_count INT DEFAULT 0,
  reviewed_count INT DEFAULT 0,
  average_response_time_seconds INT,
  most_common_response INT,
  response_distribution JSONB, -- JSON of {response_value: count}
  confusion_score DECIMAL(5,2), -- How many users review this question multiple times
  helpful_rating DECIMAL(3,2), -- Average helpfulness rating (1-5)
  feedback_summary JSONB,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(question_id)
);

CREATE INDEX idx_question_analytics_domain_id ON question_analytics(domain_id);

-- Assessment Quality Metrics
CREATE TABLE IF NOT EXISTS assessment_quality_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  completion_rate DECIMAL(5,2), -- % of questions answered
  average_response_time_seconds INT,
  time_to_first_answer INT,
  question_skip_rate DECIMAL(5,2),
  user_reported_difficulty VARCHAR(50), -- 'easy', 'moderate', 'hard'
  confidence_score DECIMAL(3,2), -- User's confidence in their responses
  result_clarity_rating DECIMAL(3,2), -- How clear were the results?
  would_recommend BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assessment_quality_assessment_id ON assessment_quality_metrics(assessment_id);

-- Enable Row Level Security
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_quality_metrics ENABLE ROW LEVEL SECURITY;

-- RLS: Users can only see their own analytics (for privacy)
CREATE POLICY analytics_events_user_view ON analytics_events
  FOR SELECT USING (user_id IS NULL OR user_id = auth.uid() OR auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'analyst')
  ));

-- Admin/analyst can view all (no WHERE clause = all)
-- Standard users can only see their own

-- Create a function to track events safely
CREATE OR REPLACE FUNCTION track_event(
  p_event_type TEXT,
  p_event_category TEXT,
  p_event_value DECIMAL DEFAULT NULL,
  p_event_properties JSONB DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL,
  p_user_country TEXT DEFAULT NULL,
  p_user_language TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO analytics_events (
    event_type,
    event_category,
    event_value,
    event_properties,
    user_id,
    session_id,
    user_country,
    user_language,
    timestamp
  ) VALUES (
    p_event_type,
    p_event_category,
    p_event_value,
    p_event_properties,
    auth.uid(),
    COALESCE(p_session_id, gen_random_uuid()::TEXT),
    p_user_country,
    p_user_language,
    CURRENT_TIMESTAMP
  )
  RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate conversion rates
CREATE OR REPLACE FUNCTION get_conversion_rate(
  p_from_event TEXT,
  p_to_event TEXT,
  p_days INT DEFAULT 30
)
RETURNS TABLE (
  from_count BIGINT,
  to_count BIGINT,
  conversion_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT CASE WHEN ae1.event_type = p_from_event THEN ae1.user_id END)::BIGINT as from_count,
    COUNT(DISTINCT CASE WHEN ae2.event_type = p_to_event THEN ae2.user_id END)::BIGINT as to_count,
    ROUND(
      100.0 * COUNT(DISTINCT CASE WHEN ae2.event_type = p_to_event THEN ae2.user_id END) /
      NULLIF(COUNT(DISTINCT CASE WHEN ae1.event_type = p_from_event THEN ae1.user_id END), 0),
      2
    )::DECIMAL as conversion_rate
  FROM analytics_events ae1
  LEFT JOIN analytics_events ae2 ON
    ae1.user_id = ae2.user_id AND
    ae2.timestamp > ae1.timestamp AND
    ae2.timestamp <= ae1.timestamp + INTERVAL '1 day' * p_days
  WHERE ae1.timestamp > NOW() - INTERVAL '1 day' * p_days;
END;
$$ LANGUAGE plpgsql;
