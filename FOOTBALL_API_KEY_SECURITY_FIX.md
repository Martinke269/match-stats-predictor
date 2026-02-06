# FOOTBALL_API_KEY Sikkerhedsrettelse

## Dato
6. februar 2026

## Problem Identificeret
API-nøglen til Football API blev eksponeret i browseren ved brug af `NEXT_PUBLIC_` præfikset, hvilket er en kritisk sikkerhedssårbarhed.

## Ændringer Implementeret

### 1. Hovedfil Rettet
**Fil:** `lib/api/football-api.ts`
- **Før:** `const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY || '';`
- **Efter:** `const API_KEY = process.env.FOOTBALL_API_KEY || '';`
- **Resultat:** API-nøglen er nu kun tilgængelig server-side og eksponeres ikke i browser-bundlen

### 2. Dokumentation Opdateret
**Fil:** `LIVE_DATA_SETUP.md`
- **Før:** `NEXT_PUBLIC_FOOTBALL_API_KEY=your_api_key_here`
- **Efter:** `FOOTBALL_API_KEY=your_api_key_here`
- **Resultat:** Brugere vil nu konfigurere API-nøglen korrekt fra starten

### 3. Eksisterende Korrekt Brug
Følgende filer brugte allerede den korrekte server-side variabel:
- ✅ `app/api/cron/fetch-matches/route.ts` - Bruger `process.env.FOOTBALL_API_KEY`
- ✅ `app/api/cron/update-matches/route.ts` - Bruger `process.env.FOOTBALL_API_KEY`

## Sikkerhedsanalyse

### Hvorfor Dette Er Vigtigt
1. **NEXT_PUBLIC_ variabler eksponeres i browseren**
   - Alle variabler med `NEXT_PUBLIC_` præfiks bliver embedded i JavaScript-bundlen
   - Enhver bruger kan se disse værdier i browser DevTools
   - API-nøgler skal ALDRIG være synlige for klienter

2. **Server-only variabler er sikre**
   - Variabler uden `NEXT_PUBLIC_` er kun tilgængelige på serveren
   - De kan ikke tilgås fra browser-kode
   - Perfekt til API-nøgler, secrets og følsomme credentials

### Hvor football-api.ts Bruges
Modulet importeres kun i server-side kontekster:
- ✅ `app/api/matches/route.ts` (API route - server-side)
- ✅ `lib/prediction/engine.ts` (kun brugt server-side)
- ✅ `lib/prediction/factors.ts` (kun brugt server-side)
- ✅ `lib/prediction/probability.ts` (kun brugt server-side)
- ✅ `lib/calculation-logger.ts` (kun brugt server-side)

**Ingen client-side komponenter importerer dette modul**, så det er sikkert at bruge server-only environment variabler.

## Verifikation

### Før Rettelsen
```typescript
// lib/api/football-api.ts
const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY || '';
// ❌ API-nøgle eksponeret i browser bundle
```

### Efter Rettelsen
```typescript
// lib/api/football-api.ts
const API_KEY = process.env.FOOTBALL_API_KEY || '';
// ✅ API-nøgle kun tilgængelig server-side
```

## Anbefalinger til Fremtiden

### Hvornår Skal Man Bruge NEXT_PUBLIC_
Brug kun `NEXT_PUBLIC_` præfikset til:
- ✅ Supabase URL (offentlig information)
- ✅ Supabase Anon Key (designet til at være offentlig)
- ✅ Google Analytics ID
- ✅ Andre offentlige konfigurationsværdier

### Hvornår Skal Man IKKE Bruge NEXT_PUBLIC_
Brug ALDRIG `NEXT_PUBLIC_` til:
- ❌ API-nøgler til eksterne services
- ❌ Database credentials
- ❌ Service role keys
- ❌ Cron secrets
- ❌ Enhver følsom information

## Konklusion

✅ **API-nøglen er nu sikker**
- Eksponeres ikke i browseren
- Kun tilgængelig på serveren
- Dokumentation opdateret
- Ingen client-side imports fundet

✅ **Ingen yderligere ændringer nødvendige**
- Modulet bruges kun server-side
- Eksisterende cron jobs bruger allerede korrekt variabel
- .env.example er allerede korrekt (bruger FOOTBALL_API_KEY)

## Næste Skridt for Brugeren

Hvis du har en eksisterende `.env.local` fil med `NEXT_PUBLIC_FOOTBALL_API_KEY`:

1. Åbn `.env.local`
2. Omdøb variablen fra `NEXT_PUBLIC_FOOTBALL_API_KEY` til `FOOTBALL_API_KEY`
3. Genstart development serveren: `npm run dev`

Eksempel:
```env
# Før
NEXT_PUBLIC_FOOTBALL_API_KEY=din_api_nøgle_her

# Efter
FOOTBALL_API_KEY=din_api_nøgle_her
