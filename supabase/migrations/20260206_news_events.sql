-- Create news_events table for tracking match-relevant news
CREATE TABLE IF NOT EXISTS news_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league TEXT NOT NULL,
  team TEXT NOT NULL,
  player TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('injury', 'suspension', 'lineup_change', 'transfer', 'rumor', 'return', 'doubt')),
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  source_url TEXT,
  summary TEXT NOT NULL,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  content_hash TEXT NOT NULL UNIQUE, -- To prevent duplicates
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX idx_news_events_league ON news_events(league);
CREATE INDEX idx_news_events_team ON news_events(team);
CREATE INDEX idx_news_events_player ON news_events(player);
CREATE INDEX idx_news_events_type ON news_events(event_type);
CREATE INDEX idx_news_events_detected_at ON news_events(detected_at DESC);
CREATE INDEX idx_news_events_content_hash ON news_events(content_hash);

-- Create a composite index for common queries
CREATE INDEX idx_news_events_team_date ON news_events(team, detected_at DESC);

-- Add RLS policies
ALTER TABLE news_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access to news events
CREATE POLICY "Allow public read access to news_events"
  ON news_events
  FOR SELECT
  TO public
  USING (true);

-- Only allow service role to insert/update/delete
CREATE POLICY "Allow service role full access to news_events"
  ON news_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_news_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER news_events_updated_at
  BEFORE UPDATE ON news_events
  FOR EACH ROW
  EXECUTE FUNCTION update_news_events_updated_at();

-- Add comment
COMMENT ON TABLE news_events IS 'Stores match-relevant news events like injuries, suspensions, and lineup changes';
