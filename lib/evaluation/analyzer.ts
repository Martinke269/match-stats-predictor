/**
 * Evaluation Analyzer
 * Analyzes prediction performance across different dimensions
 */

import { createClient } from '@/lib/supabase/server';
import { EvaluationMetrics, PredictionEvaluation, calculateAggregateMetrics } from './metrics';

export interface PerformanceByLeague {
  league: string;
  metrics: EvaluationMetrics;
}

export interface PerformanceByTeam {
  teamId: string;
  teamName: string;
  asHome: EvaluationMetrics;
  asAway: EvaluationMetrics;
  overall: EvaluationMetrics;
}

export interface PerformanceByAlgorithm {
  algorithmVersion: string;
  deployedAt: string;
  metrics: EvaluationMetrics;
}

export interface PerformanceByFactor {
  factorName: string;
  factorCategory: string;
  timesUsed: number;
  avgConfidenceWhenPresent: number;
  accuracyWhenPresent: number;
  correlationWithSuccess: number;
}

export interface PerformanceOverTime {
  period: string;
  startDate: string;
  endDate: string;
  metrics: EvaluationMetrics;
}

/**
 * Evaluation Analyzer class
 */
export class EvaluationAnalyzer {
  /**
   * Get performance metrics by league
   */
  static async getPerformanceByLeague(): Promise<PerformanceByLeague[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('calculations')
      .select(`
        id,
        predicted_home_score,
        predicted_away_score,
        actual_home_score,
        actual_away_score,
        home_win_probability,
        draw_probability,
        away_win_probability,
        confidence,
        was_correct,
        accuracy_score,
        evaluation_type,
        calculation_inputs!inner(league)
      `)
      .not('evaluated_at', 'is', null);

    if (error || !data) {
      console.error('Error fetching league performance:', error);
      return [];
    }

    // Group by league
    const byLeague = new Map<string, PredictionEvaluation[]>();
    
    for (const calc of data) {
      const inputs = calc.calculation_inputs as any;
      const league = inputs.league;
      
      if (!byLeague.has(league)) {
        byLeague.set(league, []);
      }
      
      const evaluation: PredictionEvaluation = {
        calculationId: calc.id,
        wasCorrect: calc.was_correct || false,
        exactScore: calc.evaluation_type === 'exact_score',
        evaluationType: calc.evaluation_type as any,
        accuracyScore: calc.accuracy_score || 0,
        homeScoreError: Math.abs(calc.predicted_home_score - (calc.actual_home_score || 0)),
        awayScoreError: Math.abs(calc.predicted_away_score - (calc.actual_away_score || 0)),
        totalScoreError: Math.abs(calc.predicted_home_score - (calc.actual_home_score || 0)) +
                        Math.abs(calc.predicted_away_score - (calc.actual_away_score || 0)),
        goalDifferenceError: Math.abs(
          (calc.predicted_home_score - calc.predicted_away_score) -
          ((calc.actual_home_score || 0) - (calc.actual_away_score || 0))
        ),
        brierScore: 0, // Calculated separately if needed
        logLoss: 0,
        confidence: calc.confidence,
        confidenceError: calc.confidence - (calc.accuracy_score || 0)
      };
      
      byLeague.get(league)!.push(evaluation);
    }
    
    // Calculate metrics for each league
    const results: PerformanceByLeague[] = [];
    for (const [league, evaluations] of Array.from(byLeague.entries())) {
      results.push({
        league,
        metrics: calculateAggregateMetrics(evaluations)
      });
    }
    
    return results.sort((a, b) => b.metrics.accuracy - a.metrics.accuracy);
  }

