/**
 * Evaluation Metrics
 * Advanced metrics for evaluating prediction quality
 */

export interface EvaluationMetrics {
  // Basic metrics
  accuracy: number; // Percentage of correct outcome predictions
  exactScoreRate: number; // Percentage of exact score predictions
  
  // Error metrics
  mae: number; // Mean Absolute Error for score predictions
  rmse: number; // Root Mean Square Error for score predictions
  maeHomeScore: number; // MAE for home team scores
  maeAwayScore: number; // MAE for away team scores
  
  // Probability metrics
  brier: number; // Brier score for probability accuracy
  logLoss: number; // Log loss for probability predictions
  
  // Confidence metrics
  calibration: number; // How well confidence matches actual accuracy
  overconfidence: number; // Tendency to be overconfident
  
  // Sample size
  totalPredictions: number;
  evaluatedPredictions: number;
}

export interface PredictionEvaluation {
  calculationId: string;
  wasCorrect: boolean;
  exactScore: boolean;
  evaluationType: 'exact_score' | 'correct_outcome' | 'incorrect';
  accuracyScore: number;
  
  // Error metrics
  homeScoreError: number;
  awayScoreError: number;
  totalScoreError: number;
  goalDifferenceError: number;
  
  // Probability metrics
  brierScore: number;
  logLoss: number;
  
  // Confidence analysis
  confidence: number;
  confidenceError: number; // Difference between confidence and actual accuracy
}

/**
 * Calculate comprehensive evaluation metrics for a prediction
 */
export function evaluatePrediction(
  predictedHomeScore: number,
  predictedAwayScore: number,
  actualHomeScore: number,
  actualAwayScore: number,
  homeWinProb: number,
  drawProb: number,
  awayWinProb: number,
  confidence: number
): PredictionEvaluation {
  // Determine outcomes
  const predictedOutcome = determineOutcome(predictedHomeScore, predictedAwayScore);
  const actualOutcome = determineOutcome(actualHomeScore, actualAwayScore);
  
  const wasCorrect = predictedOutcome === actualOutcome;
  const exactScore = predictedHomeScore === actualHomeScore && predictedAwayScore === actualAwayScore;
  
  // Evaluation type
  let evaluationType: 'exact_score' | 'correct_outcome' | 'incorrect';
  if (exactScore) {
    evaluationType = 'exact_score';
  } else if (wasCorrect) {
    evaluationType = 'correct_outcome';
  } else {
    evaluationType = 'incorrect';
  }
  
  // Calculate accuracy score (0-100)
  let accuracyScore = 0;
  if (exactScore) {
    accuracyScore = 100;
  } else if (wasCorrect) {
    // Partial credit based on goal difference accuracy
    const predictedGD = predictedHomeScore - predictedAwayScore;
    const actualGD = actualHomeScore - actualAwayScore;
    const gdError = Math.abs(predictedGD - actualGD);
    accuracyScore = Math.max(50, 80 - (gdError * 10));
  } else {
    // Small credit if probabilities were reasonable
    const actualProb = actualOutcome === 'home' ? homeWinProb
      : actualOutcome === 'away' ? awayWinProb
      : drawProb;
    accuracyScore = Math.min(40, actualProb / 2);
  }
  
  // Error metrics
  const homeScoreError = Math.abs(predictedHomeScore - actualHomeScore);
  const awayScoreError = Math.abs(predictedAwayScore - actualAwayScore);
  const totalScoreError = homeScoreError + awayScoreError;
  const goalDifferenceError = Math.abs(
    (predictedHomeScore - predictedAwayScore) - (actualHomeScore - actualAwayScore)
  );
  
  // Brier score (for probability accuracy)
  const homeActual = actualOutcome === 'home' ? 1 : 0;
  const drawActual = actualOutcome === 'draw' ? 1 : 0;
  const awayActual = actualOutcome === 'away' ? 1 : 0;
  
  const brierScore = (
    Math.pow(homeWinProb / 100 - homeActual, 2) +
    Math.pow(drawProb / 100 - drawActual, 2) +
    Math.pow(awayWinProb / 100 - awayActual, 2)
  ) / 3;
  
  // Log loss (penalizes confident wrong predictions)
  const epsilon = 1e-15; // Prevent log(0)
  const actualProbUsed = actualOutcome === 'home' ? homeWinProb / 100
    : actualOutcome === 'away' ? awayWinProb / 100
    : drawProb / 100;
  const logLoss = -Math.log(Math.max(epsilon, Math.min(1 - epsilon, actualProbUsed)));
  
  // Confidence error
  const confidenceError = confidence - accuracyScore;
  
  return {
    calculationId: '', // Will be set by caller
    wasCorrect,
    exactScore,
    evaluationType,
    accuracyScore,
    homeScoreError,
    awayScoreError,
    totalScoreError,
    goalDifferenceError,
    brierScore,
    logLoss,
    confidence,
    confidenceError
  };
}

