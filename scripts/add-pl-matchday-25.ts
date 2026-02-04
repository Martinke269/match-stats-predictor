import { createClient } from '@supabase/supabase-js';
import { PredictionEngine } from '../lib/prediction-engine';
import { premierLeagueTeams } from '../lib/data/leagues/premier-league';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials!');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Found' : 'Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Found' : 'Missing');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Found' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Matchday 25 matches from the user's image
const matchday25Matches = [
  {
    homeTeam: 'Leeds',
    awayTeam: 'Nottingham Forest',
    date: '2026-02-06T21:00:00Z'
  },
  {
    homeTeam: 'Manchester United',
    awayTeam: 'Tottenham',
    date: '2026-02-07T13:30:00Z'
  },
  {
    homeTeam: 'Fulham',
    awayTeam: 'Everton',
    date: '2026-02-07T16:00:00Z'
  },
  {
    homeTeam: 'Burnley',
    awayTeam: 'West Ham',
    date: '2026-02-07T16:00:00Z'
  },
  {
    homeTeam: 'Arsenal',
    awayTeam: 'Sunderland',
    date: '2026-02-07T16:00:00Z'
  },
  {
    homeTeam: 'Wolves',
    awayTeam: 'Chelsea',
    date: '2026-02-07T16:00:00Z'
  },
  {
    homeTeam: 'Bournemouth',
    awayTeam: 'Aston Villa',
    date: '2026-02-07T16:00:00Z'
  },
  {
    homeTeam: 'Newcastle',
    awayTeam: 'Brentford',
    date: '2026-02-07T18:30:00Z'
  },
  {
    homeTeam: 'Brighton',
    awayTeam: 'Crystal Palace',
    date: '2026-02-08T15:00:00Z'
  },
  {
    homeTeam: 'Liverpool',
    awayTeam: 'Manchester City',
    date: '2026-02-08T17:30:00Z'
  }
];

async function addMatchday25() {
  console.log('Adding Matchday 25 matches to database...\n');

  // First, get all teams to map names to IDs
  const { data: teams, error: teamsError } = await supabase
    .from('teams')
    .select('id, name');

  if (teamsError) {
    console.error('Error fetching teams:', teamsError);
    return;
  }

  const teamMap = new Map(teams?.map(t => [t.name.toLowerCase(), t.id]) || []);

  for (const match of matchday25Matches) {
    const homeTeamId = teamMap.get(match.homeTeam.toLowerCase());
    const awayTeamId = teamMap.get(match.awayTeam.toLowerCase());

    if (!homeTeamId || !awayTeamId) {
      console.log(`⚠️  Skipping ${match.homeTeam} vs ${match.awayTeam} - team not found in database`);
      continue;
    }

    // Insert match
    const { data: insertedMatch, error: matchError } = await supabase
      .from('matches')
      .insert({
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        date: match.date,
        league: 'Premier League',
        status: 'scheduled'
      })
      .select()
      .single();

    if (matchError) {
      console.error(`❌ Error adding ${match.homeTeam} vs ${match.awayTeam}:`, matchError);
      continue;
    }

    console.log(`✓ Added match: ${match.homeTeam} vs ${match.awayTeam}`);

    // Generate and save prediction
    const homeTeamData = premierLeagueTeams[match.homeTeam.toLowerCase()];
    const awayTeamData = premierLeagueTeams[match.awayTeam.toLowerCase()];

    if (homeTeamData && awayTeamData) {
      const prediction = PredictionEngine.predictMatch(
        homeTeamData,
        awayTeamData,
        insertedMatch.id
      );

      const { error: predError } = await supabase
        .from('predictions')
        .upsert({
          match_id: insertedMatch.id,
          home_win_probability: prediction.homeWinProbability,
          draw_probability: prediction.drawProbability,
          away_win_probability: prediction.awayWinProbability,
          predicted_home_score: prediction.predictedScore.home,
          predicted_away_score: prediction.predictedScore.away,
          confidence: prediction.confidence,
          factors: prediction.factors
        });

      if (predError) {
        console.error(`  ❌ Error saving prediction:`, predError);
      } else {
        console.log(`  ✓ Prediction: ${prediction.predictedScore.home}-${prediction.predictedScore.away} (${prediction.confidence}% confidence)`);
      }
    }
  }

  console.log('\n✅ Done! All Matchday 25 matches have been added.');
}

addMatchday25();
