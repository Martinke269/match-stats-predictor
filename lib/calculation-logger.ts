/**
 * Calculation Logger
 * Comprehensive logging system for tracking all predictions, inputs, and results
 */

import { createClient } from '@/lib/supabase/server';
import { Team, Prediction, PredictionFactor } from './types';
import { HeadToHeadStats } from './api/football-api';
import { PredictionOptions } from './prediction/engine';
import { evaluatePrediction } from './evaluation/metrics';

export interface CalculationLogData {
  matchId: string;
  homeTeam: Team;
  awayTeam: Team;
  prediction: Prediction;
  league: string; // REQUIRED: League name for proper tracking
  options?: PredictionOptions;
  calculationDurationMs?: number;
  requestSource?: 'cron' | 'api' | 'manual' | 'quick-predict';
  algorithmVersionId?: string; // Optional: if provided, uses this instead of fetching active version
  userAgent?: string;
  ipAddress?: string;
  intermediateData?: {
    homeQualityScore?: number;
    awayQualityScore?: number;
    qualityGap?: number;
    homeFormScore?: number;
    awayFormScore?: number;
    upsetBonus?: number;
    isHomeUnderdog?: boolean;
  };
}

export interface CalculationError {
  matchId?: string;
  errorType: 'error' | 'warning' | 'edge_case';
  errorCode?: string;
  errorMessage: string;
  errorStack?: string;
  requestData?: any;
  systemState?: any;
}

export interface EdgeCase {
  calculationId: string;
  edgeCaseType: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  triggerData?: any;
  handlingStrategy?: string;
}

/**
 * Main calculation logger class
 */
