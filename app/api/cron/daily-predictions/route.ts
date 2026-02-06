import { NextResponse } from 'next/server';
import { BatchPredictionEngine } from '@/lib/prediction/batch-engine';

export const dynamic = 'force-dynamic';

/**
 * Daily Predictions Cron Job
 * 
 * This endpoint automatically generates and updates predictions for upcoming matches.
 * It runs daily and:
 * - Generates predictions for matches in the next 7 days
 * - Updates existing predictions if:
 *   - Algorithm version has changed
 *   - News impact has changed (injuries, suspensions, etc.)
 *   - Prediction is older than 24 hours
 * - Tracks all runs in the prediction_runs table
 * - Logs all factors and news events considered
 * 
 * Security: Requires CRON_SECRET authorization header
 */
export async function GET(request: Request) {
  const startTime = Date.now();

  try {
    // Verify the request is from a cron job
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Starting daily predictions generation...');

    // Initialize batch prediction engine
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const batchEngine = new BatchPredictionEngine(supabaseUrl, supabaseKey);

    // Generate predictions for the next 7 days
    const result = await batchEngine.generateDailyPredictions({
      daysAhead: 7,
      forceUpdate: false, // Only update if needed
      runType: 'daily',
      notes: 'Automated daily prediction generation with news impact and algorithm versioning'
    });

    const totalDuration = Date.now() - startTime;

    console.log(`✅ Daily predictions completed in ${totalDuration}ms`);
    console.log(`   - Total processed: ${result.totalProcessed}`);
    console.log(`   - New predictions: ${result.newPredictions}`);
    console.log(`   - Updated predictions: ${result.updatedPredictions}`);
    console.log(`   - Failed predictions: ${result.failedPredictions}`);
    console.log(`   - Algorithm version: ${result.algorithmVersion.version} (v${result.algorithmVersion.versionNumber})`);

    // Return detailed statistics
    return NextResponse.json({
      success: true,
      message: 'Daily predictions generated successfully',
      statistics: {
        runId: result.runId,
        totalProcessed: result.totalProcessed,
        newPredictions: result.newPredictions,
        updatedPredictions: result.updatedPredictions,
        failedPredictions: result.failedPredictions,
        successRate: result.totalProcessed > 0 
          ? ((result.newPredictions + result.updatedPredictions) / result.totalProcessed * 100).toFixed(1) + '%'
          : 'N/A',
        duration: {
          total: totalDuration,
          average: result.totalProcessed > 0 
            ? Math.round(result.duration / result.totalProcessed)
            : 0
        },
        algorithmVersion: {
          id: result.algorithmVersion.id,
          version: result.algorithmVersion.version,
          versionNumber: result.algorithmVersion.versionNumber
        }
      },
      errors: result.errors.length > 0 ? result.errors : undefined,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in daily predictions cron:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * Manual trigger endpoint (for testing)
 * Allows manual triggering with custom parameters
 */
export async function POST(request: Request) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      daysAhead = 7,
      forceUpdate = false,
      algorithmVersionId
    } = body;

    console.log('🔄 Starting manual predictions generation...');
    console.log(`   - Days ahead: ${daysAhead}`);
    console.log(`   - Force update: ${forceUpdate}`);
    console.log(`   - Algorithm version: ${algorithmVersionId || 'latest'}`);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const batchEngine = new BatchPredictionEngine(supabaseUrl, supabaseKey);

    const result = await batchEngine.generateDailyPredictions({
      daysAhead,
      forceUpdate,
      algorithmVersionId,
      runType: 'manual',
      notes: `Manual prediction generation (daysAhead: ${daysAhead}, forceUpdate: ${forceUpdate})`
    });

    return NextResponse.json({
      success: true,
      message: 'Manual predictions generated successfully',
      statistics: {
        runId: result.runId,
        totalProcessed: result.totalProcessed,
        newPredictions: result.newPredictions,
        updatedPredictions: result.updatedPredictions,
        failedPredictions: result.failedPredictions,
        duration: result.duration,
        algorithmVersion: result.algorithmVersion
      },
      errors: result.errors.length > 0 ? result.errors : undefined
    });

  } catch (error) {
    console.error('❌ Error in manual predictions trigger:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
