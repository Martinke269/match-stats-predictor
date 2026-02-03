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
 * Check if API is configured
 */
export function isAPIConfigured(): boolean {
  return !!API_KEY && API_KEY.length > 0;
}
