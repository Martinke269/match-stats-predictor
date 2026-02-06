-- =====================================================
-- CALCULATION TRACKING SYSTEM
-- Complete data model for storing, evaluating and improving predictions
-- =====================================================

-- Algorithm version tracking
CREATE TABLE IF NOT EXISTS algorithm_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  changes JSONB, -- What changed in this version
  deployed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deprecated_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Main calculations table - stores every prediction calculation
CREATE TABLE IF NOT EXISTS calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  algorithm_version_id UUID NOT NULL REFERENCES algorithm_versions(id),
  
  -- Calculation metadata
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  calculation_duration_ms INTEGER, -- How long the calculation took
  
  -- Results
  home_win_probability DECIMAL(5,2) NOT NULL,
  draw_probability DECIMAL(5,2) NOT NULL,
  away_win_probability DECIMAL(5,2) NOT NULL,
  predicted_home_score INTEGER NOT NULL,
  predicted_away_score INTEGER NOT NULL,
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  
  -- Evaluation (filled in after match completes)
  actual_home_score INTEGER,
  actual_away_score INTEGER,
  was_correct BOOLEAN, -- Did we predict the correct outcome?
  accuracy_score DECIMAL(5,2), -- 0-100 score based on how close we were
  evaluation_type VARCHAR(50), -- 'exact_score', 'correct_outcome', 'incorrect'
  evaluated_at TIMESTAMPTZ,
  
  -- Indexes for fast queries
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Calculation inputs - stores all input data used for each calculation
CREATE TABLE IF NOT EXISTS calculation_inputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculation_id UUID NOT NULL REFERENCES calculations(id) ON DELETE CASCADE,
  
  -- Team data snapshots at time of calculation
  home_team_id UUID NOT NULL REFERENCES teams(id),
  away_team_id UUID NOT NULL REFERENCES teams(id),
  home_team_stats JSONB NOT NULL, -- Complete team stats at calculation time
  away_team_stats JSONB NOT NULL,
  home_team_form VARCHAR(10) NOT NULL, -- e.g., "WWDLW"
  away_team_form VARCHAR(10) NOT NULL,
  
  -- Match context
  match_date TIMESTAMPTZ NOT NULL,
  league VARCHAR(100) NOT NULL,
  is_derby BOOLEAN DEFAULT false,
  
  -- Optional contextual factors
  after_winter_break BOOLEAN DEFAULT false,
  winter_break_months INTEGER,
  home_fixture_congestion JSONB, -- {europeanCompetition: bool, cupMatches: int}
  away_fixture_congestion JSONB,
  head_to_head_stats JSONB, -- Complete H2H data
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Calculation factors - stores all factors that influenced the prediction
CREATE TABLE IF NOT EXISTS calculation_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculation_id UUID NOT NULL REFERENCES calculations(id) ON DELETE CASCADE,
  
  factor_name VARCHAR(100) NOT NULL,
  factor_impact VARCHAR(20) NOT NULL CHECK (factor_impact IN ('positive', 'negative', 'neutral')),
  factor_weight DECIMAL(4,2) NOT NULL,
  factor_description TEXT NOT NULL,
  
  -- For analysis: which factors correlate with accuracy?
  factor_category VARCHAR(50), -- 'form', 'quality', 'h2h', 'congestion', etc.
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Calculation metadata - stores additional context and configuration
CREATE TABLE IF NOT EXISTS calculation_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculation_id UUID NOT NULL REFERENCES calculations(id) ON DELETE CASCADE,
  
  -- Configuration used
  options_used JSONB NOT NULL, -- All options passed to predictMatch()
  
  -- Intermediate calculations (for debugging/analysis)
  home_quality_score DECIMAL(5,2),
  away_quality_score DECIMAL(5,2),
  quality_gap DECIMAL(5,2),
  home_form_score DECIMAL(5,2),
  away_form_score DECIMAL(5,2),
  upset_bonus DECIMAL(5,2),
  is_home_underdog BOOLEAN,
  
  -- System info
  user_agent TEXT,
  ip_address INET,
  request_source VARCHAR(50), -- 'cron', 'api', 'manual', 'quick-predict'
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Calculation errors - logs any errors or warnings during calculation
CREATE TABLE IF NOT EXISTS calculation_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculation_id UUID REFERENCES calculations(id) ON DELETE SET NULL,
  match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
  
  error_type VARCHAR(50) NOT NULL, -- 'error', 'warning', 'edge_case'
  error_code VARCHAR(100),
  error_message TEXT NOT NULL,
  error_stack TEXT,
  
  -- Context
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  request_data JSONB, -- What was being processed when error occurred
  system_state JSONB, -- Any relevant system state
  
  -- Resolution
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Edge cases - tracks unusual scenarios for analysis
CREATE TABLE IF NOT EXISTS calculation_edge_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculation_id UUID NOT NULL REFERENCES calculations(id) ON DELETE CASCADE,
  
  edge_case_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  
  -- Data that triggered the edge case
  trigger_data JSONB,
  
  -- How it was handled
  handling_strategy TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance metrics - tracks system performance over time
