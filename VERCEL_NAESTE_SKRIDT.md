# Næste skridt for aimatchpredictor.vercel.app

Din app er nu live! Her er hvad du skal gøre for at få den til at virke 100%:

## 1. Tilføj miljøvariabler i Vercel (VIGTIGT!)

Din app virker ikke endnu fordi miljøvariablerne mangler.

### Sådan gør du:

1. Gå til [vercel.com/dashboard](https://vercel.com/dashboard)
2. Klik på dit projekt "aimatchpredictor"
3. Klik på **"Settings"** (øverst)
4. Klik på **"Environment Variables"** (venstre menu)
5. Tilføj disse 5 variabler:

#### Variabel 1:
- Klik "Add New"
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://znkvmklheuidkffvbtvn.supabase.co`
- Vælg alle 3 checkboxes: ✓ Production ✓ Preview ✓ Development
- Klik "Save"

#### Variabel 2:
- Klik "Add New"
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpua3Zta2xoZXVpZGtmZnZidHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzk1NDYsImV4cCI6MjA4NTcxNTU0Nn0.YzgeOSDfV1lVxHO42tB9gAcesmvsYVKF8LWcRkG9Uz8`
- Vælg alle 3 checkboxes
- Klik "Save"

#### Variabel 3:
- Klik "Add New"
- **Key**: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpua3Zta2xoZXVpZGtmZnZidHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzk1NDYsImV4cCI6MjA4NTcxNTU0Nn0.YzgeOSDfV1lVxHO42tB9gAcesmvsYVKF8LWcRkG9Uz8`
- Vælg alle 3 checkboxes
- Klik "Save"

#### Variabel 4:
- Klik "Add New"
- **Key**: `CRON_SECRET`
- **Value**: `QyZE4omg0rXt95Y1s5RSldU=`
- Vælg alle 3 checkboxes
- Klik "Save"

#### Variabel 5:
- Klik "Add New"
- **Key**: `FOOTBALL_API_KEY`
- **Value**: `de7fa0811fccbfb663a79b4206a667a1`
- Vælg alle 3 checkboxes
- Klik "Save"

### 6. Trigger en ny deployment

Efter du har tilføjet alle 5 variabler, skal du trigger en ny deployment. Du har to muligheder:

**Mulighed A: Push til GitHub (Nemmest)**
1. Lav en lille ændring i din kode (f.eks. tilføj en kommentar i README.md)
2. Commit og push til GitHub
3. Vercel vil automatisk deploye med de nye miljøvariabler
4. Vent 2-3 minutter

**Mulighed B: Manuel redeploy i Vercel**
1. Gå til **"Deployments"** tab (øverst)
2. Find den seneste deployment
3. Klik på de tre prikker **⋯** til højre
4. Vælg **"Redeploy"**
5. Bekræft
6. Vent 2-3 minutter

## 2. Opdater Supabase

1. Gå til [supabase.com](https://supabase.com/dashboard)
2. Vælg dit projekt
3. Gå til **"Authentication"** → **"URL Configuration"**
4. Under **"Site URL"**, tilføj: `https://aimatchpredictor.vercel.app`
5. Under **"Redirect URLs"**, tilføj:
   - `https://aimatchpredictor.vercel.app/auth/confirm`
   - `https://aimatchpredictor.vercel.app/auth/callback`
   - `https://aimatchpredictor.vercel.app/*`
6. Klik "Save"

## 3. Test din app

Efter redeploy:

1. Besøg https://aimatchpredictor.vercel.app
2. Prøv at oprette en bruger (Sign Up)
3. Log ind
4. Test "Quick Predict" funktionen
5. Tjek at predictions vises

## Hvis noget ikke virker:

### Problem: "Supabase connection error"
**Løsning**: 
- Tjek at alle 3 Supabase variabler er sat korrekt i Vercel
- Tjek at du har redeployed efter at tilføje variabler

### Problem: "Cannot sign up"
**Løsning**:
- Tjek at du har tilføjet Vercel URL'en i Supabase redirect URLs
- Tjek Supabase email settings (Authentication → Email Templates)

### Problem: "No predictions showing"
**Løsning**:
- Gå til https://aimatchpredictor.vercel.app/admin/migrate
- Klik "Migrate Data" for at fylde databasen med initial data

### Se logs:
1. Gå til Vercel dashboard
2. Klik på dit projekt
3. Gå til "Deployments"
4. Klik på den seneste deployment
5. Klik på "Functions" for at se logs

## Hvad virker IKKE på gratis plan:

- ❌ Automatiske cron jobs (data opdateres ikke automatisk)
- ✅ Men "Quick Predict" virker stadig perfekt!
- ✅ Brugere kan stadig få predictions

Hvis du vil have automatiske opdateringer, se `VERCEL_FREE_CRON_SETUP.md` (valgfrit).

## Din app er klar når:

✅ Alle 5 miljøvariabler er sat i Vercel
✅ Du har redeployed
✅ Supabase URL'er er opdateret
✅ Du kan logge ind på https://aimatchpredictor.vercel.app
✅ Quick Predict funktionen virker

Held og lykke! 🚀
