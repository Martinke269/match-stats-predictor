import { Team } from '@/lib/types';
import { superligaenTeams } from '@/lib/data/leagues/superligaen';
import { premierLeagueTeams } from '@/lib/data/leagues/premier-league';
import { ligue1Teams } from '@/lib/data/leagues/ligue-1';
import { serieATeams } from '@/lib/data/leagues/serie-a';
import { bundesligaTeams } from '@/lib/data/leagues/bundesliga';
import { laLigaTeams } from '@/lib/data/leagues/la-liga';
import { primeiraLigaTeams } from '@/lib/data/leagues/primeira-liga';
import { eredivisieTeams } from '@/lib/data/leagues/eredivisie';

export interface PowerRanking {
  rank: number;
  team: Team;
  powerScore: number;
  championshipProbability: number;
  strengths: string[];
  weaknesses: string[];
  trend: 'up' | 'down' | 'stable';
}

export interface LeaguePowerRanking {
  leagueName: string;
  leagueId: string;
  rankings: PowerRanking[];
  topContender: PowerRanking;
  darkHorse: PowerRanking;
  analysis: string;
}

function calculateFormScore(form: string[]): number {
  const points = form.map(result => {
    if (result === 'W') return 3;
    if (result === 'D') return 1;
    return 0;
  });
  return points.reduce((a: number, b: number) => a + b, 0) / 15; // Normalize to 0-1
}

function calculateDefensiveStrength(team: Team): number {
  const gamesPlayed = team.stats.wins + team.stats.draws + team.stats.losses;
  const goalsPerGame = team.stats.goalsConceded / gamesPlayed;
  const cleanSheetRatio = team.stats.cleanSheets / gamesPlayed;
  return (1 - (goalsPerGame / 3)) * 0.6 + cleanSheetRatio * 0.4;
}

function calculateOffensiveStrength(team: Team): number {
  const gamesPlayed = team.stats.wins + team.stats.draws + team.stats.losses;
  const goalsPerGame = team.stats.goalsScored / gamesPlayed;
  const shotAccuracy = team.stats.shotsOnTarget / (gamesPlayed * 15); // Assume ~15 shots per game
  return (goalsPerGame / 3) * 0.7 + shotAccuracy * 0.3;
}

function calculateConsistency(team: Team): number {
  const gamesPlayed = team.stats.wins + team.stats.draws + team.stats.losses;
  const winRate = team.stats.wins / gamesPlayed;
  const formConsistency = calculateFormScore(team.form);
  return winRate * 0.6 + formConsistency * 0.4;
}

function calculatePowerScore(team: Team): number {
  const formScore = calculateFormScore(team.form);
  const defensive = calculateDefensiveStrength(team);
  const offensive = calculateOffensiveStrength(team);
  const consistency = calculateConsistency(team);
  const possession = team.stats.possession / 100;
  const passAccuracy = team.stats.passAccuracy / 100;
  
  // Weighted calculation
  return (
    formScore * 0.25 +
    defensive * 0.20 +
    offensive * 0.25 +
    consistency * 0.20 +
    possession * 0.05 +
    passAccuracy * 0.05
  ) * 100;
}

function determineStrengths(team: Team, powerScore: number): string[] {
  const strengths: string[] = [];
  const gamesPlayed = team.stats.wins + team.stats.draws + team.stats.losses;
  
  if (team.stats.goalsScored / gamesPlayed > 2) {
    strengths.push('Stærkt angreb');
  }
  if (team.stats.cleanSheets / gamesPlayed > 0.4) {
    strengths.push('Solid forsvar');
  }
  if (team.stats.wins / gamesPlayed > 0.6) {
    strengths.push('Høj sejrsrate');
  }
  if (team.stats.possession > 55) {
    strengths.push('Dominerende boldbesiddelse');
  }
  if (team.stats.passAccuracy > 82) {
    strengths.push('Præcis pasningsspil');
  }
  if (team.form.filter(f => f === 'W').length >= 4) {
    strengths.push('Fremragende form');
  }
  
  return strengths.length > 0 ? strengths : ['Balanceret hold'];
}

function determineWeaknesses(team: Team): string[] {
  const weaknesses: string[] = [];
  const gamesPlayed = team.stats.wins + team.stats.draws + team.stats.losses;
  
  if (team.stats.goalsConceded / gamesPlayed > 1.5) {
    weaknesses.push('Defensiv sårbarhed');
  }
  if (team.stats.goalsScored / gamesPlayed < 1) {
    weaknesses.push('Manglende scoringsevne');
  }
  if (team.stats.losses / gamesPlayed > 0.4) {
    weaknesses.push('Inkonsistente resultater');
  }
  if (team.stats.possession < 45) {
    weaknesses.push('Lav boldbesiddelse');
  }
  if (team.form.filter(f => f === 'L').length >= 3) {
    weaknesses.push('Dårlig form');
  }
  
  return weaknesses.length > 0 ? weaknesses : ['Ingen markante svagheder'];
}

