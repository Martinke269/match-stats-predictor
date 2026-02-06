-- Create prediction_runs table to track batch prediction executions
CREATE TABLE IF NOT EXISTS prediction_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_type TEXT NOT NULL CHECK (run_type IN ('daily', 'manual', 'cron', 'batch')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  total_predictions INTEGER DEFAULT 0,
  updated_predictions INTEGER DEFAULT 0,
  new_predictions INTEGER DEFAULT 0,
  failed_predictions INTEGER DEFAULT 0,
  algorithm_version_id UUID REFERENCES algorithm_versions(id),
  notes TEXT,
  error_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX idx_prediction_runs_run_type ON prediction_runs(run_type);
CREATE INDEX idx_prediction_runs_started_at ON prediction_runs(started_at DESC);
CREATE INDEX idx_prediction_runs_algorithm_version ON prediction_runs(algorithm_version_id);

-- Add RLS policies
ALTER TABLE prediction_runs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to prediction runs
CREATE POLICY "Allow public read access to prediction_runs"
  ON prediction_runs
  FOR SELECT
  TO public
  USING (true);

-- Only service role can insert/update prediction runs
CREATE POLICY "Allow service role to manage prediction_runs"
  ON prediction_runs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add columns to predictions table to track versions and updates
ALTER TABLE predictions 
  ADD COLUMN IF NOT EXISTS algorithm_version_id UUID REFERENCES algorithm_versions(id),
  ADD COLUMN IF NOT EXISTS prediction_run_id UUID REFERENCES prediction_runs(id),
  ADD COLUMN IF NOT EXISTS news_events_considered JSONB,
  ADD COLUMN IF NOT EXISTS last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS update_reason TEXT;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_predictions_algorithm_version ON predictions(algorithm_version_id);
CREATE INDEX IF NOT EXISTS idx_predictions_prediction_run ON predictions(prediction_run_id);
CREATE INDEX IF NOT EXISTS idx_predictions_last_updated ON predictions(last_updated_at DESC);

-- Create a unique constraint to prevent duplicate predictions per match
-- (allowing updates but preventing multiple active predictions)
CREATE UNIQUE INDEX IF NOT EXISTS idx_predictions_match_unique 
  ON predictions(match_id) 
  WHERE actual_home_score IS NULL;

COMMENT ON TABLE prediction_runs IS 'Tracks batch prediction generation runs for monitoring and debugging';
COMMENT ON COLUMN prediction_runs.run_type IS 'Type of run: daily (automated daily), manual (user-triggered), cron (scheduled), batch (large batch processing)';
COMMENT ON COLUMN prediction_runs.total_predictions IS 'Total number of predictions processed in this run';
COMMENT ON COLUMN prediction_runs.updated_predictions IS 'Number of existing predictions that were updated';
COMMENT ON COLUMN prediction_runs.new_predictions IS 'Number of new predictions created';
COMMENT ON COLUMN prediction_runs.failed_predictions IS 'Number of predictions that failed to generate';
COMMENT ON COLUMN predictions.algorithm_version_id IS 'References the algorithm version used to generate this prediction';
COMMENT ON COLUMN predictions.prediction_run_id IS 'References the batch run that generated/updated this prediction';
COMMENT ON COLUMN predictions.news_events_considered IS 'JSON array of news event IDs that were considered for this prediction';
COMMENT ON COLUMN predictions.last_updated_at IS 'Timestamp of when this prediction was last updated';
COMMENT ON COLUMN predictions.update_reason IS 'Reason for updating the prediction (e.g., "news_impact_changed", "algorithm_updated", "daily_refresh")';
