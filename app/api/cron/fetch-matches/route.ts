import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// API-Football league IDs
const LEAGUE_IDS = {
  'premier-league': 39,
  'la-liga': 140,
  'bundesliga': 78,
  'serie-a': 135,
  'ligue-1': 61,
  'superliga': 119, // Danish Superliga
};

// This endpoint fetches upcoming matches from API-Football
export async function GET(request: Request) {
  try {
    // Verify the request is from a cron job
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.FOOTBALL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'FOOTBALL_API_KEY not configured' 
      }, { status: 500 });
    }

    const supabase = await createClient();
    let totalFetched = 0;
    let totalAdded = 0;
    const errors: string[] = [];

    // Get current season (2024 for now, adjust as needed)
    const currentSeason = new Date().getFullYear();

    // Fetch matches for each league
    for (const [leagueName, leagueId] of Object.entries(LEAGUE_IDS)) {
      try {
        // Fetch next 10 fixtures for this league
        const response = await fetch(
          `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=${currentSeason}&next=10`,
          {
            headers: {
              'x-rapidapi-key': apiKey,
              'x-rapidapi-host': 'v3.football.api-sports.io'
            }
          }
        );

        if (!response.ok) {
          errors.push(`${leagueName}: API returned ${response.status}`);
          continue;
        }

        const data = await response.json();
        
        if (!data.response || data.response.length === 0) {
          continue;
        }

        totalFetched += data.response.length;

        // Process each match
        for (const fixture of data.response) {
          try {
            const homeTeamName = fixture.teams.home.name;
            const awayTeamName = fixture.teams.away.name;
            const matchDate = new Date(fixture.fixture.date);

            // Find or create home team
            let { data: homeTeam } = await supabase
              .from('teams')
              .select('id')
              .eq('name', homeTeamName)
              .eq('league', leagueName)
              .single();

            if (!homeTeam) {
              const { data: newHomeTeam, error: homeError } = await supabase
                .from('teams')
                .insert({
                  name: homeTeamName,
                  league: leagueName,
                  stats: {
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    goalsScored: 0,
                    goalsConceded: 0,
                    cleanSheets: 0
                  },
                  form: []
                })
                .select()
                .single();

              if (homeError) {
                errors.push(`Failed to create home team ${homeTeamName}: ${homeError.message}`);
                continue;
              }
              homeTeam = newHomeTeam;
            }

            // Find or create away team
            let { data: awayTeam } = await supabase
              .from('teams')
              .select('id')
              .eq('name', awayTeamName)
              .eq('league', leagueName)
              .single();

            if (!awayTeam) {
              const { data: newAwayTeam, error: awayError } = await supabase
                .from('teams')
                .insert({
                  name: awayTeamName,
                  league: leagueName,
                  stats: {
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    goalsScored: 0,
                    goalsConceded: 0,
                    cleanSheets: 0
                  },
                  form: []
                })
                .select()
                .single();

              if (awayError) {
                errors.push(`Failed to create away team ${awayTeamName}: ${awayError.message}`);
                continue;
              }
              awayTeam = newAwayTeam;
            }

            // Ensure both teams exist
            if (!homeTeam || !awayTeam) {
              errors.push(`Missing team data for match ${homeTeamName} vs ${awayTeamName}`);
              continue;
            }

            // Check if match already exists
            const { data: existingMatch } = await supabase
              .from('matches')
              .select('id')
              .eq('home_team_id', homeTeam.id)
              .eq('away_team_id', awayTeam.id)
              .eq('date', matchDate.toISOString())
              .single();

            if (existingMatch) {
              continue; // Match already exists
            }

            // Insert new match
            const { error: matchError } = await supabase
              .from('matches')
              .insert({
                league: leagueName,
                home_team_id: homeTeam.id,
                away_team_id: awayTeam.id,
                date: matchDate.toISOString(),
                status: 'scheduled'
              });

            if (matchError) {
              errors.push(`Failed to insert match: ${matchError.message}`);
            } else {
              totalAdded++;
            }

          } catch (error) {
            errors.push(`Error processing fixture: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }

      } catch (error) {
        errors.push(`${leagueName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      message: 'Matches fetched successfully',
      fetched: totalFetched,
      added: totalAdded,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error in fetch-matches cron:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
