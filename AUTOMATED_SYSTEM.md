# Automatiseret Forudsigelsessystem

Dette dokument beskriver det automatiserede system til at holde applikationen opdateret og spore forudsigelsernes nøjagtighed.

## Oversigt

Systemet består af tre hovedkomponenter:

1. **Automatisk opdatering af kampresultater**
2. **Automatisk generering af forudsigelser**
3. **Automatisk sporing af forudsigelsesnøjagtighed**

## Database Struktur

### Nye Tabeller og Kolonner

#### `predictions` tabel (opdateret)
- `actual_result` - Det faktiske resultat (home_win, draw, away_win)
- `was_correct` - Om forudsigelsen var korrekt
- `updated_at` - Tidspunkt for sidste opdatering

#### `prediction_stats` tabel (ny)
- `league` - Ligaens navn
- `total_predictions` - Samlet antal forudsigelser
- `correct_predictions` - Antal korrekte forudsigelser
- `accuracy_percentage` - Nøjagtighedsprocent
- `last_updated` - Sidste opdateringstidspunkt

### Database Triggers

Systemet bruger en PostgreSQL trigger til automatisk at opdatere forudsigelsesnøjagtighed:

```sql
CREATE TRIGGER update_prediction_accuracy_trigger
  AFTER UPDATE ON matches
  FOR EACH ROW
  WHEN (NEW.status = 'finished' AND OLD.status != 'finished')
  EXECUTE FUNCTION update_prediction_accuracy();
```

Når en kamp markeres som afsluttet:
1. Opdateres forudsigelsen med det faktiske resultat
2. Beregnes om forudsigelsen var korrekt
3. Opdateres ligastatistikken automatisk

## Cron Jobs

### 1. Hent Nye Kampe
**Endpoint:** `/api/cron/fetch-matches`  
**Tidsplan:** Dagligt kl. 00:00 (`0 0 * * *`)

**Funktionalitet:**
- Henter kommende kampe fra API-Football for alle ligaer
- Opretter automatisk nye hold hvis de ikke findes
- Tilføjer kampe til databasen (undgår dubletter)
- Henter de næste 10 kampe for hver liga

**Sikkerhed:**
- Kræver `CRON_SECRET` i Authorization header
- Kræver `FOOTBALL_API_KEY` for API-Football
- Kun tilgængelig for autoriserede cron-tjenester

### 2. Generer Forudsigelser
**Endpoint:** `/api/cron/generate-predictions`  
**Tidsplan:** Hver 6. time (`0 */6 * * *`)

**Funktionalitet:**
- Finder alle planlagte kampe uden forudsigelser
- Genererer forudsigelser ved hjælp af PredictionEngine
- Gemmer forudsigelser i databasen
- Returnerer statistik over genererede forudsigelser

**Sikkerhed:**
- Kræver `CRON_SECRET` i Authorization header
- Kun tilgængelig for autoriserede cron-tjenester

### 3. Opdater Kampresultater
**Endpoint:** `/api/cron/update-matches`  
**Tidsplan:** Hver 2. time (`0 */2 * * *`)

**Funktionalitet:**
- Henter alle planlagte eller igangværende kampe
- Tjekker om kamptidspunktet er passeret (>2 timer)
- Henter faktiske resultater fra API-Football
- Opdaterer kampe med scores og markerer som afsluttet
- Trigger automatisk opdatering af forudsigelsesnøjagtighed

**Sikkerhed:**
- Kræver `CRON_SECRET` i Authorization header
- Kræver `FOOTBALL_API_KEY` for at hente resultater
- Kun tilgængelig for autoriserede cron-tjenester

## Opsætning

### 1. Miljøvariabler

Tilføj til `.env.local`:

```env
# Cron job sikkerhed
CRON_SECRET=your-secure-random-string-here

# API-Football API nøgle
FOOTBALL_API_KEY=your-api-football-key-here
```

**Generer CRON_SECRET:**
```bash
openssl rand -base64 32
```

