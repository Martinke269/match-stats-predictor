# Opsætning af Cron Jobs på Vercel Free Plan

## Problem

Vercel's indbyggede cron jobs (i `vercel.json`) virker KUN på Pro/Enterprise plans. På gratis planen skal du bruge en ekstern service.

## Løsning: Brug Cron-job.org (Gratis)

### Trin 1: Opret konto på Cron-job.org

1. Gå til [cron-job.org](https://cron-job.org)
2. Klik "Sign up" (det er gratis)
3. Bekræft din email

### Trin 2: Find din Vercel URL

Efter deployment på Vercel, får du en URL som:
```
https://dit-projekt-navn.vercel.app
```

### Trin 3: Opret 3 cron jobs

Du skal oprette 3 separate cron jobs på cron-job.org:

#### Cron Job 1: Fetch Matches (Dagligt)

1. Klik "Create cronjob"
2. **Title**: `Fetch Matches`
3. **URL**: `https://dit-projekt-navn.vercel.app/api/cron/fetch-matches`
4. **Schedule**: 
   - Execution: `Every day`
   - Time: `00:00` (midnat)
5. **Request method**: `GET`
6. **Headers**: Klik "Add header"
   - Name: `Authorization`
   - Value: `Bearer QyZE4omg0rXt95Y1s5RSldU=`
7. Klik "Create cronjob"

#### Cron Job 2: Generate Predictions (Hver 6. time)

1. Klik "Create cronjob"
2. **Title**: `Generate Predictions`
3. **URL**: `https://dit-projekt-navn.vercel.app/api/cron/generate-predictions`
4. **Schedule**: 
   - Execution: `Every 6 hours`
   - Starting at: `00:00`
5. **Request method**: `GET`
6. **Headers**: Klik "Add header"
   - Name: `Authorization`
   - Value: `Bearer QyZE4omg0rXt95Y1s5RSldU=`
7. Klik "Create cronjob"

#### Cron Job 3: Update Matches (Hver 2. time)

1. Klik "Create cronjob"
2. **Title**: `Update Matches`
3. **URL**: `https://dit-projekt-navn.vercel.app/api/cron/update-matches`
4. **Schedule**: 
   - Execution: `Every 2 hours`
   - Starting at: `00:00`
5. **Request method**: `GET`
6. **Headers**: Klik "Add header"
   - Name: `Authorization`
   - Value: `Bearer QyZE4omg0rXt95Y1s5RSldU=`
7. Klik "Create cronjob"

### Trin 4: Test dine cron jobs

1. I cron-job.org dashboard, klik på hver cron job
2. Klik "Execute now" for at teste
3. Tjek "Execution history" for at se om det lykkedes (grøn = success)

## Alternativ: GitHub Actions (Gratis)

Hvis du foretrækker GitHub Actions, kan du oprette denne fil:

`.github/workflows/cron-jobs.yml`:

```yaml
name: Scheduled Cron Jobs

on:
  schedule:
    # Fetch matches - dagligt kl. 00:00 UTC
    - cron: '0 0 * * *'
    # Generate predictions - hver 6. time
    - cron: '0 */6 * * *'
    # Update matches - hver 2. time
    - cron: '0 */2 * * *'
  workflow_dispatch: # Tillader manuel kørsel

jobs:
  fetch-matches:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 0 * * *'
    steps:
      - name: Fetch Matches
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://dit-projekt-navn.vercel.app/api/cron/fetch-matches

  generate-predictions:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 */6 * * *'
    steps:
      - name: Generate Predictions
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://dit-projekt-navn.vercel.app/api/cron/generate-predictions

  update-matches:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 */2 * * *'
    steps:
      - name: Update Matches
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://dit-projekt-navn.vercel.app/api/cron/update-matches
```

Tilføj derefter `CRON_SECRET` som GitHub Secret:
1. Gå til dit GitHub repository
2. Settings → Secrets and variables → Actions
3. Klik "New repository secret"
4. Name: `CRON_SECRET`
5. Value: `QyZE4omg0rXt95Y1s5RSldU=`

## Sammenligning

| Feature | Cron-job.org | GitHub Actions |
|---------|--------------|----------------|
| Pris | Gratis | Gratis |
| Opsætning | Meget nem | Kræver YAML fil |
| UI | Pænt dashboard | GitHub interface |
| Logs | God historik | GitHub Actions logs |
| Pålidelig | Meget | Meget |

**Anbefaling**: Start med **Cron-job.org** - det er nemmest og kræver ingen kode-ændringer.

## Fjern vercel.json cron konfiguration

Da du er på free plan, kan du fjerne cron konfigurationen fra `vercel.json` eller bare lade den være (den gør ingen skade, den virker bare ikke).

## Verificer at det virker

1. Vent 5-10 minutter efter opsætning
2. Tjek cron-job.org execution history
3. Tjek din Supabase database for nye data
4. Tjek Vercel logs under "Deployments" → "Functions"

## Troubleshooting

### "401 Unauthorized"
- Tjek at Authorization header er sat korrekt
- Verificer at CRON_SECRET matcher i både Vercel og cron-job.org

### "404 Not Found"
- Tjek at URL'en er korrekt (skal være din Vercel URL)
- Verificer at `/api/cron/` endpoints eksisterer

### Ingen data opdateres
- Tjek Vercel function logs
- Verificer at FOOTBALL_API_KEY er sat i Vercel
- Tjek at du ikke har overskredet API-Football's daglige limit (100 requests)

## Næste skridt

1. ✅ Opret konto på cron-job.org
2. ✅ Opret de 3 cron jobs
3. ✅ Test hver cron job manuelt
4. ✅ Vent og verificer at de kører automatisk
5. ✅ Overvåg execution history regelmæssigt
