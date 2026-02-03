import { Match, Team } from './types';

// Superligaen Teams
export const superligaenTeams: Record<string, Team> = {
  'fc-copenhagen': {
    id: 'fc-copenhagen',
    name: 'FC København',
    form: ['W', 'W', 'D', 'W', 'W'],
    stats: {
      goalsScored: 42,
      goalsConceded: 18,
      wins: 12,
      draws: 4,
      losses: 2,
      cleanSheets: 8,
      possession: 58,
      shotsOnTarget: 124,
      passAccuracy: 84
    }
  },
  'brondby': {
    id: 'brondby',
    name: 'Brøndby IF',
    form: ['W', 'L', 'W', 'D', 'W'],
    stats: {
      goalsScored: 35,
      goalsConceded: 22,
      wins: 10,
      draws: 5,
      losses: 3,
      cleanSheets: 6,
      possession: 54,
      shotsOnTarget: 98,
      passAccuracy: 81
    }
  },
  'fc-midtjylland': {
    id: 'fc-midtjylland',
    name: 'FC Midtjylland',
    form: ['W', 'W', 'W', 'D', 'W'],
    stats: {
      goalsScored: 45,
      goalsConceded: 20,
      wins: 13,
      draws: 3,
      losses: 2,
      cleanSheets: 9,
      possession: 60,
      shotsOnTarget: 132,
      passAccuracy: 86
    }
  },
  'aab': {
    id: 'aab',
    name: 'AaB',
    form: ['L', 'D', 'L', 'W', 'D'],
    stats: {
      goalsScored: 24,
      goalsConceded: 28,
      wins: 6,
      draws: 6,
      losses: 6,
      cleanSheets: 4,
      possession: 48,
      shotsOnTarget: 76,
      passAccuracy: 77
    }
  },
  'silkeborg': {
    id: 'silkeborg',
    name: 'Silkeborg IF',
    form: ['W', 'D', 'W', 'L', 'D'],
    stats: {
      goalsScored: 30,
      goalsConceded: 26,
      wins: 8,
      draws: 6,
      losses: 4,
      cleanSheets: 5,
      possession: 51,
      shotsOnTarget: 88,
      passAccuracy: 79
    }
  },
  'nordsjaelland': {
    id: 'nordsjaelland',
    name: 'FC Nordsjælland',
    form: ['W', 'W', 'L', 'W', 'D'],
    stats: {
      goalsScored: 38,
      goalsConceded: 24,
      wins: 11,
      draws: 4,
      losses: 3,
      cleanSheets: 7,
      possession: 56,
      shotsOnTarget: 110,
      passAccuracy: 82
    }
  },
  'randers': {
    id: 'randers',
    name: 'Randers FC',
    form: ['L', 'D', 'W', 'L', 'D'],
    stats: {
      goalsScored: 22,
      goalsConceded: 32,
      wins: 5,
      draws: 7,
      losses: 6,
      cleanSheets: 3,
      possession: 47,
      shotsOnTarget: 72,
      passAccuracy: 76
    }
  },
  'viborg': {
    id: 'viborg',
    name: 'Viborg FF',
    form: ['L', 'L', 'D', 'L', 'W'],
    stats: {
      goalsScored: 20,
      goalsConceded: 35,
      wins: 4,
      draws: 6,
      losses: 8,
      cleanSheets: 2,
      possession: 45,
      shotsOnTarget: 68,
      passAccuracy: 74
    }
  }
};

