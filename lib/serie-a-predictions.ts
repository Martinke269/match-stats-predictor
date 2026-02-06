import { Match } from './types';
import { PredictionEngine } from './prediction-engine';
import { serieATeams } from './data/leagues/serie-a';

export const serieAMatches: Match[] = [
  {
    id: 'sa-24-1',
    homeTeam: serieATeams['verona'],
    awayTeam: serieATeams['pisa'],
    date: new Date('2025-02-06T20:45:00'),
    league: 'Serie A',
    status: 'upcoming'
  },
  {
    id: 'sa-24-2',
    homeTeam: serieATeams['genoa'],
    awayTeam: serieATeams['napoli'],
    date: new Date('2025-02-07T18:00:00'),
    league: 'Serie A',
    status: 'upcoming'
  },
  {
    id: 'sa-24-3',
    homeTeam: serieATeams['fiorentina'],
    awayTeam: serieATeams['torino'],
    date: new Date('2025-02-07T20:45:00'),
    league: 'Serie A',
    status: 'upcoming'
  },
  {
    id: 'sa-24-4',
    homeTeam: serieATeams['bologna'],
    awayTeam: serieATeams['parma'],
    date: new Date('2025-02-08T12:30:00'),
    league: 'Serie A',
    status: 'upcoming'
  },
  {
    id: 'sa-24-5',
    homeTeam: serieATeams['lecce'],
    awayTeam: serieATeams['udinese'],
    date: new Date('2025-02-08T15:00:00'),
    league: 'Serie A',
    status: 'upcoming'
  },
  {
    id: 'sa-24-6',
    homeTeam: serieATeams['sassuolo'],
    awayTeam: serieATeams['inter'],
    date: new Date('2025-02-08T18:00:00'),
    league: 'Serie A',
    status: 'upcoming'
  },
  {
    id: 'sa-24-7',
    homeTeam: serieATeams['juventus'],
    awayTeam: serieATeams['lazio'],
    date: new Date('2025-02-08T20:45:00'),
    league: 'Serie A',
    status: 'upcoming'
  },
  {
    id: 'sa-24-8',
    homeTeam: serieATeams['atalanta'],
    awayTeam: serieATeams['cremonese'],
    date: new Date('2025-02-09T18:30:00'),
    league: 'Serie A',
    status: 'upcoming'
  },
  {
    id: 'sa-24-9',
    homeTeam: serieATeams['roma'],
    awayTeam: serieATeams['cagliari'],
    date: new Date('2025-02-09T20:45:00'),
    league: 'Serie A',
    status: 'upcoming'
  }
];

// Generate predictions for all matches
export const serieAPredictions = serieAMatches.map(match => ({
  match,
  prediction: PredictionEngine.predictMatchSync(match.homeTeam, match.awayTeam, match.id)
}));
