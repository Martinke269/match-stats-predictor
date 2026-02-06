# Self-Evaluation System Implementation Report

## Oversigt

Dette dokument beskriver implementeringen af et selvstændigt evalueringssystem til AIMatchPredictor, der gør systemet i stand til at evaluere kvaliteten af sine egne forudsigelser over tid.

## Dato
6. februar 2026

---

## 1. Datafelter til Evaluering

### 1.1 Eksisterende Felter i `calculations` Tabellen

Følgende felter var allerede implementeret i databasen:

```sql
-- Forudsigelsesdata
predicted_home_score INTEGER
predicted_away_score INTEGER
home_win_probability DECIMAL(5,2)
draw_probability DECIMAL(5,2)
away_win_probability DECIMAL(5,2)
confidence INTEGER (0-100)

-- Faktiske resultater
actual_home_score INTEGER
actual_away_score INTEGER

-- Evalueringsresultater
was_correct BOOLEAN
accuracy_score DECIMAL(5,2) (0-100)
evaluation_type VARCHAR(50) -- 'exact_score', 'correct_outcome', 'incorrect'
evaluated_at TIMESTAMPTZ

-- Metadata
algorithm_version_id UUID
calculation_duration_ms INTEGER
calculated_at TIMESTAMPTZ
```

### 1.2 Supplerende Data fra Relaterede Tabeller

**calculation_inputs:**
- `league` - Liga for performance tracking
- `home_team_id`, `away_team_id` - Team-specifik performance
- `match_date` - Tidsbaseret analyse

**calculation_factors:**
- `factor_name` - Hvilke faktorer blev brugt
- `factor_impact` - Positiv/negativ påvirkning
- `factor_weight` - Vægtning af faktor
- `factor_category` - Kategori (form, quality, h2h, etc.)

**algorithm_versions:**
- `version` - Algoritmeversion
- `deployed_at` - Deployment tidspunkt
- `is_active` - Aktiv status

---

## 2. Evalueringsfunktionalitet

### 2.1 Nye Evalueringsmoduler

#### `lib/evaluation/metrics.ts`

Implementerer avancerede evalueringsmetrics:

**Basis Metrics:**
- `accuracy` - Procentdel af korrekte resultatforudsigelser
- `exactScoreRate` - Procentdel af eksakte score-forudsigelser

**Fejl Metrics:**
- `mae` - Mean Absolute Error for score-forudsigelser
- `rmse` - Root Mean Square Error
- `maeHomeScore` - MAE specifikt for hjemmeholdsscore
- `maeAwayScore` - MAE specifikt for udeholdsscore

**Sandsynligheds Metrics:**
- `brier` - Brier score for sandsynlighedsnøjagtighed
- `logLoss` - Log loss (straffer sikre forkerte forudsigelser)

**Confidence Metrics:**
- `calibration` - Hvor godt confidence matcher faktisk accuracy
- `overconfidence` - Tendens til at være overselvsikker

**Funktioner:**
```typescript
evaluatePrediction() - Evaluerer en enkelt forudsigelse
calculateAggregateMetrics() - Beregner aggregerede metrics
formatMetrics() - Formaterer metrics til visning
```

#### `lib/evaluation/analyzer.ts`

Analyserer performance på tværs af forskellige dimensioner:

**Analyse Funktioner:**
```typescript
getPerformanceByLeague() - Performance per liga
getPerformanceByTeam() - Performance per hold (hjemme/ude/samlet)
getPerformanceByAlgorithm() - Performance per algoritmeversion
getPerformanceByFactor() - Hvilke faktorer korrelerer med succes
getPerformanceOverTime() - Performance over tid (ugentligt/månedligt)
```

### 2.2 Opdateret Calculation Logger

`lib/calculation-logger.ts` er opdateret til at bruge de nye evalueringsmetrics:

```typescript
static async evaluateCalculation(
  calculationId: string,
  actualHomeScore: number,
  actualAwayScore: number
): Promise<void>
```

**Forbedringer:**
- Bruger `evaluatePrediction()` fra metrics modulet
- Beregner MAE, RMSE, Brier score, log loss
- Logger detaljerede metrics i konsollen
- Gemmer evalueringsresultater i databasen

---

## 3. Cron Job: evaluate-predictions

### 3.1 Eksisterende Funktionalitet

Cron jobbet `app/api/cron/evaluate-predictions/route.ts` var allerede implementeret med:

- Finder alle færdige kampe med unevaluerede forudsigelser
- Henter faktiske resultater fra `matches` tabellen
- Kalder `CalculationLogger.evaluateCalculation()`
- Opdaterer også legacy `predictions` tabel for bagudkompatibilitet

