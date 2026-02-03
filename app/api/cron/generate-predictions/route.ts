import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { PredictionEngine } from '@/lib/prediction-engine';

export const dynamic = 'force-dynamic';

// This endpoint should be called by a cron job to automatically generate predictions
// for upcoming matches that don't have predictions yet
export async function GET(request: Request) {
  try {
    // Verify the request is from a cron job
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

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
        // Generate prediction using the prediction engine
        const prediction = PredictionEngine.predictMatch(
          match.home_team,
          match.away_team,
          match.id
        );

        // Store prediction in database
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
        } else {
          generatedCount++;
        }
      } catch (error) {
        errors.push(`Match ${match.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({ 
      message: 'Predictions generated successfully',
      generated: generatedCount,
      total: matches.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error in generate-predictions cron:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
