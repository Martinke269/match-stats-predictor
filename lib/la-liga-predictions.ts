import { PredictionEngine } from './prediction-engine';
import { laLigaTeams } from './data/leagues/la-liga';
import { Prediction } from './types';

// Generate predictions for La Liga matches from the user's image - Kampdag 23 af 38
export function generateLaLigaPredictions(): {
  match: string;
  prediction: Prediction;
}[] {
  const matches = [
    {
      id: 'celta-osasuna',
      home: 'celta vigo',
      away: 'osasuna',
      matchName: 'Celta Vigo vs Osasuna'
    },
    {
      id: 'rayo-oviedo',
      home: 'rayo vallecano',
      away: 'real oviedo',
      matchName: 'Rayo vs R. Oviedo'
    },
    {
      id: 'barcelona-mallorca',
      home: 'barcelona',
      away: 'mallorca',
      matchName: 'Barcelona vs Mallorca'
    },
    {
      id: 'sevilla-girona',
      home: 'sevilla',
      away: 'girona',
      matchName: 'Sevilla vs Girona'
    },
    {
      id: 'realsociedad-elche',
      home: 'real sociedad',
      away: 'elche',
      matchName: 'Real Sociedad vs Elche'
    },
    {
      id: 'alaves-getafe',
      home: 'alaves',
      away: 'getafe',
      matchName: 'Alaves vs Getafe'
    },
    {
      id: 'athletic-levante',
      home: 'athletic bilbao',
      away: 'levante',
      matchName: 'Athletic Bilbao vs Levante'
    },
    {
      id: 'atletico-betis',
      home: 'atletico madrid',
      away: 'real betis',
      matchName: 'Atlético Madrid vs Betis'
    },
    {
      id: 'valencia-realmadrid',
      home: 'valencia',
      away: 'real madrid',
      matchName: 'Valencia vs Real Madrid'
    },
    {
      id: 'villarreal-espanyol',
      home: 'villarreal',
      away: 'espanyol',
      matchName: 'Villarreal vs Espanyol'
    }
  ];

  return matches.map(match => {
    const homeTeam = laLigaTeams[match.home];
    const awayTeam = laLigaTeams[match.away];
    
    if (!homeTeam || !awayTeam) {
      throw new Error(`Missing team data for ${match.matchName}`);
    }
    
    const prediction = PredictionEngine.predictMatch(homeTeam, awayTeam, match.id);
    
    return {
      match: match.matchName,
      prediction
    };
  });
}

// Format predictions for display
export function formatLaLigaPredictions(): string {
  const predictions = generateLaLigaPredictions();
  
  let output = '🔮 LA LIGA PREDICTIONS\n';
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