### 3.2 Forbedret Evaluering

Med de nye metrics beregnes nu automatisk:
- Accuracy score (0-100) baseret på korrekthed
- MAE for score-forudsigelser
- Brier score for sandsynlighedsnøjagtighed
- Log loss for confidence-kalibrering

### 3.3 Evaluerings Logik

```typescript
// Exact score: 100 points
if (exactScore) accuracyScore = 100

// Correct outcome: 50-80 points (baseret på goal difference accuracy)
else if (wasCorrect) {
  const gdError = Math.abs(predictedGD - actualGD)
  accuracyScore = Math.max(50, 80 - (gdError * 10))
}

// Incorrect: 0-40 points (baseret på sandsynlighed for faktisk resultat)
else {
  accuracyScore = Math.min(40, actualProbability / 2)
}
```

---

## 4. Performance Tracking Over Tid

### 4.1 Eksisterende Database Views

Databasen har allerede følgende views til analyse:

**v_recent_calculations:**
- Viser seneste beregninger med fuld kontekst
- Inkluderer match info, team info, evaluering

**v_algorithm_accuracy:**
- Accuracy per algoritmeversion
- Total predictions, evaluated predictions, correct predictions
- Gennemsnitlig confidence og accuracy score

**v_factor_effectiveness:**
- Hvilke faktorer bruges mest
- Accuracy når faktor er til stede
- Gennemsnitlig confidence

### 4.2 Nye Analyse Muligheder

Med de nye analyzer funktioner kan systemet nu tracke:

**Per Liga:**
```typescript
const leaguePerformance = await EvaluationAnalyzer.getPerformanceByLeague()
// Returns: accuracy, MAE, RMSE, Brier score per liga
```

**Per Hold:**
```typescript
const teamPerformance = await EvaluationAnalyzer.getPerformanceByTeam()
// Returns: performance som hjemmehold, udehold, og samlet
```

**Per Algoritme:**
```typescript
const algorithmPerformance = await EvaluationAnalyzer.getPerformanceByAlgorithm()
// Returns: performance per version med deployment dato
```

**Per Faktor:**
```typescript
const factorPerformance = await EvaluationAnalyzer.getPerformanceByFactor()
// Returns: hvilke faktorer korrelerer med succes
```

**Over Tid:**
```typescript
const timePerformance = await EvaluationAnalyzer.getPerformanceOverTime(7)
// Returns: performance per uge (eller anden periode)
```

---

## 5. Hvor Evaluering Udføres

### 5.1 Automatisk Evaluering

**Cron Job:**
- Fil: `app/api/cron/evaluate-predictions/route.ts`
- Trigger: Automatisk via Vercel Cron (dagligt)
- Proces:
  1. Finder unevaluerede calculations med færdige kampe
  2. Henter faktiske scores fra matches tabel
  3. Kalder `CalculationLogger.evaluateCalculation()`
  4. Gemmer evalueringsresultater

### 5.2 Evaluerings Pipeline

```
Match Færdig
    ↓
Cron Job Trigger
    ↓
Hent Unevaluerede Calculations
    ↓
For hver calculation:
    ↓
Hent Faktiske Scores
    ↓
Beregn Metrics (evaluatePrediction)
    ↓
Gem Evaluering i Database
    ↓
Log Resultater
```

### 5.3 Kode Lokationer

**Evaluerings Logik:**
- `lib/evaluation/metrics.ts` - Metric beregninger
- `lib/evaluation/analyzer.ts` - Performance analyse
- `lib/calculation-logger.ts` - Evaluerings funktion

**Cron Job:**
- `app/api/cron/evaluate-predictions/route.ts` - Automatisk evaluering

**Database:**
- `supabase/migrations/20260206_calculation_tracking.sql` - Schema
- Views: `v_algorithm_accuracy`, `v_factor_effectiveness`

---

## 6. Hvad Kan Forbedres

### 6.1 Kort Sigt (Næste Sprint)

1. **UI Dashboard for Evaluering**
   - Visualiser accuracy over tid
   - Sammenlign algoritmeversioner
   - Vis factor effectiveness

2. **Real-time Metrics**
   - Live opdatering af performance metrics
   - Alerts ved performance degradation

3. **A/B Testing Framework**
   - Test nye algoritmeversioner mod hinanden
   - Automatisk rollback ved dårlig performance

### 6.2 Mellem Sigt

4. **Machine Learning Integration**
   - Brug evalueringsdata til at træne ML modeller
   - Automatisk justering af factor weights
   - Predictive confidence scoring

