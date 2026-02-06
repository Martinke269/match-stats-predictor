import { PredictionEngine } from './prediction-engine';
import { primeiraLigaTeams } from './data/leagues/primeira-liga';
import { Prediction } from './types';

// Generate predictions for Primeira Liga matches - Kampdag 21 af 34
export function generatePrimeiraLigaPredictions(): {
  match: string;
  prediction: Prediction;
}[] {
  const matches = [
    {
      id: 'estrela-santaclara',
      home: 'estrela da amadora',
      away: 'santa clara',
      matchName: 'Estrela da Amadora vs Santa Clara'
    },
    {
      id: 'moreirense-gilvicente',
      home: 'moreirense',
      away: 'gil vicente',
      matchName: 'Moreirense vs Gil Vicente'
    },
    {
      id: 'estoril-tondela',
      home: 'estoril',
      away: 'tondela',
      matchName: 'Estoril vs Tondela'
    },
    {
      id: 'arouca-guimaraes',
      home: 'arouca',
      away: 'guimaraes',
      matchName: 'Arouca vs Guimaraes'
    },
    {
      id: 'nacional-casapia',
      home: 'nacional',
      away: 'casa pia',
      matchName: 'Nacional vs Casa Pia'
    },
    {
      id: 'braga-rioave',
      home: 'braga',
      away: 'rio ave',
      matchName: 'Braga vs Rio Ave'
    },
    {
      id: 'benfica-alverca',
      home: 'benfica',
      away: 'alverca',
      matchName: 'Benfica vs Alverca'
    },
    {
      id: 'famalicao-avs',
      home: 'famalicao',
      away: 'avs',
      matchName: 'Famalicao vs AVS'
    },
    {
      id: 'porto-sporting',
      home: 'porto',
      away: 'sporting',
      matchName: 'Porto vs Sporting'
    }
  ];

  return matches.map(match => {
    const homeTeam = primeiraLigaTeams[match.home];
    const awayTeam = primeiraLigaTeams[match.away];
    
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
export function formatPrimeiraLigaPredictions(): string {
  const predictions = generatePrimeiraLigaPredictions();
  
  let output = '🔮 PRIMEIRA LIGA PREDICTIONS\n';
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
