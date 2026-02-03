# Opsætning: Automatiske opdateringer hver tirsdag

## Situation

Din `vercel.json` er allerede sat op til at køre hver tirsdag:
- **Kl. 06:00**: Hent nye kampe
- **Kl. 08:00**: Generer predictions
- **Kl. 10:00**: Opdater kampresultater

**PROBLEM**: På Vercel's gratis plan virker cron jobs IKKE automatisk. Du skal bruge en ekstern service.

## Løsning: Brug Cron-job.org (100% Gratis)

### Trin 1: Opret konto

1. Gå til [cron-job.org](https://cron-job.org)
2. Klik "Sign up" (gratis)
3. Bekræft din email

### Trin 2: Find din Vercel URL

Efter deployment får du en URL som:
```
https://aimatchpredictor.vercel.app
```

### Trin 3: Opret 3 cron jobs (kun tirsdage)

#### Cron Job 1: Fetch Matches

1. Klik "Create cronjob"
2. **Title**: `Fetch Matches - Tuesday 06:00`
3. **URL**: `https://aimatchpredictor.vercel.app/api/cron/fetch-matches`
4. **Schedule**: 
   - Execution: `Every week`
   - Day: `Tuesday`
   - Time: `06:00`
5. **Request method**: `GET`
6. **Headers**: Klik "Add header"
   - Name: `Authorization`
   - Value: `Bearer QyZE4omg0rXt95Y1s5RSldU=`
7. Klik "Create cronjob"

#### Cron Job 2: Generate Predictions

1. Klik "Create cronjob"
2. **Title**: `Generate Predictions - Tuesday 08:00`
3. **URL**: `https://aimatchpredictor.vercel.app/api/cron/generate-predictions`
4. **Schedule**: 
   - Execution: `Every week`
   - Day: `Tuesday`
   - Time: `08:00`
5. **Request method**: `GET`
6. **Headers**: Klik "Add header"
   - Name: `Authorization`
   - Value: `Bearer QyZE4omg0rXt95Y1s5RSldU=`
7. Klik "Create cronjob"

#### Cron Job 3: Update Matches

1. Klik "Create cronjob"
2. **Title**: `Update Matches - Tuesday 10:00`
3. **URL**: `https://aimatchpredictor.vercel.app/api/cron/update-matches`
4. **Schedule**: 
   - Execution: `Every week`
   - Day: `Tuesday`
   - Time: `10:00`
5. **Request method**: `GET`
6. **Headers**: Klik "Add header"
   - Name: `Authorization`
   - Value: `Bearer QyZE4omg0rXt95Y1s5RSldU=`
7. Klik "Create cronjob"

### Trin 4: Test dine cron jobs

1. I cron-job.org dashboard, klik på hver cron job
2. Klik "Execute now" for at teste med det samme
3. Tjek "Execution history" - grøn = success ✅

## Alternativ: GitHub Actions (kun tirsdage)

Hvis du foretrækker GitHub Actions, opret denne fil:

`.github/workflows/tuesday-cron.yml`:

```yaml
name: Tuesday Cron Jobs

on:
  schedule:
    # Hver tirsdag kl. 06:00 UTC
    - cron: '0 6 * * 2'
    # Hver tirsdag kl. 08:00 UTC
    - cron: '0 8 * * 2'
    # Hver tirsdag kl. 10:00 UTC
    - cron: '0 10 * * 2'
  workflow_dispatch: # Tillader manuel test

jobs:
  fetch-matches:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 6 * * 2' || github.event_name == 'workflow_dispatch'
    steps:
      - name: Fetch Matches
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://aimatchpredictor.vercel.app/api/cron/fetch-matches

  generate-predictions:
    runs-on: ubuntu-latest
    needs: fetch-matches
    if: github.event.schedule == '0 8 * * 2' || github.event_name == 'workflow_dispatch'
    steps:
      - name: Generate Predictions
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://aimatchpredictor.vercel.app/api/cron/generate-predictions

  update-matches:
    runs-on: ubuntu-latest
    needs: generate-predictions
    if: github.event.schedule == '0 10 * * 2' || github.event_name == 'workflow_dispatch'
    steps:
      - name: Update Matches
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://aimatchpredictor.vercel.app/api/cron/update-matches
```

Tilføj `CRON_SECRET` som GitHub Secret:
1. GitHub repository → Settings → Secrets and variables → Actions
2. "New repository secret"
3. Name: `CRON_SECRET`
4. Value: `QyZE4omg0rXt95Y1s5RSldU=`

## Hvad sker der hver tirsdag?

```
06:00 → Henter nye kampe fra API-Football
        ↓
08:00 → Genererer predictions for nye kampe
        ↓
10:00 → Opdaterer resultater for afsluttede kampe
```

## Verificer at det virker

**Efter første tirsdag:**
1. Tjek cron-job.org execution history
2. Log ind på din app: https://aimatchpredictor.vercel.app
3. Tjek om der er nye predictions
4. Gå til Supabase dashboard og tjek `matches` tabellen

## Troubleshooting

### "401 Unauthorized"
- Tjek at Authorization header er sat: `Bearer QyZE4omg0rXt95Y1s5RSldU=`
- Verificer at CRON_SECRET er sat i Vercel environment variables

### "404 Not Found"
- Tjek at din Vercel URL er korrekt
- Verificer at projektet er deployed

### Ingen data opdateres
- Tjek Vercel function logs (Deployments → Functions)
- Verificer at FOOTBALL_API_KEY er sat i Vercel
- Tjek API-Football daglige limit (100 requests/dag på gratis plan)

## Vigtige noter

- ⏰ Tiderne er i UTC (dansk tid = UTC+1 eller UTC+2 i sommertid)
- 🆓 Både cron-job.org og GitHub Actions er 100% gratis
- 📊 Du kan se execution history i cron-job.org dashboard
- 🔄 Du kan teste manuelt når som helst med "Execute now"

## Næste skridt

1. ✅ Vælg enten cron-job.org ELLER GitHub Actions
2. ✅ Opret de 3 cron jobs
3. ✅ Test hver cron job manuelt
4. ✅ Vent til næste tirsdag og verificer at det virker automatisk
5. ✅ Tjek execution history regelmæssigt

**Anbefaling**: Start med cron-job.org - det er nemmest! 🚀
