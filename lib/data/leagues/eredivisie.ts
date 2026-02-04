import { Team } from '@/lib/types';

// Eredivisie teams (Dutch League) - 2025-26 Season
export const eredivisieTeams: Record<string, Team> = {
  'psv': {
    id: 'psv',
    name: 'PSV',
    form: ['W', 'W', 'W', 'W', 'W'],
    stats: {
      goalsScored: 39,
      goalsConceded: 25,
      wins: 18,
      draws: 2,
      losses: 1,
      cleanSheets: 10,
      possession: 58,
      shotsOnTarget: 128,
      passAccuracy: 84
    }
  },
  'feyenoord': {
    id: 'fey',
    name: 'Feyenoord',
    form: ['W', 'L', 'W', 'W', 'L'],
    stats: {
      goalsScored: 19,
      goalsConceded: 32,
      wins: 12,
      draws: 3,
      losses: 6,
      cleanSheets: 7,
      possession: 55,
      shotsOnTarget: 115,
      passAccuracy: 82
    }
  },
  'nec': {
    id: 'nec',
    name: 'NEC',
    form: ['W', 'W', 'W', 'D', 'W'],
    stats: {
      goalsScored: 18,
      goalsConceded: 34,
      wins: 11,
      draws: 5,
      losses: 4,
      cleanSheets: 6,
      possession: 52,
      shotsOnTarget: 108,
      passAccuracy: 79
    }
  },
  'ajax': {
    id: 'aja',
    name: 'Ajax',
    form: ['W', 'D', 'W', 'W', 'D'],
    stats: {
      goalsScored: 13,
      goalsConceded: 28,
      wins: 10,
      draws: 8,
      losses: 3,
      cleanSheets: 8,
      possession: 60,
      shotsOnTarget: 125,
      passAccuracy: 86
    }
  },
  'sparta rotterdam': {
    id: 'spa',
    name: 'Sparta Rotterdam',
    form: ['W', 'W', 'W', 'W', 'W'],
    stats: {
      goalsScored: 35,
      goalsConceded: 27,
      wins: 11,
      draws: 2,
      losses: 8,
      cleanSheets: 5,
      possession: 50,
      shotsOnTarget: 102,
      passAccuracy: 77
    }
  },
  'az': {
    id: 'az',
    name: 'AZ',
    form: ['L', 'W', 'W', 'L', 'W'],
    stats: {
      goalsScored: 32,
      goalsConceded: 35,
      wins: 9,
      draws: 5,
      losses: 7,
      cleanSheets: 4,
      possession: 53,
      shotsOnTarget: 110,
      passAccuracy: 80
    }
  },
  'twente': {
    id: 'twe',
    name: 'Twente',
    form: ['D', 'W', 'W', 'D', 'D'],
    stats: {
      goalsScored: 31,
      goalsConceded: 24,
      wins: 7,
      draws: 10,
      losses: 4,
      cleanSheets: 6,
      possession: 51,
      shotsOnTarget: 98,
      passAccuracy: 78
    }
  },
  'groningen': {
    id: 'gro',
    name: 'Groningen',
    form: ['L', 'W', 'L', 'W', 'L'],
    stats: {
      goalsScored: 31,
      goalsConceded: 26,
      wins: 9,
      draws: 4,
      losses: 8,
      cleanSheets: 5,
      possession: 49,
      shotsOnTarget: 95,
      passAccuracy: 76
    }
  },
  'zwolle': {
    id: 'zwo',
    name: 'Zwolle',
    form: ['W', 'L', 'W', 'L', 'W'],
    stats: {
      goalsScored: 26,
      goalsConceded: 43,
      wins: 7,
      draws: 5,
      losses: 9,
      cleanSheets: 3,
      possession: 47,
      shotsOnTarget: 88,
      passAccuracy: 74
    }
  },
  'heerenveen': {
    id: 'hee',
    name: 'Heerenveen',
    form: ['D', 'W', 'W', 'L', 'D'],
    stats: {
      goalsScored: 25,
      goalsConceded: 31,
      wins: 6,
      draws: 7,
      losses: 7,
      cleanSheets: 4,
      possession: 48,
      shotsOnTarget: 85,
      passAccuracy: 75
    }
  },
  'sittard': {
    id: 'sit',
    name: 'Sittard',
    form: ['L', 'W', 'W', 'L', 'L'],
    stats: {
      goalsScored: 25,
      goalsConceded: 36,
      wins: 7,
      draws: 4,
      losses: 10,
      cleanSheets: 3,
      possession: 46,
      shotsOnTarget: 82,
      passAccuracy: 73
    }
  },
  'utrecht': {
    id: 'utr',
    name: 'Utrecht',
    form: ['D', 'L', 'L', 'L', 'D'],
    stats: {
      goalsScored: 24,
      goalsConceded: 27,
      wins: 6,
      draws: 6,
      losses: 8,
      cleanSheets: 4,
      possession: 50,
      shotsOnTarget: 90,
      passAccuracy: 77
    }
  },
  'excelsior': {
    id: 'exc',
    name: 'Excelsior',
    form: ['D', 'D', 'D', 'D', 'D'],
    stats: {
      goalsScored: 23,
      goalsConceded: 37,
      wins: 6,
      draws: 5,
      losses: 10,
      cleanSheets: 3,
      possession: 45,
      shotsOnTarget: 78,
      passAccuracy: 72
    }
  },
  'go ahead eagles': {
    id: 'gae',
    name: 'Go Ahead Eagles',
    form: ['D', 'D', 'D', 'D', 'D'],
    stats: {
      goalsScored: 22,
      goalsConceded: 34,
      wins: 4,
      draws: 10,
      losses: 6,
      cleanSheets: 2,
      possession: 44,
      shotsOnTarget: 75,
      passAccuracy: 71
    }
  },
  'volendam': {
    id: 'vol',
    name: 'Volendam',
    form: ['D', 'L', 'W', 'L', 'D'],
    stats: {
      goalsScored: 18,
      goalsConceded: 36,
      wins: 4,
      draws: 6,
      losses: 11,
      cleanSheets: 2,
      possession: 43,
      shotsOnTarget: 72,
      passAccuracy: 70
    }
  },
  'heracles': {
    id: 'her',
    name: 'Heracles',
    form: ['W', 'L', 'L', 'L', 'W'],
    stats: {
      goalsScored: 17,
      goalsConceded: 53,
      wins: 5,
      draws: 2,
      losses: 14,
      cleanSheets: 2,
      possession: 42,
      shotsOnTarget: 68,
      passAccuracy: 69
    }
  },
  'breda': {
    id: 'bre',
    name: 'Breda',
    form: ['D', 'L', 'L', 'L', 'D'],
    stats: {
      goalsScored: 16,
      goalsConceded: 34,
      wins: 3,
      draws: 7,
      losses: 11,
      cleanSheets: 2,
      possession: 41,
      shotsOnTarget: 65,
      passAccuracy: 68
    }
  },
  'telstar': {
    id: 'tel',
    name: 'Telstar',
    form: ['L', 'L', 'L', 'L', 'L'],
    stats: {
      goalsScored: 16,
      goalsConceded: 37,
      wins: 3,
      draws: 7,
      losses: 11,
      cleanSheets: 1,
      possession: 40,
      shotsOnTarget: 62,
      passAccuracy: 67
    }
  }
};
