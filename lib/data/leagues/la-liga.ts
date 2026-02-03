import { Team } from '@/lib/types';

// La Liga teams
export const laLigaTeams: Record<string, Team> = {
  'real madrid': {
    id: 'rma',
    name: 'Real Madrid',
    form: ['W', 'W', 'W', 'W', 'D'],
    stats: {
      goalsScored: 56,
      goalsConceded: 20,
      wins: 16,
      draws: 3,
      losses: 1,
      cleanSheets: 11,
      possession: 61,
      shotsOnTarget: 140,
      passAccuracy: 88
    }
  },
  'barcelona': {
    id: 'bar',
    name: 'Barcelona',
    form: ['W', 'W', 'D', 'W', 'W'],
    stats: {
      goalsScored: 54,
      goalsConceded: 22,
      wins: 15,
      draws: 4,
      losses: 1,
      cleanSheets: 10,
      possession: 64,
      shotsOnTarget: 142,
      passAccuracy: 89
    }
  },
  'atletico madrid': {
    id: 'atm',
    name: 'Atletico Madrid',
    form: ['W', 'D', 'W', 'W', 'L'],
    stats: {
      goalsScored: 45,
      goalsConceded: 24,
      wins: 13,
      draws: 5,
      losses: 2,
      cleanSheets: 9,
      possession: 54,
      shotsOnTarget: 115,
      passAccuracy: 83
    }
  },
  'athletic bilbao': {
    id: 'ath',
    name: 'Athletic Bilbao',
    form: ['W', 'W', 'D', 'L', 'W'],
    stats: {
      goalsScored: 42,
      goalsConceded: 28,
      wins: 11,
      draws: 6,
      losses: 3,
      cleanSheets: 7,
      possession: 52,
      shotsOnTarget: 105,
      passAccuracy: 81
    }
  },
  'real sociedad': {
    id: 'rso',
    name: 'Real Sociedad',
    form: ['D', 'W', 'W', 'D', 'W'],
    stats: {
      goalsScored: 40,
      goalsConceded: 30,
      wins: 10,
      draws: 7,
      losses: 3,
      cleanSheets: 6,
      possession: 55,
      shotsOnTarget: 102,
      passAccuracy: 82
    }
  },
  'villarreal': {
    id: 'vil',
    name: 'Villarreal',
    form: ['W', 'D', 'L', 'W', 'D'],
    stats: {
      goalsScored: 38,
      goalsConceded: 32,
      wins: 9,
      draws: 8,
      losses: 3,
      cleanSheets: 5,
      possession: 53,
      shotsOnTarget: 98,
      passAccuracy: 80
    }
  },
  'real betis': {
    id: 'bet',
    name: 'Real Betis',
    form: ['W', 'L', 'W', 'D', 'W'],
    stats: {
      goalsScored: 39,
      goalsConceded: 34,
      wins: 9,
      draws: 7,
      losses: 4,
      cleanSheets: 5,
      possession: 54,
      shotsOnTarget: 100,
      passAccuracy: 81
    }
  },
  'sevilla': {
    id: 'sev',
    name: 'Sevilla',
    form: ['D', 'W', 'L', 'D', 'W'],
    stats: {
      goalsScored: 36,
      goalsConceded: 34,
      wins: 8,
      draws: 8,
      losses: 4,
      cleanSheets: 4,
      possession: 52,
      shotsOnTarget: 94,
      passAccuracy: 79
    }
  },
  'valencia': {
    id: 'val',
    name: 'Valencia',
    form: ['L', 'D', 'W', 'D', 'L'],
    stats: {
      goalsScored: 34,
      goalsConceded: 36,
      wins: 7,
      draws: 9,
      losses: 4,
      cleanSheets: 4,
      possession: 50,
      shotsOnTarget: 88,
      passAccuracy: 77
    }
  },
  'osasuna': {
    id: 'osa',
    name: 'Osasuna',
    form: ['W', 'D', 'L', 'W', 'D'],
    stats: {
      goalsScored: 32,
      goalsConceded: 36,
      wins: 7,
      draws: 8,
      losses: 5,
      cleanSheets: 3,
      possession: 48,
      shotsOnTarget: 82,
      passAccuracy: 75
    }
  },
  'getafe': {
    id: 'get',
    name: 'Getafe',
    form: ['D', 'D', 'L', 'D', 'W'],
    stats: {
      goalsScored: 28,
      goalsConceded: 34,
      wins: 6,
      draws: 10,
      losses: 4,
      cleanSheets: 4,
      possession: 46,
      shotsOnTarget: 75,
      passAccuracy: 73
    }
  },
  'girona': {
    id: 'gir',
    name: 'Girona',
    form: ['W', 'L', 'D', 'W', 'L'],
    stats: {
      goalsScored: 35,
      goalsConceded: 38,
      wins: 7,
      draws: 6,
      losses: 7,
      cleanSheets: 3,
      possession: 49,
      shotsOnTarget: 85,
      passAccuracy: 76
    }
  },
  'rayo vallecano': {
    id: 'ray',
    name: 'Rayo Vallecano',
    form: ['L', 'W', 'D', 'L', 'D'],
    stats: {
      goalsScored: 30,
      goalsConceded: 40,
      wins: 6,
      draws: 8,
      losses: 6,
      cleanSheets: 2,
      possession: 47,
      shotsOnTarget: 78,
      passAccuracy: 74
    }
  },
  'celta vigo': {
    id: 'cel',
    name: 'Celta Vigo',
    form: ['D', 'L', 'W', 'L', 'D'],
    stats: {
      goalsScored: 29,
      goalsConceded: 42,
      wins: 5,
      draws: 9,
      losses: 6,
      cleanSheets: 2,
      possession: 46,
      shotsOnTarget: 76,
      passAccuracy: 73
    }
  },
  'mallorca': {
    id: 'mal',
    name: 'Mallorca',
    form: ['L', 'D', 'D', 'W', 'L'],
    stats: {
      goalsScored: 26,
      goalsConceded: 40,
      wins: 5,
      draws: 8,
      losses: 7,
      cleanSheets: 3,
      possession: 44,
      shotsOnTarget: 70,
      passAccuracy: 71
    }
  },
  'las palmas': {
    id: 'lpa',
    name: 'Las Palmas',
    form: ['L', 'L', 'D', 'W', 'L'],
    stats: {
      goalsScored: 24,
      goalsConceded: 44,
      wins: 4,
      draws: 8,
      losses: 8,
      cleanSheets: 2,
      possession: 43,
      shotsOnTarget: 68,
      passAccuracy: 70
    }
  },
  'alaves': {
    id: 'ala',
    name: 'Alaves',
    form: ['D', 'L', 'L', 'D', 'L'],
    stats: {
      goalsScored: 22,
      goalsConceded: 46,
      wins: 4,
      draws: 7,
      losses: 9,
      cleanSheets: 2,
      possession: 42,
      shotsOnTarget: 65,
      passAccuracy: 69
    }
  },
  'cadiz': {
    id: 'cad',
    name: 'Cadiz',
    form: ['L', 'D', 'L', 'L', 'D'],
    stats: {
      goalsScored: 20,
      goalsConceded: 48,
      wins: 3,
      draws: 8,
      losses: 9,
      cleanSheets: 1,
      possession: 41,
      shotsOnTarget: 62,
      passAccuracy: 68
    }
  },
  'almeria': {
    id: 'alm',
    name: 'Almeria',
    form: ['L', 'L', 'L', 'D', 'L'],
    stats: {
      goalsScored: 18,
      goalsConceded: 50,
      wins: 2,
      draws: 7,
      losses: 11,
      cleanSheets: 1,
      possession: 40,
      shotsOnTarget: 58,
      passAccuracy: 67
    }
  },
  'granada': {
    id: 'gra',
    name: 'Granada',
    form: ['L', 'L', 'D', 'L', 'L'],
    stats: {
      goalsScored: 16,
      goalsConceded: 52,
      wins: 2,
      draws: 6,
      losses: 12,
      cleanSheets: 1,
      possession: 39,
      shotsOnTarget: 55,
      passAccuracy: 66
    }
  },
  'real oviedo': {
    id: 'rov',
    name: 'R. Oviedo',
    form: ['W', 'D', 'W', 'L', 'D'],
    stats: {
      goalsScored: 32,
      goalsConceded: 30,
      wins: 8,
      draws: 7,
      losses: 5,
      cleanSheets: 5,
      possession: 49,
      shotsOnTarget: 88,
      passAccuracy: 76
    }
  },
  'elche': {
    id: 'elc',
    name: 'Elche',
    form: ['W', 'D', 'L', 'W', 'D'],
    stats: {
      goalsScored: 31,
      goalsConceded: 32,
      wins: 7,
      draws: 8,
      losses: 5,
      cleanSheets: 4,
      possession: 48,
      shotsOnTarget: 85,
      passAccuracy: 75
    }
  },
  'levante': {
    id: 'lev',
    name: 'Levante',
    form: ['D', 'L', 'W', 'D', 'W'],
    stats: {
      goalsScored: 28,
      goalsConceded: 34,
      wins: 6,
      draws: 8,
      losses: 6,
      cleanSheets: 3,
      possession: 47,
      shotsOnTarget: 80,
      passAccuracy: 74
    }
  },
  'espanyol': {
    id: 'esp',
    name: 'Espanyol',
    form: ['D', 'W', 'L', 'D', 'W'],
    stats: {
      goalsScored: 27,
      goalsConceded: 28,
      wins: 7,
      draws: 7,
      losses: 6,
      cleanSheets: 4,
      possession: 48,
      shotsOnTarget: 82,
      passAccuracy: 75
    }
  }
};
