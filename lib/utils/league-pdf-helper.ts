import { Match } from '@/lib/types';
import { exportPredictionsToPDF } from './pdf-export';

interface PredictionData {
  match: string;
  prediction: any;
}

export function exportLeaguePredictionsToPDF(
  predictions: PredictionData[],
  leagueName: string,
  roundInfo: string
) {
  const predictionsWithMatches = predictions.map(({ match, prediction }) => {
    const [homeTeamName, awayTeamName] = match.split(' vs ');
    
    const matchObj: Match = {
      id: `${leagueName.toLowerCase().replace(/\s+/g, '-')}-${homeTeamName}-${awayTeamName}`,
      homeTeam: {
        id: `team-${homeTeamName}`,
        name: homeTeamName,
        form: ['W', 'W', 'D', 'W', 'L'],
        stats: {
          wins: 0,
          draws: 0,
          losses: 0,
          goalsScored: 0,
          goalsConceded: 0,
          cleanSheets: 0,
          possession: 50,
          shotsOnTarget: 0,
          passAccuracy: 80
        }
      },
      awayTeam: {
        id: `team-${awayTeamName}`,
        name: awayTeamName,
        form: ['W', 'D', 'L', 'W', 'D'],
        stats: {
          wins: 0,
          draws: 0,
          losses: 0,
          goalsScored: 0,
          goalsConceded: 0,
          cleanSheets: 0,
          possession: 50,
          shotsOnTarget: 0,
          passAccuracy: 80
        }
      },
      date: new Date(),
      league: leagueName,
      status: 'upcoming'
    };

    return {
      match: matchObj,
      prediction
    };
  });

  exportPredictionsToPDF(predictionsWithMatches, `${leagueName} Predictions - ${roundInfo}`);
}
