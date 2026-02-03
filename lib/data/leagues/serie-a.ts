import { Team } from '@/lib/types';

// Serie A teams 2025-26 season
export const serieATeams: Record<string, Team> = {
  'inter': {
    id: 'INT',
    name: 'Inter',
    form: ['W', 'W', 'W', 'W', 'W'],
    stats: {
      goalsScored: 52,
      goalsConceded: 19,
      wins: 18,
      draws: 1,
      losses: 4,
      cleanSheets: 13,
      possession: 58,
      shotsOnTarget: 145,
      passAccuracy: 87
    }
  },
  'milan': {
    id: 'MIL',
    name: 'Milan',
    form: ['W', 'D', 'W', 'D', 'D'],
    stats: {
      goalsScored: 35,
      goalsConceded: 17,
      wins: 13,
      draws: 8,
      losses: 1,
      cleanSheets: 10,
      possession: 56,
      shotsOnTarget: 128,
      passAccuracy: 85
    }
  },
  'napoli': {
    id: 'NAP',
    name: 'Napoli',
    form: ['W', 'W', 'D', 'L', 'W'],
    stats: {
      goalsScored: 33,
      goalsConceded: 21,
      wins: 14,
      draws: 4,
      losses: 5,
      cleanSheets: 9,
      possession: 57,
      shotsOnTarget: 132,
      passAccuracy: 84
    }
  },
  'juventus': {
    id: 'JUV',
    name: 'Juventus',
    form: ['W', 'W', 'D', 'W', 'W'],
    stats: {
      goalsScored: 39,
      goalsConceded: 18,
      wins: 13,
      draws: 6,
      losses: 4,
      cleanSheets: 11,
      possession: 55,
      shotsOnTarget: 125,
      passAccuracy: 86
    }
  },
  'roma': {
    id: 'ROM',
    name: 'Roma',
    form: ['W', 'W', 'W', 'D', 'L'],
    stats: {
      goalsScored: 27,
      goalsConceded: 14,
      wins: 14,
      draws: 1,
      losses: 8,
      cleanSheets: 8,
      possession: 54,
      shotsOnTarget: 118,
      passAccuracy: 83
    }
  },
  'como': {
    id: 'COM',
    name: 'Como Calcio',
    form: ['W', 'D', 'W', 'D', 'D'],
    stats: {
      goalsScored: 37,
      goalsConceded: 16,
      wins: 11,
      draws: 8,
      losses: 4,
      cleanSheets: 7,
      possession: 52,
      shotsOnTarget: 115,
      passAccuracy: 81
    }
  },
  'atalanta': {
    id: 'ATA',
    name: 'Atalanta',
    form: ['W', 'W', 'W', 'D', 'D'],
    stats: {
      goalsScored: 30,
      goalsConceded: 20,
      wins: 9,
      draws: 9,
      losses: 5,
      cleanSheets: 6,
      possession: 53,
      shotsOnTarget: 122,
      passAccuracy: 80
    }
  },
  'lazio': {
    id: 'LAZ',
    name: 'Lazio',
    form: ['W', 'D', 'W', 'D', 'W'],
    stats: {
      goalsScored: 24,
      goalsConceded: 21,
      wins: 8,
      draws: 8,
      losses: 7,
      cleanSheets: 5,
      possession: 52,
      shotsOnTarget: 108,
      passAccuracy: 82
    }
  },
  'udinese': {
    id: 'UDI',
    name: 'Udinese',
    form: ['W', 'W', 'D', 'W', 'W'],
    stats: {
      goalsScored: 26,
      goalsConceded: 34,
      wins: 9,
      draws: 5,
      losses: 9,
      cleanSheets: 4,
      possession: 48,
      shotsOnTarget: 95,
      passAccuracy: 77
    }
  },
  'bologna': {
    id: 'BOL',
    name: 'Bologna',
    form: ['L', 'W', 'D', 'W', 'L'],
    stats: {
      goalsScored: 32,
      goalsConceded: 27,
      wins: 8,
      draws: 6,
      losses: 8,
      cleanSheets: 5,
      possession: 51,
      shotsOnTarget: 102,
      passAccuracy: 79
    }
  },
  'sassuolo': {
    id: 'SAS',
    name: 'Sassuolo',
    form: ['L', 'L', 'L', 'W', 'W'],
    stats: {
      goalsScored: 27,
      goalsConceded: 29,
      wins: 8,
      draws: 5,
      losses: 10,
      cleanSheets: 4,
      possession: 49,
      shotsOnTarget: 98,
      passAccuracy: 78
    }
  },
  'cagliari': {
    id: 'CAG',
    name: 'Cagliari',
    form: ['W', 'D', 'W', 'D', 'W'],
    stats: {
      goalsScored: 28,
      goalsConceded: 31,
      wins: 7,
      draws: 7,
      losses: 9,
      cleanSheets: 4,
      possession: 47,
      shotsOnTarget: 92,
      passAccuracy: 76
    }
  },
  'torino': {
    id: 'TOR',
    name: 'Torino',
    form: ['L', 'L', 'L', 'L', 'W'],
    stats: {
      goalsScored: 22,
      goalsConceded: 40,
      wins: 7,
      draws: 5,
      losses: 11,
      cleanSheets: 3,
      possession: 46,
      shotsOnTarget: 88,
      passAccuracy: 75
    }
  },
  'genoa': {
    id: 'GEN',
    name: 'Genoa',
    form: ['W', 'D', 'W', 'D', 'L'],
    stats: {
      goalsScored: 27,
      goalsConceded: 34,
      wins: 5,
      draws: 8,
      losses: 10,
      cleanSheets: 3,
      possession: 45,
      shotsOnTarget: 82,
      passAccuracy: 74
    }
  },
  'cremonese': {
    id: 'CRE',
    name: 'Cremonese',
    form: ['W', 'D', 'L', 'L', 'L'],
    stats: {
      goalsScored: 20,
      goalsConceded: 31,
      wins: 5,
      draws: 8,
      losses: 10,
      cleanSheets: 3,
      possession: 44,
      shotsOnTarget: 78,
      passAccuracy: 73
    }
  },
  'parma': {
    id: 'PAR',
    name: 'Parma',
    form: ['W', 'D', 'D', 'L', 'L'],
    stats: {
      goalsScored: 15,
      goalsConceded: 30,
      wins: 5,
      draws: 8,
      losses: 10,
      cleanSheets: 2,
      possession: 43,
      shotsOnTarget: 75,
      passAccuracy: 72
    }
  },
  'lecce': {
    id: 'LEC',
    name: 'Lecce',
    form: ['L', 'L', 'L', 'D', 'L'],
    stats: {
      goalsScored: 13,
      goalsConceded: 30,
      wins: 4,
      draws: 6,
      losses: 13,
      cleanSheets: 2,
      possession: 42,
      shotsOnTarget: 68,
      passAccuracy: 71
    }
  },
  'fiorentina': {
    id: 'FIO',
    name: 'Fiorentina',
    form: ['W', 'D', 'W', 'L', 'L'],
    stats: {
      goalsScored: 25,
      goalsConceded: 36,
      wins: 3,
      draws: 8,
      losses: 12,
      cleanSheets: 2,
      possession: 50,
      shotsOnTarget: 85,
      passAccuracy: 79
    }
  },
  'pisa': {
    id: 'PIS',
    name: 'Pisa',
    form: ['L', 'D', 'D', 'L', 'L'],
    stats: {
      goalsScored: 19,
      goalsConceded: 40,
      wins: 1,
      draws: 11,
      losses: 11,
      cleanSheets: 1,
      possession: 41,
      shotsOnTarget: 62,
      passAccuracy: 70
    }
  },
  'verona': {
    id: 'VER',
    name: 'Verona',
    form: ['L', 'L', 'L', 'L', 'L'],
    stats: {
      goalsScored: 18,
      goalsConceded: 41,
      wins: 2,
      draws: 8,
      losses: 13,
      cleanSheets: 1,
      possession: 40,
      shotsOnTarget: 58,
      passAccuracy: 69
    }
  }
};
