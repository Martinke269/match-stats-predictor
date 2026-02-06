import { Team } from '../types';

/**
 * Calculate form score based on recent results
 * Recent results have more weight
 */
export function calculateFormScore(form: string[]): number {
  let score = 0;
  form.forEach((result, index) => {
    const weight = form.length - index; // Recent results have more weight
    if (result === 'W') score += 3 * weight;
    else if (result === 'D') score += 1 * weight;
  });
  return score;
}

/**
 * Calculate win rate for a team
 */
export function calculateWinRate(team: Team): number {
  const totalGames = team.stats.wins + team.stats.draws + team.stats.losses;
  return totalGames > 0 ? team.stats.wins / totalGames : 0;
}

/**
 * Calculate overall team quality score (0-100)
 * Based on multiple factors: win rate, goal difference, form, clean sheets
 */
export function calculateTeamQuality(team: Team): number {
  const totalGames = team.stats.wins + team.stats.draws + team.stats.losses;
  if (totalGames === 0) return 50;

  // Win rate component (0-30 points)
  const winRate = team.stats.wins / totalGames;
  const winRateScore = winRate * 30;

  // Goal difference component (0-25 points)
  const goalDiff = team.stats.goalsScored - team.stats.goalsConceded;
  const goalDiffScore = Math.min(Math.max((goalDiff + 25) / 2, 0), 25);

  // Form component (0-20 points)
  const formScore = calculateFormScore(team.form);
  const maxFormScore = 15 * 5; // 5 results, max 3 points each with weight 5
  const formPercentage = (formScore / maxFormScore) * 20;

  // Clean sheet rate component (0-15 points)
  const cleanSheetRate = team.stats.cleanSheets / totalGames;
  const cleanSheetScore = cleanSheetRate * 15;

  // Points per game component (0-10 points)
  const points = (team.stats.wins * 3) + team.stats.draws;
  const pointsPerGame = points / totalGames;
  const pointsScore = (pointsPerGame / 3) * 10; // Max 3 points per game

  return winRateScore + goalDiffScore + formPercentage + cleanSheetScore + pointsScore;
}

/**
 * Calculate attack strength (goals per game)
 */
export function calculateAttackStrength(team: Team): number {
  const totalGames = team.stats.wins + team.stats.draws + team.stats.losses;
  return totalGames > 0 ? team.stats.goalsScored / totalGames : 0;
}

/**
 * Calculate defensive strength (clean sheet rate)
 */
export function calculateDefensiveStrength(team: Team): number {
  const totalGames = team.stats.wins + team.stats.draws + team.stats.losses;
  return totalGames > 0 ? team.stats.cleanSheets / totalGames : 0;
}

/**
 * Calculate goal difference
 */
export function calculateGoalDifference(team: Team): number {
  return team.stats.goalsScored - team.stats.goalsConceded;
}
