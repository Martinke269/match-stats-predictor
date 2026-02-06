# Calculation Tracking System - Komplet Dokumentation

## Oversigt

Dette dokument beskriver det omfattende system til tracking, evaluering og forbedring af fodboldkamp-predictions. Systemet gemmer alle input, beregninger, resultater og metadata for at muliggøre kontinuerlig forbedring af algoritmen.

## Problemer der blev løst

### Før implementeringen manglede systemet:

1. **Ingen logging af input data** - Vi vidste ikke hvilke data der blev brugt til hver beregning
2. **Ingen tracking af beregningsprocessen** - Ingen information om hvordan predictions blev beregnet
3. **Ingen evaluering** - Ingen sammenligning mellem forudsigelser og faktiske resultater
4. **Ingen fejlhåndtering** - Fejl forsvandt uden spor
5. **Ingen mulighed for forbedring** - Ingen data til at analysere hvad der virker og hvad der ikke gør
6. **Ingen versionering** - Ingen måde at spore ændringer i algoritmen over tid

### Efter implementeringen har systemet:

1. ✅ **Komplet input logging** - Alle team stats, form, og kontekst gemmes
2. ✅ **Detaljeret beregningstracking** - Alle faktorer og mellemregninger logges
3. ✅ **Automatisk evaluering** - Predictions sammenlignes med faktiske resultater
4. ✅ **Robust fejlhåndtering** - Alle fejl logges med kontekst
5. ✅ **Selv-evaluering** - Systemet kan analysere sin egen præcision
6. ✅ **Algoritme versionering** - Alle ændringer trackes med version numre

## Arkitektur

### 1. Modulariseret Prediction Engine

Prediction engine er opdelt i mindre, vedligeholdelsesvenlige moduler:

```
lib/prediction/
├── engine.ts          # Hovedklasse - orchestrerer beregninger
├── calculators.ts     # Hjælpefunktioner (form, quality, etc.)
├── factors.ts         # Faktor analyse (h2h, form, quality gap, etc.)
└── probability.ts     # Sandsynlighedsberegninger og score predictions
```

**Fordele:**
- Lettere at teste individuelle komponenter
- Bedre kode organisation
- Nemmere at udvide med nye features
- Backward compatible via re-exports i `lib/prediction-engine.ts`

### 2. Database Schema

#### Tabeller

**algorithm_versions**
- Tracker hver version af prediction algoritmen
- Gemmer hvad der ændrede sig i hver version
- Muliggør sammenligning af forskellige algoritme versioner

**calculations**
- Hovedtabel for hver prediction beregning
- Gemmer alle output værdier (probabilities, predicted score, confidence)
- Gemmer evaluering når kampen er færdig (was_correct, accuracy_score)

**calculation_inputs**
- Snapshot af alle input data på beregningstidspunktet
- Team stats, form, league, match context
- Fixture congestion, winter break status, head-to-head data

**calculation_factors**
- Alle faktorer der påvirkede predictionen
- Kategoriseret for analyse (form, quality, h2h, etc.)
- Vægt og impact (positive/negative/neutral)

**calculation_metadata**
- Konfiguration brugt til beregningen
- Mellemregninger (quality scores, form scores, etc.)
- System info (user agent, IP, request source)

**calculation_errors**
- Logger alle fejl og warnings
- Inkluderer stack traces og kontekst
- Kan markeres som resolved

**calculation_edge_cases**
- Tracker usædvanlige scenarier
- Severity levels (low/medium/high)
- Dokumenterer hvordan de blev håndteret

**calculation_performance**
- Aggregerede metrics over tid
- Performance (calculation time)
- Accuracy metrics (correct predictions, avg accuracy)

#### Views

**v_recent_calculations**
- Nem adgang til seneste beregninger med fuld kontekst

**v_algorithm_accuracy**
- Accuracy metrics per algoritme version
- Sammenlign forskellige versioner

**v_factor_effectiveness**
- Hvilke faktorer korrelerer med høj accuracy?
- Bruges til at tune algoritmen

### 3. Calculation Logger

`lib/calculation-logger.ts` - Centraliseret logging system

**Hovedfunktioner:**

