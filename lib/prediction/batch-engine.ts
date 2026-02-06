import { createClient } from '@supabase/supabase-js';
import { PredictionEngine } from './engine';
import { analyzeNewsImpact } from '../news-scanner/prediction-integration';
import { calculateTeamQuality, calculateFormScore } from './calculators';
import { CalculationLogger } from '../calculation-logger';

export interface BatchPredictionOptions {
  daysAhead?: number; // How many days ahead to generate predictions for
  forceUpdate?: boolean; // Force update existing predictions
  algorithmVersionId?: string; // Specific algorithm version to use
  runType?: 'daily' | 'manual' | 'cron' | 'batch';
  notes?: string;
}

export interface BatchPredictionResult {
  runId: string;
  totalProcessed: number;
  newPredictions: number;
  updatedPredictions: number;
  failedPredictions: number;
  errors: Array<{ matchId: string; error: string }>;
  algorithmVersion: {
    id: string;
    version: string;
    versionNumber: number;
  };
  duration: number;
}

export interface PredictionUpdateReason {
  reason: 'news_impact_changed' | 'algorithm_updated' | 'daily_refresh' | 'manual_update' | 'force_update';
  details?: string;
}

/**
 * Batch Prediction Engine
 * Handles bulk prediction generation and updates for scheduled matches
 */
