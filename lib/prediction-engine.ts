/**
 * Legacy prediction engine file
 * This file now re-exports from the refactored modular prediction system
 * for backward compatibility with existing code
 */

export { PredictionEngine } from './prediction/engine';
export type { PredictionOptions } from './prediction/engine';

// Re-export calculator functions for any code that might use them directly
export {
  calculateFormScore,
  calculateWinRate,
  calculateTeamQuality,
  calculateAttackStrength,
  calculateDefensiveStrength,
  calculateGoalDifference
} from './prediction/calculators';

// Re-export factor analysis
export { analyzeFactors } from './prediction/factors';
export type { FactorOptions, FactorAnalysisResult, FixtureCongestion } from './prediction/factors';

// Re-export probability calculations
export { calculateProbabilities } from './prediction/probability';
export type { ProbabilityResult, ProbabilityOptions } from './prediction/probability';
