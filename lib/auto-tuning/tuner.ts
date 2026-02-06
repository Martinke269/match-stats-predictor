/**
 * Auto-Tuning System
 * Automatically improves algorithm weights based on evaluation data
 */

import { createClient } from '@supabase/supabase-js';

export interface AlgorithmWeights {
  formWeight: number;
  goalDifferenceWeight: number;
  headToHeadWeight: number;
  homeAdvantageWeight: number;
  winRateWeight: number;
  defensiveStrengthWeight: number;
  qualityGapWeight: number;
  upsetFactorWeight: number;
  fixtureCongestionWeight: number;
  winterBreakWeight: number;
  homeAdvantageBonus: number;
  awayHandicap: number;
}

export interface FactorEffectiveness {
  factorName: string;
  factorCategory: string;
  timesUsed: number;
  avgConfidence: number;
  accuracyWhenPresent: number;
  currentWeight: number;
  suggestedWeight: number;
  adjustment: number;
}

export interface TuningResult {
  newVersion: number;
  oldWeights: AlgorithmWeights;
  newWeights: AlgorithmWeights;
  improvements: string[];
  factorAnalysis: FactorEffectiveness[];
  evaluationsPeriod: {
    start: Date;
    end: Date;
    totalEvaluations: number;
  };
  performanceMetrics: {
    oldAccuracy: number;
    expectedImprovement: number;
  };
}

/**
 * Main auto-tuning function
 * Analyzes recent evaluations and generates improved weights
 */
export async function autoTuneAlgorithm(
  supabaseUrl: string,
  supabaseKey: string
): Promise<TuningResult> {
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Get evaluations from last week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data: evaluations, error: evalError } = await supabase
    .from('calculations')
    .select(`
      *,
      calculation_factors (
        factor_name,
        factor_category,
        factor_weight,
        factor_impact
      )
    `)
    .gte('evaluated_at', oneWeekAgo.toISOString())
    .not('was_correct', 'is', null)
    .order('evaluated_at', { ascending: false });

  if (evalError || !evaluations || evaluations.length === 0) {
    throw new Error(`No evaluations found for tuning: ${evalError?.message || 'No data'}`);
  }

  // 2. Get current algorithm version and weights
  const { data: currentVersion, error: versionError } = await supabase
    .from('algorithm_versions')
    .select('*')
    .eq('is_active', true)
    .order('version_number', { ascending: false })
    .limit(1)
    .single();

  if (versionError || !currentVersion) {
    throw new Error(`Failed to get current algorithm version: ${versionError?.message}`);
  }

  const currentWeights = currentVersion.weights as AlgorithmWeights;

  // 3. Calculate factor effectiveness
  const factorEffectiveness = calculateFactorEffectiveness(evaluations, currentWeights);

  // 4. Adjust weights based on performance
  const newWeights = adjustWeights(currentWeights, factorEffectiveness, evaluations);

  // 5. Calculate home/away bias adjustment
  const biasAdjustment = calculateBiasAdjustment(evaluations);
  newWeights.homeAdvantageBonus = Math.max(5, Math.min(15, 
    currentWeights.homeAdvantageBonus + biasAdjustment.homeAdjustment
  ));
  newWeights.awayHandicap = Math.max(0, Math.min(10,
    currentWeights.awayHandicap + biasAdjustment.awayAdjustment
  ));

  // 6. Generate improvement notes
  const improvements = generateImprovementNotes(
    currentWeights,
    newWeights,
    factorEffectiveness,
    biasAdjustment
  );

  // 7. Calculate performance metrics
  const correctCount = evaluations.filter(e => e.was_correct).length;
  const oldAccuracy = (correctCount / evaluations.length) * 100;
  const expectedImprovement = estimateImprovement(factorEffectiveness);

  // 8. Create new algorithm version
  const newVersionNumber = currentVersion.version_number + 1;
  const { data: newVersion, error: insertError } = await supabase
    .from('algorithm_versions')
    .insert({
      version: `${Math.floor(newVersionNumber / 10)}.${newVersionNumber % 10}.0`,
      version_number: newVersionNumber,
      description: `Auto-tuned version based on ${evaluations.length} evaluations from last week`,
      weights: newWeights,
      notes: improvements.join('\n'),
      changes: {
        tuningDate: new Date().toISOString(),
        evaluationCount: evaluations.length,
        oldAccuracy,
        expectedImprovement,
        weightChanges: calculateWeightChanges(currentWeights, newWeights)
      },
      is_active: true
    })
    .select()
    .single();

  if (insertError || !newVersion) {
    throw new Error(`Failed to create new version: ${insertError?.message}`);
  }

  // 9. Deactivate old version
  await supabase
    .from('algorithm_versions')
    .update({ 
      is_active: false,
      deprecated_at: new Date().toISOString()
    })
    .eq('id', currentVersion.id);

  return {
    newVersion: newVersionNumber,
    oldWeights: currentWeights,
    newWeights,
    improvements,
    factorAnalysis: factorEffectiveness,
    evaluationsPeriod: {
      start: oneWeekAgo,
      end: new Date(),
      totalEvaluations: evaluations.length
    },
    performanceMetrics: {
      oldAccuracy,
      expectedImprovement
    }
  };
}

