import { PredictionEngine } from './prediction-engine';
import { premierLeagueTeams } from './data/leagues/premier-league';
import { Prediction } from './types';

// Generate predictions for Premier League matches from the user's image
export function generatePremierLeaguePredictions(): {
  match: string;
  prediction: Prediction;
}[] {
  const matches = [
    {
      id: 'leicester-nottingham',
      home: 'leicester',
      away: 'nottingham forest',
      matchName: 'Leicester vs Nottingham Forest'
    },
    {
      id: 'manutd-tottenham',
      home: 'manchester united',
      away: 'tottenham',
      matchName: 'Man Utd vs Tottenham'
    },
    {
      id: 'fulham-everton',
      home: 'fulham',
      away: 'everton',
      matchName: 'Fulham vs Everton'
    },
    {
      id: 'bournemouth-westham',
      home: 'bournemouth',
      away: 'west ham',
      matchName: 'Bournemouth vs West Ham'
    },
    {
      id: 'arsenal-southampton',
      home: 'arsenal',
      away: 'southampton',
      matchName: 'Arsenal vs Southampton'
    },
    {
      id: 'wolves-chelsea',
      home: 'wolves',
      away: 'chelsea',
      matchName: 'Wolves vs Chelsea'
    },
    {
      id: 'ipswich-astonvilla',
      home: 'ipswich',
      away: 'aston villa',
      matchName: 'Ipswich vs Aston Villa'
    },
    {
      id: 'newcastle-brentford',
      home: 'newcastle',
      away: 'brentford',
      matchName: 'Newcastle vs Brentford'
    },
    {
      id: 'brighton-crystalpalace',
      home: 'brighton',
      away: 'crystal palace',
      matchName: 'Brighton vs Crystal Palace'
    },
    {
      id: 'liverpool-mancity',
      home: 'liverpool',
      away: 'manchester city',
      matchName: 'Liverpool vs Man City'
    }
  ];

  return matches.map(match => {
    const homeTeam = premierLeagueTeams[match.home];
    const awayTeam = premierLeagueTeams[match.away];
    
    const prediction = PredictionEngine.predictMatch(homeTeam, awayTeam, match.id);
    
    return {
      match: match.matchName,
      prediction
    };
  });
}

// Format predictions for display
export function formatPremierLeaguePredictions(): string {
  const predictions = generatePremierLeaguePredictions();
  
  let output = '🔮 PREMIER LEAGUE PREDICTIONS\n';
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
