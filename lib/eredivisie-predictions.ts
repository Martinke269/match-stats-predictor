import { PredictionEngine } from './prediction-engine';
import { eredivisieTeams } from './data/leagues/eredivisie';
import { Prediction } from './types';

// Generate predictions for Eredivisie matches - Kampdag 22 af 34
export function generateEredivisiePredictions(): {
  match: string;
  prediction: Prediction;
}[] {
  const matches = [
    {
      id: 'breda-excelsior',
      home: 'breda',
      away: 'excelsior',
      matchName: 'Breda vs Excelsior'
    },
    {
      id: 'zwolle-volendam',
      home: 'zwolle',
      away: 'volendam',
      matchName: 'Zwolle vs Volendam'
    },
    {
      id: 'nec-heracles',
      home: 'nec',
      away: 'heracles',
      matchName: 'NEC vs Heracles'
    },
    {
      id: 'twente-heerenveen',
      home: 'twente',
      away: 'heerenveen',
      matchName: 'Twente vs Heerenveen'
    },
    {
      id: 'sittard-sparta rotterdam',
      home: 'sittard',
      away: 'sparta rotterdam',
      matchName: 'Sittard vs Sparta Rotterdam'
    },
    {
      id: 'utrecht-feyenoord',
      home: 'utrecht',
      away: 'feyenoord',
      matchName: 'Utrecht vs Feyenoord'
    },
    {
      id: 'go ahead eagles-telstar',
      home: 'go ahead eagles',
      away: 'telstar',
      matchName: 'Go Ahead Eagles vs Telstar'
    },
    {
      id: 'az-ajax',
      home: 'az',
      away: 'ajax',
      matchName: 'AZ vs Ajax'
    },
    {
      id: 'groningen-psv',
      home: 'groningen',
      away: 'psv',
      matchName: 'Groningen vs PSV'
    }
  ];

  return matches.map(match => {
    const homeTeam = eredivisieTeams[match.home];
    const awayTeam = eredivisieTeams[match.away];
    
    if (!homeTeam || !awayTeam) {
      throw new Error(`Missing team data for ${match.matchName}`);
    }
    
    const prediction = PredictionEngine.predictMatchSync(homeTeam, awayTeam, match.id);
    
    return {
      match: match.matchName,
      prediction
    };
  });
}

// Format predictions for display
export function formatEredivisiePredictions(): string {
  const predictions = generateEredivisiePredictions();
  
  let output = '🔮 EREDIVISIE PREDICTIONS\n';
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