  /**
   * Get performance metrics by team
   */
  static async getPerformanceByTeam(teamId?: string): Promise<PerformanceByTeam[]> {
    const supabase = await createClient();
    
    let query = supabase
      .from('calculations')
      .select(`
        id,
        predicted_home_score,
        predicted_away_score,
        actual_home_score,
        actual_away_score,
        confidence,
        was_correct,
        accuracy_score,
        evaluation_type,
        calculation_inputs!inner(
          home_team_id,
          away_team_id
        )
      `)
      .not('evaluated_at', 'is', null);

    if (teamId) {
      query = query.or(`calculation_inputs.home_team_id.eq.${teamId},calculation_inputs.away_team_id.eq.${teamId}`);
    }

    const { data, error } = await query;

    if (error || !data) {
      console.error('Error fetching team performance:', error);
      return [];
    }

    // Group by team
    const byTeam = new Map<string, { home: PredictionEvaluation[], away: PredictionEvaluation[] }>();
    
    for (const calc of data) {
      const inputs = calc.calculation_inputs as any;
      const homeTeamId = inputs.home_team_id;
      const awayTeamId = inputs.away_team_id;
      
      const evaluation: PredictionEvaluation = {
        calculationId: calc.id,
        wasCorrect: calc.was_correct || false,
        exactScore: calc.evaluation_type === 'exact_score',
        evaluationType: calc.evaluation_type as any,
        accuracyScore: calc.accuracy_score || 0,
        homeScoreError: Math.abs(calc.predicted_home_score - (calc.actual_home_score || 0)),
        awayScoreError: Math.abs(calc.predicted_away_score - (calc.actual_away_score || 0)),
        totalScoreError: Math.abs(calc.predicted_home_score - (calc.actual_home_score || 0)) +
                        Math.abs(calc.predicted_away_score - (calc.actual_away_score || 0)),
        goalDifferenceError: 0,
        brierScore: 0,
        logLoss: 0,
        confidence: calc.confidence,
        confidenceError: calc.confidence - (calc.accuracy_score || 0)
      };
      
      // Add to home team
      if (!byTeam.has(homeTeamId)) {
        byTeam.set(homeTeamId, { home: [], away: [] });
      }
      byTeam.get(homeTeamId)!.home.push(evaluation);
      
      // Add to away team
      if (!byTeam.has(awayTeamId)) {
        byTeam.set(awayTeamId, { home: [], away: [] });
      }
      byTeam.get(awayTeamId)!.away.push(evaluation);
    }
    
    // Calculate metrics for each team
    const results: PerformanceByTeam[] = [];
    for (const [teamId, evaluations] of Array.from(byTeam.entries())) {
      const allEvaluations = [...evaluations.home, ...evaluations.away];
      results.push({
        teamId,
        teamName: '', // Would need to join with teams table
        asHome: calculateAggregateMetrics(evaluations.home),
        asAway: calculateAggregateMetrics(evaluations.away),
        overall: calculateAggregateMetrics(allEvaluations)
      });
    }
    
    return results.sort((a, b) => b.overall.accuracy - a.overall.accuracy);
  }

  /**
   * Get performance metrics by algorithm version
   */
  static async getPerformanceByAlgorithm(): Promise<PerformanceByAlgorithm[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('calculations')
      .select(`
        id,
        predicted_home_score,
        predicted_away_score,
        actual_home_score,
        actual_away_score,
        confidence,
        was_correct,
        accuracy_score,
        evaluation_type,
        algorithm_versions!inner(
          version,
          deployed_at
        )
      `)
      .not('evaluated_at', 'is', null);

    if (error || !data) {
      console.error('Error fetching algorithm performance:', error);
      return [];
    }

    // Group by algorithm version
    const byVersion = new Map<string, { evaluations: PredictionEvaluation[], deployedAt: string }>();
    
    for (const calc of data) {
      const version = (calc.algorithm_versions as any).version;
      const deployedAt = (calc.algorithm_versions as any).deployed_at;
      
      if (!byVersion.has(version)) {
        byVersion.set(version, { evaluations: [], deployedAt });
      }
      
      const evaluation: PredictionEvaluation = {
        calculationId: calc.id,
        wasCorrect: calc.was_correct || false,
        exactScore: calc.evaluation_type === 'exact_score',
        evaluationType: calc.evaluation_type as any,
        accuracyScore: calc.accuracy_score || 0,
        homeScoreError: Math.abs(calc.predicted_home_score - (calc.actual_home_score || 0)),
        awayScoreError: Math.abs(calc.predicted_away_score - (calc.actual_away_score || 0)),
        totalScoreError: Math.abs(calc.predicted_home_score - (calc.actual_home_score || 0)) +
                        Math.abs(calc.predicted_away_score - (calc.actual_away_score || 0)),
        goalDifferenceError: 0,
        brierScore: 0,
        logLoss: 0,
        confidence: calc.confidence,
        confidenceError: calc.confidence - (calc.accuracy_score || 0)
      };
      
      byVersion.get(version)!.evaluations.push(evaluation);
    }
    
    // Calculate metrics for each version
    const results: PerformanceByAlgorithm[] = [];
    for (const [version, data] of Array.from(byVersion.entries())) {
      results.push({
        algorithmVersion: version,
        deployedAt: data.deployedAt,
        metrics: calculateAggregateMetrics(data.evaluations)
      });
    }
    
    return results.sort((a, b) => new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime());
  }