/**
 * Calculate effectiveness of each factor
 */
function calculateFactorEffectiveness(
  evaluations: any[],
  currentWeights: AlgorithmWeights
): FactorEffectiveness[] {
  const factorStats = new Map<string, {
    category: string;
    timesUsed: number;
    correctWhenPresent: number;
    totalConfidence: number;
  }>();

  // Aggregate factor statistics
  evaluations.forEach(evaluation => {
    const factors = evaluation.calculation_factors || [];
    const wasCorrect = evaluation.was_correct;
    const confidence = evaluation.confidence;

    factors.forEach((factor: any) => {
      const key = factor.factor_name;
      if (!factorStats.has(key)) {
        factorStats.set(key, {
          category: factor.factor_category || 'unknown',
          timesUsed: 0,
          correctWhenPresent: 0,
          totalConfidence: 0
        });
      }

      const stats = factorStats.get(key)!;
      stats.timesUsed++;
      if (wasCorrect) stats.correctWhenPresent++;
      stats.totalConfidence += confidence;
    });
  });

  // Convert to effectiveness array
  const effectiveness: FactorEffectiveness[] = [];
  
  factorStats.forEach((stats, factorName) => {
    const accuracyWhenPresent = (stats.correctWhenPresent / stats.timesUsed) * 100;
    const avgConfidence = stats.totalConfidence / stats.timesUsed;
    
    // Map factor names to weight keys
    const currentWeight = getWeightForFactor(factorName, currentWeights);
    
    // Calculate suggested weight based on performance
    const performanceScore = (accuracyWhenPresent / 100) * (avgConfidence / 100);
    const suggestedWeight = currentWeight * (0.8 + (performanceScore * 0.4));
    const adjustment = suggestedWeight - currentWeight;

    effectiveness.push({
      factorName,
      factorCategory: stats.category,
      timesUsed: stats.timesUsed,
      avgConfidence,
      accuracyWhenPresent,
      currentWeight,
      suggestedWeight: Math.round(suggestedWeight * 100) / 100,
      adjustment: Math.round(adjustment * 100) / 100
    });
  });

  return effectiveness.sort((a, b) => b.timesUsed - a.timesUsed);
}

/**
 * Adjust weights based on factor effectiveness
 */