// Premier League Teams
export const premierLeagueTeams: Record<string, Team> = {
  'liverpool': {
    id: 'liverpool',
    name: 'Liverpool',
    form: ['W', 'W', 'W', 'W', 'D'],
    stats: {
      goalsScored: 58,
      goalsConceded: 22,
      wins: 18,
      draws: 4,
      losses: 2,
      cleanSheets: 12,
      possession: 62,
      shotsOnTarget: 156,
      passAccuracy: 87
    }
  },
  'man-city': {
    id: 'man-city',
    name: 'Manchester City',
    form: ['W', 'W', 'D', 'W', 'W'],
    stats: {
      goalsScored: 55,
      goalsConceded: 24,
      wins: 17,
      draws: 5,
      losses: 2,
      cleanSheets: 11,
      possession: 65,
      shotsOnTarget: 148,
      passAccuracy: 89
    }
  },
  'arsenal': {
    id: 'arsenal',
    name: 'Arsenal',
    form: ['W', 'D', 'W', 'W', 'W'],
    stats: {
      goalsScored: 52,
      goalsConceded: 26,
      wins: 16,
      draws: 5,
      losses: 3,
      cleanSheets: 10,
      possession: 60,
      shotsOnTarget: 142,
      passAccuracy: 86
    }
  },
  'chelsea': {
    id: 'chelsea',
    name: 'Chelsea',
    form: ['W', 'L', 'W', 'D', 'W'],
    stats: {
      goalsScored: 45,
      goalsConceded: 32,
      wins: 13,
      draws: 6,
      losses: 5,
      cleanSheets: 8,
      possession: 58,
      shotsOnTarget: 128,
      passAccuracy: 84
    }
  },
  'man-united': {
    id: 'man-united',
    name: 'Manchester United',
    form: ['D', 'W', 'L', 'W', 'D'],
    stats: {
      goalsScored: 38,
      goalsConceded: 35,
      wins: 11,
      draws: 7,
      losses: 6,
      cleanSheets: 6,
      possession: 55,
      shotsOnTarget: 115,
      passAccuracy: 82
    }
  },
  'tottenham': {
    id: 'tottenham',
    name: 'Tottenham',
    form: ['W', 'W', 'L', 'D', 'W'],
    stats: {
      goalsScored: 48,
      goalsConceded: 38,
      wins: 14,
      draws: 4,
      losses: 6,
      cleanSheets: 7,
      possession: 56,
      shotsOnTarget: 132,
      passAccuracy: 83
    }
  }
};

// Ligue 1 Teams
export const ligue1Teams: Record<string, Team> = {
  'psg': {
    id: 'psg',
    name: 'Paris Saint-Germain',
    form: ['W', 'W', 'W', 'D', 'W'],
    stats: {
      goalsScored: 54,
      goalsConceded: 20,
      wins: 17,
      draws: 4,
      losses: 2,
      cleanSheets: 11,
      possession: 64,
      shotsOnTarget: 152,
      passAccuracy: 88
    }
  },
  'monaco': {
    id: 'monaco',
    name: 'AS Monaco',
    form: ['W', 'W', 'D', 'W', 'W'],
    stats: {
      goalsScored: 48,
      goalsConceded: 26,
      wins: 15,
      draws: 5,
      losses: 3,
      cleanSheets: 9,
      possession: 58,
      shotsOnTarget: 138,
      passAccuracy: 85
    }
  },
  'marseille': {
    id: 'marseille',
    name: 'Olympique Marseille',
    form: ['W', 'L', 'W', 'W', 'D'],
    stats: {
      goalsScored: 42,
      goalsConceded: 28,
      wins: 13,
      draws: 6,
      losses: 4,
      cleanSheets: 8,
      possession: 56,
      shotsOnTarget: 125,
      passAccuracy: 83
    }
  },
  'lille': {
    id: 'lille',
    name: 'LOSC Lille',
    form: ['D', 'W', 'W', 'L', 'W'],
    stats: {
      goalsScored: 38,
      goalsConceded: 30,
      wins: 12,
      draws: 6,
      losses: 5,
      cleanSheets: 7,
      possession: 54,
      shotsOnTarget: 118,
      passAccuracy: 81
    }
  }
};

// Bundesliga Teams
export const bundesligaTeams: Record<string, Team> = {
  'bayern': {
    id: 'bayern',
    name: 'Bayern München',
    form: ['W', 'W', 'W', 'W', 'D'],
    stats: {
      goalsScored: 62,
      goalsConceded: 24,
      wins: 18,
      draws: 3,
      losses: 2,
      cleanSheets: 11,
      possession: 63,
      shotsOnTarget: 165,
      passAccuracy: 88
    }
  },
  'leverkusen': {
    id: 'leverkusen',
    name: 'Bayer Leverkusen',
    form: ['W', 'W', 'D', 'W', 'W'],
    stats: {
      goalsScored: 56,
      goalsConceded: 22,
      wins: 17,
      draws: 4,
      losses: 2,
      cleanSheets: 12,
      possession: 61,
      shotsOnTarget: 148,
      passAccuracy: 86
    }
  },
  'dortmund': {
    id: 'dortmund',
    name: 'Borussia Dortmund',
    form: ['W', 'D', 'W', 'W', 'L'],
    stats: {
      goalsScored: 52,
      goalsConceded: 30,
      wins: 15,
      draws: 5,
      losses: 3,
      cleanSheets: 9,
      possession: 59,
      shotsOnTarget: 142,
      passAccuracy: 84
    }
  },
  'leipzig': {
    id: 'leipzig',
    name: 'RB Leipzig',
    form: ['W', 'W', 'L', 'D', 'W'],
    stats: {
      goalsScored: 48,
      goalsConceded: 28,
      wins: 14,
      draws: 5,
      losses: 4,
      cleanSheets: 8,
      possession: 57,
      shotsOnTarget: 135,
      passAccuracy: 83
    }
  }
};

