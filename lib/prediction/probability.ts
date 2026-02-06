import { Team } from '../types';
import { HeadToHeadStats } from '../api/football-api';
import { calculateAttackStrength, calculateWinRate } from './calculators';
import { FactorAnalysisResult } from './factors';

export interface ProbabilityResult {
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  predictedHomeGoals: number;
  predictedAwayGoals: number;
  confidence: number;
}

export interface ProbabilityOptions {
  afterWinterBreak?: boolean;
  headToHead?: HeadToHeadStats | null;
}

/**
 * Calculate match probabilities and predicted score
 */
export function calculateProbabilities(
  homeTeam: Team,
  awayTeam: Team,
  factorAnalysis: FactorAnalysisResult,
  options: ProbabilityOptions = {}
): ProbabilityResult {
  const { afterWinterBreak = false, headToHead } = options;
  const {
    factors,
    homeFormScore,
    awayFormScore,
    homeGoalDiff,
    awayGoalDiff,
    homeQuality,
    awayQuality,
    h2hBonus,
    upsetBonus,
    isHomeUnderdog,
    homeFixtureLoad,
    awayFixtureLoad
  } = factorAnalysis;

  // Calculate base score
  let homeScore = 50;
  const impactMultiplier = afterWinterBreak ? 0.5 : 1.0;

  // Team quality impact
  homeScore += ((homeQuality - awayQuality) / 5) * impactMultiplier;

  // Upset bonus
  if (upsetBonus > 0) {
    homeScore += isHomeUnderdog ? upsetBonus : -upsetBonus;
  }

  // Fixture congestion
  const fixtureLoadDifference = awayFixtureLoad - homeFixtureLoad;
  homeScore += fixtureLoadDifference * 5;

  // Head-to-head
  homeScore += h2hBonus * impactMultiplier;

  // Derby factor - reduce confidence
  if (headToHead?.isDerby) {
    homeScore = 50 + (homeScore - 50) * 0.85;
  }

  // Form impact
  homeScore += (homeFormScore - awayFormScore) * 3 * impactMultiplier;

  // Home advantage
  homeScore += 10 * (afterWinterBreak ? 0.7 : 1.0);

  // Goal difference
  homeScore += Math.min(Math.max((homeGoalDiff - awayGoalDiff) / 2, -10), 10) * impactMultiplier;

  // Win rate
  const homeWinRate = calculateWinRate(homeTeam);
  const awayWinRate = calculateWinRate(awayTeam);
  homeScore += (homeWinRate - awayWinRate) * 20 * impactMultiplier;

  // Attack strength
  const homeAttack = calculateAttackStrength(homeTeam);
  const awayAttack = calculateAttackStrength(awayTeam);
  homeScore += (homeAttack - awayAttack) * 5 * impactMultiplier;

  // Normalize score
  if (afterWinterBreak) {
    homeScore = 50 + (homeScore - 50) * 0.6;
    homeScore = Math.min(Math.max(homeScore, 25), 75);
  } else {
    homeScore = Math.min(Math.max(homeScore, 10), 90);
  }

  // Calculate probabilities
  const scoreDifference = Math.abs(homeScore - 50);
  let baseDraw = 30 - (scoreDifference / 5);

  if (afterWinterBreak) {
    baseDraw += 5;
  }

  const drawProbability = Math.max(20, Math.min(35, baseDraw));
  const remainingProb = 100 - drawProbability;
  const homeWinProbability = (remainingProb * homeScore) / 100;
  const awayWinProbability = remainingProb - homeWinProbability;

  // Predict score
  const homeExpectedGoals = homeAttack * 1.1;
  const awayExpectedGoals = awayAttack * 0.95;

  let predictedHomeGoals: number;
  let predictedAwayGoals: number;

  if (homeWinProbability > awayWinProbability + 15) {
    predictedHomeGoals = Math.max(Math.round(homeExpectedGoals * 1.2), 2);
    predictedAwayGoals = Math.max(Math.round(awayExpectedGoals * 0.8), 0);
    if (predictedHomeGoals <= predictedAwayGoals) {
      predictedHomeGoals = predictedAwayGoals + 1;
    }
  } else if (awayWinProbability > homeWinProbability + 15) {
    predictedHomeGoals = Math.max(Math.round(homeExpectedGoals * 0.8), 0);
    predictedAwayGoals = Math.max(Math.round(awayExpectedGoals * 1.2), 2);
    if (predictedAwayGoals <= predictedHomeGoals) {
      predictedAwayGoals = predictedHomeGoals + 1;
    }
  } else if (drawProbability > Math.max(homeWinProbability, awayWinProbability)) {
    const avgGoals = (homeExpectedGoals + awayExpectedGoals) / 2;
    predictedHomeGoals = Math.round(avgGoals);
    predictedAwayGoals = predictedHomeGoals;
  } else {
    predictedHomeGoals = Math.round(homeExpectedGoals);
    predictedAwayGoals = Math.round(awayExpectedGoals);
    if (homeWinProbability > awayWinProbability && predictedHomeGoals <= predictedAwayGoals) {
      predictedHomeGoals = predictedAwayGoals + 1;
    } else if (awayWinProbability > homeWinProbability && predictedAwayGoals <= predictedHomeGoals) {
      predictedAwayGoals = predictedHomeGoals + 1;
    }
  }

  // Calculate confidence
  const maxProb = Math.max(homeWinProbability, drawProbability, awayWinProbability);
  const secondMaxProb = [homeWinProbability, drawProbability, awayWinProbability]
    .sort((a, b) => b - a)[1];
  const margin = maxProb - secondMaxProb;

  let confidence = 45 + (margin * 1.5);

  // Factor alignment
  const positiveFactors = factors.filter(f => f.impact === 'positive').length;
  const negativeFactors = factors.filter(f => f.impact === 'negative').length;
  const factorAlignment = Math.abs(positiveFactors - negativeFactors);

  if (factorAlignment >= 3) {
    confidence += 10;
  } else if (factorAlignment >= 2) {
    confidence += 5;
  }

  // Quality gap impact
  const qualityGap = Math.abs(homeQuality - awayQuality);
  if (qualityGap >= 50) {
    confidence += 25;
  } else if (qualityGap >= 40) {
    confidence += 20;
  } else if (qualityGap >= 30) {
    confidence += 15;
  } else if (qualityGap >= 20) {
    confidence += 10;
  } else if (qualityGap >= 10) {
    confidence += 5;
  }

  // Top vs bottom teams
  if ((homeQuality > 65 && awayQuality < 30) || (awayQuality > 65 && homeQuality < 30)) {
    confidence += 15;
  }

  // Winter break reduction
  if (afterWinterBreak) {
    const confidenceReduction = Math.min(30, 15 + (2 * 5));
    confidence -= confidenceReduction;
  }

  // Cap confidence
  const minConfidence = afterWinterBreak ? 35 : 50;
  confidence = Math.min(Math.max(Math.round(confidence), minConfidence), 98);

  return {
    homeWinProbability: Math.round(homeWinProbability * 10) / 10,
    drawProbability: Math.round(drawProbability * 10) / 10,
    awayWinProbability: Math.round(awayWinProbability * 10) / 10,
    predictedHomeGoals,
    predictedAwayGoals,
    confidence
  };
}
