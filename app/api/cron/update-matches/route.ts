import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// This endpoint should be called by a cron job (e.g., Vercel Cron or external service)
// to automatically update match results
export async function GET(request: Request) {
  try {
    // Verify the request is from a cron job (optional: add authorization header check)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Get all scheduled or live matches
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('*, home_team:teams!matches_home_team_id_fkey(name), away_team:teams!matches_away_team_id_fkey(name)')
      .in('status', ['scheduled', 'live'])
      .order('date', { ascending: true });

    if (matchesError) {
      console.error('Error fetching matches:', matchesError);
      return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
    }

    if (!matches || matches.length === 0) {
      return NextResponse.json({ message: 'No matches to update', updated: 0 });
    }

    const apiKey = process.env.FOOTBALL_API_KEY;
    let updatedCount = 0;
    const now = new Date();
    const errors: string[] = [];

    // League ID mapping
    const LEAGUE_IDS: Record<string, number> = {
      'premier-league': 39,
      'la-liga': 140,
      'bundesliga': 78,
      'serie-a': 135,
      'ligue-1': 61,
      'superliga': 119,
    };

    // Update matches that have passed their scheduled time
    for (const match of matches) {
      const matchDate = new Date(match.date);
      
      // If match date has passed by more than 2 hours, try to get results
      if (now.getTime() - matchDate.getTime() > 2 * 60 * 60 * 1000) {
        let homeScore = null;
        let awayScore = null;
        let status = 'finished';

        // Try to fetch actual results from API if key is available
        if (apiKey && match.home_team && match.away_team) {
          try {
            const leagueId = LEAGUE_IDS[match.league];
            if (leagueId) {
              // Format date for API (YYYY-MM-DD)
              const dateStr = matchDate.toISOString().split('T')[0];
              
              const response = await fetch(
                `https://v3.football.api-sports.io/fixtures?league=${leagueId}&date=${dateStr}&team=${match.home_team.name}`,
                {
                  headers: {
                    'x-rapidapi-key': apiKey,
                    'x-rapidapi-host': 'v3.football.api-sports.io'
                  }
                }
              );

              if (response.ok) {
                const data = await response.json();
                
                // Find the specific match
                const fixture = data.response?.find((f: any) => 
                  f.teams.home.name === match.home_team.name &&
                  f.teams.away.name === match.away_team.name
                );

                if (fixture && fixture.fixture.status.short === 'FT') {
                  homeScore = fixture.goals.home;
                  awayScore = fixture.goals.away;
                }
              }
            }
          } catch (error) {
            errors.push(`Failed to fetch result for match ${match.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }

        // Update match with results (or just mark as finished if no API)
        const { error: updateError } = await supabase
          .from('matches')
          .update({ 
            status,
            home_score: homeScore,
            away_score: awayScore,
            updated_at: new Date().toISOString()
          })
          .eq('id', match.id);

        if (!updateError) {
          updatedCount++;
        } else {
          errors.push(`Failed to update match ${match.id}: ${updateError.message}`);
        }
      }
    }

    return NextResponse.json({ 
      message: 'Matches updated successfully',
      updated: updatedCount,
      total: matches.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error in update-matches cron:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