// La Liga Teams
export const laLigaTeams: Record<string, Team> = {
  'real-madrid': {
    id: 'real-madrid',
    name: 'Real Madrid',
    form: ['W', 'W', 'W', 'D', 'W'],
    stats: {
      goalsScored: 58,
      goalsConceded: 22,
      wins: 18,
      draws: 4,
      losses: 2,
      cleanSheets: 12,
      possession: 61,
      shotsOnTarget: 158,
      passAccuracy: 87
    }
  },
  'barcelona': {
    id: 'barcelona',
    name: 'Barcelona',
    form: ['W', 'W', 'W', 'W', 'D'],
    stats: {
      goalsScored: 55,
      goalsConceded: 24,
      wins: 17,
      draws: 5,
      losses: 2,
      cleanSheets: 11,
      possession: 64,
      shotsOnTarget: 152,
      passAccuracy: 89
    }
  },
  'atletico': {
    id: 'atletico',
    name: 'Atlético Madrid',
    form: ['W', 'D', 'W', 'W', 'L'],
    stats: {
      goalsScored: 45,
      goalsConceded: 26,
      wins: 15,
      draws: 6,
      losses: 3,
      cleanSheets: 10,
      possession: 56,
      shotsOnTarget: 128,
      passAccuracy: 84
    }
  },
  'athletic': {
    id: 'athletic',
    name: 'Athletic Bilbao',
    form: ['W', 'L', 'D', 'W', 'W'],
    stats: {
      goalsScored: 38,
      goalsConceded: 30,
      wins: 12,
      draws: 7,
      losses: 5,
      cleanSheets: 7,
      possession: 53,
      shotsOnTarget: 115,
      passAccuracy: 81
    }
  }
};

// Serie A Teams
export const serieATeams: Record<string, Team> = {
  'inter': {
    id: 'inter',
    name: 'Inter Milan',
    form: ['W', 'W', 'D', 'W', 'W'],
    stats: {
      goalsScored: 54,
      goalsConceded: 20,
      wins: 18,
      draws: 4,
      losses: 2,
      cleanSheets: 13,
      possession: 60,
      shotsOnTarget: 148,
      passAccuracy: 86
    }
  },
  'napoli': {
    id: 'napoli',
    name: 'Napoli',
    form: ['W', 'W', 'W', 'L', 'W'],
    stats: {
      goalsScored: 50,
      goalsConceded: 24,
      wins: 16,
      draws: 5,
      losses: 3,
      cleanSheets: 11,
      possession: 58,
      shotsOnTarget: 142,
      passAccuracy: 85
    }
  },
  'juventus': {
    id: 'juventus',
    name: 'Juventus',
    form: ['D', 'W', 'W', 'D', 'W'],
    stats: {
      goalsScored: 42,
      goalsConceded: 22,
      wins: 14,
      draws: 7,
      losses: 3,
      cleanSheets: 10,
      possession: 57,
      shotsOnTarget: 125,
      passAccuracy: 84
    }
  },
  'milan': {
    id: 'milan',
    name: 'AC Milan',
    form: ['W', 'L', 'W', 'W', 'D'],
    stats: {
      goalsScored: 46,
      goalsConceded: 28,
      wins: 14,
      draws: 6,
      losses: 4,
      cleanSheets: 9,
      possession: 56,
      shotsOnTarget: 132,
      passAccuracy: 83
    }
  }
};

