# Deployment Guide til Vercel

## Trin-for-trin guide til at publicere dit projekt på Vercel

### 1. Forbered dit projekt

Før deployment skal du sikre dig at:
- ✅ Alle ændringer er committed til Git
- ✅ Dit projekt bygger lokalt uden fejl
- ✅ Du har alle nødvendige miljøvariabler klar

### 2. Opret Vercel konto

1. Gå til [vercel.com](https://vercel.com)
2. Klik på "Sign Up"
3. Log ind med din GitHub konto (anbefalet)

### 3. Deploy projektet

#### Metode A: Via Vercel Dashboard (Anbefalet)

1. Klik på "Add New..." → "Project" i Vercel dashboard
2. Vælg dit GitHub repository
3. Vercel vil automatisk detektere at det er et Next.js projekt
4. Konfigurer miljøvariabler (se nedenfor)
5. Klik på "Deploy"

#### Metode B: Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Login til Vercel
vercel login

# Deploy projektet
vercel

# For production deployment
vercel --prod
```

### 4. Konfigurer miljøvariabler

I Vercel dashboard under "Settings" → "Environment Variables", tilføj følgende:

#### Supabase variabler:
```
NEXT_PUBLIC_SUPABASE_URL=https://znkvmklheuidkffvbtvn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[din-supabase-anon-key]
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=[din-supabase-anon-key]
```

#### Cron Job Security:
```
CRON_SECRET=[generer-en-sikker-string]
```
Generer en sikker string med: `openssl rand -base64 32`

#### API-Football:
```
FOOTBALL_API_KEY=[din-api-football-key]
```
Få en gratis API key på: https://www.api-football.com/

**Vigtigt:** Sæt alle variabler til både "Production", "Preview" og "Development" environments.

### 5. Konfigurer Supabase

I din Supabase dashboard:

1. Gå til "Authentication" → "URL Configuration"
2. Tilføj din Vercel URL til "Site URL": `https://dit-projekt.vercel.app`
3. Tilføj til "Redirect URLs":
   - `https://dit-projekt.vercel.app/auth/confirm`
   - `https://dit-projekt.vercel.app/auth/callback`

### 6. Verificer Cron Jobs

Dine cron jobs er allerede konfigureret i `vercel.json`:
- **Fetch Matches**: Kører dagligt kl. 00:00
- **Generate Predictions**: Kører hver 6. time
- **Update Matches**: Kører hver 2. time

Cron jobs er kun tilgængelige på Pro/Enterprise plans. På Hobby plan skal du bruge eksterne services som:
- [Cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)
- [GitHub Actions](https://github.com/features/actions)

### 7. Test deployment

1. Besøg din Vercel URL
2. Test login/signup funktionalitet
3. Verificer at data hentes korrekt
4. Tjek at predictions genereres

### 8. Opdater domæne (Valgfrit)

1. Gå til "Settings" → "Domains" i Vercel
2. Tilføj dit eget domæne
3. Følg instruktionerne for DNS konfiguration

### Troubleshooting

#### Build fejler
- Tjek build logs i Vercel dashboard
- Kør `npm run build` lokalt for at finde fejl

#### Miljøvariabler virker ikke
- Verificer at alle variabler er sat korrekt
- Redeploy projektet efter at have ændret variabler

#### Supabase authentication fejler
- Tjek at redirect URLs er konfigureret korrekt
- Verificer at NEXT_PUBLIC_SUPABASE_URL matcher din Supabase URL

#### Cron jobs kører ikke
- Verificer at CRON_SECRET er sat
- Tjek at du har en Pro/Enterprise plan, eller brug eksterne services

### Nyttige kommandoer

```bash
# Se deployment status
vercel ls

# Se logs
vercel logs [deployment-url]

# Fjern deployment
vercel rm [deployment-name]

# Åbn projekt i browser
vercel open
```

### Næste skridt

Efter successful deployment:
1. ✅ Konfigurer custom domæne
2. ✅ Opsæt monitoring og analytics
3. ✅ Konfigurer eksterne cron services (hvis på Hobby plan)
4. ✅ Test alle funktioner grundigt
5. ✅ Opsæt error tracking (f.eks. Sentry)

### Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase + Vercel Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
