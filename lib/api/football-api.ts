/**
 * Football API integration for fetching real match data
 * Using API-Football (free tier)
 */

import { Team, Match } from '../types';

const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY || '';
const API_BASE_URL = 'https://v3.football.api-sports.io';

// League IDs for API-Football
export const LEAGUE_IDS = {
  'Superligaen': 119,      // Danish Superliga
  'Premier League': 39,     // English Premier League
  'Ligue 1': 61,           // French Ligue 1
  'Bundesliga': 78,        // German Bundesliga
  'La Liga': 140,          // Spanish La Liga
  'Serie A': 135           // Italian Serie A
};

interface APITeam {
  id: number;
  name: string;
  logo: string;
}

interface APIFixture {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
  };
  teams: {
    home: APITeam;
    away: APITeam;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

interface APITeamStats {
  team: APITeam;
  statistics: Array<{
    type: string;
    value: number | string;
  }>;
}

/**
 * Convert API team data to our Team format
 */
function convertAPITeamToTeam(apiTeam: APITeam, stats?: APITeamStats): Team {
  // Extract stats if available
  const getStatValue = (type: string, defaultValue: number = 0): number => {
    if (!stats) return defaultValue;
    const stat = stats.statistics.find(s => s.type === type);
    return stat ? (typeof stat.value === 'number' ? stat.value : parseInt(stat.value as string) || defaultValue) : defaultValue;
  };

  return {
    id: apiTeam.id.toString(),
    name: apiTeam.name,
    logo: apiTeam.logo,
    form: ['W', 'W', 'D', 'W', 'L'], // Default form, would need separate API call for actual form
    stats: {
      goalsScored: getStatValue('goals_for', 30),
      goalsConceded: getStatValue('goals_against', 25),
      wins: getStatValue('wins', 10),
      draws: getStatValue('draws', 5),
      losses: getStatValue('losses', 5),
      cleanSheets: getStatValue('clean_sheets', 5),
      possession: getStatValue('possession', 50),
      shotsOnTarget: getStatValue('shots_on_target', 100),
      passAccuracy: getStatValue('pass_accuracy', 80)
    }
  };
}

/**
 * Fetch fixtures for a specific league and date range
 */
export async function fetchLeagueFixtures(
  leagueName: keyof typeof LEAGUE_IDS,
  from: string,
  to: string
): Promise<Match[]> {
  if (!API_KEY) {
    console.warn('No API key provided, using sample data');
    return [];
  }

  const leagueId = LEAGUE_IDS[leagueName];
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/fixtures?league=${leagueId}&from=${from}&to=${to}&season=2025`,
      {
        headers: {
          'x-apisports-key': API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const fixtures: APIFixture[] = data.response || [];

    return fixtures.map(fixture => {
      const status = fixture.fixture.status.short;
      let matchStatus: 'upcoming' | 'live' | 'finished' = 'upcoming';
      
      if (status === 'FT' || status === 'AET' || status === 'PEN') {
        matchStatus = 'finished';
      } else if (status === '1H' || status === '2H' || status === 'HT' || status === 'ET' || status === 'P') {
        matchStatus = 'live';
      }

      const match: Match = {
        id: fixture.fixture.id.toString(),
        homeTeam: convertAPITeamToTeam(fixture.teams.home),
        awayTeam: convertAPITeamToTeam(fixture.teams.away),
        date: new Date(fixture.fixture.date),
        league: leagueName,
        status: matchStatus
      };

      if (fixture.goals.home !== null && fixture.goals.away !== null) {
        match.score = {
          home: fixture.goals.home,
          away: fixture.goals.away
        };
      }

      return match;
    });
  } catch (error) {
    console.error(`Error fetching fixtures for ${leagueName}:`, error);
    return [];
  }
}

/**
 * Fetch fixtures for all leagues for the current week
 */
export async function fetchAllLeaguesFixtures(): Promise<Match[]> {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)

  const from = weekStart.toISOString().split('T')[0];
  const to = weekEnd.toISOString().split('T')[0];

  const leagues = Object.keys(LEAGUE_IDS) as Array<keyof typeof LEAGUE_IDS>;
  
  const allMatches = await Promise.all(
    leagues.map(league => fetchLeagueFixtures(league, from, to))
  );

  return allMatches.flat();
}

/**
 * Head-to-head match result
 */
export interface HeadToHeadMatch {
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  winner: 'home' | 'away' | 'draw';
}

/**
 * Head-to-head statistics between two teams
 */
export interface HeadToHeadStats {
  totalMatches: number;
  homeTeamWins: number;
  awayTeamWins: number;
  draws: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
  lastMatches: HeadToHeadMatch[];
  isDerby: boolean; // True if teams are from same city/region
}

/**
 * Fetch head-to-head statistics between two teams
 * @param homeTeamId - Home team ID
 * @param awayTeamId - Away team ID
 * @param limit - Number of recent matches to include (default: 10)
 */
export async function fetchHeadToHead(
  homeTeamId: string,
  awayTeamId: string,
  limit: number = 10
): Promise<HeadToHeadStats | null> {
  if (!API_KEY) {
    console.warn('No API key provided for head-to-head data');
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/fixtures/headtohead?h2h=${homeTeamId}-${awayTeamId}&last=${limit}`,
      {
        headers: {
          'x-apisports-key': API_KEY
        },
        next: { revalidate: 86400 } // Cache for 24 hours
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const fixtures: APIFixture[] = data.response || [];

    if (fixtures.length === 0) {
      return null;
    }

    // Process matches
    const lastMatches: HeadToHeadMatch[] = [];
    let homeTeamWins = 0;
    let awayTeamWins = 0;
    let draws = 0;
    let homeTeamGoals = 0;
    let awayTeamGoals = 0;

    fixtures.forEach(fixture => {
      const homeGoals = fixture.goals.home || 0;
      const awayGoals = fixture.goals.away || 0;
      
      // Determine which team was home in this match
      const wasHomeTeamHome = fixture.teams.home.id.toString() === homeTeamId;
      
      let winner: 'home' | 'away' | 'draw';
      if (homeGoals > awayGoals) {
        winner = 'home';
        if (wasHomeTeamHome) homeTeamWins++;
        else awayTeamWins++;
      } else if (awayGoals > homeGoals) {
        winner = 'away';
        if (wasHomeTeamHome) awayTeamWins++;
        else homeTeamWins++;
      } else {
        winner = 'draw';
        draws++;
      }

      // Accumulate goals (from perspective of current home/away teams)
      if (wasHomeTeamHome) {
        homeTeamGoals += homeGoals;
        awayTeamGoals += awayGoals;
      } else {
        homeTeamGoals += awayGoals;
        awayTeamGoals += homeGoals;
      }

      lastMatches.push({
        date: fixture.fixture.date,
        homeTeam: fixture.teams.home.name,
        awayTeam: fixture.teams.away.name,
        homeGoals,
        awayGoals,
        winner
      });
    });

    // Check if it's a derby (teams from same country/region)
    // This is a simplified check - could be enhanced with city data
    const isDerby = fixtures.length > 0 && 
                    fixtures[0].league.country === fixtures[0].league.country;

    return {
      totalMatches: fixtures.length,
      homeTeamWins,
      awayTeamWins,
      draws,
      homeTeamGoals,
      awayTeamGoals,
      lastMatches: lastMatches.slice(0, 5), // Return last 5 matches
      isDerby
    };
  } catch (error) {
    console.error('Error fetching head-to-head data:', error);
    return null;
  }
}

/**
 * Check if API is configured
 */
export function isAPIConfigured(): boolean {
  return !!API_KEY && API_KEY.length > 0;
}
