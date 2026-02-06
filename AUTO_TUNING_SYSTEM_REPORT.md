# Auto-Tuning System Implementation Report

## Overview

The auto-tuning system automatically improves the prediction algorithm over time by analyzing evaluation data and adjusting factor weights based on performance. This creates a self-learning system that continuously optimizes prediction accuracy.

## System Architecture

### 1. Database Schema

#### Algorithm Versions Table
```sql
algorithm_versions (
  id UUID PRIMARY KEY,
  version VARCHAR(50) UNIQUE,
  version_number INTEGER,
  weights JSONB,
  notes TEXT,
  description TEXT,
  changes JSONB,
  deployed_at TIMESTAMPTZ,
  deprecated_at TIMESTAMPTZ,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ
)
```

**Key Fields:**
- `weights`: JSON object containing all algorithm weights
- `version_number`: Sequential integer for easy comparison
- `is_active`: Only one version is active at a time
- `changes`: Detailed log of what changed in this version

### 2. Core Components

#### A. Auto-Tuning Engine (`lib/auto-tuning/tuner.ts`)

**Main Function: `autoTuneAlgorithm()`**

Process flow:
1. **Fetch Evaluations** - Gets all evaluated predictions from the last 7 days
2. **Calculate Factor Effectiveness** - Analyzes which factors correlate with accurate predictions
3. **Adjust Weights** - Modifies weights based on performance (max 20% change per cycle)
4. **Calculate Bias Adjustment** - Adjusts home/away bias if predictions are systematically off
5. **Generate New Version** - Creates and activates new algorithm version
6. **Deactivate Old Version** - Marks previous version as deprecated

**Weight Adjustment Algorithm:**
```typescript
// Conservative adjustment: max 20% change per tuning
const maxChange = currentValue * 0.2;
const suggestedChange = (performanceRatio - overallAccuracy) * currentValue;
const actualChange = Math.max(-maxChange, Math.min(maxChange, suggestedChange));

newWeight = Math.max(0.05, Math.min(0.5, currentValue + actualChange));
```

**Home/Away Bias Adjustment:**
```typescript
const homeAccuracy = homeCorrect / homeTotal;
const awayAccuracy = awayCorrect / awayTotal;

// Reduce bonus if too accurate (over-predicting home wins)
const homeAdjustment = (homeAccuracy - 0.5) * -2;
// Reduce handicap if too accurate (over-predicting away wins)
const awayAdjustment = (awayAccuracy - 0.5) * 2;
```

#### B. Version Loader (`lib/auto-tuning/version-loader.ts`)

**Purpose:** Efficiently loads the latest algorithm version with caching

**Features:**
- 5-minute cache to reduce database queries
- Fallback to default weights if database unavailable
- Force refresh option for immediate updates

**Usage:**
```typescript
const version = await getLatestAlgorithmVersion(supabaseUrl, supabaseKey);
const weights = version.weights;
```

#### C. Auto-Tune Cron Job (`app/api/cron/auto-tune/route.ts`)

**Schedule:** Every Monday at 3 AM UTC (weekly)

**Process:**
1. Verify cron secret for security
2. Run auto-tuning algorithm
3. Log results and improvements
4. Return detailed report

**Response Format:**
```json
{
  "success": true,
  "result": {
    "newVersion": 2,
    "evaluationsPeriod": {
      "start": "2026-01-30T03:00:00Z",
      "end": "2026-02-06T03:00:00Z",
      "totalEvaluations": 45
    },
    "performanceMetrics": {
      "oldAccuracy": 62.5,
      "expectedImprovement": 1.8
    },
    "improvements": [
      "Adjusted 3 weight(s) based on performance data",
      "  - formWeight: 0.20 → 0.22 (+10.0%)",
      "Top performing factors: Form, Hjemmebane, Kvalitetsforskel"
    ],
    "factorAnalysis": [...]
  }
}
```

### 3. Integration with Prediction System

#### Updated Generate-Predictions Cron

The prediction generation cron now:
1. Loads the latest algorithm version at startup
2. Passes the version ID to the calculation logger
3. Logs which version was used for each prediction
4. Returns version info in the response

```typescript
const algorithmVersion = await getLatestAlgorithmVersion(supabaseUrl, supabaseKey);
console.log(`🔧 Using algorithm version ${algorithmVersion.version}`);

await CalculationLogger.logCalculation({
  // ... other params
  algorithmVersionId: algorithmVersion.id
});
```

#### Updated Calculation Logger

The calculation logger now:
- Accepts optional `algorithmVersionId` parameter
- Falls back to fetching active version if not provided
- Links all calculations to their algorithm version

## How the System Learns

### Factor Effectiveness Analysis