**Få API-Football nøgle:**
1. Gå til [https://www.api-football.com/](https://www.api-football.com/)
2. Opret en gratis konto
3. Gratis plan inkluderer 100 requests/dag
4. Kopier din API nøgle fra dashboard
5. Tilføj den til `.env.local`

### 2. Vercel Deployment

Cron jobs er konfigureret i `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/fetch-matches",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/generate-predictions",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/update-matches",
      "schedule": "0 */2 * * *"
    }
  ]
}
```

**Bemærk:** Vercel Cron er kun tilgængelig på Pro og Enterprise planer.

**Tilføj miljøvariabler i Vercel:**
1. Gå til dit projekt i Vercel Dashboard
2. Settings → Environment Variables
3. Tilføj `CRON_SECRET` og `FOOTBALL_API_KEY`
4. Redeploy projektet

### 3. Alternative Løsninger

Hvis du ikke har Vercel Pro, kan du bruge:

#### A. Externe Cron-tjenester
- [cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)
- [Uptime Robot](https://uptimerobot.com) (med monitor intervals)

Konfigurer dem til at kalde:
```
GET https://your-domain.com/api/cron/update-matches
Header: Authorization: Bearer YOUR_CRON_SECRET

GET https://your-domain.com/api/cron/generate-predictions
Header: Authorization: Bearer YOUR_CRON_SECRET
```

#### B. GitHub Actions

Opret `.github/workflows/cron.yml`:

```yaml
name: Automated Updates

on:
  schedule:
    - cron: '0 */2 * * *'  # Update matches every 2 hours
    - cron: '0 */6 * * *'  # Generate predictions every 6 hours

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - name: Update Matches
        run: |
          curl -X GET https://your-domain.com/api/cron/update-matches \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
      
      - name: Generate Predictions
        run: |
          curl -X GET https://your-domain.com/api/cron/generate-predictions \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

## Admin Dashboard

### Statistik Side
**URL:** `/admin/stats`

Viser:
- Samlet antal forudsigelser
- Antal korrekte forudsigelser
- Samlet nøjagtighed på tværs af alle ligaer
- Nøjagtighed pr. liga
- De 20 seneste forudsigelser med resultater

### Funktioner
- Realtidsopdatering af statistik
- Visuel indikation af korrekte/forkerte forudsigelser
- Detaljeret sammenligning af forudsagte vs. faktiske resultater
- Tillidsscorer for hver forudsigelse

## Dataflow

```
1. Ny kamp oprettes i databasen
   ↓
2. Cron job genererer forudsigelse (hver 6. time)
   ↓
3. Forudsigelse gemmes i predictions tabel
   ↓
4. Kamp afvikles (i virkeligheden)
   ↓
5. Cron job opdaterer kampresultat (hver 2. time)
   ↓
6. Database trigger aktiveres automatisk
   ↓
7. Forudsigelsesnøjagtighed beregnes og gemmes
   ↓
8. Ligastatistik opdateres automatisk
   ↓
9. Admin dashboard viser opdateret statistik
```

## Fremtidige Forbedringer

### 1. Integration med Fodbold-API
Implementer integration med en live fodbold-API for at hente faktiske kampresultater:
- [API-Football](https://www.api-football.com/)
- [Football-Data.org](https://www.football-data.org/)
- [TheSportsDB](https://www.thesportsdb.com/)

### 2. Machine Learning Forbedringer
- Brug historiske forudsigelser til at træne modellen
- Implementer feedback loop baseret på nøjagtighed
- Juster vægte baseret på performance

### 3. Notifikationer
- Send email når nøjagtigheden falder under en tærskel
- Notificer om nye forudsigelser
- Daglige/ugentlige rapporter

### 4. A/B Testing
- Test forskellige forudsigelsesalgoritmer
- Sammenlign performance mellem modeller
- Vælg automatisk den bedste model

### 5. Avanceret Analyse
- Trend-analyse over tid
- Sammenligning mellem ligaer
- Identifikation af mønstre i fejlforudsigelser

## Fejlfinding

### Cron Jobs Kører Ikke
1. Tjek at `CRON_SECRET` er sat korrekt
2. Verificer Vercel deployment settings
3. Tjek Vercel logs for fejl
4. Test endpoints manuelt med curl

### Forudsigelser Genereres Ikke
1. Tjek at der er kampe i databasen med status 'scheduled'
2. Verificer at PredictionEngine fungerer korrekt
3. Tjek logs i `/api/cron/generate-predictions`

### Statistik Opdateres Ikke
1. Verificer at database trigger er oprettet korrekt
2. Tjek at kampe markeres som 'finished' med scores
3. Kør migration igen hvis nødvendigt

## Support

For spørgsmål eller problemer, tjek:
1. Vercel deployment logs
2. Supabase database logs
3. Browser console for frontend fejl
4. `/admin/stats` for systemstatus
