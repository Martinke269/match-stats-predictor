# Opsætning: Automatiske opdateringer hver tirsdag med Netlify + GitHub Actions

## Din situation

✅ **App hosted på:** https://aimatchpredictor.netlify.app
✅ **GitHub Actions workflow:** Oprettet og klar
⏳ **Mangler:** GitHub Secret for at autorisere cron jobs

## Trin 1: Tilføj GitHub Secret

1. Gå til dit GitHub repository: https://github.com/Martinke269/match-stats-predictor
2. Klik på **"Settings"** (øverst til højre)
3. I venstre menu, klik på **"Secrets and variables"** → **"Actions"**
4. Klik på **"New repository secret"** (grøn knap)
5. Udfyld:
   - **Name:** `CRON_SECRET`
   - **Secret:** `QyZE4omg0rXt95Y1s5RSldU=`
6. Klik **"Add secret"**

## Trin 2: Push ændringerne til GitHub

Du skal pushe den nye GitHub Actions workflow fil:

```bash
git add .github/workflows/tuesday-cron.yml
git commit -m "Add GitHub Actions for Tuesday cron jobs"
git push
```

## Trin 3: Test workflow manuelt

1. Gå til dit GitHub repository
2. Klik på **"Actions"** tab (øverst)
3. Vælg **"Tuesday Match Updates"** i venstre menu
4. Klik på **"Run workflow"** (højre side)
5. Klik på den grønne **"Run workflow"** knap
6. Vent 1-2 minutter og se om det virker

## Hvad sker der automatisk?

Hver tirsdag kl. 06:00, 08:00 og 10:00 UTC:

```
06:00 UTC → Henter nye kampe fra API-Football
    ↓
08:00 UTC → Genererer predictions for nye kampe
    ↓
10:00 UTC → Opdaterer resultater for afsluttede kampe
```

## Verificer at det virker

**Efter første tirsdag (eller efter manuel test):**

1. Gå til GitHub → Actions tab
2. Tjek at workflow'en kørte succesfuldt (grøn checkmark)
3. Besøg https://aimatchpredictor.netlify.app
4. Tjek om der er nye predictions
5. Gå til Supabase dashboard og tjek `matches` tabellen

## Troubleshooting

### "Secret not found"
- Tjek at du har tilføjet `CRON_SECRET` i GitHub Secrets
- Tjek at navnet er stavet korrekt (CRON_SECRET)

### "401 Unauthorized"
- Tjek at CRON_SECRET værdien er korrekt: `QyZE4omg0rXt95Y1s5RSldU=`
- Verificer at CRON_SECRET er sat i Netlify environment variables

### "404 Not Found"
- Tjek at din Netlify app er deployed og kører
- Verificer at endpoints eksisterer: `/api/cron/fetch-matches` osv.

### Workflow kører ikke automatisk
- GitHub Actions kan tage op til 15 minutter at starte første gang
- Prøv at køre workflow'en manuelt først for at teste

## Manuel opdatering

Hvis du vil opdatere data manuelt:

**Besøg:** https://aimatchpredictor.netlify.app/admin/migrate

Klik på "Migrate Data" knappen.

## Næste skridt

1. ✅ Tilføj CRON_SECRET i GitHub Secrets
2. ✅ Push workflow filen til GitHub
3. ✅ Test workflow manuelt via GitHub Actions
4. ✅ Vent til næste tirsdag og verificer automatisk kørsel
5. ✅ Tjek GitHub Actions history regelmæssigt

Din app er nu sat op til automatiske opdateringer hver tirsdag! 🚀
