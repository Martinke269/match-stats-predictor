import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { CalculationLogger } from '@/lib/calculation-logger';

export const dynamic = 'force-dynamic';

/**
 * Cron job to evaluate predictions after matches are completed
 * Compares predicted results with actual results and updates accuracy metrics
 */
export async function GET(request: Request) {
  try {
    // Verify the request is from a cron job
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Get all finished matches that have calculations but haven't been evaluated yet
    const { data: calculations, error: fetchError } = await supabase
      .from('calculations')
      .select(`
        id,
        match_id,
        matches!inner(
          id,
          status,
          home_score,
          away_score
        )
      `)
      .is('evaluated_at', null)
      .eq('matches.status', 'finished')
      .not('matches.home_score', 'is', null)
      .not('matches.away_score', 'is', null);

    if (fetchError) {
      console.error('Error fetching calculations:', fetchError);
      await CalculationLogger.logError({
        errorType: 'error',
        errorCode: 'EVALUATION_FETCH_FAILED',
        errorMessage: fetchError.message,
        systemState: { fetchError }
      });
      return NextResponse.json({ error: 'Failed to fetch calculations' }, { status: 500 });
    }

    if (!calculations || calculations.length === 0) {
      return NextResponse.json({ 
        message: 'No calculations need evaluation', 
        evaluated: 0 
      });
    }

    let evaluatedCount = 0;
    const errors: string[] = [];

    // Evaluate each calculation
    for (const calc of calculations) {
      try {
        const match = calc.matches as any;
        
        await CalculationLogger.evaluateCalculation(
          calc.id,
          match.home_score,
          match.away_score
        );

        evaluatedCount++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Calculation ${calc.id}: ${errorMessage}`);
        await CalculationLogger.logError({
          errorType: 'error',
          errorCode: 'EVALUATION_FAILED',
          errorMessage,
          errorStack: error instanceof Error ? error.stack : undefined,
          requestData: { calculationId: calc.id }
        });
      }
    }

    // Also update legacy predictions table for backward compatibility
    try {
      const { data: legacyPredictions, error: legacyFetchError } = await supabase
        .from('predictions')
        .select(`
          id,
          match_id,
          predicted_home_score,
          predicted_away_score,
          matches!inner(
            id,
            status,
            home_score,
            away_score
          )
        `)
        .is('was_correct', null)
        .eq('matches.status', 'finished')
        .not('matches.home_score', 'is', null)
        .not('matches.away_score', 'is', null);

      if (!legacyFetchError && legacyPredictions && legacyPredictions.length > 0) {
        for (const pred of legacyPredictions) {
          const match = pred.matches as any;
          
          const predictedOutcome = determineOutcome(
            pred.predicted_home_score,
            pred.predicted_away_score
          );
          const actualOutcome = determineOutcome(
            match.home_score,
            match.away_score
          );

          const wasCorrect = predictedOutcome === actualOutcome;
          const exactScore = 
            pred.predicted_home_score === match.home_score &&
            pred.predicted_away_score === match.away_score;

          let resultType: string;
          if (exactScore) {
            resultType = 'exact_score';
          } else if (wasCorrect) {
            resultType = 'correct_outcome';
          } else {
            resultType = 'incorrect';
          }

          await supabase
            .from('predictions')
            .update({
              actual_home_score: match.home_score,
              actual_away_score: match.away_score,
              was_correct: wasCorrect,
              result_type: resultType
            })
            .eq('id', pred.id);
        }
      }
    } catch (error) {
      console.error('Error updating legacy predictions:', error);
      await CalculationLogger.logError({
        errorType: 'warning',
        errorCode: 'LEGACY_EVALUATION_FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    return NextResponse.json({ 
      message: 'Predictions evaluated successfully',
      evaluated: evaluatedCount,
      total: calculations.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error in evaluate-predictions cron:', error);
    await CalculationLogger.logError({
      errorType: 'error',
      errorCode: 'EVALUATION_CRON_FATAL_ERROR',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function determineOutcome(homeScore: number, awayScore: number): 'home' | 'draw' | 'away' {
  if (homeScore > awayScore) return 'home';
  if (awayScore > homeScore) return 'away';
  return 'draw';
}
