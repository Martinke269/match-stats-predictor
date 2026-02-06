import { NextResponse } from 'next/server';
import { scanNews } from '@/lib/news-scanner/scanner';

export const dynamic = 'force-dynamic';

/**
 * Cron job endpoint for scanning news
 * Should be called daily to detect match-relevant news events
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting news scan...');
    const startTime = Date.now();

    // Run the news scanner
    const result = await scanNews();

    const duration = Date.now() - startTime;

    console.log('News scan completed:', {
      success: result.success,
      eventsFound: result.eventsFound,
      eventsStored: result.eventsStored,
      duration: `${duration}ms`,
      errors: result.errors.length
    });

    return NextResponse.json({
      success: result.success,
      eventsFound: result.eventsFound,
      eventsStored: result.eventsStored,
      duration,
      errors: result.errors,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in news scan cron job:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
