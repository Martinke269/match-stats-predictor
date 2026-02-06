# Data Storage Implementation Report

## Oversigt

Dette dokument beskriver det komplette datalagringssystem, der er implementeret for at gemme alle beregninger, input, resultater og fejl fra forudsigelsessystemet.

## Database Struktur

### Eksisterende Tabeller

#### 1. **algorithm_versions**
Sporer forskellige versioner af forudsigelsesalgoritmen.

**Felter:**
- `id` (UUID) - Primær nøgle
- `version` (VARCHAR) - Versionsnummer (f.eks. "1.0.0")
- `description` (TEXT) - Beskrivelse af versionen
- `changes` (JSONB) - Ændringer i denne version
- `deployed_at` (TIMESTAMPTZ) - Hvornår versionen blev deployed
- `deprecated_at` (TIMESTAMPTZ) - Hvornår versionen blev deprecated
- `is_active` (BOOLEAN) - Om versionen er aktiv
- `created_at` (TIMESTAMPTZ) - Oprettelsestidspunkt

**Status:** ✅ Aktiv version findes (1.0.0)

#### 2. **calculations**
Hovedtabel for alle beregninger.

**Felter:**
- `id` (UUID) - Primær nøgle
- `match_id` (UUID) - Reference til match
- `algorithm_version_id` (UUID) - Reference til algoritmeversion
- `calculated_at` (TIMESTAMPTZ) - Beregningstidspunkt
- `calculation_duration_ms` (INTEGER) - Beregningstid i millisekunder
- `home_win_probability` (NUMERIC) - Sandsynlighed for hjemmesejr
- `draw_probability` (NUMERIC) - Sandsynlighed for uafgjort
- `away_win_probability` (NUMERIC) - Sandsynlighed for udesejr
- `predicted_home_score` (INTEGER) - Forudsagt hjemmescore
- `predicted_away_score` (INTEGER) - Forudsagt udescore
- `confidence` (INTEGER) - Sikkerhedsniveau (0-100)
- `actual_home_score` (INTEGER) - Faktisk hjemmescore (efter kamp)
- `actual_away_score` (INTEGER) - Faktisk udescore (efter kamp)
- `was_correct` (BOOLEAN) - Om forudsigelsen var korrekt
- `accuracy_score` (NUMERIC) - Nøjagtighedsscore (0-100)
- `evaluation_type` (VARCHAR) - Type af evaluering
- `evaluated_at` (TIMESTAMPTZ) - Evalueringstidspunkt
- `created_at` (TIMESTAMPTZ) - Oprettelsestidspunkt
- `updated_at` (TIMESTAMPTZ) - Opdateringstidspunkt

#### 3. **calculation_inputs**
Gemmer alle input-data for hver beregning.

**Felter:**
- `id` (UUID) - Primær nøgle
- `calculation_id` (UUID) - Reference til calculation
- `home_team_id` (UUID) - Reference til hjemmehold
- `away_team_id` (UUID) - Reference til udehold
- `home_team_stats` (JSONB) - Hjemmeholdets statistik
- `away_team_stats` (JSONB) - Udeholdets statistik
- `home_team_form` (VARCHAR) - Hjemmeholdets form
- `away_team_form` (VARCHAR) - Udeholdets form
- `match_date` (TIMESTAMPTZ) - Kampdato
- `league` (VARCHAR) - Liga navn
- `is_derby` (BOOLEAN) - Om det er et derby
- `after_winter_break` (BOOLEAN) - Efter vinterpause
- `winter_break_months` (INTEGER) - Antal måneder vinterpause
- `home_fixture_congestion` (JSONB) - Hjemmeholdets kampprogram
- `away_fixture_congestion` (JSONB) - Udeholdets kampprogram
- `head_to_head_stats` (JSONB) - Indbyrdes statistik
- `created_at` (TIMESTAMPTZ) - Oprettelsestidspunkt

