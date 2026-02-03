import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { premierLeagueTeams } from '@/lib/data/leagues/premier-league';
import { laLigaTeams } from '@/lib/data/leagues/la-liga';
import { bundesligaTeams } from '@/lib/data/leagues/bundesliga';
import { serieATeams } from '@/lib/data/leagues/serie-a';
import { ligue1Teams } from '@/lib/data/leagues/ligue-1';
import { superligaenTeams } from '@/lib/data/leagues/superligaen';
import { Team } from '@/lib/types';

export const dynamic = 'force-dynamic';

// Server-side insert functions
async function upsertTeam(supabase: any, team: Team, league: string): Promise<string | null> {
  // First try to find existing team
  const { data: existing } = await supabase
    .from('teams')
    .select('id')
    .eq('name', team.name)
    .eq('league', league)
    .single();
  
  if (existing) {
    // Update existing team
    const { error: updateError } = await supabase
      .from('teams')
      .update({
        stats: team.stats,
        form: team.form
      })
      .eq('id', existing.id);
    
    if (updateError) {
      console.error('Error updating team:', updateError);
    }
    return existing.id;
  }
  
  // Insert new team
  const { data, error } = await supabase
    .from('teams')
    .insert({
      name: team.name,
      league: league,
      stats: team.stats,
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

async function upsertMatch(
  supabase: any,
  league: string,
  homeTeamId: string,
  awayTeamId: string,
  date: Date
): Promise<string | null> {
  // Check if match already exists
  const { data: existing } = await supabase
    .from('matches')
    .select('id')
    .eq('home_team_id', homeTeamId)
    .eq('away_team_id', awayTeamId)
    .eq('date', date.toISOString())
    .single();
  
  if (existing) {
    return existing.id;
  }
  
  // Insert new match
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

export async function POST() {
  try {
    // Create Supabase client with service role key for server-side operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!
    );

    const results = {
      teams: 0,
      matches: 0,
      errors: [] as string[]
    };

    // Migrate Premier League
    const plTeamIds: Record<string, string> = {};
    for (const [key, team] of Object.entries(premierLeagueTeams)) {
      const teamId = await upsertTeam(supabase, team, 'Premier League');
      if (teamId) {
        plTeamIds[key] = teamId;
        results.teams++;
      } else {
        results.errors.push(`Failed to insert team: ${team.name}`);
      }
    }

    // Premier League matches (from the schedule)
    const plMatches = [
      { home: 'leicester', away: 'nottingham forest', date: new Date('2025-02-07T21:00:00Z') },
      { home: 'manchester united', away: 'tottenham', date: new Date('2025-02-08T13:30:00Z') },
      { home: 'fulham', away: 'everton', date: new Date('2025-02-08T16:00:00Z') },
      { home: 'bournemouth', away: 'west ham', date: new Date('2025-02-08T16:00:00Z') },
      { home: 'arsenal', away: 'southampton', date: new Date('2025-02-08T16:00:00Z') },
      { home: 'wolves', away: 'chelsea', date: new Date('2025-02-08T16:00:00Z') },
      { home: 'ipswich', away: 'aston villa', date: new Date('2025-02-08T16:00:00Z') },
      { home: 'newcastle', away: 'brentford', date: new Date('2025-02-08T18:30:00Z') },
      { home: 'brighton', away: 'crystal palace', date: new Date('2025-02-09T15:00:00Z') },
      { home: 'liverpool', away: 'manchester city', date: new Date('2025-02-09T17:30:00Z') }
    ];

    for (const match of plMatches) {
      const homeId = plTeamIds[match.home];
      const awayId = plTeamIds[match.away];
      if (homeId && awayId) {
        const matchId = await upsertMatch(supabase, 'Premier League', homeId, awayId, match.date);
        if (matchId) {
          results.matches++;
        } else {
          results.errors.push(`Failed to insert match: ${match.home} vs ${match.away}`);
        }
      }
    }

    // Migrate La Liga
    const laLigaTeamIds: Record<string, string> = {};
    for (const [key, team] of Object.entries(laLigaTeams)) {
      const teamId = await upsertTeam(supabase, team, 'La Liga');
      if (teamId) {
        laLigaTeamIds[key] = teamId;
        results.teams++;
      } else {
        results.errors.push(`Failed to insert team: ${team.name}`);
      }
    }

    // Migrate Bundesliga
    const bundesligaTeamIds: Record<string, string> = {};
    for (const [key, team] of Object.entries(bundesligaTeams)) {
      const teamId = await upsertTeam(supabase, team, 'Bundesliga');
      if (teamId) {
        bundesligaTeamIds[key] = teamId;
        results.teams++;
      } else {
        results.errors.push(`Failed to insert team: ${team.name}`);
      }
    }

    // Migrate Serie A
    const serieATeamIds: Record<string, string> = {};
    for (const [key, team] of Object.entries(serieATeams)) {
      const teamId = await upsertTeam(supabase, team, 'Serie A');
      if (teamId) {
        serieATeamIds[key] = teamId;
        results.teams++;
      } else {
        results.errors.push(`Failed to insert team: ${team.name}`);
      }
    }

    // Migrate Ligue 1
    const ligue1TeamIds: Record<string, string> = {};
    for (const [key, team] of Object.entries(ligue1Teams)) {
      const teamId = await upsertTeam(supabase, team, 'Ligue 1');
      if (teamId) {
        ligue1TeamIds[key] = teamId;
        results.teams++;
      } else {
        results.errors.push(`Failed to insert team: ${team.name}`);
      }
    }

    // Migrate Superligaen
    const superligaenTeamIds: Record<string, string> = {};
    for (const [key, team] of Object.entries(superligaenTeams)) {
      const teamId = await upsertTeam(supabase, team, 'Superligaen');
      if (teamId) {
        superligaenTeamIds[key] = teamId;
        results.teams++;
      } else {
        results.errors.push(`Failed to insert team: ${team.name}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Data migration completed',
      results
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, error: 'Migration failed', details: error },
      { status: 500 }
    );
  }
}
