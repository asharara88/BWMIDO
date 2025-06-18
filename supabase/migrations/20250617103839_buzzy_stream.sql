/*
  # Add Audio Cache Table

  1. New Tables
    - audio_cache: stores cached audio for each user
      - id (uuid, primary key)
      - user_id (uuid, foreign key to auth.users)
      - cache_key (text, unique per user)
      - audio_data (bytea)
      - content_type (text, defaults to 'audio/mpeg')
      - created_at (timestamptz)
      - expires_at (timestamptz)

  2. Security
    - Enable RLS on audio_cache table
    - Policy for authenticated users to manage their own cache

  3. Automation
    - Cleanup function and trigger to remove expired entries
*/

-- Remove the cleanup function if it exists to avoid duplication
DROP FUNCTION IF EXISTS cleanup_expired_audio_cache();

-- Create audio_cache table
CREATE TABLE IF NOT EXISTS audio_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  cache_key TEXT NOT NULL,
  audio_data BYTEA NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'audio/mpeg',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  UNIQUE (user_id, cache_key)
);

-- Enable row level security
ALTER TABLE audio_cache ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage their own cache
DROP POLICY IF EXISTS "Users manage their own cache" ON audio_cache;
CREATE POLICY "Users manage their own cache" ON audio_cache
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to cleanup expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_audio_cache()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM audio_cache WHERE expires_at <= NOW();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run cleanup after insert or update
DROP TRIGGER IF EXISTS audio_cache_cleanup ON audio_cache;
CREATE TRIGGER audio_cache_cleanup
  AFTER INSERT OR UPDATE ON audio_cache
  FOR EACH STATEMENT
  EXECUTE FUNCTION cleanup_expired_audio_cache();
