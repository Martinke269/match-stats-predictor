import { Team } from '@/lib/types';

// Danish Superliga teams - Updated with current 2024/25 season stats
export const superligaenTeams: Record<string, Team> = {
  'agf': {
    id: 'agf',
    name: 'AGF',
    form: ['W', 'W', 'W', 'D', 'D'],
    stats: {
      goalsScored: 36,
      goalsConceded: 18,
      wins: 12,
      draws: 4,
      losses: 2,
      cleanSheets: 8,
      possession: 54,
      shotsOnTarget: 95,
      passAccuracy: 82
    }
  },
  'fc midtjylland': {
    id: 'fcm',
    name: 'FC Midtjylland',
    form: ['W', 'D', 'W', 'W', 'W'],
    stats: {
      goalsScored: 48,
      goalsConceded: 21,
      wins: 10,
      draws: 6,
      losses: 2,
      cleanSheets: 7,
      possession: 58,
      shotsOnTarget: 110,
      passAccuracy: 85
    }
  },
  'brøndby if': {
    id: 'bif',
    name: 'Brøndby IF',
    form: ['W', 'W', 'L', 'W', 'W'],
    stats: {
      goalsScored: 31,
      goalsConceded: 21,
      wins: 10,
      draws: 1,
      losses: 7,
      cleanSheets: 6,
      possession: 52,
      shotsOnTarget: 88,
      passAccuracy: 80
    }
  },
  'sønderjyske fodbold': {
    id: 'sje',
    name: 'Sønderjyske Fodbold',
    form: ['W', 'W', 'W', 'D', 'W'],
    stats: {
      goalsScored: 30,
      goalsConceded: 25,
      wins: 8,
      draws: 5,
      losses: 5,
      cleanSheets: 5,
      possession: 49,
      shotsOnTarget: 82,
      passAccuracy: 77
    }
  },
  'fc københavn': {
    id: 'fck',
    name: 'F.C. København',
    form: ['W', 'W', 'L', 'W', 'D'],
    stats: {
      goalsScored: 30,
      goalsConceded: 26,
      wins: 8,
      draws: 4,
      losses: 6,
      cleanSheets: 5,
      possession: 56,
      shotsOnTarget: 98,
      passAccuracy: 83
    }
  },
  'ob': {
    id: 'ob',
    name: 'OB',
    form: ['W', 'W', 'D', 'D', 'L'],
    stats: {
      goalsScored: 32,
      goalsConceded: 37,
      wins: 7,
      draws: 5,
      losses: 6,
      cleanSheets: 4,
      possession: 48,
      shotsOnTarget: 78,
      passAccuracy: 76
    }
  },
  'viborg ff': {
    id: 'vff',
    name: 'Viborg FF',
    form: ['D', 'W', 'W', 'W', 'D'],
    stats: {
      goalsScored: 31,
      goalsConceded: 29,
      wins: 7,
      draws: 3,
      losses: 8,
      cleanSheets: 4,
      possession: 47,
      shotsOnTarget: 75,
      passAccuracy: 75
    }
  },
  'fc nordsjælland': {
    id: 'fcn',
    name: 'FC Nordsjælland',
    form: ['W', 'W', 'W', 'L', 'L'],
    stats: {
      goalsScored: 29,
      goalsConceded: 32,
      wins: 8,
      draws: 0,
      losses: 10,
      cleanSheets: 3,
      possession: 50,
      shotsOnTarget: 82,
      passAccuracy: 78
    }
  },
  'randers fc': {
    id: 'rfc',
    name: 'Randers FC',
    form: ['W', 'D', 'L', 'L', 'L'],
    stats: {
      goalsScored: 17,
      goalsConceded: 24,
      wins: 5,
      draws: 4,
      losses: 9,
      cleanSheets: 3,
      possession: 46,
      shotsOnTarget: 65,
      passAccuracy: 74
    }
  },
  'silkeborg if': {
    id: 'sif',
    name: 'Silkeborg IF',
    form: ['W', 'L', 'L', 'D', 'W'],
    stats: {
      goalsScored: 22,
      goalsConceded: 36,
      wins: 5,
      draws: 4,
      losses: 9,
      cleanSheets: 2,
      possession: 48,
      shotsOnTarget: 70,
      passAccuracy: 76
    }
  },
  'fc fredericia': {
    id: 'fcf',
    name: 'FC Fredericia',
    form: ['W', 'W', 'L', 'L', 'L'],
    stats: {
      goalsScored: 22,
      goalsConceded: 44,
      wins: 4,
      draws: 2,
      losses: 12,
      cleanSheets: 2,
      possession: 43,
      shotsOnTarget: 62,
      passAccuracy: 71
    }
  },
  'vejle boldklub': {
    id: 'vbk',
    name: 'Vejle Boldklub',
    form: ['W', 'W', 'L', 'W', 'L'],
    stats: {
      goalsScored: 20,
      goalsConceded: 35,
      wins: 3,
      draws: 4,
      losses: 11,
      cleanSheets: 2,
      possession: 42,
      shotsOnTarget: 58,
      passAccuracy: 70
    }
  }
};
