# Simpel Guide: Publicer til Vercel

## Du har allerede:
- ✅ Supabase konto (allerede sat op)
- ✅ API-Football key (allerede i din .env.local)
- ✅ Dit projekt klar

## Du skal kun bruge ÉN ny konto: Vercel

### Trin 1: Opret Vercel konto (5 minutter)

1. Gå til [vercel.com](https://vercel.com)
2. Klik "Sign Up"
3. **Vælg "Continue with GitHub"** (brug din eksisterende GitHub konto)
4. Færdig! Du har nu Vercel konto

### Trin 2: Deploy dit projekt (2 minutter)

1. I Vercel dashboard, klik **"Add New..."** → **"Project"**
2. Vælg dit GitHub repository fra listen
3. Vercel finder automatisk at det er Next.js
4. Klik **"Deploy"**
5. Vent 2-3 minutter mens det bygger

### Trin 3: Tilføj miljøvariabler (5 minutter)

Efter deployment:

1. Klik på dit projekt i Vercel
2. Gå til **"Settings"** → **"Environment Variables"**
3. Klik **"Add New"** og tilføj disse 5 variabler én ad gangen:

#### Variabel 1:
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://znkvmklheuidkffvbtvn.supabase.co`
- Vælg alle 3 checkboxes (Production, Preview, Development)
- Klik "Save"

#### Variabel 2:
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpua3Zta2xoZXVpZGtmZnZidHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzk1NDYsImV4cCI6MjA4NTcxNTU0Nn0.YzgeOSDfV1lVxHO42tB9gAcesmvsYVKF8LWcRkG9Uz8`
- Vælg alle 3 checkboxes
- Klik "Save"

#### Variabel 3:
- **Key**: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpua3Zta2xoZXVpZGtmZnZidHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzk1NDYsImV4cCI6MjA4NTcxNTU0Nn0.YzgeOSDfV1lVxHO42tB9gAcesmvsYVKF8LWcRkG9Uz8`
- Vælg alle 3 checkboxes
- Klik "Save"

#### Variabel 4:
- **Key**: `CRON_SECRET`
- **Value**: `QyZE4omg0rXt95Y1s5RSldU=`
- Vælg alle 3 checkboxes
- Klik "Save"

#### Variabel 5:
- **Key**: `FOOTBALL_API_KEY`
- **Value**: `de7fa0811fccbfb663a79b4206a667a1`
- Vælg alle 3 checkboxes
- Klik "Save"

4. Gå til **"Deployments"** → klik de 3 prikker → **"Redeploy"**

### Trin 4: Opdater Supabase (2 minutter)

1. Gå til din Supabase dashboard
2. **Authentication** → **URL Configuration**
3. Tilføj din nye Vercel URL (f.eks. `https://dit-projekt.vercel.app`)

**Færdig!** Din app er nu live på Vercel.

## Om Cron Jobs (automatiske opdateringer)

På Vercel's gratis plan virker automatiske cron jobs IKKE. Det betyder:
- Din app virker perfekt
- Men data opdateres ikke automatisk

**To muligheder:**

### A) Gør ingenting (simplest)
- Brugere kan stadig bruge "Quick Predict" funktionen
- Data opdateres når brugere besøger siden
- Perfekt til at starte med

### B) Tilføj automatiske opdateringer senere (valgfrit)
- Kræver én ekstra gratis konto (cron-job.org)
- Se `VERCEL_FREE_CRON_SETUP.md` hvis du vil det senere
- Men det er IKKE nødvendigt for at få din app til at virke

## Hvad du har nu:

✅ **1 GitHub konto** (havde du allerede)
✅ **1 Supabase konto** (havde du allerede)  
✅ **1 Vercel konto** (ny, men bruger GitHub login)
✅ **Din app er live!**

## Test din app:

1. Besøg din Vercel URL
2. Prøv at logge ind
3. Prøv "Quick Predict" funktionen
4. Alt skulle virke!

## Hvis noget ikke virker:

1. Tjek at alle 5 miljøvariabler er sat i Vercel
2. Tjek at du har redeployed efter at tilføje variabler
3. Tjek Vercel logs under "Deployments" → "Functions"