/**
 * Calculate aggregate metrics for a set of evaluations
 */
export function calculateAggregateMetrics(evaluations: PredictionEvaluation[]): EvaluationMetrics {
  if (evaluations.length === 0) {
    return {
      accuracy: 0,
      exactScoreRate: 0,
      mae: 0,
      rmse: 0,
      maeHomeScore: 0,
      maeAwayScore: 0,
      brier: 0,
      logLoss: 0,
      calibration: 0,
      overconfidence: 0,
      totalPredictions: 0,
      evaluatedPredictions: 0
    };
  }
  
  const n = evaluations.length;
  
  // Basic metrics
  const correctCount = evaluations.filter(e => e.wasCorrect).length;
  const exactScoreCount = evaluations.filter(e => e.exactScore).length;
  const accuracy = (correctCount / n) * 100;
  const exactScoreRate = (exactScoreCount / n) * 100;
  
  // Error metrics
  const maeHomeScore = evaluations.reduce((sum, e) => sum + e.homeScoreError, 0) / n;
  const maeAwayScore = evaluations.reduce((sum, e) => sum + e.awayScoreError, 0) / n;
  const mae = evaluations.reduce((sum, e) => sum + e.totalScoreError, 0) / n;
  
  const rmse = Math.sqrt(
    evaluations.reduce((sum, e) => sum + Math.pow(e.totalScoreError, 2), 0) / n
  );
  
  // Probability metrics
  const brier = evaluations.reduce((sum, e) => sum + e.brierScore, 0) / n;
  const logLoss = evaluations.reduce((sum, e) => sum + e.logLoss, 0) / n;
  
  // Confidence metrics
  const avgConfidence = evaluations.reduce((sum, e) => sum + e.confidence, 0) / n;
  const avgAccuracy = evaluations.reduce((sum, e) => sum + e.accuracyScore, 0) / n;
  const calibration = 100 - Math.abs(avgConfidence - avgAccuracy);
  const overconfidence = avgConfidence - avgAccuracy;
  
  return {
    accuracy,
    exactScoreRate,
    mae,
    rmse,
    maeHomeScore,
    maeAwayScore,
    brier,
    logLoss,
    calibration,
    overconfidence,
    totalPredictions: n,
    evaluatedPredictions: n
  };
}

/**
 * Helper: Determine match outcome
 */
function determineOutcome(homeScore: number, awayScore: number): 'home' | 'draw' | 'away' {
  if (homeScore > awayScore) return 'home';
  if (awayScore > homeScore) return 'away';
  return 'draw';
}

/**
 * Format metrics for display
 */
export function formatMetrics(metrics: EvaluationMetrics): string {
  return `
Evaluation Metrics (n=${metrics.evaluatedPredictions}):
  Accuracy: ${metrics.accuracy.toFixed(1)}%
  Exact Score Rate: ${metrics.exactScoreRate.toFixed(1)}%
  MAE: ${metrics.mae.toFixed(2)} goals
  RMSE: ${metrics.rmse.toFixed(2)} goals
  Brier Score: ${metrics.brier.toFixed(4)}
  Log Loss: ${metrics.logLoss.toFixed(4)}
  Calibration: ${metrics.calibration.toFixed(1)}%
  Overconfidence: ${metrics.overconfidence > 0 ? '+' : ''}${metrics.overconfidence.toFixed(1)}%
  `.trim();
}
