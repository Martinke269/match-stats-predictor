import { Team } from '@/lib/types';

// Bundesliga 2025-26 teams
export const bundesligaTeams: Record<string, Team> = {
  'bayern munich': {
    id: 'bay',
    name: 'Bayern Munich',
    form: ['W', 'W', 'W', 'L', 'W'],
    stats: {
      goalsScored: 74,
      goalsConceded: 18,
      wins: 16,
      draws: 3,
      losses: 1,
      cleanSheets: 12,
      possession: 63,
      shotsOnTarget: 152,
      passAccuracy: 88
    }
  },
  'borussia dortmund': {
    id: 'bvb',
    name: 'Borussia Dortmund',
    form: ['W', 'W', 'W', 'W', 'W'],
    stats: {
      goalsScored: 41,
      goalsConceded: 19,
      wins: 13,
      draws: 6,
      losses: 1,
      cleanSheets: 9,
      possession: 58,
      shotsOnTarget: 128,
      passAccuracy: 85
    }
  },
  'hoffenheim': {
    id: 'tsg',
    name: 'Hoffenheim',
    form: ['W', 'W', 'W', 'W', 'W'],
    stats: {
      goalsScored: 43,
      goalsConceded: 23,
      wins: 13,
      draws: 3,
      losses: 4,
      cleanSheets: 8,
      possession: 54,
      shotsOnTarget: 115,
      passAccuracy: 82
    }
  },
  'vfb stuttgart': {
    id: 'vfb',
    name: 'VfB Stuttgart',
    form: ['W', 'W', 'D', 'W', 'W'],
    stats: {
      goalsScored: 37,
      goalsConceded: 26,
      wins: 12,
      draws: 3,
      losses: 5,
      cleanSheets: 7,
      possession: 52,
      shotsOnTarget: 105,
      passAccuracy: 81
    }
  },
  'rb leipzig': {
    id: 'rbl',
    name: 'RB Leipzig',
    form: ['L', 'W', 'W', 'D', 'L'],
    stats: {
      goalsScored: 38,
      goalsConceded: 27,
      wins: 11,
      draws: 3,
      losses: 6,
      cleanSheets: 6,
      possession: 57,
      shotsOnTarget: 118,
      passAccuracy: 84
    }
  },
  'bayer leverkusen': {
    id: 'b04',
    name: 'Bayer Leverkusen',
    form: ['W', 'L', 'L', 'W', 'W'],
    stats: {
      goalsScored: 38,
      goalsConceded: 26,
      wins: 11,
      draws: 2,
      losses: 6,
      cleanSheets: 7,
      possession: 59,
      shotsOnTarget: 122,
      passAccuracy: 86
    }
  },
  'freiburg': {
    id: 'scf',
    name: 'Freiburg',
    form: ['W', 'L', 'D', 'W', 'L'],
    stats: {
      goalsScored: 31,
      goalsConceded: 33,
      wins: 7,
      draws: 6,
      losses: 7,
      cleanSheets: 4,
      possession: 49,
      shotsOnTarget: 88,
      passAccuracy: 77
    }
  },
  'eintracht frankfurt': {
    id: 'sge',
    name: 'Eintracht Frankfurt',
    form: ['D', 'L', 'D', 'L', 'L'],
    stats: {
      goalsScored: 40,
      goalsConceded: 45,
      wins: 7,
      draws: 6,
      losses: 7,
      cleanSheets: 3,
      possession: 52,
      shotsOnTarget: 102,
      passAccuracy: 80
    }
  },
  'union berlin': {
    id: 'fcub',
    name: 'Union Berlin',
    form: ['D', 'D', 'D', 'L', 'L'],
    stats: {
      goalsScored: 25,
      goalsConceded: 33,
      wins: 6,
      draws: 6,
      losses: 8,
      cleanSheets: 4,
      possession: 48,
      shotsOnTarget: 82,
      passAccuracy: 76
    }
  },
  'fc koln': {
    id: 'koe',
    name: 'FC Köln',
    form: ['D', 'L', 'W', 'L', 'W'],
    stats: {
      goalsScored: 29,
      goalsConceded: 32,
      wins: 6,
      draws: 5,
      losses: 9,
      cleanSheets: 4,
      possession: 47,
      shotsOnTarget: 78,
      passAccuracy: 75
    }
  },
  'augsburg': {
    id: 'fca',
    name: 'Augsburg',
    form: ['L', 'D', 'D', 'W', 'W'],
    stats: {
      goalsScored: 24,
      goalsConceded: 37,
      wins: 6,
      draws: 4,
      losses: 10,
      cleanSheets: 3,
      possession: 44,
      shotsOnTarget: 68,
      passAccuracy: 71
    }
  },
  'borussia monchengladbach': {
    id: 'bmg',
    name: 'Borussia Monchengladbach',
    form: ['W', 'L', 'D', 'L', 'D'],
    stats: {
      goalsScored: 24,
      goalsConceded: 33,
      wins: 5,
      draws: 6,
      losses: 9,
      cleanSheets: 3,
      possession: 51,
      shotsOnTarget: 75,
      passAccuracy: 79
    }
  },
  'hamburger sv': {
    id: 'hsv',
    name: 'Hamburger SV',
    form: ['D', 'L', 'D', 'D', 'D'],
    stats: {
      goalsScored: 19,
      goalsConceded: 29,
      wins: 4,
      draws: 7,
      losses: 8,
      cleanSheets: 3,
      possession: 48,
      shotsOnTarget: 70,
      passAccuracy: 76
    }
  },
  'wolfsburg': {
    id: 'wob',
    name: 'Wolfsburg',
    form: ['L', 'W', 'D', 'L', 'L'],
    stats: {
      goalsScored: 28,
      goalsConceded: 42,
      wins: 5,
      draws: 4,
      losses: 11,
      cleanSheets: 2,
      possession: 48,
      shotsOnTarget: 80,
      passAccuracy: 76
    }
  },
  'werder bremen': {
    id: 'svw',
    name: 'Werder Bremen',
    form: ['L', 'D', 'L', 'L', 'D'],
    stats: {
      goalsScored: 22,
      goalsConceded: 38,
      wins: 4,
      draws: 7,
      losses: 9,
      cleanSheets: 2,
      possession: 46,
      shotsOnTarget: 72,
      passAccuracy: 73
    }
  },
  'mainz': {
    id: 'm05',
    name: 'Mainz 05',
    form: ['D', 'W', 'L', 'W', 'W'],
    stats: {
      goalsScored: 23,
      goalsConceded: 33,
      wins: 4,
      draws: 6,
      losses: 10,
      cleanSheets: 2,
      possession: 47,
      shotsOnTarget: 75,
      passAccuracy: 74
    }
  },
  'st pauli': {
    id: 'stp',
    name: 'St. Pauli',
    form: ['L', 'L', 'D', 'D', 'L'],
    stats: {
      goalsScored: 18,
      goalsConceded: 34,
      wins: 3,
      draws: 5,
      losses: 12,
      cleanSheets: 2,
      possession: 43,
      shotsOnTarget: 62,
      passAccuracy: 72
    }
  },
  'heidenheim': {
    id: 'hdh',
    name: 'Heidenheim',
    form: ['D', 'L', 'L', 'L', 'L'],
    stats: {
      goalsScored: 19,
      goalsConceded: 45,
      wins: 3,
      draws: 4,
      losses: 13,
      cleanSheets: 1,
      possession: 42,
      shotsOnTarget: 62,
      passAccuracy: 69
    }
  }
};
