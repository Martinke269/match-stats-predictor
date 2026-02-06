import { Team, Prediction } from '../types';
import { HeadToHeadStats } from '../api/football-api';
import { analyzeFactors, FactorOptions } from './factors';
import { calculateProbabilities } from './probability';
import { analyzeNewsImpact, applyNewsImpactToProbabilities, getNewsContextForLogging } from '../news-scanner/prediction-integration';

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
  enableNewsImpact?: boolean;
}

/**
 * Main prediction engine class
 * Refactored into modular components for better maintainability
 */
export class PredictionEngine {
  /**
   * Calculate match prediction synchronously (without news impact analysis)
   * @param homeTeam - Home team data
   * @param awayTeam - Away team data
   * @param matchId - Unique match identifier
   * @param options - Optional configuration including winter break detection and head-to-head data
   */
  static predictMatchSync(
    homeTeam: Team,
    awayTeam: Team,
    matchId: string,
    options?: Omit<PredictionOptions, 'enableNewsImpact'>
  ): Prediction {
    // Analyze all factors
    const factorAnalysis = analyzeFactors(homeTeam, awayTeam, options as FactorOptions);

    // Calculate base probabilities and predicted score
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

  /**
   * Calculate match prediction based on team statistics and form (async with news impact)
   * @param homeTeam - Home team data
   * @param awayTeam - Away team data
   * @param matchId - Unique match identifier
   * @param options - Optional configuration including winter break detection and head-to-head data
   */
  static async predictMatch(
    homeTeam: Team,
    awayTeam: Team,
    matchId: string,
    options?: PredictionOptions
  ): Promise<Prediction> {
    // Analyze all factors
    const factorAnalysis = analyzeFactors(homeTeam, awayTeam, options as FactorOptions);

    // Calculate base probabilities and predicted score
    const probabilityResult = calculateProbabilities(
      homeTeam,
      awayTeam,
      factorAnalysis,
      {
        afterWinterBreak: options?.afterWinterBreak,
        headToHead: options?.headToHead
      }
    );

    let finalProbabilities = {
      home: probabilityResult.homeWinProbability,
      draw: probabilityResult.drawProbability,
      away: probabilityResult.awayWinProbability
    };

    // Apply news impact if enabled (default: true)
    const enableNewsImpact = options?.enableNewsImpact !== false;
    if (enableNewsImpact) {
      try {
        const newsImpact = await analyzeNewsImpact(homeTeam.name, awayTeam.name);
        
        if (newsImpact.affectedEvents.length > 0) {
          // Apply news impact to probabilities
          finalProbabilities = applyNewsImpactToProbabilities(finalProbabilities, newsImpact);
          
          // Log news impact for transparency
          const newsContext = getNewsContextForLogging(newsImpact);
          console.log(`News impact for ${homeTeam.name} vs ${awayTeam.name}:\n${newsContext}`);
          
          // Add news factor to factors list
          const netImpact = newsImpact.homeTeamImpact - newsImpact.awayTeamImpact;
          factorAnalysis.factors.push({
            name: 'News Events',
            impact: netImpact > 0.05 ? 'positive' : netImpact < -0.05 ? 'negative' : 'neutral',
            weight: Math.abs(netImpact) * 100,
            description: `${newsImpact.affectedEvents.length} recent news events affecting teams`
          });
        }
      } catch (error) {
        console.error('Error analyzing news impact:', error);
        // Continue with base probabilities if news analysis fails
      }
    }

    return {
      matchId,
      homeWinProbability: finalProbabilities.home,
      drawProbability: finalProbabilities.draw,
      awayWinProbability: finalProbabilities.away,
      predictedScore: {
        home: probabilityResult.predictedHomeGoals,
        away: probabilityResult.predictedAwayGoals
      },
      confidence: probabilityResult.confidence,
      factors: factorAnalysis.factors
    };
  }
}