function determineTrend(form: string[]): 'up' | 'down' | 'stable' {
  const recent = form.slice(0, 3);
  const older = form.slice(3, 5);
  
  const recentPoints = recent.reduce((sum, r) => sum + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0);
  const olderPoints = older.reduce((sum, r) => sum + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0);
  
  if (recentPoints > olderPoints + 2) return 'up';
  if (recentPoints < olderPoints - 2) return 'down';
  return 'stable';
}

function calculateChampionshipProbability(powerScore: number, maxScore: number): number {
  // Exponential distribution favoring top teams
  const normalized = powerScore / maxScore;
  return Math.pow(normalized, 2) * 100;
}

export function generateLeaguePowerRanking(
  leagueName: string,
  leagueId: string,
  teams: Record<string, Team>
): LeaguePowerRanking {
  // Calculate power scores for all teams
  const teamRankings = Object.values(teams).map(team => {
    const powerScore = calculatePowerScore(team);
    return {
      team,
      powerScore,
      strengths: determineStrengths(team, powerScore),
      weaknesses: determineWeaknesses(team),
      trend: determineTrend(team.form)
    };
  });
  
  // Sort by power score, with tie-breaking based on league points
  // When teams have the same score, promote top teams over middle teams over bottom teams
  teamRankings.sort((a, b) => {
    const scoreDiff = b.powerScore - a.powerScore;
    
    // If power scores are equal (or very close), use league points as tie-breaker
    if (Math.abs(scoreDiff) < 0.01) {
      const aPoints = a.team.stats.wins * 3 + a.team.stats.draws;
      const bPoints = b.team.stats.wins * 3 + b.team.stats.draws;
      return bPoints - aPoints; // Higher points = better position (top team)
    }
    
    return scoreDiff;
  });
  
  // Calculate championship probabilities
  const maxScore = teamRankings[0].powerScore;
  const totalProbability = teamRankings.reduce((sum, t) => 
    sum + calculateChampionshipProbability(t.powerScore, maxScore), 0
  );
  
  // Create final rankings
  const rankings: PowerRanking[] = teamRankings.map((tr, index) => {
    const rawProbability = calculateChampionshipProbability(tr.powerScore, maxScore);
    return {
      rank: index + 1,
      team: tr.team,
      powerScore: Math.round(tr.powerScore * 10) / 10,
      championshipProbability: Math.round((rawProbability / totalProbability) * 100 * 10) / 10,
      strengths: tr.strengths,
      weaknesses: tr.weaknesses,
      trend: tr.trend
    };
  });
  
  // Identify top contender and dark horse
  const topContender = rankings[0];
  const darkHorse = rankings.find((r, i) => i >= 3 && r.trend === 'up') || rankings[3];
  
  // Generate analysis
  const analysis = generateLeagueAnalysis(leagueName, rankings, topContender, darkHorse);
  
  return {
    leagueName,
    leagueId,
    rankings,
    topContender,
    darkHorse,
    analysis
  };
}

function generateLeagueAnalysis(
  leagueName: string,
  rankings: PowerRanking[],
  topContender: PowerRanking,
  darkHorse: PowerRanking
): string {
  const top3 = rankings.slice(0, 3);
  const gap = top3[0].powerScore - top3[1].powerScore;
  
  if (gap > 5) {
    return `${topContender.team.name} er klare favoritter til mesterskabet i ${leagueName} med en dominerende power score på ${topContender.powerScore}. Deres ${topContender.championshipProbability}% sandsynlighed for titlen afspejler deres overlegne præstationer. ${darkHorse.team.name} kunne være sæsonens overraskelse med deres stigende form.`;
  } else if (gap > 2) {
    return `Mesterskabskampen i ${leagueName} ser ud til at være mellem ${top3[0].team.name} og ${top3[1].team.name}, med kun ${gap.toFixed(1)} point mellem dem. ${topContender.team.name} har en lille fordel med ${topContender.championshipProbability}% sandsynlighed. Hold øje med ${darkHorse.team.name} som en potentiel udfordrer.`;
  } else {
    return `${leagueName} har et utroligt tæt mesterskab med ${top3[0].team.name}, ${top3[1].team.name} og ${top3[2].team.name} alle i spil. Med kun ${gap.toFixed(1)} point mellem toppen, kan enhver af disse hold vinde titlen. ${darkHorse.team.name} bør ikke undervurderes.`;
  }
}

// Generate power rankings for all leagues
export function getAllLeaguePowerRankings(): LeaguePowerRanking[] {
  return [
    generateLeaguePowerRanking('Superligaen', 'superliga', superligaenTeams),
    generateLeaguePowerRanking('Premier League', 'premier-league', premierLeagueTeams),
    generateLeaguePowerRanking('La Liga', 'la-liga', laLigaTeams),
    generateLeaguePowerRanking('Serie A', 'serie-a', serieATeams),
    generateLeaguePowerRanking('Bundesliga', 'bundesliga', bundesligaTeams),
    generateLeaguePowerRanking('Ligue 1', 'ligue1', ligue1Teams),
    generateLeaguePowerRanking('Primeira Liga', 'primeira-liga', primeiraLigaTeams),
    generateLeaguePowerRanking('Eredivisie', 'eredivisie', eredivisieTeams)
  ];
}
