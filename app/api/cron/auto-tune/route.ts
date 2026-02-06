import { NextResponse } from 'next/server';
import { autoTuneAlgorithm } from '@/lib/auto-tuning/tuner';

export const dynamic = 'force-dynamic';

/**
 * Auto-Tuning Cron Job
 * Runs weekly to analyze evaluations and improve algorithm weights
 * 
 * Schedule: Every Monday at 3 AM UTC
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    console.log('🔧 Starting auto-tuning process...');

    const result = await autoTuneAlgorithm(supabaseUrl, supabaseKey);

    console.log('✅ Auto-tuning completed successfully');
    console.log(`📊 New version: ${result.newVersion}`);
    console.log(`📈 Old accuracy: ${result.performanceMetrics.oldAccuracy.toFixed(2)}%`);
    console.log(`🎯 Expected improvement: +${result.performanceMetrics.expectedImprovement.toFixed(2)}%`);
    console.log(`📝 Improvements:\n${result.improvements.join('\n')}`);

    return NextResponse.json({
      success: true,
      message: 'Auto-tuning completed successfully',
      result: {
        newVersion: result.newVersion,
        evaluationsPeriod: result.evaluationsPeriod,
        performanceMetrics: result.performanceMetrics,
        improvements: result.improvements,
        factorAnalysis: result.factorAnalysis.slice(0, 10) // Top 10 factors
      }
    });

  } catch (error) {
    console.error('❌ Auto-tuning failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