function adjustWeights(
  currentWeights: AlgorithmWeights,
  factorEffectiveness: FactorEffectiveness[],
  evaluations: any[]
): AlgorithmWeights {
  const newWeights = { ...currentWeights };
  
  // Calculate overall accuracy
  const correctCount = evaluations.filter(e => e.was_correct).length;
  const overallAccuracy = correctCount / evaluations.length;

  // Adjust each weight based on factor effectiveness
  factorEffectiveness.forEach(factor => {
    const weightKey = getWeightKeyForFactor(factor.factorName);
    if (weightKey && weightKey in newWeights) {
      const currentValue = (newWeights as any)[weightKey];
      const performanceRatio = factor.accuracyWhenPresent / 100;
      
      // Conservative adjustment: max 20% change per tuning
      const maxChange = currentValue * 0.2;
      const suggestedChange = (performanceRatio - overallAccuracy) * currentValue;
      const actualChange = Math.max(-maxChange, Math.min(maxChange, suggestedChange));
      
      (newWeights as any)[weightKey] = Math.max(0.05, Math.min(0.5, 
        currentValue + actualChange
      ));
    }
  });

  // Normalize weights to ensure they sum appropriately
  return normalizeWeights(newWeights);
}

/**
 * Calculate home/away bias adjustment
 */
function calculateBiasAdjustment(evaluations: any[]): {
  homeAdjustment: number;
  awayAdjustment: number;
} {
  let homeCorrect = 0;
  let homeTotal = 0;
  let awayCorrect = 0;
  let awayTotal = 0;

  evaluations.forEach(evaluation => {
    const predictedHome = evaluation.predicted_home_score > evaluation.predicted_away_score;
    const actualHome = evaluation.actual_home_score > evaluation.actual_away_score;
    const predictedAway = evaluation.predicted_away_score > evaluation.predicted_home_score;
    const actualAway = evaluation.actual_away_score > evaluation.actual_home_score;

    if (predictedHome) {
      homeTotal++;
      if (actualHome) homeCorrect++;
    }
    if (predictedAway) {
      awayTotal++;
      if (actualAway) awayCorrect++;
    }
  });

  const homeAccuracy = homeTotal > 0 ? homeCorrect / homeTotal : 0.5;
  const awayAccuracy = awayTotal > 0 ? awayCorrect / awayTotal : 0.5;

  // Adjust bias based on accuracy difference
  const homeAdjustment = (homeAccuracy - 0.5) * -2; // Reduce bonus if too accurate
  const awayAdjustment = (awayAccuracy - 0.5) * 2; // Reduce handicap if too accurate

  return {
    homeAdjustment: Math.round(homeAdjustment * 10) / 10,
    awayAdjustment: Math.round(awayAdjustment * 10) / 10
  };
}

/**
 * Generate human-readable improvement notes
 */
function generateImprovementNotes(
  oldWeights: AlgorithmWeights,
  newWeights: AlgorithmWeights,
  factorEffectiveness: FactorEffectiveness[],
  biasAdjustment: { homeAdjustment: number; awayAdjustment: number }
): string[] {
  const notes: string[] = [];

  // Weight changes
  const significantChanges = Object.keys(newWeights).filter(key => {
    const oldVal = (oldWeights as any)[key];
    const newVal = (newWeights as any)[key];
    return Math.abs(newVal - oldVal) > 0.02;
  });

  if (significantChanges.length > 0) {
    notes.push(`Adjusted ${significantChanges.length} weight(s) based on performance data`);
    significantChanges.forEach(key => {
      const oldVal = (oldWeights as any)[key];
      const newVal = (newWeights as any)[key];
      const changePercent = ((newVal - oldVal) / oldVal * 100);
      const changeStr = changePercent.toFixed(1);
      notes.push(`  - ${key}: ${oldVal.toFixed(2)} → ${newVal.toFixed(2)} (${changePercent > 0 ? '+' : ''}${changeStr}%)`);
    });
  }

  // Bias adjustments
  if (Math.abs(biasAdjustment.homeAdjustment) > 0.5) {
    notes.push(`Home advantage bonus adjusted by ${biasAdjustment.homeAdjustment > 0 ? '+' : ''}${biasAdjustment.homeAdjustment.toFixed(1)}`);
  }
  if (Math.abs(biasAdjustment.awayAdjustment) > 0.5) {
    notes.push(`Away handicap adjusted by ${biasAdjustment.awayAdjustment > 0 ? '+' : ''}${biasAdjustment.awayAdjustment.toFixed(1)}`);
  }

  // Top performing factors
  const topFactors = factorEffectiveness
    .filter(f => f.accuracyWhenPresent > 70)
    .slice(0, 3);
  
  if (topFactors.length > 0) {
    notes.push(`Top performing factors: ${topFactors.map(f => f.factorName).join(', ')}`);
  }

  // Underperforming factors
  const weakFactors = factorEffectiveness
    .filter(f => f.accuracyWhenPresent < 50 && f.timesUsed > 5)
    .slice(0, 2);
  
  if (weakFactors.length > 0) {
    notes.push(`Reduced weight for underperforming factors: ${weakFactors.map(f => f.factorName).join(', ')}`);
  }

  return notes;
}

