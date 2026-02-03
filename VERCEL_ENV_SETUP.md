# Sådan konfigurerer du miljøvariabler i Vercel

## Hvad er miljøvariabler?

Miljøvariabler er hemmelige nøgler og konfigurationer som din app bruger. De skal IKKE committes til Git, men skal i stedet sættes direkte i Vercel.

## Trin-for-trin guide

### 1. Gå til Vercel Dashboard

1. Log ind på [vercel.com](https://vercel.com)
2. Vælg dit projekt
3. Klik på **"Settings"** (øverst)
4. Klik på **"Environment Variables"** i venstre menu

### 2. Tilføj hver variabel

For hver variabel nedenfor:
1. Klik på **"Add New"**
2. Indtast **Key** (navnet på variablen)
3. Indtast **Value** (værdien fra din `.env.local` fil)
4. Vælg **alle tre environments**: Production, Preview, Development
5. Klik **"Save"**

### 3. Dine specifikke værdier

Kopier disse værdier direkte fra din `.env.local` fil:

#### Variabel 1: NEXT_PUBLIC_SUPABASE_URL
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://znkvmklheuidkffvbtvn.supabase.co
```

#### Variabel 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpua3Zta2xoZXVpZGtmZnZidHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzk1NDYsImV4cCI6MjA4NTcxNTU0Nn0.YzgeOSDfV1lVxHO42tB9gAcesmvsYVKF8LWcRkG9Uz8
```

#### Variabel 3: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```
Key: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpua3Zta2xoZXVpZGtmZnZidHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzk1NDYsImV4cCI6MjA4NTcxNTU0Nn0.YzgeOSDfV1lVxHO42tB9gAcesmvsYVKF8LWcRkG9Uz8
```

#### Variabel 4: CRON_SECRET
```
Key: CRON_SECRET
Value: QyZE4omg0rXt95Y1s5RSldU=
```

#### Variabel 5: FOOTBALL_API_KEY
```
Key: FOOTBALL_API_KEY
Value: de7fa0811fccbfb663a79b4206a667a1
```

### 4. Vigtigt at huske

- ✅ Vælg **alle tre environments** for hver variabel
- ✅ Kopier værdierne **præcist** som de står (ingen mellemrum før/efter)
- ✅ Klik **"Save"** efter hver variabel
- ✅ Efter du har tilføjet alle variabler, skal du **redeploy** projektet

### 5. Redeploy projektet

Efter at have tilføjet alle miljøvariabler:

1. Gå til **"Deployments"** tab
2. Find den seneste deployment
3. Klik på de tre prikker (⋯)
4. Vælg **"Redeploy"**
5. Bekræft

## Visuel guide

```
Vercel Dashboard
    ↓
Settings
    ↓
Environment Variables
    ↓
Add New
    ↓
[Key] NEXT_PUBLIC_SUPABASE_URL
[Value] https://znkvmklheuidkffvbtvn.supabase.co
[✓] Production
[✓] Preview  
[✓] Development
    ↓
Save
    ↓
Gentag for alle 5 variabler
    ↓
Redeploy
```

## Fejlfinding

### "Environment variable not found"
- Tjek at du har stavet Key korrekt (præcis som vist ovenfor)
- Tjek at du har valgt alle tre environments
- Prøv at redeploy projektet

### "Supabase connection failed"
- Verificer at NEXT_PUBLIC_SUPABASE_URL er korrekt
- Verificer at NEXT_PUBLIC_SUPABASE_ANON_KEY er korrekt
- Tjek at der ikke er mellemrum før eller efter værdierne

### "API key invalid"
- Verificer at FOOTBALL_API_KEY er korrekt
- Tjek at din API key stadig er aktiv på api-football.com

## Næste skridt

Efter miljøvariabler er sat:
1. ✅ Redeploy projektet
2. ✅ Test at login virker
3. ✅ Test at data hentes korrekt
4. ✅ Verificer at predictions genereres
