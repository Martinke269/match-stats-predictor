import { SimpleNeuralNetwork } from './simple-neural-network';
import { Team, Prediction, PredictionFactor } from './types';

export interface TrainingData {
  homeTeam: Team;
  awayTeam: Team;
  actualResult: 'home' | 'draw' | 'away';
  actualScore: { home: number; away: number };
}

export class MLPredictionEngine {
  private network: SimpleNeuralNetwork;
  private isTraining: boolean = false;
  private trainingProgress: number = 0;
  private trainingHistory: TrainingData[] = [];

  constructor() {
    // Initialize neural network with optimized configuration
    // Architecture: Input(21) → Hidden(10) → Hidden(8) → Hidden(6) → Output(3)
    this.network = new SimpleNeuralNetwork([21, 10, 8, 6, 3], 0.01);
  }

  /**
   * Normalize team statistics to 0-1 range for neural network input
   */
  private normalizeTeamStats(team: Team): number[] {
    const totalGames = team.stats.wins + team.stats.draws + team.stats.losses || 1;
    
    // Calculate form score (0-1)
    const formScore = team.form.reduce((score, result) => {
      if (result === 'W') return score + 0.2;
      if (result === 'D') return score + 0.1;
      return score;
    }, 0);

    return [
      formScore, // Form (0-1)
      team.stats.wins / totalGames, // Win rate (0-1)
      team.stats.draws / totalGames, // Draw rate (0-1)
      team.stats.losses / totalGames, // Loss rate (0-1)
      Math.min(team.stats.goalsScored / 100, 1), // Goals scored (normalized)
      Math.min(team.stats.goalsConceded / 100, 1), // Goals conceded (normalized)
      team.stats.cleanSheets / totalGames, // Clean sheet rate (0-1)
      team.stats.possession / 100, // Possession (0-1)
      Math.min(team.stats.shotsOnTarget / 200, 1), // Shots on target (normalized)
      team.stats.passAccuracy / 100, // Pass accuracy (0-1)
    ];
  }

  /**
   * Prepare input data for neural network
   */
  private prepareInput(homeTeam: Team, awayTeam: Team): number[] {
    const homeStats = this.normalizeTeamStats(homeTeam);
    const awayStats = this.normalizeTeamStats(awayTeam);
    
    // Combine home and away stats, plus home advantage indicator
    return [...homeStats, ...awayStats, 1]; // 1 = home advantage
  }

  /**
   * Prepare output data for training
   */
  private prepareOutput(result: 'home' | 'draw' | 'away'): number[] {
    // One-hot encoding: [home win, draw, away win]
    if (result === 'home') return [1, 0, 0];
    if (result === 'draw') return [0, 1, 0];
    return [0, 0, 1];
  }

  /**
   * Train the neural network with historical match data
   */
  async train(trainingData: TrainingData[], onProgress?: (progress: number) => void): Promise<void> {
    this.isTraining = true;
    this.trainingProgress = 0;
    this.trainingHistory = trainingData;

    const formattedData = trainingData.map(data => ({
      input: this.prepareInput(data.homeTeam, data.awayTeam),
      output: this.prepareOutput(data.actualResult)
    }));

    return new Promise((resolve) => {
      // Use setTimeout to make training async and allow UI updates
      setTimeout(() => {
        this.network.train(formattedData, 5000, (progress) => {
          this.trainingProgress = progress;
          if (onProgress) {
            onProgress(progress);
          }
        });

        this.isTraining = false;
        this.trainingProgress = 100;
        resolve();
      }, 0);
    });
  }

  /**
   * Predict match outcome using trained neural network
   */
  predict(homeTeam: Team, awayTeam: Team, matchId: string): Prediction {
    const input = this.prepareInput(homeTeam, awayTeam);
    const output = this.network.predict(input);

    // Extract probabilities from neural network output
    let [homeWinProb, drawProb, awayWinProb] = output;

    // Normalize probabilities to sum to 100%
    const total = homeWinProb + drawProb + awayWinProb;
    homeWinProb = (homeWinProb / total) * 100;
    drawProb = (drawProb / total) * 100;
    awayWinProb = (awayWinProb / total) * 100;

    // Calculate confidence based on the difference between highest and second highest probability
    const probs = [homeWinProb, drawProb, awayWinProb].sort((a, b) => b - a);
    const confidence = Math.min(50 + (probs[0] - probs[1]) * 1.5, 95);

    // Predict score based on team attacking strength and probabilities
    const homeAttack = homeTeam.stats.goalsScored / (homeTeam.stats.wins + homeTeam.stats.draws + homeTeam.stats.losses);
    const awayAttack = awayTeam.stats.goalsScored / (awayTeam.stats.wins + awayTeam.stats.draws + awayTeam.stats.losses);
    
    let predictedHomeGoals = Math.round(homeAttack * 1.15); // Home advantage
    let predictedAwayGoals = Math.round(awayAttack * 0.95);

    // Adjust based on most likely outcome
    if (homeWinProb > drawProb && homeWinProb > awayWinProb) {
      predictedHomeGoals = Math.max(predictedHomeGoals, predictedAwayGoals + 1);
    } else if (awayWinProb > drawProb && awayWinProb > homeWinProb) {
      predictedAwayGoals = Math.max(predictedAwayGoals, predictedHomeGoals + 1);
    } else {
      // Draw likely - make scores equal
      const avg = Math.round((predictedHomeGoals + predictedAwayGoals) / 2);
      predictedHomeGoals = avg;
      predictedAwayGoals = avg;
    }

    // Generate prediction factors based on neural network analysis
    const factors = this.generateFactors(homeTeam, awayTeam, homeWinProb, drawProb, awayWinProb);

    return {
      matchId,
      homeWinProbability: Math.round(homeWinProb * 10) / 10,
      drawProbability: Math.round(drawProb * 10) / 10,
      awayWinProbability: Math.round(awayWinProb * 10) / 10,
      predictedScore: {
        home: predictedHomeGoals,
        away: predictedAwayGoals
      },
      confidence: Math.round(confidence),
      factors
    };
  }

