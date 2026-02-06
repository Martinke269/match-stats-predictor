import { PredictionEngine } from './prediction-engine';
import { bundesligaTeams } from './data/leagues/bundesliga';
import { Prediction } from './types';

// Generate predictions for Bundesliga matches from the user's image - Kampdag 21 af 34
export function generateBundesligaPredictions(): {
  match: string;
  prediction: Prediction;
}[] {
  const matches = [
    {
      id: 'union-frankfurt',
      home: 'union berlin',
      away: 'eintracht frankfurt',
      matchName: 'Union Berlin vs Eintracht Frankfurt'
    },
    {
      id: 'heidenheim-hsv',
      home: 'heidenheim',
      away: 'hamburger sv',
      matchName: 'Heidenheim vs Hamburger SV'
    },
    {
      id: 'wolfsburg-dortmund',
      home: 'wolfsburg',
      away: 'borussia dortmund',
      matchName: 'Wolfsburg vs Dortmund'
    },
    {
      id: 'stpauli-stuttgart',
      home: 'st pauli',
      away: 'vfb stuttgart',
      matchName: 'St. Pauli vs Stuttgart'
    },
    {
      id: 'mainz-augsburg',
      home: 'mainz',
      away: 'augsburg',
      matchName: 'Mainz 05 vs Augsburg'
    },
    {
      id: 'freiburg-bremen',
      home: 'freiburg',
      away: 'werder bremen',
      matchName: 'Freiburg vs Werder Bremen'
    },
    {
      id: 'gladbach-leverkusen',
      home: 'borussia monchengladbach',
      away: 'bayer leverkusen',
      matchName: 'Mönchengladbach vs Leverkusen'
    },
    {
      id: 'koln-leipzig',
      home: 'fc koln',
      away: 'rb leipzig',
      matchName: '1. FC Köln vs RB Leipzig'
    },
    {
      id: 'bayern-hoffenheim',
      home: 'bayern munich',
      away: 'hoffenheim',
      matchName: 'Bayern vs Hoffenheim'
    }
  ];

  return matches.map(match => {
    const homeTeam = bundesligaTeams[match.home];
    const awayTeam = bundesligaTeams[match.away];
    
    const prediction = PredictionEngine.predictMatchSync(homeTeam, awayTeam, match.id);
    
    return {
      match: match.matchName,
      prediction
    };
  });
}

// Format predictions for display
export function formatBundesligaPredictions(): string {
  const predictions = generateBundesligaPredictions();
  
  let output = '🔮 BUNDESLIGA PREDICTIONS\n';
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
