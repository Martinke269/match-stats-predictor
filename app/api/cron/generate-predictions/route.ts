import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { PredictionEngine } from '@/lib/prediction-engine';
import { CalculationLogger } from '@/lib/calculation-logger';
import { calculateTeamQuality, calculateFormScore } from '@/lib/prediction/calculators';
import { getLatestAlgorithmVersion } from '@/lib/auto-tuning/version-loader';

export const dynamic = 'force-dynamic';

/**
 * LEGACY: Generate Predictions Cron Job
 * 
 * This endpoint is now primarily used for large batch operations and initial setup.
 * For daily prediction updates, use /api/cron/daily-predictions instead.
 * 
 * This endpoint:
 * - Only generates predictions for matches WITHOUT existing predictions
 * - Does NOT update existing predictions
 * - Useful for initial data population or backfilling
 * 
 * For automated daily updates with news impact and algorithm versioning,
 * use the new daily-predictions endpoint.
 */
export async function GET(request: Request) {
  try {
    // Verify the request is from a cron job
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Load the latest algorithm version
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const algorithmVersion = await getLatestAlgorithmVersion(supabaseUrl, supabaseKey);
    
    console.log(`🔧 Using algorithm version ${algorithmVersion.version} (v${algorithmVersion.version_number})`);

    // Get all scheduled matches without predictions
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(*),
        away_team:teams!matches_away_team_id_fkey(*),
        predictions(id)
      `)
      .eq('status', 'scheduled')
      .is('predictions.id', null)
      .order('date', { ascending: true });

    if (matchesError) {
      console.error('Error fetching matches:', matchesError);
      await CalculationLogger.logError({
        errorType: 'error',
        errorCode: 'CRON_FETCH_MATCHES_FAILED',
        errorMessage: matchesError.message,
        systemState: { matchesError }
      });
      return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
    }

    if (!matches || matches.length === 0) {
      return NextResponse.json({ message: 'No matches need predictions', generated: 0 });
    }

    let generatedCount = 0;
    const errors: string[] = [];

    // Generate predictions for each match
    for (const match of matches) {
      try {
        const startTime = Date.now();

        // Generate prediction using the prediction engine
        const prediction = await PredictionEngine.predictMatch(
          match.home_team,
          match.away_team,
          match.id
        );

        const calculationDuration = Date.now() - startTime;

        // Calculate intermediate data for logging
        const homeQuality = calculateTeamQuality(match.home_team);
        const awayQuality = calculateTeamQuality(match.away_team);
        const homeFormScore = calculateFormScore(match.home_team.form);
        const awayFormScore = calculateFormScore(match.away_team.form);

        // Log the complete calculation with algorithm version
        const calculationId = await CalculationLogger.logCalculation({
          matchId: match.id,
          homeTeam: match.home_team,
          awayTeam: match.away_team,
          prediction,
          league: match.league, // Pass league from match data
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

        // Store prediction in legacy predictions table (for backward compatibility)
        const { error: insertError } = await supabase
          .from('predictions')
          .insert({
            match_id: match.id,
            home_win_probability: prediction.homeWinProbability,
            draw_probability: prediction.drawProbability,
            away_win_probability: prediction.awayWinProbability,
            predicted_home_score: prediction.predictedScore.home,
            predicted_away_score: prediction.predictedScore.away,
            confidence: prediction.confidence,
            factors: prediction.factors
          });

        if (insertError) {
          errors.push(`Match ${match.id}: ${insertError.message}`);
          await CalculationLogger.logError({
            matchId: match.id,
            errorType: 'warning',
            errorCode: 'LEGACY_PREDICTION_INSERT_FAILED',
            errorMessage: insertError.message,
            requestData: { calculationId }
          });
        } else {
          generatedCount++;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Match ${match.id}: ${errorMessage}`);
        await CalculationLogger.logError({
          matchId: match.id,
          errorType: 'error',
          errorCode: 'PREDICTION_GENERATION_FAILED',
          errorMessage,
          errorStack: error instanceof Error ? error.stack : undefined,
          requestData: { match }
        });
      }
    }

    return NextResponse.json({ 
      message: 'Predictions generated successfully',
      generated: generatedCount,
      total: matches.length,
      algorithmVersion: {
        version: algorithmVersion.version,
        versionNumber: algorithmVersion.version_number
      },
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error in generate-predictions cron:', error);
    await CalculationLogger.logError({
      errorType: 'error',
      errorCode: 'CRON_FATAL_ERROR',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
