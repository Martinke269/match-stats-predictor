import { createClient } from '@supabase/supabase-js';
import { PredictionEngine } from '../lib/prediction-engine';
import { premierLeagueTeams } from '../lib/data/leagues/premier-league';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function generatePredictions() {
  console.log('Fetching Premier League matches...');
  
  // Get all Premier League matches
  const { data: matches, error: matchError } = await supabase
    .from('matches')
    .select(`
      id,
      date,
      home_team:teams!matches_home_team_id_fkey(name),
      away_team:teams!matches_away_team_id_fkey(name)
    `)
    .eq('league', 'Premier League')
    .eq('status', 'scheduled')
    .order('date', { ascending: true });

  if (matchError) {
    console.error('Error fetching matches:', matchError);
    return;
  }

  console.log(`Found ${matches?.length || 0} matches`);

  for (const match of matches || []) {
    const homeTeamName = (match.home_team as any).name.toLowerCase();
    const awayTeamName = (match.away_team as any).name.toLowerCase();
    
    const homeTeam = premierLeagueTeams[homeTeamName];
    const awayTeam = premierLeagueTeams[awayTeamName];

    if (!homeTeam || !awayTeam) {
      console.log(`Skipping ${homeTeamName} vs ${awayTeamName} - team data not found`);
      continue;
    }

    console.log(`Generating prediction for ${homeTeam.name} vs ${awayTeam.name}...`);

    const prediction = PredictionEngine.predictMatch(
      homeTeam,
      awayTeam,
      match.id
    );

    // Insert prediction
    const { error: predError } = await supabase
      .from('predictions')
      .upsert({
        match_id: match.id,
        home_win_probability: prediction.homeWinProbability,
        draw_probability: prediction.drawProbability,
        away_win_probability: prediction.awayWinProbability,
        predicted_home_score: prediction.predictedScore.home,
        predicted_away_score: prediction.predictedScore.away,
        confidence: prediction.confidence,
        factors: prediction.factors
      });

    if (predError) {
      console.error(`Error saving prediction for ${homeTeam.name} vs ${awayTeam.name}:`, predError);
    } else {
      console.log(`✓ Saved prediction: ${homeTeam.name} ${prediction.predictedScore.home}-${prediction.predictedScore.away} ${awayTeam.name} (${prediction.confidence}% confidence)`);
    }
  }

  console.log('Done!');
}

generatePredictions();