/**
 * Estimate expected improvement from weight changes
 */
function estimateImprovement(factorEffectiveness: FactorEffectiveness[]): number {
  const avgAdjustment = factorEffectiveness.reduce((sum, f) => 
    sum + Math.abs(f.adjustment), 0
  ) / factorEffectiveness.length;

  // Conservative estimate: 0.5-2% improvement per tuning cycle
  return Math.min(2, avgAdjustment * 10);
}

/**
 * Calculate weight changes for logging
 */
function calculateWeightChanges(
  oldWeights: AlgorithmWeights,
  newWeights: AlgorithmWeights
): Record<string, { old: number; new: number; change: number }> {
  const changes: Record<string, { old: number; new: number; change: number }> = {};

  Object.keys(newWeights).forEach(key => {
    const oldVal = (oldWeights as any)[key];
    const newVal = (newWeights as any)[key];
    if (oldVal !== newVal) {
      changes[key] = {
        old: oldVal,
        new: newVal,
        change: newVal - oldVal
      };
    }
  });

  return changes;
}

/**
 * Get current weight value for a factor name
 */
function getWeightForFactor(factorName: string, weights: AlgorithmWeights): number {
  const mapping: Record<string, keyof AlgorithmWeights> = {
    'Form': 'formWeight',
    'Målforskel': 'goalDifferenceWeight',
    'Indbyrdes kampe': 'headToHeadWeight',
    'Hjemmebane': 'homeAdvantageWeight',
    'Sejrsrate': 'winRateWeight',
    'Defensiv styrke': 'defensiveStrengthWeight',
    'Kvalitetsforskel': 'qualityGapWeight',
    'Overraskelsesfaktor': 'upsetFactorWeight',
    'Europæisk fodbold': 'fixtureCongestionWeight',
    'Pokalkampe': 'fixtureCongestionWeight',
    'Vinterpause': 'winterBreakWeight'
  };

  const key = mapping[factorName];
  return key ? weights[key] : 0.1;
}

/**
 * Get weight key for a factor name
 */
function getWeightKeyForFactor(factorName: string): keyof AlgorithmWeights | null {
  const mapping: Record<string, keyof AlgorithmWeights> = {
    'Form': 'formWeight',
    'Målforskel': 'goalDifferenceWeight',
    'Indbyrdes kampe': 'headToHeadWeight',
    'Hjemmebane': 'homeAdvantageWeight',
    'Sejrsrate': 'winRateWeight',
    'Defensiv styrke': 'defensiveStrengthWeight',
    'Kvalitetsforskel': 'qualityGapWeight',
    'Overraskelsesfaktor': 'upsetFactorWeight',
    'Europæisk fodbold': 'fixtureCongestionWeight',
    'Pokalkampe': 'fixtureCongestionWeight',
    'Vinterpause': 'winterBreakWeight'
  };

  return mapping[factorName] || null;
}

/**
 * Normalize weights to ensure they're in valid ranges
 */
function normalizeWeights(weights: AlgorithmWeights): AlgorithmWeights {
  // Ensure all weights are between 0.05 and 0.5
  Object.keys(weights).forEach(key => {
    if (key.includes('Weight')) {
      (weights as any)[key] = Math.max(0.05, Math.min(0.5, (weights as any)[key]));
    }
  });

  // Round to 2 decimal places
  Object.keys(weights).forEach(key => {
    (weights as any)[key] = Math.round((weights as any)[key] * 100) / 100;
  });

  return weights;
}