For each factor (e.g., "Form", "Hjemmebane", "Kvalitetsforskel"):

1. **Count Usage:** How many times was this factor present?
2. **Measure Accuracy:** What was the accuracy when this factor was present?
3. **Compare to Baseline:** Is this better or worse than overall accuracy?
4. **Calculate Adjustment:** Increase weight if effective, decrease if not

**Example:**
```
Factor: "Form"
- Times used: 30
- Accuracy when present: 75%
- Overall accuracy: 62%
- Performance ratio: 75/62 = 1.21
- Current weight: 0.20
- Suggested adjustment: +10%
- New weight: 0.22
```

### Weight Normalization

All weights are kept within safe bounds:
- Minimum: 0.05 (5%)
- Maximum: 0.50 (50%)
- Rounded to 2 decimal places

This prevents any single factor from dominating or becoming irrelevant.

### Version History

Every version change is logged with:
- What weights changed and by how much
- Why the changes were made
- Expected improvement
- Evaluation data used

This creates an audit trail for understanding algorithm evolution.

## Default Weights (Version 1.0.0)

```json
{
  "formWeight": 0.20,
  "goalDifferenceWeight": 0.15,
  "headToHeadWeight": 0.20,
  "homeAdvantageWeight": 0.15,
  "winRateWeight": 0.10,
  "defensiveStrengthWeight": 0.10,
  "qualityGapWeight": 0.25,
  "upsetFactorWeight": 0.15,
  "fixtureCongestionWeight": 0.15,
  "winterBreakWeight": 0.25,
  "homeAdvantageBonus": 10,
  "awayHandicap": 5
}
```

These baseline weights were set based on domain knowledge and will be refined over time.

## Performance Expectations

### Conservative Tuning

The system uses conservative adjustments to avoid:
- Overfitting to recent data
- Wild swings in predictions
- Destabilizing the algorithm

**Limits:**
- Max 20% weight change per tuning cycle
- Weekly tuning frequency (not daily)
- Requires minimum 10 evaluations to tune

### Expected Improvements

Based on the tuning algorithm:
- **Per Cycle:** 0.5-2% accuracy improvement
- **Over Time:** Gradual convergence to optimal weights
- **Plateau:** Eventually reaches diminishing returns

### Monitoring

Key metrics to track:
1. **Accuracy Trend:** Is accuracy improving over versions?
2. **Weight Stability:** Are weights converging or oscillating?
3. **Factor Performance:** Which factors consistently perform well?
4. **Bias Metrics:** Is home/away bias balanced?

## Usage Examples

### Manual Trigger (for testing)

```bash
curl -X GET https://your-domain.com/api/cron/auto-tune \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Query Version History

```sql
SELECT 
  version,
  version_number,
  deployed_at,
  notes,
  weights->>'formWeight' as form_weight,
  weights->>'homeAdvantageBonus' as home_bonus
FROM algorithm_versions
ORDER BY version_number DESC;
```

### Compare Versions

```sql
SELECT 
  av.version,
  COUNT(c.id) as predictions,
  AVG(CASE WHEN c.was_correct THEN 100 ELSE 0 END) as accuracy
FROM algorithm_versions av
LEFT JOIN calculations c ON av.id = c.algorithm_version_id
WHERE c.was_correct IS NOT NULL
GROUP BY av.id, av.version
ORDER BY av.version_number DESC;
```

## Future Enhancements

### Potential Improvements

1. **A/B Testing:** Run multiple versions simultaneously
2. **League-Specific Weights:** Different weights per league
3. **Seasonal Adjustments:** Adapt to season phases
4. **Advanced ML:** Use gradient descent or neural networks
5. **Real-time Tuning:** Adjust during the season, not just weekly

### Data Requirements

For optimal tuning:
- **Minimum:** 20 evaluated predictions per week
- **Ideal:** 50+ evaluated predictions per week
- **Coverage:** Predictions across multiple leagues and match types

## Security Considerations

1. **Cron Secret:** Auto-tune endpoint requires authentication
2. **RLS Policies:** Algorithm versions are read-only for public
3. **Service Role:** Only service role can create new versions
4. **Audit Trail:** All changes are logged with timestamps

## Conclusion

The auto-tuning system creates a self-improving prediction algorithm that:
- ✅ Learns from past predictions
- ✅ Adjusts weights based on performance
- ✅ Maintains version history
- ✅ Operates automatically
- ✅ Provides transparency through logging

This transforms the prediction system from static to adaptive, continuously improving accuracy over time without manual intervention.

---

**Implementation Date:** February 6, 2026  
**Status:** ✅ Fully Implemented  
**Next Review:** After first auto-tuning cycle (1 week)