#### 4. **calculation_factors**
Gemmer alle faktorer der påvirker forudsigelsen.

**Felter:**
- `id` (UUID) - Primær nøgle
- `calculation_id` (UUID) - Reference til calculation
- `factor_name` (VARCHAR) - Faktor navn
- `factor_impact` (VARCHAR) - Impact type (positive/negative/neutral)
- `factor_weight` (NUMERIC) - Faktor vægt
- `factor_description` (TEXT) - Beskrivelse
- `factor_category` (VARCHAR) - Kategori (form/quality/h2h/etc.)
- `created_at` (TIMESTAMPTZ) - Oprettelsestidspunkt

#### 5. **calculation_metadata**
Gemmer metadata om beregningen.

**Felter:**
- `id` (UUID) - Primær nøgle
- `calculation_id` (UUID) - Reference til calculation
- `options_used` (JSONB) - Anvendte options
- `home_quality_score` (NUMERIC) - Hjemmeholdets kvalitetsscore
- `away_quality_score` (NUMERIC) - Udeholdets kvalitetsscore
- `quality_gap` (NUMERIC) - Kvalitetsforskel
- `home_form_score` (NUMERIC) - Hjemmeholdets formscore
- `away_form_score` (NUMERIC) - Udeholdets formscore
- `upset_bonus` (NUMERIC) - Overraskelsesbonus
- `is_home_underdog` (BOOLEAN) - Om hjemmeholdet er underdog
- `user_agent` (TEXT) - Brugerens user agent
- `ip_address` (INET) - Brugerens IP-adresse
- `request_source` (VARCHAR) - Kilde (cron/api/manual/quick-predict)
- `created_at` (TIMESTAMPTZ) - Oprettelsestidspunkt

#### 6. **calculation_errors**
Gemmer alle fejl og advarsler.

**Felter:**
- `id` (UUID) - Primær nøgle
- `calculation_id` (UUID) - Reference til calculation (nullable)
- `match_id` (UUID) - Reference til match (nullable)
- `error_type` (VARCHAR) - Fejltype (error/warning/edge_case)
- `error_code` (VARCHAR) - Fejlkode
- `error_message` (TEXT) - Fejlbesked
- `error_stack` (TEXT) - Stack trace
- `occurred_at` (TIMESTAMPTZ) - Tidspunkt for fejl
- `request_data` (JSONB) - Request data
- `system_state` (JSONB) - Systemtilstand
- `resolved` (BOOLEAN) - Om fejlen er løst
- `resolved_at` (TIMESTAMPTZ) - Løsningstidspunkt
- `resolution_notes` (TEXT) - Løsningsnoter
- `created_at` (TIMESTAMPTZ) - Oprettelsestidspunkt

#### 7. **calculation_edge_cases**
Gemmer edge cases der opstår under beregninger.

**Felter:**
- `id` (UUID) - Primær nøgle
- `calculation_id` (UUID) - Reference til calculation
- `edge_case_type` (VARCHAR) - Type af edge case
- `description` (TEXT) - Beskrivelse
- `severity` (VARCHAR) - Alvorlighed (low/medium/high)
- `trigger_data` (JSONB) - Data der triggede edge case
- `handling_strategy` (TEXT) - Håndteringsstrategi
- `created_at` (TIMESTAMPTZ) - Oprettelsestidspunkt

#### 8. **calculation_performance**
Aggregeret performance data.

**Felter:**
- `id` (UUID) - Primær nøgle
- `period_start` (TIMESTAMPTZ) - Periode start
- `period_end` (TIMESTAMPTZ) - Periode slut
- `total_calculations` (INTEGER) - Antal beregninger
- `avg_calculation_time_ms` (NUMERIC) - Gennemsnitlig beregningstid
- `max_calculation_time_ms` (INTEGER) - Maksimal beregningstid
- `min_calculation_time_ms` (INTEGER) - Minimal beregningstid
- `total_evaluated` (INTEGER) - Antal evaluerede
- `correct_predictions` (INTEGER) - Antal korrekte forudsigelser
- `exact_score_predictions` (INTEGER) - Antal eksakte score forudsigelser
- `avg_accuracy_score` (NUMERIC) - Gennemsnitlig nøjagtighed
- `avg_confidence` (NUMERIC) - Gennemsnitlig sikkerhed
- `algorithm_version_id` (UUID) - Reference til algoritmeversion
- `created_at` (TIMESTAMPTZ) - Oprettelsestidspunkt