export class BatchPredictionEngine {
  private supabase;
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Generate predictions for all upcoming matches
   */
  async generateDailyPredictions(options: BatchPredictionOptions = {}): Promise<BatchPredictionResult> {
    const startTime = Date.now();
    const {
      daysAhead = 7,
      forceUpdate = false,
      algorithmVersionId,
      runType = 'daily',
      notes
    } = options;

    // Create a prediction run record
    const { data: predictionRun, error: runError } = await this.supabase
      .from('prediction_runs')
      .insert({
        run_type: runType,
        started_at: new Date().toISOString(),
        notes: notes || `Automated ${runType} prediction generation for next ${daysAhead} days`
      })
      .select()
      .single();

    if (runError || !predictionRun) {
      throw new Error(`Failed to create prediction run: ${runError?.message}`);
    }

    const runId = predictionRun.id;

    try {
      // Get the latest algorithm version
      const algorithmVersion = await this.getAlgorithmVersion(algorithmVersionId);

      // Get upcoming matches (next N days)
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

      const { data: matches, error: matchesError } = await this.supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(*),
          away_team:teams!matches_away_team_id_fkey(*),
          predictions(
            id,
            algorithm_version_id,
            last_updated_at,
            news_events_considered
          )
        `)
        .eq('status', 'scheduled')
        .gte('date', new Date().toISOString())
        .lte('date', cutoffDate.toISOString())
        .order('date', { ascending: true });

      if (matchesError) {
        throw new Error(`Failed to fetch matches: ${matchesError.message}`);
      }

      if (!matches || matches.length === 0) {
        await this.finalizePredictionRun(runId, {
          totalProcessed: 0,
          newPredictions: 0,
          updatedPredictions: 0,
          failedPredictions: 0,
          algorithmVersionId: algorithmVersion.id
        });

        return {
          runId,
          totalProcessed: 0,
          newPredictions: 0,
          updatedPredictions: 0,
          failedPredictions: 0,
          errors: [],
          algorithmVersion,
          duration: Date.now() - startTime
        };
      }

      // Process each match
      let newPredictions = 0;
      let updatedPredictions = 0;
      let failedPredictions = 0;
      const errors: Array<{ matchId: string; error: string }> = [];

      for (const match of matches) {
        try {
          const existingPrediction = match.predictions?.[0];
          const shouldUpdate = await this.shouldUpdatePrediction(
            match,
            existingPrediction,
            algorithmVersion.id,
            forceUpdate
          );

          if (!existingPrediction || shouldUpdate.shouldUpdate) {
            const result = await this.generatePredictionForMatch(
              match,
              algorithmVersion,
              runId,
              shouldUpdate.reason
            );

            if (result.isNew) {
              newPredictions++;
            } else {
              updatedPredictions++;
            }
          }
        } catch (error) {
          failedPredictions++;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          errors.push({ matchId: match.id, error: errorMessage });
          
          await CalculationLogger.logError({
            matchId: match.id,
            errorType: 'error',
            errorCode: 'BATCH_PREDICTION_FAILED',
            errorMessage,
            errorStack: error instanceof Error ? error.stack : undefined,
            requestData: { runId, match }
          });
        }
      }

      // Finalize the run
      await this.finalizePredictionRun(runId, {
        totalProcessed: matches.length,
        newPredictions,
        updatedPredictions,
        failedPredictions,
        algorithmVersionId: algorithmVersion.id,
        errorDetails: errors.length > 0 ? errors : undefined
      });

      return {
        runId,
        totalProcessed: matches.length,
        newPredictions,
        updatedPredictions,
        failedPredictions,
        errors,
        algorithmVersion,
        duration: Date.now() - startTime
      };

    } catch (error) {
      // Mark run as failed
      await this.supabase
        .from('prediction_runs')
        .update({
          finished_at: new Date().toISOString(),
          error_details: {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
          }
        })
        .eq('id', runId);

      throw error;
    }
  }

  /**
   * Determine if a prediction should be updated
   */
  private async shouldUpdatePrediction(
    match: any,
    existingPrediction: any,
    currentAlgorithmVersionId: string,
    forceUpdate: boolean
  ): Promise<{ shouldUpdate: boolean; reason?: PredictionUpdateReason }> {
    if (!existingPrediction) {
      return { shouldUpdate: true };
    }

    if (forceUpdate) {
      return {
        shouldUpdate: true,
        reason: { reason: 'force_update', details: 'Manual force update requested' }
      };
    }

    // Check if algorithm version changed
    if (existingPrediction.algorithm_version_id !== currentAlgorithmVersionId) {
      return {
        shouldUpdate: true,
        reason: { reason: 'algorithm_updated', details: 'New algorithm version available' }
      };
    }

    // Check if news impact changed (compare recent news events)
    try {
      const newsImpact = await analyzeNewsImpact(
        match.home_team.name,
        match.away_team.name
      );

      const currentNewsEventIds = newsImpact.affectedEvents.map(e => e.id).sort();
      const previousNewsEventIds = (existingPrediction.news_events_considered || []).sort();

      if (JSON.stringify(currentNewsEventIds) !== JSON.stringify(previousNewsEventIds)) {
        return {
          shouldUpdate: true,
          reason: {
            reason: 'news_impact_changed',
            details: `News events changed: ${currentNewsEventIds.length} current vs ${previousNewsEventIds.length} previous`
          }
        };
      }
    } catch (error) {
      console.error('Error checking news impact:', error);
    }

    // Daily refresh if prediction is older than 24 hours
    const lastUpdated = new Date(existingPrediction.last_updated_at || existingPrediction.created_at);
    const hoursSinceUpdate = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60);

    if (hoursSinceUpdate >= 24) {
      return {
        shouldUpdate: true,
        reason: { reason: 'daily_refresh', details: `Last updated ${Math.floor(hoursSinceUpdate)} hours ago` }
      };
    }

    return { shouldUpdate: false };
  }

  /**
   * Generate prediction for a single match
   */
  private async generatePredictionForMatch(
    match: any,
    algorithmVersion: any,
    runId: string,
    updateReason?: PredictionUpdateReason
  ): Promise<{ isNew: boolean }> {
    const startTime = Date.now();

    // Generate prediction using the prediction engine
    const prediction = await PredictionEngine.predictMatch(
      match.home_team,
      match.away_team,
      match.id,
      { enableNewsImpact: true }
    );

    const calculationDuration = Date.now() - startTime;

    // Get news events that were considered
    const newsImpact = await analyzeNewsImpact(match.home_team.name, match.away_team.name);
    const newsEventIds = newsImpact.affectedEvents.map(e => e.id);

    // Calculate intermediate data for logging
    const homeQuality = calculateTeamQuality(match.home_team);
    const awayQuality = calculateTeamQuality(match.away_team);
    const homeFormScore = calculateFormScore(match.home_team.form);
    const awayFormScore = calculateFormScore(match.away_team.form);

    // Log the calculation
    const calculationId = await CalculationLogger.logCalculation({
      matchId: match.id,
      homeTeam: match.home_team,
      awayTeam: match.away_team,
      prediction,
      league: match.league,
      calculationDurationMs: calculationDuration,
      requestSource: 'cron',
      algorithmVersionId: algorithmVersion.id,
      intermediateData: {
        homeQualityScore: homeQuality,
        awayQualityScore: awayQuality,
        qualityGap: Math.abs(homeQuality - awayQuality),
        homeFormScore,
        awayFormScore
      }
    });

    // Check if prediction exists
    const { data: existingPrediction } = await this.supabase
      .from('predictions')
      .select('id')
      .eq('match_id', match.id)
      .is('actual_home_score', null)
      .single();

    const isNew = !existingPrediction;

    // Upsert prediction
    const predictionData = {
      match_id: match.id,
      home_win_probability: prediction.homeWinProbability,
      draw_probability: prediction.drawProbability,
      away_win_probability: prediction.awayWinProbability,
      predicted_home_score: prediction.predictedScore.home,
      predicted_away_score: prediction.predictedScore.away,
      confidence: prediction.confidence,
      factors: prediction.factors,
      algorithm_version_id: algorithmVersion.id,
      prediction_run_id: runId,
      news_events_considered: newsEventIds,
      last_updated_at: new Date().toISOString(),
      update_reason: updateReason ? `${updateReason.reason}: ${updateReason.details || ''}` : 'initial_prediction'
    };

    if (isNew) {
      const { error } = await this.supabase
        .from('predictions')
        .insert(predictionData);

      if (error) {
        throw new Error(`Failed to insert prediction: ${error.message}`);
      }
    } else {
      const { error } = await this.supabase
        .from('predictions')
        .update(predictionData)
        .eq('id', existingPrediction.id);

      if (error) {
        throw new Error(`Failed to update prediction: ${error.message}`);
      }
    }

    return { isNew };
  }

  /**
   * Get algorithm version (latest or specific)
   */
  private async getAlgorithmVersion(versionId?: string) {
    if (versionId) {
      const { data, error } = await this.supabase
        .from('algorithm_versions')
        .select('*')
        .eq('id', versionId)
        .single();

      if (error || !data) {
        throw new Error(`Algorithm version not found: ${versionId}`);
      }

      return data;
    }

    // Get latest active version
    const { data, error } = await this.supabase
      .from('algorithm_versions')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      throw new Error('No active algorithm version found');
    }

    return data;
  }

  /**
   * Finalize prediction run with statistics
   */
  private async finalizePredictionRun(
    runId: string,
    stats: {
      totalProcessed: number;
      newPredictions: number;
      updatedPredictions: number;
      failedPredictions: number;
      algorithmVersionId: string;
      errorDetails?: any;
    }
  ) {
    await this.supabase
      .from('prediction_runs')
      .update({
        finished_at: new Date().toISOString(),
        total_predictions: stats.totalProcessed,
        new_predictions: stats.newPredictions,
        updated_predictions: stats.updatedPredictions,
        failed_predictions: stats.failedPredictions,
        algorithm_version_id: stats.algorithmVersionId,
        error_details: stats.errorDetails
      })
      .eq('id', runId);
  }
}
