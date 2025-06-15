/*
  # Enforce RLS and create API rate limit table
  1. Ensure all public tables have RLS enabled
  2. Add api_rate_limits table used for rate limiting Edge Functions
*/

-- Enable RLS on existing tables
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS wearable_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS supplement_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS supplement_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS deployments ENABLE ROW LEVEL SECURITY;

-- Create table for API rate limiting
CREATE TABLE IF NOT EXISTS api_rate_limits (
  identifier TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY(identifier, window_start)
);

ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow Edge Functions to manage rate limits
CREATE POLICY "Allow rate limit updates" ON api_rate_limits
  FOR ALL USING (true) WITH CHECK (true);
