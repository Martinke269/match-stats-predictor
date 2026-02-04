import { Team } from '@/lib/types';

// Primeira Liga teams (Portuguese League)
export const primeiraLigaTeams: Record<string, Team> = {
  'porto': {
    id: 'por',
    name: 'Porto',
    form: ['W', 'W', 'W', 'W', 'W'],
    stats: {
      goalsScored: 41,
      goalsConceded: 6,
      wins: 18,
      draws: 1,
      losses: 1,
      cleanSheets: 14,
      possession: 62,
      shotsOnTarget: 135,
      passAccuracy: 87
    }
  },
  'sporting': {
    id: 'scp',
    name: 'Sporting',
    form: ['W', 'W', 'W', 'D', 'W'],
    stats: {
      goalsScored: 54,
      goalsConceded: 11,
      wins: 16,
      draws: 3,
      losses: 1,
      cleanSheets: 13,
      possession: 64,
      shotsOnTarget: 145,
      passAccuracy: 88
    }
  },
  'benfica': {
    id: 'ben',
    name: 'Benfica',
    form: ['W', 'W', 'W', 'W', 'D'],
    stats: {
      goalsScored: 42,
      goalsConceded: 11,
      wins: 13,
      draws: 7,
      losses: 0,
      cleanSheets: 12,
      possession: 63,
      shotsOnTarget: 138,
      passAccuracy: 86
    }
  },
  'braga': {
    id: 'bra',
    name: 'Braga',
    form: ['W', 'W', 'D', 'D', 'W'],
    stats: {
      goalsScored: 41,
      goalsConceded: 18,
      wins: 10,
      draws: 6,
      losses: 4,
      cleanSheets: 8,
      possession: 56,
      shotsOnTarget: 118,
      passAccuracy: 82
    }
  },
  'gil vicente': {
    id: 'gil',
    name: 'Gil Vicente',
    form: ['W', 'D', 'W', 'L', 'W'],
    stats: {
      goalsScored: 29,
      goalsConceded: 16,
      wins: 9,
      draws: 7,
      losses: 4,
      cleanSheets: 7,
      possession: 51,
      shotsOnTarget: 98,
      passAccuracy: 78
    }
  },
  'moreirense': {
    id: 'mor',
    name: 'Moreirense',
    form: ['L', 'W', 'L', 'W', 'L'],
    stats: {
      goalsScored: 26,
      goalsConceded: 27,
      wins: 9,
      draws: 3,
      losses: 8,
      cleanSheets: 5,
      possession: 48,
      shotsOnTarget: 88,
      passAccuracy: 75
    }
  },
  'estoril': {
    id: 'est',
    name: 'Estoril',
    form: ['W', 'L', 'W', 'W', 'W'],
    stats: {
      goalsScored: 41,
      goalsConceded: 33,
      wins: 8,
      draws: 5,
      losses: 7,
      cleanSheets: 4,
      possession: 50,
      shotsOnTarget: 102,
      passAccuracy: 76
    }
  },
  'famalicao': {
    id: 'fam',
    name: 'Famalicao',
    form: ['L', 'L', 'W', 'W', 'L'],
    stats: {
      goalsScored: 24,
      goalsConceded: 19,
      wins: 8,
      draws: 5,
      losses: 7,
      cleanSheets: 6,
      possession: 49,
      shotsOnTarget: 85,
      passAccuracy: 74
    }
  },
  'guimaraes': {
    id: 'gui',
    name: 'Guimaraes',
    form: ['W', 'W', 'L', 'L', 'W'],
    stats: {
      goalsScored: 21,
      goalsConceded: 27,
      wins: 8,
      draws: 4,
      losses: 8,
      cleanSheets: 4,
      possession: 50,
      shotsOnTarget: 82,
      passAccuracy: 76
    }
  },
  'alverca': {
    id: 'alv',
    name: 'Alverca',
    form: ['D', 'W', 'L', 'W', 'D'],
    stats: {
      goalsScored: 20,
      goalsConceded: 34,
      wins: 7,
      draws: 3,
      losses: 10,
      cleanSheets: 3,
      possession: 46,
      shotsOnTarget: 75,
      passAccuracy: 72
    }
  },
  'nacional': {
    id: 'nac',
    name: 'Nacional',
    form: ['L', 'D', 'L', 'W', 'L'],
    stats: {
      goalsScored: 27,
      goalsConceded: 30,
      wins: 5,
      draws: 5,
      losses: 10,
      cleanSheets: 3,
      possession: 47,
      shotsOnTarget: 78,
      passAccuracy: 73
    }
  },
  'estrela da amadora': {
    id: 'eda',
    name: 'Estrela da Amadora',
    form: ['W', 'D', 'L', 'L', 'D'],
    stats: {
      goalsScored: 24,
      goalsConceded: 37,
      wins: 4,
      draws: 8,
      losses: 8,
      cleanSheets: 2,
      possession: 45,
      shotsOnTarget: 72,
      passAccuracy: 71
    }
  },
  'rio ave': {
    id: 'rio',
    name: 'Rio Ave',
    form: ['L', 'W', 'L', 'L', 'L'],
    stats: {
      goalsScored: 22,
      goalsConceded: 38,
      wins: 4,
      draws: 8,
      losses: 8,
      cleanSheets: 2,
      possession: 46,
      shotsOnTarget: 70,
      passAccuracy: 72
    }
  },
  'arouca': {
    id: 'aro',
    name: 'Arouca',
    form: ['W', 'L', 'L', 'L', 'W'],
    stats: {
      goalsScored: 23,
      goalsConceded: 44,
      wins: 5,
      draws: 5,
      losses: 10,
      cleanSheets: 2,
      possession: 44,
      shotsOnTarget: 68,
      passAccuracy: 70
    }
  },
  'casa pia': {
    id: 'cas',
    name: 'Casa Pia',
    form: ['L', 'L', 'L', 'D', 'W'],
    stats: {
      goalsScored: 22,
      goalsConceded: 39,
      wins: 4,
      draws: 6,
      losses: 10,
      cleanSheets: 2,
      possession: 43,
      shotsOnTarget: 65,
      passAccuracy: 69
    }
  },
  'santa clara': {
    id: 'scl',
    name: 'Santa Clara',
    form: ['L', 'D', 'L', 'L', 'L'],
    stats: {
      goalsScored: 16,
      goalsConceded: 25,
      wins: 4,
      draws: 5,
      losses: 11,
      cleanSheets: 3,
      possession: 42,
      shotsOnTarget: 62,
      passAccuracy: 68
    }
  },
  'tondela': {
    id: 'ton',
    name: 'Tondela',
    form: ['W', 'L', 'L', 'L', 'D'],
    stats: {
      goalsScored: 12,
      goalsConceded: 33,
      wins: 3,
      draws: 4,
      losses: 13,
      cleanSheets: 2,
      possession: 41,
      shotsOnTarget: 58,
      passAccuracy: 67
    }
  },
  'avs': {
    id: 'avs',
    name: 'AVS',
    form: ['L', 'L', 'L', 'D', 'L'],
    stats: {
      goalsScored: 14,
      goalsConceded: 51,
      wins: 0,
      draws: 5,
      losses: 15,
      cleanSheets: 1,
      possession: 38,
      shotsOnTarget: 52,
      passAccuracy: 65
    }
  }
};
