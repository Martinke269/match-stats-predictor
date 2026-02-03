import { Team } from '@/lib/types';
import { teamsDatabase } from '@/lib/data/teams-database';

// Normalize team name for lookup
export function normalizeTeamName(name: string): string {
  return name.toLowerCase().trim();
}

// Find team with fuzzy matching
export function findTeam(searchName: string): Team | null {
  const normalized = normalizeTeamName(searchName);
  
  // Exact match by key
  if (teamsDatabase[normalized]) {
    return teamsDatabase[normalized];
  }
  
  // Check against team IDs (e.g., "fck" for FC København)
  for (const team of Object.values(teamsDatabase)) {
    if (normalizeTeamName(team.id) === normalized) {
      return team;
    }
  }
  
  // Partial match by key
  for (const [key, team] of Object.entries(teamsDatabase)) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return team;
    }
  }
  
  // Check if search term is in team name
  for (const team of Object.values(teamsDatabase)) {
    if (normalizeTeamName(team.name).includes(normalized)) {
      return team;
    }
  }
  
  // Check if search term matches team ID partially
  for (const team of Object.values(teamsDatabase)) {
    const teamId = normalizeTeamName(team.id);
    if (teamId.includes(normalized) || normalized.includes(teamId)) {
      return team;
    }
  }
  
  return null;
}

// Get all available teams
export function getAllTeams(): Team[] {
  return Object.values(teamsDatabase);
}

// Get teams by league
export function getTeamsByLeague(league: string): Team[] {
  // This would need league information in the team data
  // For now, return all teams
  return getAllTeams();
}
