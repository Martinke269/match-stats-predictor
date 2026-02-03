import { Team } from '@/lib/types';
import { superligaenTeams } from './leagues/superligaen';
import { premierLeagueTeams } from './leagues/premier-league';
import { laLigaTeams } from './leagues/la-liga';
import { bundesligaTeams } from './leagues/bundesliga';
import { serieATeams } from './leagues/serie-a';
import { ligue1Teams } from './leagues/ligue-1';

// Database of teams with their stats
// Organized by league for better maintainability
export const teamsDatabase: Record<string, Team> = {
  ...superligaenTeams,
  ...premierLeagueTeams,
  ...laLigaTeams,
  ...bundesligaTeams,
  ...serieATeams,
  ...ligue1Teams
};