// All matches for this week (Feb 3-9, 2026)
export const allMatches: Match[] = [
  // Superligaen - Feb 7-9
  {
    id: 'sl-1',
    homeTeam: superligaenTeams['fc-copenhagen'],
    awayTeam: superligaenTeams['brondby'],
    date: new Date('2026-02-08T15:00:00'),
    league: 'Superligaen',
    status: 'upcoming'
  },
  {
    id: 'sl-2',
    homeTeam: superligaenTeams['fc-midtjylland'],
    awayTeam: superligaenTeams['nordsjaelland'],
    date: new Date('2026-02-08T17:00:00'),
    league: 'Superligaen',
    status: 'upcoming'
  },
  {
    id: 'sl-3',
    homeTeam: superligaenTeams['silkeborg'],
    awayTeam: superligaenTeams['aab'],
    date: new Date('2026-02-09T14:00:00'),
    league: 'Superligaen',
    status: 'upcoming'
  },

  // Premier League - Feb 7-9
  {
    id: 'pl-1',
    homeTeam: premierLeagueTeams['liverpool'],
    awayTeam: premierLeagueTeams['man-city'],
    date: new Date('2026-02-07T17:30:00'),
    league: 'Premier League',
    status: 'upcoming'
  },
  {
    id: 'pl-2',
    homeTeam: premierLeagueTeams['arsenal'],
    awayTeam: premierLeagueTeams['chelsea'],
    date: new Date('2026-02-08T12:30:00'),
    league: 'Premier League',
    status: 'upcoming'
  },
  {
    id: 'pl-3',
    homeTeam: premierLeagueTeams['man-united'],
    awayTeam: premierLeagueTeams['tottenham'],
    date: new Date('2026-02-08T15:00:00'),
    league: 'Premier League',
    status: 'upcoming'
  },
  {
    id: 'pl-4',
    homeTeam: premierLeagueTeams['chelsea'],
    awayTeam: premierLeagueTeams['liverpool'],
    date: new Date('2026-02-09T16:30:00'),
    league: 'Premier League',
    status: 'upcoming'
  },

  // Ligue 1 - Feb 7-9
  {
    id: 'l1-1',
    homeTeam: ligue1Teams['psg'],
    awayTeam: ligue1Teams['monaco'],
    date: new Date('2026-02-07T20:45:00'),
    league: 'Ligue 1',
    status: 'upcoming'
  },
  {
    id: 'l1-2',
    homeTeam: ligue1Teams['marseille'],
    awayTeam: ligue1Teams['lille'],
    date: new Date('2026-02-08T17:00:00'),
    league: 'Ligue 1',
    status: 'upcoming'
  },
  {
    id: 'l1-3',
    homeTeam: ligue1Teams['monaco'],
    awayTeam: ligue1Teams['marseille'],
    date: new Date('2026-02-09T20:45:00'),
    league: 'Ligue 1',
    status: 'upcoming'
  },

  // Bundesliga - Feb 7-9
  {
    id: 'bl-1',
    homeTeam: bundesligaTeams['bayern'],
    awayTeam: bundesligaTeams['leverkusen'],
    date: new Date('2026-02-07T18:30:00'),
    league: 'Bundesliga',
    status: 'upcoming'
  },
  {
    id: 'bl-2',
    homeTeam: bundesligaTeams['dortmund'],
    awayTeam: bundesligaTeams['leipzig'],
    date: new Date('2026-02-08T15:30:00'),
    league: 'Bundesliga',
    status: 'upcoming'
  },
  {
    id: 'bl-3',
    homeTeam: bundesligaTeams['leverkusen'],
    awayTeam: bundesligaTeams['dortmund'],
    date: new Date('2026-02-09T17:30:00'),
    league: 'Bundesliga',
    status: 'upcoming'
  },

  // La Liga - Feb 7-9
  {
    id: 'll-1',
    homeTeam: laLigaTeams['real-madrid'],
    awayTeam: laLigaTeams['barcelona'],
    date: new Date('2026-02-07T21:00:00'),
    league: 'La Liga',
    status: 'upcoming'
  },
  {
    id: 'll-2',
    homeTeam: laLigaTeams['atletico'],
    awayTeam: laLigaTeams['athletic'],
    date: new Date('2026-02-08T16:15:00'),
    league: 'La Liga',
    status: 'upcoming'
  },
  {
    id: 'll-3',
    homeTeam: laLigaTeams['barcelona'],
    awayTeam: laLigaTeams['atletico'],
    date: new Date('2026-02-09T21:00:00'),
    league: 'La Liga',
    status: 'upcoming'
  },

  // Serie A - Feb 7-9
  {
    id: 'sa-1',
    homeTeam: serieATeams['inter'],
    awayTeam: serieATeams['napoli'],
    date: new Date('2026-02-07T20:45:00'),
    league: 'Serie A',
    status: 'upcoming'
  },
  {
    id: 'sa-2',
    homeTeam: serieATeams['juventus'],
    awayTeam: serieATeams['milan'],
    date: new Date('2026-02-08T18:00:00'),
    league: 'Serie A',
    status: 'upcoming'
  },
  {
    id: 'sa-3',
    homeTeam: serieATeams['napoli'],
    awayTeam: serieATeams['juventus'],
    date: new Date('2026-02-09T20:45:00'),
    league: 'Serie A',
    status: 'upcoming'
  }
];

// Legacy export for backward compatibility
export const sampleTeams = superligaenTeams;
export const sampleMatches = allMatches.filter(m => m.league === 'Superligaen');
