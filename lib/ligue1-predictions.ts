import { PredictionEngine } from './prediction-engine';
import { ligue1Teams } from './data/leagues/ligue-1';
import { Prediction } from './types';

// Generate predictions for Ligue 1 matches from the user's image
export function generateLigue1Predictions(): {
  match: string;
  prediction: Prediction;
}[] {
  const matches = [
    {
      id: 'metz-lille',
      home: 'metz',
      away: 'lille',
      matchName: 'Metz vs Lille'
    },
    {
      id: 'lens-rennes',
      home: 'lens',
      away: 'rennes',
      matchName: 'Lens vs Rennes'
    },
    {
      id: 'brest-lorient',
      home: 'brest',
      away: 'lorient',
      matchName: 'Brest vs Lorient'
    },
    {
      id: 'nantes-lyon',
      home: 'nantes',
      away: 'lyon',
      matchName: 'Nantes vs Lyon'
    },
    {
      id: 'nice-monaco',
      home: 'nice',
      away: 'monaco',
      matchName: 'Nice vs Monaco'
    },
    {
      id: 'auxerre-paris-fc',
      home: 'auxerre',
      away: 'paris fc',
      matchName: 'Auxerre vs Paris FC'
    },
    {
      id: 'le-havre-strasbourg',
      home: 'le havre',
      away: 'strasbourg',
      matchName: 'Le Havre vs Strasbourg'
    },
    {
      id: 'angers-toulouse',
      home: 'angers',
      away: 'toulouse',
      matchName: 'Angers vs Toulouse'
    },
    {
      id: 'psg-marseille',
      home: 'psg',
      away: 'marseille',
      matchName: 'PSG vs Marseille'
    }
  ];

  return matches.map(match => {
    const homeTeam = ligue1Teams[match.home];
    const awayTeam = ligue1Teams[match.away];
    
    const prediction = PredictionEngine.predictMatchSync(homeTeam, awayTeam, match.id);
    
    return {
      match: match.matchName,
      prediction
    };
  });
}

// Format predictions for display
export function formatLigue1Predictions(): string {
  const predictions = generateLigue1Predictions();
  
  let output = '🔮 LIGUE 1 PREDICTIONS\n';
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
