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
      id: 'leeds-nottinghamforest',
      home: 'leeds',
      away: 'nottingham forest',
      matchName: 'Leeds vs Nottingham Forest',
      date: '2026-02-06T21:00:00Z'
    },
    {
      id: 'manutd-tottenham',
      home: 'manchester united',
      away: 'tottenham',
      matchName: 'Man Utd vs Tottenham',
      date: '2026-02-07T13:30:00Z'
    },
    {
      id: 'fulham-everton',
      home: 'fulham',
      away: 'everton',
      matchName: 'Fulham vs Everton',
      date: '2026-02-07T16:00:00Z'
    },
    {
      id: 'burnley-westham',
      home: 'burnley',
      away: 'west ham',
      matchName: 'Burnley vs West Ham',
      date: '2026-02-07T16:00:00Z'
    },
    {
      id: 'arsenal-sunderland',
      home: 'arsenal',
      away: 'sunderland',
      matchName: 'Arsenal vs Sunderland',
      date: '2026-02-07T16:00:00Z'
    },
    {
      id: 'wolves-chelsea',
      home: 'wolves',
      away: 'chelsea',
      matchName: 'Wolves vs Chelsea',
      date: '2026-02-07T16:00:00Z'
    },
    {
      id: 'bournemouth-astonvilla',
      home: 'bournemouth',
      away: 'aston villa',
      matchName: 'Bournemouth vs Aston Villa',
      date: '2026-02-07T16:00:00Z'
    },
    {
      id: 'newcastle-brentford',
      home: 'newcastle',
      away: 'brentford',
      matchName: 'Newcastle vs Brentford',
      date: '2026-02-07T18:30:00Z'
    },
    {
      id: 'brighton-crystalpalace',
      home: 'brighton',
      away: 'crystal palace',
      matchName: 'Brighton vs Crystal Palace',
      date: '2026-02-08T15:00:00Z'
    },
    {
      id: 'liverpool-mancity',
      home: 'liverpool',
      away: 'manchester city',
      matchName: 'Liverpool vs Man City',
      date: '2026-02-08T17:30:00Z'
    }
  ];

  return matches.map(match => {
    const homeTeam = premierLeagueTeams[match.home];
    const awayTeam = premierLeagueTeams[match.away];
    
    const prediction = PredictionEngine.predictMatchSync(homeTeam, awayTeam, match.id);
    
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
