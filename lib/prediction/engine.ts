import { Team, Prediction } from '../types';
import { HeadToHeadStats } from '../api/football-api';
import { analyzeFactors, FactorOptions } from './factors';
import { calculateProbabilities } from './probability';

export interface PredictionOptions {
  afterWinterBreak?: boolean;
  winterBreakMonths?: number;
  homeFixtureCongestion?: {
    europeanCompetition?: boolean;
    cupMatches?: number;
  };
  awayFixtureCongestion?: {
    europeanCompetition?: boolean;
    cupMatches?: number;
  };
  enableUpsetFactor?: boolean;
  upsetFactorStrength?: number;
  headToHead?: HeadToHeadStats | null;
}

/**
 * Main prediction engine class
 * Refactored into modular components for better maintainability
 */
export class PredictionEngine {
  /**
   * Calculate match prediction based on team statistics and form
   * @param homeTeam - Home team data
   * @param awayTeam - Away team data
   * @param matchId - Unique match identifier
   * @param options - Optional configuration including winter break detection and head-to-head data
   */
  static predictMatch(
    homeTeam: Team,
    awayTeam: Team,
    matchId: string,
    options?: PredictionOptions
  ): Prediction {
    // Analyze all factors
    const factorAnalysis = analyzeFactors(homeTeam, awayTeam, options as FactorOptions);

    // Calculate probabilities and predicted score
    const probabilityResult = calculateProbabilities(
      homeTeam,
      awayTeam,
      factorAnalysis,
      {
        afterWinterBreak: options?.afterWinterBreak,
        headToHead: options?.headToHead
      }
    );

    return {
      matchId,
      homeWinProbability: probabilityResult.homeWinProbability,
      drawProbability: probabilityResult.drawProbability,
      awayWinProbability: probabilityResult.awayWinProbability,
      predictedScore: {
        home: probabilityResult.predictedHomeGoals,
        away: probabilityResult.predictedAwayGoals
      },
      confidence: probabilityResult.confidence,
      factors: factorAnalysis.factors
    };
  }
}
