import { Team, Prediction, PredictionFactor } from './types';

export class PredictionEngine {
  /**
   * Calculate match prediction based on team statistics and form
   * @param homeTeam - Home team data
   * @param awayTeam - Away team data
   * @param matchId - Unique match identifier
   * @param options - Optional configuration including winter break detection
   */
  static predictMatch(
    homeTeam: Team, 
    awayTeam: Team, 
    matchId: string,
    options?: {
      afterWinterBreak?: boolean;
      winterBreakMonths?: number; // How many months since last match
      homeFixtureCongestion?: {
        europeanCompetition?: boolean; // Playing in European competition
        cupMatches?: number; // Number of cup matches this month
      };
      awayFixtureCongestion?: {
        europeanCompetition?: boolean;
        cupMatches?: number;
      };
    }
  ): Prediction {
    const factors: PredictionFactor[] = [];
    const afterWinterBreak = options?.afterWinterBreak || false;
    const winterBreakMonths = options?.winterBreakMonths || 2;
    const homeFixtureCongestion = options?.homeFixtureCongestion;
    const awayFixtureCongestion = options?.awayFixtureCongestion;
    
    // Winter break warning - form is less reliable
    if (afterWinterBreak) {
      factors.push({
        name: 'Vinterpause',
        impact: 'negative',
        weight: 0.25,
        description: `⚠️ ${winterBreakMonths} måneders vinterpause - alle hold starter fra 0. Resultater er meget usikre!`
      });
    }
    
    // Fixture congestion analysis
    let homeFixtureLoad = 0;
    let awayFixtureLoad = 0;
    
    if (homeFixtureCongestion) {
      if (homeFixtureCongestion.europeanCompetition) {
        homeFixtureLoad += 2; // European matches are very demanding
        factors.push({
          name: 'Europæisk fodbold',
          impact: 'negative',
          weight: 0.2,
          description: `${homeTeam.name} spiller i Europa League - risiko for træthed og rotation`
        });
      }
      if (homeFixtureCongestion.cupMatches && homeFixtureCongestion.cupMatches > 0) {
        homeFixtureLoad += homeFixtureCongestion.cupMatches;
        factors.push({
          name: 'Pokalkampe',
          impact: 'negative',
          weight: 0.15,
          description: `${homeTeam.name} har ${homeFixtureCongestion.cupMatches} pokalkamp${homeFixtureCongestion.cupMatches > 1 ? 'e' : ''} denne måned`
        });
      }
    }
    
    if (awayFixtureCongestion) {
      if (awayFixtureCongestion.europeanCompetition) {
        awayFixtureLoad += 2;
        factors.push({
          name: 'Europæisk fodbold',
          impact: 'positive', // Positive for home team
          weight: 0.2,
          description: `${awayTeam.name} spiller i Europa League - risiko for træthed og rotation`
        });
      }
      if (awayFixtureCongestion.cupMatches && awayFixtureCongestion.cupMatches > 0) {
        awayFixtureLoad += awayFixtureCongestion.cupMatches;
        factors.push({
          name: 'Pokalkampe',
          impact: 'positive', // Positive for home team
          weight: 0.15,
          description: `${awayTeam.name} har ${awayFixtureCongestion.cupMatches} pokalkamp${awayFixtureCongestion.cupMatches > 1 ? 'e' : ''} denne måned`
        });
      }
    }
    
    // Calculate form score (recent results) - but reduce weight after winter break
    const formReliability = afterWinterBreak ? 0.4 : 1.0; // Form is only 40% as reliable after break
    const homeFormScore = this.calculateFormScore(homeTeam.form) * formReliability;
    const awayFormScore = this.calculateFormScore(awayTeam.form) * formReliability;
    
    if (homeFormScore > awayFormScore + 1) {
      factors.push({
        name: 'Form',
        impact: 'positive',
        weight: 0.2,
        description: `${homeTeam.name} har bedre form (${homeTeam.form.join('')})`
      });
    } else if (awayFormScore > homeFormScore + 1) {
      factors.push({
        name: 'Form',
        impact: 'negative',
        weight: 0.2,
        description: `${awayTeam.name} har bedre form (${awayTeam.form.join('')})`
      });
    }

    // Calculate goal difference
    const homeGoalDiff = homeTeam.stats.goalsScored - homeTeam.stats.goalsConceded;
    const awayGoalDiff = awayTeam.stats.goalsScored - awayTeam.stats.goalsConceded;
    
    if (homeGoalDiff > awayGoalDiff + 5) {
      factors.push({
        name: 'Målforskel',
        impact: 'positive',
        weight: 0.15,
        description: `${homeTeam.name} har bedre målforskel (+${homeGoalDiff})`
      });
    } else if (awayGoalDiff > homeGoalDiff + 5) {
      factors.push({
        name: 'Målforskel',
        impact: 'negative',
        weight: 0.15,
        description: `${awayTeam.name} har bedre målforskel (+${awayGoalDiff})`
      });
    }

    // Home advantage
    factors.push({
      name: 'Hjemmebane',
      impact: 'positive',
      weight: 0.15,
      description: `${homeTeam.name} spiller hjemme`
    });

    // Calculate win percentages
    const homeWinRate = this.calculateWinRate(homeTeam);
    const awayWinRate = this.calculateWinRate(awayTeam);

    if (homeWinRate > 0.6) {
      factors.push({
        name: 'Sejrsrate',
        impact: 'positive',
        weight: 0.1,
        description: `${homeTeam.name} har ${(homeWinRate * 100).toFixed(0)}% sejrsrate`
      });
    }

    // Defensive strength
    const homeDefense = homeTeam.stats.cleanSheets / (homeTeam.stats.wins + homeTeam.stats.draws + homeTeam.stats.losses);
    const awayDefense = awayTeam.stats.cleanSheets / (awayTeam.stats.wins + awayTeam.stats.draws + awayTeam.stats.losses);

    if (homeDefense > 0.4) {
      factors.push({
        name: 'Defensiv styrke',
        impact: 'positive',
        weight: 0.1,
        description: `${homeTeam.name} har holdt ${homeTeam.stats.cleanSheets} clean sheets`
      });
    }

    // Calculate probabilities
    let homeScore = 50; // Base score
    
    // After winter break, reduce the impact of all factors
    const impactMultiplier = afterWinterBreak ? 0.5 : 1.0;
    
    // Fixture congestion impact - reduces team's effective strength
    const fixtureLoadDifference = awayFixtureLoad - homeFixtureLoad;
    homeScore += fixtureLoadDifference * 5; // Each fixture load point is worth 5 points
    
    // Form impact (max ±15, reduced after winter break)
    homeScore += (homeFormScore - awayFormScore) * 3 * impactMultiplier;
    
    // Home advantage (+10, slightly reduced after winter break)
    homeScore += 10 * (afterWinterBreak ? 0.7 : 1.0);
    
    // Goal difference impact (max ±10, reduced after winter break)
    homeScore += Math.min(Math.max((homeGoalDiff - awayGoalDiff) / 2, -10), 10) * impactMultiplier;
    
    // Win rate impact (max ±10, reduced after winter break)
    homeScore += (homeWinRate - awayWinRate) * 20 * impactMultiplier;
    
    // Attacking strength (goals scored per game)
    const homeAttack = homeTeam.stats.goalsScored / (homeTeam.stats.wins + homeTeam.stats.draws + homeTeam.stats.losses);
    const awayAttack = awayTeam.stats.goalsScored / (awayTeam.stats.wins + awayTeam.stats.draws + awayTeam.stats.losses);
    homeScore += (homeAttack - awayAttack) * 5 * impactMultiplier;

    // Normalize to 0-100, but keep closer to 50 after winter break
    if (afterWinterBreak) {
      // Pull score towards 50 (more uncertainty)
      homeScore = 50 + (homeScore - 50) * 0.6;
      homeScore = Math.min(Math.max(homeScore, 25), 75);
    } else {
      homeScore = Math.min(Math.max(homeScore, 10), 90);
    }
    
    // Calculate probabilities with better distribution
    // Base draw probability varies based on how evenly matched teams are
    const scoreDifference = Math.abs(homeScore - 50);
    let baseDraw = 30 - (scoreDifference / 5); // 20-30% draw probability
    
    // After winter break, increase draw probability (more unpredictable)
    if (afterWinterBreak) {
      baseDraw += 5; // Increase base draw probability by 5%
    }
    
    const drawProbability = Math.max(20, Math.min(35, baseDraw));
    
    // Distribute remaining probability between home and away
    const remainingProb = 100 - drawProbability;
    const homeWinProbability = (remainingProb * homeScore) / 100;
    const awayWinProbability = remainingProb - homeWinProbability;

    // Predict score that aligns with probabilities
    let predictedHomeGoals: number;
    let predictedAwayGoals: number;
    
    // Calculate expected goals based on attack strength
    const homeExpectedGoals = homeAttack * 1.1; // Home advantage boost
    const awayExpectedGoals = awayAttack * 0.95; // Away disadvantage
    
    if (homeWinProbability > awayWinProbability + 15) {
      // Clear home win predicted
      predictedHomeGoals = Math.max(Math.round(homeExpectedGoals * 1.2), 2);
      predictedAwayGoals = Math.max(Math.round(awayExpectedGoals * 0.8), 0);
      
      // Ensure it's actually a win
      if (predictedHomeGoals <= predictedAwayGoals) {
        predictedHomeGoals = predictedAwayGoals + 1;
      }
    } else if (awayWinProbability > homeWinProbability + 15) {
      // Clear away win predicted
      predictedHomeGoals = Math.max(Math.round(homeExpectedGoals * 0.8), 0);
      predictedAwayGoals = Math.max(Math.round(awayExpectedGoals * 1.2), 2);
      
      // Ensure it's actually a win
      if (predictedAwayGoals <= predictedHomeGoals) {
        predictedAwayGoals = predictedHomeGoals + 1;
      }
    } else if (drawProbability > Math.max(homeWinProbability, awayWinProbability)) {
      // Draw is most likely
      const avgGoals = (homeExpectedGoals + awayExpectedGoals) / 2;
      predictedHomeGoals = Math.round(avgGoals);
      predictedAwayGoals = predictedHomeGoals; // Same score for draw
    } else {
      // Close match - slight favorite
      predictedHomeGoals = Math.round(homeExpectedGoals);
      predictedAwayGoals = Math.round(awayExpectedGoals);
      
      // Adjust to match probability leader
      if (homeWinProbability > awayWinProbability && predictedHomeGoals <= predictedAwayGoals) {
        predictedHomeGoals = predictedAwayGoals + 1;
      } else if (awayWinProbability > homeWinProbability && predictedAwayGoals <= predictedHomeGoals) {
        predictedAwayGoals = predictedHomeGoals + 1;
      }
    }

    // Calculate confidence based on how decisive the prediction is
    // Confidence should correlate with the margin of the prediction
    const maxProb = Math.max(homeWinProbability, drawProbability, awayWinProbability);
    const secondMaxProb = [homeWinProbability, drawProbability, awayWinProbability]
      .sort((a, b) => b - a)[1];
    
    // The margin between the top prediction and second place
    const margin = maxProb - secondMaxProb;
    
    // Base confidence on the margin:
    // - Small margin (5-10%): Low confidence (50-60%)
    // - Medium margin (10-20%): Medium confidence (60-75%)
    // - Large margin (20-30%): High confidence (75-85%)
    // - Very large margin (30%+): Very high confidence (85-95%)
    let confidence = 45 + (margin * 1.5);
    
    // Boost confidence if multiple factors align
    const positiveFactors = factors.filter(f => f.impact === 'positive').length;
    const negativeFactors = factors.filter(f => f.impact === 'negative').length;
    const factorAlignment = Math.abs(positiveFactors - negativeFactors);
    
    // Add up to 10% for strong factor alignment
    if (factorAlignment >= 3) {
      confidence += 10;
    } else if (factorAlignment >= 2) {
      confidence += 5;
    }
    
    // Significantly reduce confidence after winter break
    if (afterWinterBreak) {
      // Reduce confidence by 20-30% depending on break length
      const confidenceReduction = Math.min(30, 15 + (winterBreakMonths * 5));
      confidence -= confidenceReduction;
    }
    
    // Cap between 35% and 95% (lower minimum after winter break)
    const minConfidence = afterWinterBreak ? 35 : 50;
    confidence = Math.min(Math.max(Math.round(confidence), minConfidence), 95);

    return {
      matchId,
      homeWinProbability: Math.round(homeWinProbability * 10) / 10,
      drawProbability: Math.round(drawProbability * 10) / 10,
      awayWinProbability: Math.round(awayWinProbability * 10) / 10,
      predictedScore: {
        home: predictedHomeGoals,
        away: predictedAwayGoals
      },
      confidence: Math.round(confidence),
      factors
    };
  }

  private static calculateFormScore(form: string[]): number {
    let score = 0;
    form.forEach((result, index) => {
      const weight = form.length - index; // Recent results have more weight
      if (result === 'W') score += 3 * weight;
      else if (result === 'D') score += 1 * weight;
    });
    return score;
  }

  private static calculateWinRate(team: Team): number {
    const totalGames = team.stats.wins + team.stats.draws + team.stats.losses;
    return totalGames > 0 ? team.stats.wins / totalGames : 0;
  }
}