```typescript
// Log en komplet beregning
CalculationLogger.logCalculation({
  matchId,
  homeTeam,
  awayTeam,
  prediction,
  options,
  calculationDurationMs,
  requestSource: 'cron' | 'api' | 'manual' | 'quick-predict',
  intermediateData: {
    homeQualityScore,
    awayQualityScore,
    qualityGap,
    homeFormScore,
    awayFormScore,
    upsetBonus,
    isHomeUnderdog
  }
});

// Log fejl
CalculationLogger.logError({
  matchId,
  errorType: 'error' | 'warning' | 'edge_case',
  errorCode,
  errorMessage,
  errorStack,
  requestData
});

// Log edge case
CalculationLogger.logEdgeCase({
  calculationId,
  edgeCaseType,
  description,
  severity: 'low' | 'medium' | 'high',
  triggerData,
  handlingStrategy
});

// Evaluer prediction efter kamp
CalculationLogger.evaluateCalculation(
  calculationId,
  actualHomeScore,
  actualAwayScore
);
```

## Data Flow

### 1. Prediction Generation (Cron Job)

```
app/api/cron/generate-predictions/route.ts
↓
1. Hent kampe uden predictions
2. For hver kamp:
   a. Start timer
   b. Kald PredictionEngine.predictMatch()
   c. Beregn intermediate data (quality scores, form scores)
   d. Log komplet calculation via CalculationLogger
   e. Gem i legacy predictions table (backward compatibility)
3. Returner statistik
```

**Logging inkluderer:**
- Match ID og team data
- Alle prediction outputs
- Alle faktorer der påvirkede
- Beregningens varighed
- Intermediate beregninger
- Request source ('cron')

### 2. Prediction Evaluation (Cron Job)

```
app/api/cron/evaluate-predictions/route.ts
↓
1. Find færdige kampe med unevaluerede predictions
2. For hver calculation:
   a. Hent faktisk resultat
   b. Sammenlign med prediction
   c. Beregn accuracy score (0-100)
   d. Opdater calculation med evaluering
3. Opdater også legacy predictions table
4. Returner statistik
```

**Evaluation types:**
- `exact_score` - Præcis score forudsagt (100 points)
- `correct_outcome` - Korrekt vinder/uafgjort (50-80 points)
- `incorrect` - Forkert outcome (0-40 points)

### 3. Quick Predict Flow

Når brugere bruger quick-predict funktionen, logges det også:

```typescript
const prediction = PredictionEngine.predictMatch(homeTeam, awayTeam, matchId);

await CalculationLogger.logCalculation({
  matchId,
  homeTeam,
  awayTeam,
  prediction,
  requestSource: 'quick-predict',
  userAgent: request.headers.get('user-agent'),
  // ... andre data
});
```

## Selv-Evaluering

Systemet kan nu evaluere sig selv på flere måder:

### 1. Overall Accuracy

```sql
SELECT 
  COUNT(*) as total_evaluated,
  SUM(CASE WHEN was_correct THEN 1 ELSE 0 END) as correct,
  ROUND(AVG(CASE WHEN was_correct THEN 100 ELSE 0 END), 2) as accuracy_pct,
  ROUND(AVG(accuracy_score), 2) as avg_accuracy_score,
  ROUND(AVG(confidence), 2) as avg_confidence
FROM calculations
WHERE evaluated_at IS NOT NULL;
```

### 2. Accuracy by Algorithm Version

```sql
SELECT * FROM v_algorithm_accuracy;
```

Dette viser hvilke versioner af algoritmen der performer bedst.

### 3. Factor Effectiveness

```sql
SELECT * FROM v_factor_effectiveness
ORDER BY accuracy_when_present DESC;
```

Dette viser hvilke faktorer der korrelerer med høj accuracy.

### 4. Confidence Calibration

```sql
SELECT 
  CASE 
    WHEN confidence >= 90 THEN '90-100%'
    WHEN confidence >= 80 THEN '80-89%'
    WHEN confidence >= 70 THEN '70-79%'
    WHEN confidence >= 60 THEN '60-69%'
    ELSE '50-59%'
  END as confidence_range,
  COUNT(*) as predictions,
  ROUND(AVG(CASE WHEN was_correct THEN 100 ELSE 0 END), 2) as actual_accuracy
FROM calculations
WHERE evaluated_at IS NOT NULL
GROUP BY confidence_range
ORDER BY confidence_range DESC;
```

Dette viser om vores confidence levels er kalibreret korrekt.

### 5. Performance Over Time

```sql
SELECT 
  DATE_TRUNC('week', calculated_at) as week,
  COUNT(*) as predictions,
  ROUND(AVG(CASE WHEN was_correct THEN 100 ELSE 0 END), 2) as accuracy,
  ROUND(AVG(calculation_duration_ms), 2) as avg_calc_time_ms
FROM calculations
WHERE evaluated_at IS NOT NULL
GROUP BY week
ORDER BY week DESC;
```

## Forbedring Over Tid

