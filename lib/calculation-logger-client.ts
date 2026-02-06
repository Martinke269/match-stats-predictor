/**
 * Client-side Calculation Logger
 * Sends calculation data to API endpoint for storage
 */

import { Team, Prediction } from './types';
import { PredictionOptions } from './prediction/engine';

export interface ClientCalculationLogData {
  homeTeam: Team;
  awayTeam: Team;
  prediction: Prediction;
  league: string;
  options?: PredictionOptions;
  calculationDurationMs?: number;
  requestSource?: 'quick-predict' | 'manual' | 'api' | 'cron';
}

/**
 * Client-side calculation logger
 * Sends data to server API for database storage
 */
export class CalculationLoggerClient {
  /**
   * Log a calculation from the client side
   */
  static async logCalculation(data: ClientCalculationLogData): Promise<boolean> {
    try {
      const response = await fetch('/api/log-calculation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error('Failed to log calculation:', await response.text());
        return false;
      }

      const result = await response.json();
      console.log('✅ Calculation logged:', result.calculationId);
      return true;
    } catch (error) {
      console.error('Error logging calculation:', error);
      return false;
    }
  }

  /**
   * Log an error from the client side
   */
  static async logError(error: {
    errorType: 'error' | 'warning';
    errorMessage: string;
    context?: any;
  }): Promise<void> {
    try {
      await fetch('/api/log-calculation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'error',
          ...error,
        }),
      });
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  }
}