#### 9. **teams**
Gemmer holddata.

**Felter:**
- `id` (UUID) - Primær nøgle
- `name` (TEXT) - Holdnavn
- `league` (TEXT) - Liga
- `stats` (JSONB) - Statistik
- `form` (TEXT[]) - Form (sidste 5 kampe)
- `created_at` (TIMESTAMPTZ) - Oprettelsestidspunkt
- `updated_at` (TIMESTAMPTZ) - Opdateringstidspunkt

#### 10. **matches**
Gemmer kampdata.

**Felter:**
- `id` (UUID) - Primær nøgle
- `league` (TEXT) - Liga
- `home_team_id` (UUID) - Reference til hjemmehold
- `away_team_id` (UUID) - Reference til udehold
- `date` (TIMESTAMPTZ) - Kampdato
- `status` (TEXT) - Status (scheduled/completed/etc.)
- `home_score` (INTEGER) - Hjemmescore
- `away_score` (INTEGER) - Udescore
- `created_at` (TIMESTAMPTZ) - Oprettelsestidspunkt
- `updated_at` (TIMESTAMPTZ) - Opdateringstidspunkt

## Implementerede Komponenter

### 1. Server-side Logger (`lib/calculation-logger.ts`)
**Formål:** Håndterer al datalagring på server-siden.

**Metoder:**
- `logCalculation()` - Logger en komplet beregning med alle detaljer
- `logError()` - Logger fejl og advarsler
- `logEdgeCase()` - Logger edge cases
- `evaluateCalculation()` - Opdaterer beregning med faktiske resultater

**Funktioner:**
- ✅ Atomare inserts
- ✅ Type-sikre operationer
- ✅ Automatisk fejlhåndtering
- ✅ Konsistent datastruktur

### 2. Client-side Logger (`lib/calculation-logger-client.ts`)
**Formål:** Sender beregningsdata fra klienten til API.

**Metoder:**
- `logCalculation()` - Sender beregningsdata til API
- `logError()` - Sender fejl til API

**Funktioner:**
- ✅ Asynkron logging (blokerer ikke UI)
- ✅ Fejlhåndtering
- ✅ Type-sikker

### 3. API Endpoint (`app/api/log-calculation/route.ts`)
**Formål:** Modtager data fra klienten og gemmer i database.

**Endpoints:**
- `POST /api/log-calculation` - Logger beregninger og fejl

**Funktioner:**
- ✅ Validering af input
- ✅ Automatisk match ID generering for quick-predict
- ✅ User agent og IP tracking
- ✅ Fejlhåndtering med logging

## Data Flow

### Quick-Predict Flow
```
1. Bruger indtaster holdnavne
   ↓
2. Component kalder PredictionEngine.predictMatch()
   ↓
3. Beregning udføres (med timing)
   ↓
4. CalculationLoggerClient.logCalculation() kaldes asynkront
   ↓
5. POST /api/log-calculation
   ↓
6. CalculationLogger.logCalculation() gemmer i database
   ↓
7. Data gemmes i:
   - calculations
   - calculation_inputs
   - calculation_factors
   - calculation_metadata
```

### Cron Job Flow
```
1. Cron job starter (generate-predictions)
   ↓
2. Henter matches fra database
   ↓
3. For hver match:
   - Beregner forudsigelse
   - CalculationLogger.logCalculation() kaldes direkte
   - Gemmer i alle relevante tabeller
   ↓
4. Ved fejl: CalculationLogger.logError()
```

