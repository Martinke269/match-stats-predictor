import { NextResponse } from 'next/server';
import { CalculationLogger } from '@/lib/calculation-logger';
import { Team, Prediction } from '@/lib/types';
import { PredictionOptions } from '@/lib/prediction/engine';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

interface LogCalculationRequest {
  type?: 'calculation' | 'error';
  homeTeam?: Team;
  awayTeam?: Team;
  prediction?: Prediction;
  league?: string;
  options?: PredictionOptions;
  calculationDurationMs?: number;
  requestSource?: 'quick-predict' | 'manual' | 'api' | 'cron';
  errorType?: 'error' | 'warning';
  errorMessage?: string;
  context?: any;
}

export async function POST(request: Request) {
  try {
    const body: LogCalculationRequest = await request.json();
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || undefined;
    const forwardedFor = headersList.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : undefined;

    // Handle error logging
    if (body.type === 'error') {
      await CalculationLogger.logError({
        errorType: body.errorType || 'error',
        errorMessage: body.errorMessage || 'Unknown error',
        requestData: body.context,
      });

      return NextResponse.json({ success: true });
    }

    // Handle calculation logging
    if (!body.homeTeam || !body.awayTeam || !body.prediction || !body.league) {
      return NextResponse.json(
        { error: 'Missing required fields: homeTeam, awayTeam, prediction, league' },
        { status: 400 }
      );
    }

    // Create a temporary match ID for quick predictions
    const matchId = body.prediction.matchId || `quick-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const calculationId = await CalculationLogger.logCalculation({
      matchId,
      homeTeam: body.homeTeam,
      awayTeam: body.awayTeam,
      prediction: {
        ...body.prediction,
        matchId, // Ensure matchId is set
      },
      league: body.league,
      options: body.options,
      calculationDurationMs: body.calculationDurationMs,
      requestSource: body.requestSource || 'manual',
      userAgent,
      ipAddress,
    });

    if (!calculationId) {
      return NextResponse.json(
        { error: 'Failed to log calculation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      calculationId,
    });
  } catch (error) {
    console.error('Error in log-calculation API:', error);
    
    // Try to log the error
    try {
      await CalculationLogger.logError({
        errorType: 'error',
        errorCode: 'API_LOG_CALCULATION_ERROR',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined,
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
