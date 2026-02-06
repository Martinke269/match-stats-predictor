import { Team, PredictionFactor } from '../types';
import { HeadToHeadStats } from '../api/football-api';
import {
  calculateFormScore,
  calculateWinRate,
  calculateGoalDifference,
  calculateDefensiveStrength,
  calculateTeamQuality
} from './calculators';

export interface FixtureCongestion {
  europeanCompetition?: boolean;
  cupMatches?: number;
}

export interface FactorAnalysisResult {
  factors: PredictionFactor[];
  homeFormScore: number;
  awayFormScore: number;
  homeGoalDiff: number;
  awayGoalDiff: number;
  homeQuality: number;
  awayQuality: number;
  h2hBonus: number;
  upsetBonus: number;
  isHomeUnderdog: boolean;
  homeFixtureLoad: number;
  awayFixtureLoad: number;
}

export interface FactorOptions {
  afterWinterBreak?: boolean;
  winterBreakMonths?: number;
  homeFixtureCongestion?: FixtureCongestion;
  awayFixtureCongestion?: FixtureCongestion;
  enableUpsetFactor?: boolean;
  upsetFactorStrength?: number;
  headToHead?: HeadToHeadStats | null;
}

/**
 * Analyze all factors that influence match prediction
 */
export function analyzeFactors(
  homeTeam: Team,
  awayTeam: Team,
  options: FactorOptions = {}
): FactorAnalysisResult {
  const factors: PredictionFactor[] = [];
  const {
    afterWinterBreak = false,
    winterBreakMonths = 2,
    homeFixtureCongestion,
    awayFixtureCongestion,
    enableUpsetFactor = true,
    upsetFactorStrength = 0.3,
    headToHead
  } = options;

  // Winter break warning
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
      homeFixtureLoad += 2;
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
        impact: 'positive',
        weight: 0.2,
        description: `${awayTeam.name} spiller i Europa League - risiko for træthed og rotation`
      });
    }
    if (awayFixtureCongestion.cupMatches && awayFixtureCongestion.cupMatches > 0) {
      awayFixtureLoad += awayFixtureCongestion.cupMatches;
      factors.push({
        name: 'Pokalkampe',
        impact: 'positive',
        weight: 0.15,
        description: `${awayTeam.name} har ${awayFixtureCongestion.cupMatches} pokalkamp${awayFixtureCongestion.cupMatches > 1 ? 'e' : ''} denne måned`
      });
    }
  }

  // Calculate form scores
  const formReliability = afterWinterBreak ? 0.4 : 1.0;
  const homeFormScore = calculateFormScore(homeTeam.form) * formReliability;
  const awayFormScore = calculateFormScore(awayTeam.form) * formReliability;

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

  // Calculate goal differences
  const homeGoalDiff = calculateGoalDifference(homeTeam);
  const awayGoalDiff = calculateGoalDifference(awayTeam);

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

  // Head-to-head analysis
  let h2hBonus = 0;
  if (headToHead && headToHead.totalMatches >= 3) {
    const h2hWinRate = headToHead.homeTeamWins / headToHead.totalMatches;
    const h2hAwayWinRate = headToHead.awayTeamWins / headToHead.totalMatches;

    if (h2hWinRate >= 0.6) {
      h2hBonus = 10;
      factors.push({
        name: 'Indbyrdes kampe',
        impact: 'positive',
        weight: 0.2,
        description: `${homeTeam.name} har vundet ${headToHead.homeTeamWins} af ${headToHead.totalMatches} seneste indbyrdes kampe (${Math.round(h2hWinRate * 100)}%)`
      });
    } else if (h2hAwayWinRate >= 0.6) {
      h2hBonus = -10;
      factors.push({
        name: 'Indbyrdes kampe',
        impact: 'negative',
        weight: 0.2,
        description: `${awayTeam.name} har vundet ${headToHead.awayTeamWins} af ${headToHead.totalMatches} seneste indbyrdes kampe (${Math.round(h2hAwayWinRate * 100)}%)`
      });
    } else if (Math.abs(h2hWinRate - h2hAwayWinRate) >= 0.3) {
      if (h2hWinRate > h2hAwayWinRate) {
        h2hBonus = 5;
        factors.push({
          name: 'Indbyrdes kampe',
          impact: 'positive',
          weight: 0.15,
          description: `${homeTeam.name} har fordel i indbyrdes opgør (${headToHead.homeTeamWins}-${headToHead.draws}-${headToHead.awayTeamWins})`
        });
      } else {
        h2hBonus = -5;
        factors.push({
          name: 'Indbyrdes kampe',
          impact: 'negative',
          weight: 0.15,
          description: `${awayTeam.name} har fordel i indbyrdes opgør (${headToHead.awayTeamWins}-${headToHead.draws}-${headToHead.homeTeamWins})`
        });
      }
    }

    if (headToHead.isDerby) {
      factors.push({
        name: 'Derby/Lokalopgør',
        impact: 'neutral',
        weight: 0.15,
        description: `⚡ Lokalderby - historik og rivalitet kan ændre alt! Forventede resultater gælder ofte ikke`
      });
    }

    if (headToHead.lastMatches.length >= 3) {
      const recentH2H = headToHead.lastMatches.slice(0, 3);
      const recentHomeWins = recentH2H.filter(m =>
        (m.homeTeam === homeTeam.name && m.winner === 'home') ||
        (m.awayTeam === homeTeam.name && m.winner === 'away')
      ).length;

      if (recentHomeWins >= 2) {
        factors.push({
          name: 'Seneste indbyrdes form',
          impact: 'positive',
          weight: 0.1,
          description: `${homeTeam.name} har vundet ${recentHomeWins} af de seneste 3 indbyrdes kampe`
        });
      }
    }
  }

  // Home advantage
  factors.push({
    name: 'Hjemmebane',
    impact: 'positive',
    weight: 0.15,
    description: `${homeTeam.name} spiller hjemme`
  });

  // Win rate
  const homeWinRate = calculateWinRate(homeTeam);
  if (homeWinRate > 0.6) {
    factors.push({
      name: 'Sejrsrate',
      impact: 'positive',
      weight: 0.1,
      description: `${homeTeam.name} har ${(homeWinRate * 100).toFixed(0)}% sejrsrate`
    });
  }

  // Defensive strength
  const homeDefense = calculateDefensiveStrength(homeTeam);
  if (homeDefense > 0.4) {
    factors.push({
      name: 'Defensiv styrke',
      impact: 'positive',
      weight: 0.1,
      description: `${homeTeam.name} har holdt ${homeTeam.stats.cleanSheets} clean sheets`
    });
  }

  // Team quality analysis
  const homeQuality = calculateTeamQuality(homeTeam);
  const awayQuality = calculateTeamQuality(awayTeam);
  const qualityGap = Math.abs(homeQuality - awayQuality);

  // Upset factor
  let upsetBonus = 0;
  let isHomeUnderdog = false;

  if (enableUpsetFactor && qualityGap >= 15) {
    isHomeUnderdog = homeQuality < awayQuality;
    const underdogTeam = isHomeUnderdog ? homeTeam : awayTeam;

    const underdogFormScore = calculateFormScore(underdogTeam.form);
    const maxFormScore = 15 * 5;
    const underdogFormStrength = underdogFormScore / maxFormScore;

    const gapFactor = Math.min(qualityGap / 50, 1);
    const formFactor = underdogFormStrength * 0.5;
    const randomFactor = Math.random() * 0.3;
    const upsetPotential = (gapFactor * 0.6) + formFactor + randomFactor;

    upsetBonus = upsetPotential * 15 * upsetFactorStrength;

    if (upsetBonus >= 3) {
      const upsetPercentage = Math.round(upsetPotential * 100);
      factors.push({
        name: 'Overraskelsesfaktor',
        impact: isHomeUnderdog ? 'positive' : 'negative',
        weight: 0.15,
        description: `⚡ ${underdogTeam.name} har ${upsetPercentage}% "underdog-potentiale" - kan overraske!`
      });
    }
  }

  // Quality gap factors
  if (qualityGap >= 50) {
    factors.push({
      name: 'Enorm kvalitetsforskel',
      impact: homeQuality > awayQuality ? 'positive' : 'negative',
      weight: 0.3,
      description: `${homeQuality > awayQuality ? homeTeam.name : awayTeam.name} er et langt bedre hold (kvalitetsscore: ${Math.round(homeQuality)} vs ${Math.round(awayQuality)})`
    });
  } else if (qualityGap >= 40) {
    factors.push({
      name: 'Stor kvalitetsforskel',
      impact: homeQuality > awayQuality ? 'positive' : 'negative',
      weight: 0.25,
      description: `${homeQuality > awayQuality ? homeTeam.name : awayTeam.name} er et markant bedre hold (kvalitetsscore: ${Math.round(homeQuality)} vs ${Math.round(awayQuality)})`
    });
  } else if (qualityGap >= 30) {
    factors.push({
      name: 'Betydelig kvalitetsforskel',
      impact: homeQuality > awayQuality ? 'positive' : 'negative',
      weight: 0.2,
      description: `${homeQuality > awayQuality ? homeTeam.name : awayTeam.name} er et bedre hold (kvalitetsscore: ${Math.round(homeQuality)} vs ${Math.round(awayQuality)})`
    });
  }

  return {
    factors,
    homeFormScore,
    awayFormScore,
    homeGoalDiff,
    awayGoalDiff,
    homeQuality,
    awayQuality,
    h2hBonus,
    upsetBonus,
    isHomeUnderdog,
    homeFixtureLoad,
    awayFixtureLoad
  };
}