  /**
   * Get performance metrics by factor
   */
  static async getPerformanceByFactor(): Promise<PerformanceByFactor[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('calculation_factors')
      .select(`
        factor_name,
        factor_category,
        factor_impact,
        calculations!inner(
          confidence,
          was_correct,
          accuracy_score
        )
      `)
      .not('calculations.evaluated_at', 'is', null);

    if (error || !data) {
      console.error('Error fetching factor performance:', error);
      return [];
    }

    // Group by factor
    const byFactor = new Map<string, {
      category: string,
      confidences: number[],
      accuracies: number[],
      correctCount: number,
      totalCount: number
    }>();
    
    for (const row of data) {
      const calc = row.calculations as any;
      
      if (!byFactor.has(row.factor_name)) {
        byFactor.set(row.factor_name, {
          category: row.factor_category || 'other',
          confidences: [],
          accuracies: [],
          correctCount: 0,
          totalCount: 0
        });
      }
      
      const factorData = byFactor.get(row.factor_name)!;
      factorData.confidences.push(calc.confidence);
      factorData.accuracies.push(calc.accuracy_score || 0);
      if (calc.was_correct) factorData.correctCount++;
      factorData.totalCount++;
    }
    
    // Calculate metrics for each factor
    const results: PerformanceByFactor[] = [];
    for (const [factorName, data] of Array.from(byFactor.entries())) {
      const avgConfidence = data.confidences.reduce((a: number, b: number) => a + b, 0) / data.confidences.length;
      const accuracy = (data.correctCount / data.totalCount) * 100;
      
      // Simple correlation: positive if accuracy > 50%, negative otherwise
      const correlationWithSuccess = accuracy > 50 ? (accuracy - 50) / 50 : -(50 - accuracy) / 50;
      
      results.push({
        factorName,
        factorCategory: data.category,
        timesUsed: data.totalCount,
        avgConfidenceWhenPresent: avgConfidence,
        accuracyWhenPresent: accuracy,
        correlationWithSuccess
      });
    }
    
    return results.sort((a, b) => b.timesUsed - a.timesUsed);
  }

  /**
   * Get performance metrics over time
   */
  static async getPerformanceOverTime(periodDays: number = 7): Promise<PerformanceOverTime[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('calculations')
      .select(`
        id,
        calculated_at,
        predicted_home_score,
        predicted_away_score,
        actual_home_score,
        actual_away_score,
        confidence,
        was_correct,
        accuracy_score,
        evaluation_type
      `)
      .not('evaluated_at', 'is', null)
      .order('calculated_at', { ascending: true });

    if (error || !data) {
      console.error('Error fetching time-based performance:', error);
      return [];
    }

    // Group by time periods
    const byPeriod = new Map<string, PredictionEvaluation[]>();
    
    for (const calc of data) {
      const date = new Date(calc.calculated_at);
      const periodStart = new Date(date);
      periodStart.setDate(periodStart.getDate() - (periodStart.getDate() % periodDays));
      periodStart.setHours(0, 0, 0, 0);
      const periodKey = periodStart.toISOString().split('T')[0];
      
      if (!byPeriod.has(periodKey)) {
        byPeriod.set(periodKey, []);
      }
      
      const evaluation: PredictionEvaluation = {
        calculationId: calc.id,
        wasCorrect: calc.was_correct || false,
        exactScore: calc.evaluation_type === 'exact_score',
        evaluationType: calc.evaluation_type as any,
        accuracyScore: calc.accuracy_score || 0,
        homeScoreError: Math.abs(calc.predicted_home_score - (calc.actual_home_score || 0)),
        awayScoreError: Math.abs(calc.predicted_away_score - (calc.actual_away_score || 0)),
        totalScoreError: Math.abs(calc.predicted_home_score - (calc.actual_home_score || 0)) +
                        Math.abs(calc.predicted_away_score - (calc.actual_away_score || 0)),
        goalDifferenceError: 0,
        brierScore: 0,
        logLoss: 0,
        confidence: calc.confidence,
        confidenceError: calc.confidence - (calc.accuracy_score || 0)
      };
      
      byPeriod.get(periodKey)!.push(evaluation);
    }
    
    // Calculate metrics for each period
    const results: PerformanceOverTime[] = [];
    for (const [periodKey, evaluations] of Array.from(byPeriod.entries())) {
      const startDate = new Date(periodKey);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + periodDays);
      
      results.push({
        period: `${periodKey} to ${endDate.toISOString().split('T')[0]}`,
        startDate: periodKey,
        endDate: endDate.toISOString().split('T')[0],
        metrics: calculateAggregateMetrics(evaluations)
      });
    }
    
    return results.sort((a, b) => a.startDate.localeCompare(b.startDate));
  }
}