export class CalculationLogger {
  /**
   * Log a complete calculation with all inputs and outputs
   */
  static async logCalculation(data: CalculationLogData): Promise<string | null> {
    try {
      const supabase = await createClient();
      const startTime = Date.now();

      // Get algorithm version (use provided ID or fetch active version)
      let algorithmVersionId: string;
      
      if (data.algorithmVersionId) {
        algorithmVersionId = data.algorithmVersionId;
      } else {
        const { data: algorithmVersion, error: versionError } = await supabase
          .from('algorithm_versions')
          .select('id')
          .eq('is_active', true)
          .single();

        if (versionError || !algorithmVersion) {
          console.error('Failed to get algorithm version:', versionError);
          await this.logError({
            errorType: 'error',
            errorCode: 'MISSING_ALGORITHM_VERSION',
            errorMessage: 'Could not find active algorithm version',
            systemState: { versionError }
          });
          return null;
        }
        
        algorithmVersionId = algorithmVersion.id;
      }

      // Insert main calculation record
      const { data: calculation, error: calcError } = await supabase
        .from('calculations')
        .insert({
          match_id: data.matchId,
          algorithm_version_id: algorithmVersionId,
          calculation_duration_ms: data.calculationDurationMs,
          home_win_probability: data.prediction.homeWinProbability,
          draw_probability: data.prediction.drawProbability,
          away_win_probability: data.prediction.awayWinProbability,
          predicted_home_score: data.prediction.predictedScore.home,
          predicted_away_score: data.prediction.predictedScore.away,
          confidence: data.prediction.confidence
        })
        .select()
        .single();

      if (calcError || !calculation) {
        console.error('Failed to insert calculation:', calcError);
        await this.logError({
          matchId: data.matchId,
          errorType: 'error',
          errorCode: 'CALCULATION_INSERT_FAILED',
          errorMessage: calcError?.message || 'Failed to insert calculation',
          requestData: data
        });
        return null;
      }

      // Insert calculation inputs
      const { error: inputsError } = await supabase
        .from('calculation_inputs')
        .insert({
          calculation_id: calculation.id,
          home_team_id: data.homeTeam.id,
          away_team_id: data.awayTeam.id,
          home_team_stats: data.homeTeam.stats,
          away_team_stats: data.awayTeam.stats,
          home_team_form: data.homeTeam.form.join(''),
          away_team_form: data.awayTeam.form.join(''),
          match_date: new Date().toISOString(),
          league: data.league, // Now properly passed from caller
          is_derby: data.options?.headToHead?.isDerby || false,
          after_winter_break: data.options?.afterWinterBreak || false,
          winter_break_months: data.options?.winterBreakMonths,
          home_fixture_congestion: data.options?.homeFixtureCongestion || null,
          away_fixture_congestion: data.options?.awayFixtureCongestion || null,
          head_to_head_stats: data.options?.headToHead || null
        });

      if (inputsError) {
        console.error('Failed to insert calculation inputs:', inputsError);
        await this.logError({
          matchId: data.matchId,
          errorType: 'warning',
          errorCode: 'INPUTS_INSERT_FAILED',
          errorMessage: inputsError.message,
          requestData: { calculationId: calculation.id }
        });
      }

      // Insert calculation factors
      if (data.prediction.factors && data.prediction.factors.length > 0) {
        const factorsToInsert = data.prediction.factors.map(factor => ({
          calculation_id: calculation.id,
          factor_name: factor.name,
          factor_impact: factor.impact,
          factor_weight: factor.weight,
          factor_description: factor.description,
          factor_category: this.categorizeFactor(factor.name)
        }));

        const { error: factorsError } = await supabase
          .from('calculation_factors')
          .insert(factorsToInsert);

        if (factorsError) {
          console.error('Failed to insert calculation factors:', factorsError);
          await this.logError({
            matchId: data.matchId,
            errorType: 'warning',
            errorCode: 'FACTORS_INSERT_FAILED',
            errorMessage: factorsError.message,
            requestData: { calculationId: calculation.id, factorsCount: factorsToInsert.length }
          });
        }
      }

      // Insert calculation metadata
      const { error: metadataError } = await supabase
        .from('calculation_metadata')
        .insert({
          calculation_id: calculation.id,
          options_used: data.options || {},
          home_quality_score: data.intermediateData?.homeQualityScore,
          away_quality_score: data.intermediateData?.awayQualityScore,
          quality_gap: data.intermediateData?.qualityGap,
          home_form_score: data.intermediateData?.homeFormScore,
          away_form_score: data.intermediateData?.awayFormScore,
          upset_bonus: data.intermediateData?.upsetBonus,
          is_home_underdog: data.intermediateData?.isHomeUnderdog,
          user_agent: data.userAgent,
          ip_address: data.ipAddress,
          request_source: data.requestSource || 'api'
        });

      if (metadataError) {
        console.error('Failed to insert calculation metadata:', metadataError);
        await this.logError({
          matchId: data.matchId,
          errorType: 'warning',
          errorCode: 'METADATA_INSERT_FAILED',
          errorMessage: metadataError.message,
          requestData: { calculationId: calculation.id }
        });
      }

      const totalTime = Date.now() - startTime;
      console.log(`✅ Calculation logged successfully in ${totalTime}ms (calculation_id: ${calculation.id})`);

      return calculation.id;
    } catch (error) {
      console.error('Fatal error in logCalculation:', error);
      await this.logError({
        matchId: data.matchId,
        errorType: 'error',
        errorCode: 'FATAL_LOGGING_ERROR',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined,
        requestData: data
      });
      return null;
    }
  }

  /**
   * Log an error or warning
   */
  static async logError(error: CalculationError): Promise<void> {
    try {
      const supabase = await createClient();

      await supabase.from('calculation_errors').insert({
        match_id: error.matchId || null,
        error_type: error.errorType,
        error_code: error.errorCode,
        error_message: error.errorMessage,
        error_stack: error.errorStack,
        request_data: error.requestData || null,
        system_state: error.systemState || null
      });

      console.error(`[${error.errorType.toUpperCase()}] ${error.errorCode || 'UNKNOWN'}: ${error.errorMessage}`);
    } catch (e) {
      // Fallback: log to console if database logging fails
      console.error('Failed to log error to database:', e);
      console.error('Original error:', error);
    }
  }