5. **Advanced Analytics**
   - Correlation analysis mellem faktorer
   - Seasonal performance patterns
   - Home/away bias detection

6. **Performance Optimization**
   - Cache frequently accessed metrics
   - Batch evaluation processing
   - Incremental metric updates

### 6.3 Lang Sigt

7. **Self-Improving System**
   - Automatisk algoritme tuning baseret på evaluering
   - Dynamic factor weighting
   - Adaptive confidence scoring

8. **Comprehensive Reporting**
   - Automatiske performance rapporter
   - Stakeholder dashboards
   - Export til BI tools

9. **Quality Assurance**
   - Automated testing af nye algoritmeversioner
   - Performance benchmarks
   - Regression detection

---

## 7. Teknisk Dokumentation

### 7.1 Evaluerings Metrics Formler

**Mean Absolute Error (MAE):**
```
MAE = Σ|predicted - actual| / n
```

**Root Mean Square Error (RMSE):**
```
RMSE = √(Σ(predicted - actual)² / n)
```

**Brier Score:**
```
Brier = Σ(probability - outcome)² / n
hvor outcome ∈ {0, 1}
```

**Log Loss:**
```
LogLoss = -log(probability_of_actual_outcome)
```

**Calibration:**
```
Calibration = 100 - |avg_confidence - avg_accuracy|
```

### 7.2 Database Queries

**Hent Unevaluerede Calculations:**
```sql
SELECT c.*, m.home_score, m.away_score
FROM calculations c
INNER JOIN matches m ON c.match_id = m.id
WHERE c.evaluated_at IS NULL
  AND m.status = 'finished'
  AND m.home_score IS NOT NULL
  AND m.away_score IS NOT NULL
```

**Performance Per Liga:**
```sql
SELECT 
  ci.league,
  COUNT(*) as total,
  AVG(c.accuracy_score) as avg_accuracy,
  SUM(CASE WHEN c.was_correct THEN 1 ELSE 0 END)::float / COUNT(*) * 100 as accuracy_pct
FROM calculations c
JOIN calculation_inputs ci ON c.id = ci.calculation_id
WHERE c.evaluated_at IS NOT NULL
GROUP BY ci.league
ORDER BY accuracy_pct DESC
```

---

## 8. Konklusion

Selvstændigt evalueringssystem er nu fuldt implementeret med:

✅ **Omfattende Metrics** - MAE, RMSE, Brier, Log Loss, Calibration
✅ **Multi-dimensional Analyse** - Liga, hold, algoritme, faktor, tid
✅ **Automatisk Evaluering** - Cron job evaluerer dagligt
✅ **Performance Tracking** - Database views og analyzer funktioner
✅ **Skalerbar Arkitektur** - Modulær design, let at udvide

Systemet kan nu:
- Evaluere sine egne forudsigelser automatisk
- Tracke performance over tid
- Identificere hvilke faktorer der virker bedst
- Sammenligne algoritmeversioner
- Opdage performance problemer tidligt

**Næste Skridt:**
1. Implementer UI dashboard for visualisering
2. Tilføj alerts ved performance degradation
3. Start A/B testing af nye algoritmeversioner

---

## Appendix: Kode Eksempler

### Brug af Evaluation Metrics

```typescript
import { evaluatePrediction, calculateAggregateMetrics } from '@/lib/evaluation/metrics';

// Evaluer en enkelt forudsigelse
const evaluation = evaluatePrediction(
  2, 1,  // predicted scores
  2, 0,  // actual scores
  65, 20, 15,  // probabilities
  75  // confidence
);

console.log(`Accuracy: ${evaluation.accuracyScore}%`);
console.log(`MAE: ${evaluation.totalScoreError}`);
console.log(`Brier: ${evaluation.brierScore}`);
```

### Brug af Evaluation Analyzer

```typescript
import { EvaluationAnalyzer } from '@/lib/evaluation/analyzer';

// Hent performance per liga
const leaguePerf = await EvaluationAnalyzer.getPerformanceByLeague();
leaguePerf.forEach(league => {
  console.log(`${league.league}: ${league.metrics.accuracy.toFixed(1)}% accuracy`);
});

// Hent performance over tid
const timePerf = await EvaluationAnalyzer.getPerformanceOverTime(7);
timePerf.forEach(period => {
  console.log(`${period.period}: ${period.metrics.accuracy.toFixed(1)}%`);
});
```

---

**Rapport Oprettet:** 6. februar 2026  
**Version:** 1.0  
**Status:** ✅ Implementeret og Testet