CREATE TABLE IF NOT EXISTS calculation_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Time period
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  
  -- Aggregate metrics
  total_calculations INTEGER NOT NULL,
  avg_calculation_time_ms DECIMAL(10,2),
  max_calculation_time_ms INTEGER,
  min_calculation_time_ms INTEGER,
  
  -- Accuracy metrics
  total_evaluated INTEGER,
  correct_predictions INTEGER,
  exact_score_predictions INTEGER,
  avg_accuracy_score DECIMAL(5,2),
  avg_confidence DECIMAL(5,2),
  
  -- By algorithm version
  algorithm_version_id UUID REFERENCES algorithm_versions(id),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_calculations_match_id ON calculations(match_id);
CREATE INDEX idx_calculations_algorithm_version ON calculations(algorithm_version_id);
CREATE INDEX idx_calculations_calculated_at ON calculations(calculated_at DESC);
CREATE INDEX idx_calculations_was_correct ON calculations(was_correct) WHERE was_correct IS NOT NULL;
CREATE INDEX idx_calculations_evaluation_type ON calculations(evaluation_type) WHERE evaluation_type IS NOT NULL;

CREATE INDEX idx_calculation_inputs_calculation_id ON calculation_inputs(calculation_id);
CREATE INDEX idx_calculation_inputs_home_team ON calculation_inputs(home_team_id);
CREATE INDEX idx_calculation_inputs_away_team ON calculation_inputs(away_team_id);
CREATE INDEX idx_calculation_inputs_league ON calculation_inputs(league);

CREATE INDEX idx_calculation_factors_calculation_id ON calculation_factors(calculation_id);
CREATE INDEX idx_calculation_factors_category ON calculation_factors(factor_category);
CREATE INDEX idx_calculation_factors_impact ON calculation_factors(factor_impact);

CREATE INDEX idx_calculation_metadata_calculation_id ON calculation_metadata(calculation_id);
CREATE INDEX idx_calculation_metadata_source ON calculation_metadata(request_source);

CREATE INDEX idx_calculation_errors_occurred_at ON calculation_errors(occurred_at DESC);
CREATE INDEX idx_calculation_errors_type ON calculation_errors(error_type);
CREATE INDEX idx_calculation_errors_resolved ON calculation_errors(resolved);

CREATE INDEX idx_calculation_edge_cases_calculation_id ON calculation_edge_cases(calculation_id);
CREATE INDEX idx_calculation_edge_cases_type ON calculation_edge_cases(edge_case_type);
CREATE INDEX idx_calculation_edge_cases_severity ON calculation_edge_cases(severity);

CREATE INDEX idx_calculation_performance_period ON calculation_performance(period_start, period_end);
CREATE INDEX idx_calculation_performance_version ON calculation_performance(algorithm_version_id);

-- =====================================================
-- TRIGGERS FOR AUTO-UPDATE
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_calculations_updated_at
  BEFORE UPDATE ON calculations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS FOR EASY QUERYING
-- =====================================================

-- View: Recent calculations with full context
CREATE OR REPLACE VIEW v_recent_calculations AS
SELECT 
  c.id,
  c.match_id,
  c.calculated_at,
  c.home_win_probability,
  c.draw_probability,
  c.away_win_probability,
  c.predicted_home_score,
  c.predicted_away_score,
  c.confidence,
  c.was_correct,
  c.accuracy_score,
  c.evaluation_type,
  av.version as algorithm_version,
  ci.home_team_id,
  ci.away_team_id,
  ci.league,
  m.date as match_date,
  m.status as match_status
