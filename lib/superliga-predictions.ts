import { PredictionEngine } from './prediction-engine';
import { superligaenTeams } from './data/leagues/superligaen';
import { Prediction } from './types';

// Generate predictions for the Danish Superliga matches
export function generateSuperligaPredictions(): {
  match: string;
  prediction: Prediction;
}[] {
  const matches = [
    {
      id: 'agf-ob',
      home: 'agf',
      away: 'ob',
      matchName: 'AGF vs OB'
    },
    {
      id: 'fcn-sje',
      home: 'fc nordsjælland',
      away: 'sønderjyske fodbold',
      matchName: 'FC Nordsjælland vs SønderjyskE'
    },
    {
      id: 'sif-vff',
      home: 'silkeborg if',
      away: 'viborg ff',
      matchName: 'Silkeborg IF vs Viborg FF'
    },
    {
      id: 'fcm-fck',
      home: 'fc midtjylland',
      away: 'fc københavn',
      matchName: 'FC Midtjylland vs FC København'
    },
    {
      id: 'bif-rfc',
      home: 'brøndby if',
      away: 'randers fc',
      matchName: 'Brøndby IF vs Randers FC'
    },
    {
      id: 'vbk-fcf',
      home: 'vejle boldklub',
      away: 'fc fredericia',
      matchName: 'Vejle BK vs FC Fredericia'
    }
  ];

  return matches.map(match => {
    const homeTeam = superligaenTeams[match.home];
    const awayTeam = superligaenTeams[match.away];
    
    // Superligaen has winter break from mid-December to late February
    // Current date is in February, so we're right after the winter break
    const prediction = PredictionEngine.predictMatch(homeTeam, awayTeam, match.id, {
      afterWinterBreak: true,
      winterBreakMonths: 2 // Approximately 2 months break
    });
    
    return {
      match: match.matchName,
      prediction
    };
  });
}

// Format predictions for display
export function formatPredictions(): string {
  const predictions = generateSuperligaPredictions();
  
  let output = '🔮 SUPERLIGAEN PREDICTIONS\n';
  output += '═══════════════════════════════════════\n\n';
  
  predictions.forEach(({ match, prediction }) => {
    output += `⚽ ${match}\n`;
    output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    output += `📊 Forudsagt resultat: ${prediction.predictedScore.home}-${prediction.predictedScore.away}\n`;
    output += `📈 Sandsynligheder:\n`;
    output += `   Hjemmesejr: ${prediction.homeWinProbability}%\n`;
    output += `   Uafgjort: ${prediction.drawProbability}%\n`;
    output += `   Udesejr: ${prediction.awayWinProbability}%\n`;
    output += `🎯 Tillid: ${prediction.confidence}%\n`;
    
    if (prediction.factors.length > 0) {
      output += `\n💡 Nøglefaktorer:\n`;
      prediction.factors.forEach(factor => {
        const icon = factor.impact === 'positive' ? '✅' : '⚠️';
        output += `   ${icon} ${factor.description}\n`;
      });
    }
    
    output += `\n`;
  });
  
  return output;
}