### Evaluation Flow
```
1. Cron job starter (evaluate-predictions)
   ↓
2. Henter afsluttede kampe
   ↓
3. For hver kamp:
   - Finder tilhørende calculation
   - CalculationLogger.evaluateCalculation()
   - Opdaterer med faktiske resultater
   - Beregner nøjagtighed
```

## Gemte Data per Kørsel

### Input Data
- ✅ Hjemmehold ID og stats
- ✅ Udehold ID og stats
- ✅ Form for begge hold
- ✅ Liga
- ✅ Kampdato
- ✅ Derby status
- ✅ Vinterpause information
- ✅ Fixture congestion
- ✅ Head-to-head statistik

### Beregningsresultater
- ✅ Sandsynligheder (hjemme/uafgjort/ude)
- ✅ Forudsagt score
- ✅ Sikkerhedsniveau
- ✅ Beregningstid

### Faktorer
- ✅ Faktor navn
- ✅ Impact (positive/negative/neutral)
- ✅ Vægt
- ✅ Beskrivelse
- ✅ Kategori

### Metadata
- ✅ Anvendte options
- ✅ Kvalitetsscores
- ✅ Formscores
- ✅ Upset bonus
- ✅ User agent
- ✅ IP adresse
- ✅ Request source

### Fejl og Advarsler
- ✅ Fejltype
- ✅ Fejlkode
- ✅ Fejlbesked
- ✅ Stack trace
- ✅ Request data
- ✅ Systemtilstand

### Evaluering (efter kamp)
- ✅ Faktisk score
- ✅ Om forudsigelsen var korrekt
- ✅ Nøjagtighedsscore
- ✅ Evalueringstype

## Implementeringsstatus

### ✅ Implementeret
1. **Database struktur** - Alle tabeller eksisterer
2. **Server-side logger** - Komplet med alle metoder
3. **Client-side logger** - Implementeret
4. **API endpoint** - Fungerende
5. **Quick-predict integration** - Data gemmes automatisk
6. **Cron job integration** - Data gemmes for alle scheduled predictions
7. **Error logging** - Fejl gemmes konsekvent
8. **Evaluation system** - Opdaterer med faktiske resultater

### ⚠️ Mangler
1. **League page logging** - Statiske league pages gemmer ikke data endnu
2. **Performance aggregation** - calculation_performance tabellen populeres ikke automatisk
3. **Cleanup jobs** - Ingen automatisk oprydning af gamle data
4. **Analytics dashboard** - Ingen UI til at se gemte data

## Sikkerhed og Best Practices

### ✅ Implementeret
- Type-sikre operationer
- Atomare inserts
- Konsistent datastruktur
- Fejlhåndtering på alle niveauer
- Ingen duplikerede writes
- Asynkron logging (blokerer ikke UI)

### 🔒 Sikkerhed
- RLS (Row Level Security) er aktiveret på alle tabeller
- IP-adresser gemmes kun for tracking, ikke for identifikation
- User agents gemmes for debugging

## Næste Skridt

### Prioritet 1 (Kritisk)
1. Tilføj logging til alle league prediction pages
2. Test at data gemmes korrekt for alle flows

### Prioritet 2 (Vigtigt)
1. Implementer performance aggregation job
2. Opret analytics dashboard
3. Tilføj data retention policy

### Prioritet 3 (Nice to have)
1. Tilføj real-time monitoring
2. Implementer alerting for fejl
3. Opret rapporter for accuracy over tid

## Konklusion

Systemet har nu et robust og konsistent datalagringssystem der:
- ✅ Gemmer alle nødvendige data fra hver kørsel
- ✅ Håndterer fejl elegant
- ✅ Er type-sikkert og atomart
- ✅ Fungerer både server-side og client-side
- ✅ Understøtter evaluering af forudsigelser

De primære mangler er logging fra statiske league pages og analytics/monitoring værktøjer.
