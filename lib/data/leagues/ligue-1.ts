import { Team } from '@/lib/types';

// Ligue 1 teams
export const ligue1Teams: Record<string, Team> = {
  'psg': {
    id: 'psg',
    name: 'PSG',
    form: ['W', 'W', 'W', 'W', 'W'],
    stats: {
      goalsScored: 43,
      goalsConceded: 16,
      wins: 15,
      draws: 3,
      losses: 2,
      cleanSheets: 12,
      possession: 64,
      shotsOnTarget: 148,
      passAccuracy: 89
    }
  },
  'lens': {
    id: 'rcl',
    name: 'Lens',
    form: ['W', 'W', 'L', 'L', 'W'],
    stats: {
      goalsScored: 34,
      goalsConceded: 16,
      wins: 15,
      draws: 1,
      losses: 4,
      cleanSheets: 10,
      possession: 55,
      shotsOnTarget: 125,
      passAccuracy: 83
    }
  },
  'marseille': {
    id: 'om',
    name: 'Marseille',
    form: ['W', 'L', 'W', 'W', 'D'],
    stats: {
      goalsScored: 46,
      goalsConceded: 22,
      wins: 12,
      draws: 3,
      losses: 5,
      cleanSheets: 8,
      possession: 56,
      shotsOnTarget: 120,
      passAccuracy: 83
    }
  },
  'lyon': {
    id: 'ol',
    name: 'Lyon',
    form: ['W', 'W', 'W', 'W', 'W'],
    stats: {
      goalsScored: 33,
      goalsConceded: 20,
      wins: 12,
      draws: 3,
      losses: 5,
      cleanSheets: 8,
      possession: 54,
      shotsOnTarget: 115,
      passAccuracy: 82
    }
  },
  'lille': {
    id: 'los',
    name: 'Lille',
    form: ['W', 'L', 'L', 'L', 'L'],
    stats: {
      goalsScored: 34,
      goalsConceded: 30,
      wins: 10,
      draws: 2,
      losses: 8,
      cleanSheets: 6,
      possession: 52,
      shotsOnTarget: 108,
      passAccuracy: 81
    }
  },
  'rennes': {
    id: 'sre',
    name: 'Rennes',
    form: ['W', 'W', 'L', 'L', 'L'],
    stats: {
      goalsScored: 30,
      goalsConceded: 31,
      wins: 8,
      draws: 7,
      losses: 5,
      cleanSheets: 5,
      possession: 51,
      shotsOnTarget: 102,
      passAccuracy: 80
    }
  },
  'strasbourg': {
    id: 'rcs',
    name: 'Strasbourg',
    form: ['D', 'D', 'W', 'W', 'L'],
    stats: {
      goalsScored: 33,
      goalsConceded: 25,
      wins: 9,
      draws: 3,
      losses: 8,
      cleanSheets: 5,
      possession: 49,
      shotsOnTarget: 98,
      passAccuracy: 78
    }
  },
  'toulouse': {
    id: 'tfc',
    name: 'Toulouse',
    form: ['W', 'L', 'W', 'W', 'D'],
    stats: {
      goalsScored: 31,
      goalsConceded: 23,
      wins: 8,
      draws: 6,
      losses: 6,
      cleanSheets: 5,
      possession: 48,
      shotsOnTarget: 95,
      passAccuracy: 77
    }
  },
  'lorient': {
    id: 'fcl',
    name: 'Lorient',
    form: ['D', 'D', 'W', 'W', 'W'],
    stats: {
      goalsScored: 27,
      goalsConceded: 31,
      wins: 7,
      draws: 7,
      losses: 6,
      cleanSheets: 4,
      possession: 46,
      shotsOnTarget: 88,
      passAccuracy: 75
    }
  },
  'monaco': {
    id: 'asm',
    name: 'Monaco',
    form: ['L', 'L', 'L', 'D', 'W'],
    stats: {
      goalsScored: 32,
      goalsConceded: 33,
      wins: 8,
      draws: 3,
      losses: 9,
      cleanSheets: 4,
      possession: 54,
      shotsOnTarget: 105,
      passAccuracy: 82
    }
  },
  'angers': {
    id: 'sco',
    name: 'Angers',
    form: ['W', 'L', 'L', 'D', 'W'],
    stats: {
      goalsScored: 21,
      goalsConceded: 25,
      wins: 7,
      draws: 5,
      losses: 8,
      cleanSheets: 4,
      possession: 45,
      shotsOnTarget: 82,
      passAccuracy: 74
    }
  },
  'brest': {
    id: 'sb29',
    name: 'Brest',
    form: ['L', 'W', 'W', 'L', 'D'],
    stats: {
      goalsScored: 26,
      goalsConceded: 33,
      wins: 6,
      draws: 5,
      losses: 9,
      cleanSheets: 3,
      possession: 44,
      shotsOnTarget: 78,
      passAccuracy: 73
    }
  },
  'nice': {
    id: 'ogc',
    name: 'Nice',
    form: ['L', 'D', 'L', 'W', 'D'],
    stats: {
      goalsScored: 27,
      goalsConceded: 38,
      wins: 6,
      draws: 4,
      losses: 10,
      cleanSheets: 3,
      possession: 50,
      shotsOnTarget: 92,
      passAccuracy: 79
    }
  },
  'paris fc': {
    id: 'pfc',
    name: 'Paris FC',
    form: ['L', 'L', 'W', 'W', 'D'],
    stats: {
      goalsScored: 26,
      goalsConceded: 34,
      wins: 5,
      draws: 6,
      losses: 9,
      cleanSheets: 3,
      possession: 47,
      shotsOnTarget: 75,
      passAccuracy: 76
    }
  },
  'le havre': {
    id: 'hac',
    name: 'Le Havre',
    form: ['L', 'W', 'W', 'D', 'L'],
    stats: {
      goalsScored: 16,
      goalsConceded: 25,
      wins: 4,
      draws: 8,
      losses: 8,
      cleanSheets: 3,
      possession: 43,
      shotsOnTarget: 68,
      passAccuracy: 72
    }
  },
  'nantes': {
    id: 'fcn',
    name: 'Nantes',
    form: ['L', 'W', 'W', 'L', 'L'],
    stats: {
      goalsScored: 19,
      goalsConceded: 36,
      wins: 3,
      draws: 5,
      losses: 12,
      cleanSheets: 2,
      possession: 45,
      shotsOnTarget: 70,
      passAccuracy: 73
    }
  },
  'auxerre': {
    id: 'aja',
    name: 'Auxerre',
    form: ['L', 'L', 'L', 'L', 'D'],
    stats: {
      goalsScored: 14,
      goalsConceded: 29,
      wins: 3,
      draws: 4,
      losses: 13,
      cleanSheets: 2,
      possession: 42,
      shotsOnTarget: 62,
      passAccuracy: 70
    }
  },
  'metz': {
    id: 'fcm',
    name: 'Metz',
    form: ['L', 'D', 'L', 'L', 'L'],
    stats: {
      goalsScored: 21,
      goalsConceded: 46,
      wins: 3,
      draws: 3,
      losses: 14,
      cleanSheets: 1,
      possession: 40,
      shotsOnTarget: 65,
      passAccuracy: 69
    }
  }
};