  /**
   * Log an edge case
   */
  static async logEdgeCase(edgeCase: EdgeCase): Promise<void> {
    try {
      const supabase = await createClient();

      await supabase.from('calculation_edge_cases').insert({
        calculation_id: edgeCase.calculationId,
        edge_case_type: edgeCase.edgeCaseType,
        description: edgeCase.description,
        severity: edgeCase.severity,
        trigger_data: edgeCase.triggerData || null,
        handling_strategy: edgeCase.handlingStrategy
      });

      console.warn(`[EDGE CASE] ${edgeCase.edgeCaseType}: ${edgeCase.description}`);
    } catch (error) {
      console.error('Failed to log edge case:', error);
    }
  }

  /**
   * Update calculation with actual results for evaluation
   * Uses enhanced evaluation metrics including MAE, RMSE, Brier score, etc.
   */
  static async evaluateCalculation(
    calculationId: string,
    actualHomeScore: number,
    actualAwayScore: number
  ): Promise<void> {
    try {
      const supabase = await createClient();

      // Get the calculation
      const { data: calculation, error: fetchError } = await supabase
        .from('calculations')
        .select('predicted_home_score, predicted_away_score, home_win_probability, draw_probability, away_win_probability, confidence')
        .eq('id', calculationId)
        .single();

      if (fetchError || !calculation) {
        await this.logError({
          errorType: 'error',
          errorCode: 'EVALUATION_FETCH_FAILED',
          errorMessage: 'Could not fetch calculation for evaluation',
          requestData: { calculationId }
        });
        return;
      }

      // Use enhanced evaluation metrics
      const evaluation = evaluatePrediction(
        calculation.predicted_home_score,
        calculation.predicted_away_score,
        actualHomeScore,
        actualAwayScore,
        calculation.home_win_probability,
        calculation.draw_probability,
        calculation.away_win_probability,
        calculation.confidence
      );

      // Update calculation with comprehensive evaluation data
      const { error: updateError } = await supabase
        .from('calculations')
        .update({
          actual_home_score: actualHomeScore,
          actual_away_score: actualAwayScore,
          was_correct: evaluation.wasCorrect,
          accuracy_score: evaluation.accuracyScore,
          evaluation_type: evaluation.evaluationType,
          evaluated_at: new Date().toISOString()
        })
        .eq('id', calculationId);

      if (updateError) {
        await this.logError({
          errorType: 'error',
          errorCode: 'EVALUATION_UPDATE_FAILED',
          errorMessage: updateError.message,
          requestData: { calculationId, actualHomeScore, actualAwayScore }
        });
      } else {
        console.log(`✅ Calculation evaluated: ${evaluation.evaluationType} (accuracy: ${evaluation.accuracyScore.toFixed(1)}%, MAE: ${evaluation.totalScoreError.toFixed(1)}, Brier: ${evaluation.brierScore.toFixed(4)})`);
      }
    } catch (error) {
      console.error('Failed to evaluate calculation:', error);
      await this.logError({
        errorType: 'error',
        errorCode: 'EVALUATION_EXCEPTION',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined,
        requestData: { calculationId, actualHomeScore, actualAwayScore }
      });
    }
  }

  /**
   * Helper: Determine match outcome
   */
  private static determineOutcome(homeScore: number, awayScore: number): 'home' | 'draw' | 'away' {
    if (homeScore > awayScore) return 'home';
    if (awayScore > homeScore) return 'away';
    return 'draw';
  }

  /**
   * Helper: Categorize factor for analysis
   */
  private static categorizeFactor(factorName: string): string {
    const name = factorName.toLowerCase();
    if (name.includes('form')) return 'form';
    if (name.includes('kvalitet')) return 'quality';
    if (name.includes('indbyrdes') || name.includes('h2h')) return 'h2h';
    if (name.includes('derby') || name.includes('lokal')) return 'derby';
    if (name.includes('europa') || name.includes('pokal') || name.includes('congestion')) return 'congestion';
    if (name.includes('vinterpause') || name.includes('winter')) return 'winter_break';
    if (name.includes('hjemmebane') || name.includes('home')) return 'home_advantage';
    if (name.includes('målforskel') || name.includes('goal')) return 'goal_difference';
    if (name.includes('overraskelse') || name.includes('underdog')) return 'upset';
    if (name.includes('defensiv')) return 'defense';
    if (name.includes('sejr')) return 'win_rate';
    return 'other';
  }
}