  /**
   * Generate human-readable prediction factors
   */
  private generateFactors(
    homeTeam: Team,
    awayTeam: Team,
    homeWinProb: number,
    drawProb: number,
    awayWinProb: number
  ): PredictionFactor[] {
    const factors: PredictionFactor[] = [];

    // Neural network confidence
    const maxProb = Math.max(homeWinProb, drawProb, awayWinProb);
    if (maxProb > 50) {
      factors.push({
        name: 'Neural Network Analyse',
        impact: 'positive',
        weight: 0.3,
        description: `ML-modellen viser ${maxProb.toFixed(1)}% sandsynlighed for ${
          homeWinProb === maxProb ? `${homeTeam.name} sejr` :
          awayWinProb === maxProb ? `${awayTeam.name} sejr` : 'uafgjort'
        }`
      });
    }

    // Form analysis
    const homeFormScore = homeTeam.form.filter(r => r === 'W').length;
    const awayFormScore = awayTeam.form.filter(r => r === 'W').length;
    
    if (homeFormScore > awayFormScore + 1) {
      factors.push({
        name: 'Form Analyse',
        impact: 'positive',
        weight: 0.2,
        description: `${homeTeam.name} har vundet ${homeFormScore} af sidste 5 kampe`
      });
    } else if (awayFormScore > homeFormScore + 1) {
      factors.push({
        name: 'Form Analyse',
        impact: 'negative',
        weight: 0.2,
        description: `${awayTeam.name} har vundet ${awayFormScore} af sidste 5 kampe`
      });
    }

    // Goal difference
    const homeGoalDiff = homeTeam.stats.goalsScored - homeTeam.stats.goalsConceded;
    const awayGoalDiff = awayTeam.stats.goalsScored - awayTeam.stats.goalsConceded;
    
    if (Math.abs(homeGoalDiff - awayGoalDiff) > 8) {
      factors.push({
        name: 'Målforskel',
        impact: homeGoalDiff > awayGoalDiff ? 'positive' : 'negative',
        weight: 0.15,
        description: `Betydelig forskel i målforskel: ${homeTeam.name} (+${homeGoalDiff}) vs ${awayTeam.name} (+${awayGoalDiff})`
      });
    }

    // Home advantage
    factors.push({
      name: 'Hjemmebanefordel',
      impact: 'positive',
      weight: 0.15,
      description: `${homeTeam.name} spiller på hjemmebane (historisk ~15% fordel)`
    });

    // Defensive strength
    const homeDefense = homeTeam.stats.cleanSheets / (homeTeam.stats.wins + homeTeam.stats.draws + homeTeam.stats.losses);
    const awayDefense = awayTeam.stats.cleanSheets / (awayTeam.stats.wins + awayTeam.stats.draws + awayTeam.stats.losses);

    if (homeDefense > 0.4 || awayDefense > 0.4) {
      factors.push({
        name: 'Defensiv Styrke',
        impact: homeDefense > awayDefense ? 'positive' : 'negative',
        weight: 0.1,
        description: `${homeDefense > awayDefense ? homeTeam.name : awayTeam.name} har stærk defensiv (${Math.round(Math.max(homeDefense, awayDefense) * 100)}% clean sheets)`
      });
    }

    return factors;
  }

  /**
   * Get training status
   */
  getTrainingStatus(): { isTraining: boolean; progress: number; dataPoints: number } {
    return {
      isTraining: this.isTraining,
      progress: this.trainingProgress,
      dataPoints: this.trainingHistory.length
    };
  }

  /**
   * Export trained model as JSON
   */
  exportModel(): string {
    return JSON.stringify(this.network.toJSON());
  }

  /**
   * Import trained model from JSON
   */
  importModel(modelJson: string): void {
    const modelData = JSON.parse(modelJson);
    this.network.fromJSON(modelData);
  }
}