### Proces for kontinuerlig forbedring:

1. **Analyser data**
   - Kør queries for at identificere mønstre
   - Find faktorer der korrelerer med høj/lav accuracy
   - Identificer edge cases der skal håndteres bedre

2. **Implementer forbedringer**
   - Opdater prediction engine kode
   - Test ændringer grundigt
   - Dokumenter hvad der ændres

3. **Deploy ny version**
   ```sql
   -- Deprecate old version
   UPDATE algorithm_versions 
   SET is_active = false, deprecated_at = NOW()
   WHERE version = '1.0.0';
   
   -- Add new version
   INSERT INTO algorithm_versions (version, description, changes, is_active)
   VALUES (
     '1.1.0',
     'Improved upset factor calculation',
     '{"changes": ["Adjusted upset bonus calculation", "Added derby factor weight"]}',
     true
   );
   ```

4. **Monitorer resultater**
   - Sammenlign accuracy mellem versioner
   - Verificer at forbedringer virker
   - Rulle tilbage hvis nødvendigt

### Eksempel på forbedring baseret på data:

```sql
-- Find faktorer der ofte er til stede ved forkerte predictions
SELECT 
  cf.factor_name,
  COUNT(*) as times_present,
  ROUND(AVG(CASE WHEN c.was_correct THEN 0 ELSE 100 END), 2) as error_rate
FROM calculation_factors cf
JOIN calculations c ON cf.calculation_id = c.id
WHERE c.evaluated_at IS NOT NULL
GROUP BY cf.factor_name
HAVING COUNT(*) > 10
ORDER BY error_rate DESC
LIMIT 10;
```

Hvis "Vinterpause" har høj error rate, kan vi justere hvordan vi håndterer det.

## Sikkerhed

### Row Level Security (RLS)

Alle tabeller har RLS aktiveret:

- **Public read access** - Alle kan læse data (anonymiseret)
- **Service role write access** - Kun service role kan skrive/opdatere

Dette sikrer:
- Transparens (brugere kan se accuracy)
- Sikkerhed (kun systemet kan ændre data)
- Data integritet (ingen manuel manipulation)

### Sensitive Data

IP adresser og user agents gemmes, men:
- Bruges kun til debugging
- Ikke vist i public views
- Kan anonymiseres hvis nødvendigt

## Monitoring & Alerts

### Vigtige metrics at overvåge:

1. **Calculation success rate**
   ```sql
   SELECT 
     COUNT(*) as total_attempts,
     COUNT(CASE WHEN id IS NOT NULL THEN 1 END) as successful,
     COUNT(*) - COUNT(CASE WHEN id IS NOT NULL THEN 1 END) as failed
   FROM calculation_errors
   WHERE occurred_at > NOW() - INTERVAL '24 hours';
   ```

2. **Average calculation time**
   ```sql
   SELECT AVG(calculation_duration_ms) as avg_ms
   FROM calculations
   WHERE calculated_at > NOW() - INTERVAL '24 hours';
   ```

3. **Recent errors**
   ```sql
   SELECT * FROM calculation_errors
   WHERE occurred_at > NOW() - INTERVAL '1 hour'
   AND resolved = false
   ORDER BY occurred_at DESC;
   ```

## Fremtidige Udvidelser

### Mulige forbedringer:

1. **Machine Learning Integration**
   - Brug historical data til at træne ML modeller
   - Sammenlign ML predictions med rule-based predictions
   - Hybrid approach: kombiner begge

2. **A/B Testing**
   - Kør flere algoritme versioner samtidigt
   - Sammenlign performance
   - Gradvis rollout af nye versioner

3. **Real-time Adjustments**
   - Opdater predictions under kampen
   - Inkorporer live data (possession, shots, etc.)
   - Track in-play accuracy

4. **Advanced Analytics Dashboard**
   - Visualiser accuracy trends
   - Factor effectiveness heatmaps
   - Performance comparisons

5. **Automated Tuning**
   - Brug data til at auto-tune vægte
   - Genetic algorithms for optimization
   - Continuous learning

## Konklusion

Dette system giver nu:

✅ **Komplet transparens** - Alle beregninger er tracket
✅ **Selv-evaluering** - Systemet ved hvor godt det performer
✅ **Kontinuerlig forbedring** - Data-drevet optimization
✅ **Robust fejlhåndtering** - Ingen data går tabt
✅ **Versionering** - Alle ændringer er dokumenteret
✅ **Skalerbarhed** - Klar til fremtidige udvidelser

Systemet er nu production-ready og klar til at indsamle data der vil drive fremtidige forbedringer.