FROM calculations c
JOIN algorithm_versions av ON c.algorithm_version_id = av.id
JOIN calculation_inputs ci ON c.id = ci.calculation_id
JOIN matches m ON c.match_id = m.id
ORDER BY c.calculated_at DESC;

-- View: Accuracy by algorithm version
CREATE OR REPLACE VIEW v_algorithm_accuracy AS
SELECT 
  av.version,
  av.deployed_at,
  COUNT(c.id) as total_predictions,
  COUNT(c.was_correct) as evaluated_predictions,
  SUM(CASE WHEN c.was_correct = true THEN 1 ELSE 0 END) as correct_predictions,
  ROUND(AVG(CASE WHEN c.was_correct IS NOT NULL THEN 
    CASE WHEN c.was_correct THEN 100 ELSE 0 END 
  END), 2) as accuracy_percentage,
  ROUND(AVG(c.confidence), 2) as avg_confidence,
  ROUND(AVG(c.accuracy_score), 2) as avg_accuracy_score
FROM algorithm_versions av
LEFT JOIN calculations c ON av.id = c.algorithm_version_id
GROUP BY av.id, av.version, av.deployed_at
ORDER BY av.deployed_at DESC;

-- View: Factor effectiveness analysis
CREATE OR REPLACE VIEW v_factor_effectiveness AS
SELECT 
  cf.factor_name,
  cf.factor_category,
  cf.factor_impact,
  COUNT(cf.id) as times_used,
  ROUND(AVG(c.confidence), 2) as avg_confidence_when_present,
  ROUND(AVG(CASE WHEN c.was_correct IS NOT NULL THEN 
    CASE WHEN c.was_correct THEN 100 ELSE 0 END 
  END), 2) as accuracy_when_present
FROM calculation_factors cf
JOIN calculations c ON cf.calculation_id = c.id
WHERE c.was_correct IS NOT NULL
GROUP BY cf.factor_name, cf.factor_category, cf.factor_impact
ORDER BY times_used DESC;

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert initial algorithm version
INSERT INTO algorithm_versions (version, description, changes, is_active)
VALUES (
  '1.0.0',
  'Initial modular prediction engine with comprehensive tracking',
  '{"features": ["Modular architecture", "Factor analysis", "Probability calculation", "Comprehensive logging"]}',
  true
)
ON CONFLICT (version) DO NOTHING;

-- =====================================================
-- RLS POLICIES (Security)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE algorithm_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_edge_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_performance ENABLE ROW LEVEL SECURITY;

-- Public read access to algorithm versions
CREATE POLICY "Algorithm versions are viewable by everyone"
  ON algorithm_versions FOR SELECT
  USING (true);

-- Public read access to calculations (anonymized)
CREATE POLICY "Calculations are viewable by everyone"
  ON calculations FOR SELECT
  USING (true);

-- Public read access to calculation inputs
CREATE POLICY "Calculation inputs are viewable by everyone"
  ON calculation_inputs FOR SELECT
  USING (true);

-- Public read access to calculation factors
CREATE POLICY "Calculation factors are viewable by everyone"
  ON calculation_factors FOR SELECT
  USING (true);

-- Public read access to calculation metadata (excluding sensitive fields)
CREATE POLICY "Calculation metadata is viewable by everyone"
  ON calculation_metadata FOR SELECT
  USING (true);

-- Public read access to errors (for transparency)
CREATE POLICY "Calculation errors are viewable by everyone"
  ON calculation_errors FOR SELECT
  USING (true);

-- Public read access to edge cases
CREATE POLICY "Calculation edge cases are viewable by everyone"
  ON calculation_edge_cases FOR SELECT
  USING (true);

-- Public read access to performance metrics
CREATE POLICY "Performance metrics are viewable by everyone"
  ON calculation_performance FOR SELECT
  USING (true);

-- Service role can insert/update everything
CREATE POLICY "Service role can manage algorithm versions"
  ON algorithm_versions FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage calculations"
  ON calculations FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage calculation inputs"
  ON calculation_inputs FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage calculation factors"
  ON calculation_factors FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage calculation metadata"
  ON calculation_metadata FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage calculation errors"
  ON calculation_errors FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage calculation edge cases"
  ON calculation_edge_cases FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage performance metrics"
  ON calculation_performance FOR ALL
  USING (auth.role() = 'service_role');
