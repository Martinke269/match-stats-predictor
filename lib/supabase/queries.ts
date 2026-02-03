import { createClient } from '@/lib/supabase/client';
import { Database } from './database.types';
import { Team, Match, Prediction } from '@/lib/types';

type TeamRow = Database['public']['Tables']['teams']['Row'];
type MatchRow = Database['public']['Tables']['matches']['Row'];
type PredictionRow = Database['public']['Tables']['predictions']['Row'];

// Convert database row to Team type
function rowToTeam(row: TeamRow): Team {
  const stats = row.stats as any;
  return {
    id: row.name.toLowerCase().replace(/\s+/g, '-'),
    name: row.name,
    form: row.form,
    stats: {
      goalsScored: stats.goalsScored || 0,
      goalsConceded: stats.goalsConceded || 0,
      wins: stats.wins || 0,
      draws: stats.draws || 0,
      losses: stats.losses || 0,
      cleanSheets: stats.cleanSheets || 0,
      possession: stats.possession || 0,
      shotsOnTarget: stats.shotsOnTarget || 0,
      passAccuracy: stats.passAccuracy || 0
    }
  };
}

// Convert database rows to Match type
async function rowToMatch(row: MatchRow, homeTeam: TeamRow, awayTeam: TeamRow): Promise<Match> {
  // Map database status to Match status type
  let status: 'upcoming' | 'live' | 'finished';
  if (row.status === 'scheduled') {
    status = 'upcoming';
  } else if (row.status === 'live') {
    status = 'live';
  } else {
    status = 'finished';
  }
  
  return {
    id: row.id,
    homeTeam: rowToTeam(homeTeam),
    awayTeam: rowToTeam(awayTeam),
    date: new Date(row.date),
    league: row.league,
    status,
    score: row.home_score !== null && row.away_score !== null 
      ? { home: row.home_score, away: row.away_score }
      : undefined
  };
}

// Get all teams for a league
export async function getTeamsByLeague(league: string): Promise<Team[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('league', league)
    .order('name');
  
  if (error) {
    console.error('Error fetching teams:', error);
    return [];
  }
  
  return data.map(rowToTeam);
}

// Get a specific team by name and league
export async function getTeam(name: string, league: string): Promise<Team | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('name', name)
    .eq('league', league)
    .single();
  
  if (error) {
    console.error('Error fetching team:', error);
    return null;
  }
  
  return rowToTeam(data);
}

// Get all matches for a league
export async function getMatchesByLeague(league: string): Promise<Match[]> {
  const supabase = createClient();
  
  const { data: matchesData, error: matchesError } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(*),
      away_team:teams!matches_away_team_id_fkey(*)
    `)
    .eq('league', league)
    .order('date');
  
  if (matchesError) {
    console.error('Error fetching matches:', matchesError);
    return [];
  }
  
  const matches: Match[] = [];
  for (const match of matchesData) {
    if (match.home_team && match.away_team) {
      matches.push(await rowToMatch(
        match as MatchRow,
        match.home_team as TeamRow,
        match.away_team as TeamRow
      ));
    }
  }
  
  return matches;
}

// Get upcoming matches (scheduled status)
export async function getUpcomingMatches(league?: string): Promise<Match[]> {
  const supabase = createClient();
  
  let query = supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(*),
      away_team:teams!matches_away_team_id_fkey(*)
    `)
    .eq('status', 'scheduled')
    .gte('date', new Date().toISOString())
    .order('date');
  
  if (league) {
    query = query.eq('league', league);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching upcoming matches:', error);
    return [];
  }
  
  const matches: Match[] = [];
  for (const match of data) {
    if (match.home_team && match.away_team) {
      matches.push(await rowToMatch(
        match as MatchRow,
        match.home_team as TeamRow,
        match.away_team as TeamRow
      ));
    }
  }
  
  return matches;
}

// Get prediction for a match
export async function getPrediction(matchId: string): Promise<Prediction | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('match_id', matchId)
    .single();
  
  if (error) {
    console.error('Error fetching prediction:', error);
    return null;
  }
  
  return {
    matchId: data.match_id,
    homeWinProbability: Number(data.home_win_probability),
    drawProbability: Number(data.draw_probability),
    awayWinProbability: Number(data.away_win_probability),
    predictedScore: {
      home: data.predicted_home_score,
      away: data.predicted_away_score
    },
    confidence: data.confidence,
    factors: data.factors as Prediction['factors']
  };
}

// Save prediction for a match
export async function savePrediction(prediction: Prediction): Promise<boolean> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('predictions')
    .upsert({
      match_id: prediction.matchId,
      home_win_probability: prediction.homeWinProbability,
      draw_probability: prediction.drawProbability,
      away_win_probability: prediction.awayWinProbability,
      predicted_home_score: prediction.predictedScore.home,
      predicted_away_score: prediction.predictedScore.away,
      confidence: prediction.confidence,
      factors: prediction.factors as any
    });
  
  if (error) {
    console.error('Error saving prediction:', error);
    return false;
  }
  
  return true;
}

// Insert a team
export async function insertTeam(team: Team, league: string): Promise<string | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('teams')
    .insert({
      name: team.name,
      league: league,
      stats: team.stats as any,
      form: team.form
    })
    .select('id')
    .single();
  
  if (error) {
    console.error('Error inserting team:', error);
    return null;
  }
  
  return data.id;
}

// Insert a match
export async function insertMatch(
  league: string,
  homeTeamId: string,
  awayTeamId: string,
  date: Date
): Promise<string | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('matches')
    .insert({
      league,
      home_team_id: homeTeamId,
      away_team_id: awayTeamId,
      date: date.toISOString(),
      status: 'scheduled'
    })
    .select('id')
    .single();
  
  if (error) {
    console.error('Error inserting match:', error);
    return null;
  }
  
  return data.id;
}
