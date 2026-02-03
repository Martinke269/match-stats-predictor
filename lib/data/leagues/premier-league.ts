import { Team } from '@/lib/types';

// Premier League teams
export const premierLeagueTeams: Record<string, Team> = {
  'liverpool': {
    id: 'liv',
    name: 'Liverpool',
    form: ['W', 'W', 'W', 'W', 'D'],
    stats: {
      goalsScored: 55,
      goalsConceded: 24,
      wins: 15,
      draws: 4,
      losses: 2,
      cleanSheets: 9,
      possession: 62,
      shotsOnTarget: 138,
      passAccuracy: 87
    }
  },
  'manchester city': {
    id: 'mci',
    name: 'Manchester City',
    form: ['W', 'W', 'W', 'D', 'W'],
    stats: {
      goalsScored: 58,
      goalsConceded: 22,
      wins: 16,
      draws: 3,
      losses: 2,
      cleanSheets: 10,
      possession: 65,
      shotsOnTarget: 145,
      passAccuracy: 89
    }
  },
  'arsenal': {
    id: 'ars',
    name: 'Arsenal',
    form: ['W', 'D', 'W', 'W', 'W'],
    stats: {
      goalsScored: 52,
      goalsConceded: 26,
      wins: 14,
      draws: 5,
      losses: 2,
      cleanSheets: 8,
      possession: 60,
      shotsOnTarget: 132,
      passAccuracy: 86
    }
  },
  'chelsea': {
    id: 'che',
    name: 'Chelsea',
    form: ['W', 'L', 'W', 'D', 'W'],
    stats: {
      goalsScored: 45,
      goalsConceded: 30,
      wins: 12,
      draws: 5,
      losses: 4,
      cleanSheets: 7,
      possession: 58,
      shotsOnTarget: 118,
      passAccuracy: 84
    }
  },
  'manchester united': {
    id: 'mun',
    name: 'Manchester United',
    form: ['D', 'D', 'W', 'W', 'W'],
    stats: {
      goalsScored: 42,
      goalsConceded: 32,
      wins: 11,
      draws: 6,
      losses: 4,
      cleanSheets: 6,
      possession: 56,
      shotsOnTarget: 110,
      passAccuracy: 82
    }
  },
  'tottenham': {
    id: 'tot',
    name: 'Tottenham',
    form: ['D', 'L', 'L', 'L', 'D'],
    stats: {
      goalsScored: 48,
      goalsConceded: 35,
      wins: 12,
      draws: 4,
      losses: 5,
      cleanSheets: 5,
      possession: 55,
      shotsOnTarget: 115,
      passAccuracy: 81
    }
  },
  'newcastle': {
    id: 'new',
    name: 'Newcastle',
    form: ['W', 'D', 'W', 'W', 'L'],
    stats: {
      goalsScored: 44,
      goalsConceded: 30,
      wins: 11,
      draws: 6,
      losses: 4,
      cleanSheets: 7,
      possession: 54,
      shotsOnTarget: 108,
      passAccuracy: 80
    }
  },
  'aston villa': {
    id: 'avl',
    name: 'Aston Villa',
    form: ['W', 'W', 'D', 'L', 'W'],
    stats: {
      goalsScored: 46,
      goalsConceded: 32,
      wins: 11,
      draws: 5,
      losses: 5,
      cleanSheets: 6,
      possession: 53,
      shotsOnTarget: 105,
      passAccuracy: 79
    }
  },
  'brighton': {
    id: 'bha',
    name: 'Brighton',
    form: ['D', 'W', 'W', 'D', 'L'],
    stats: {
      goalsScored: 40,
      goalsConceded: 34,
      wins: 10,
      draws: 6,
      losses: 5,
      cleanSheets: 5,
      possession: 56,
      shotsOnTarget: 102,
      passAccuracy: 82
    }
  },
  'west ham': {
    id: 'whu',
    name: 'West Ham',
    form: ['L', 'D', 'W', 'D', 'W'],
    stats: {
      goalsScored: 38,
      goalsConceded: 36,
      wins: 9,
      draws: 7,
      losses: 5,
      cleanSheets: 4,
      possession: 51,
      shotsOnTarget: 95,
      passAccuracy: 77
    }
  },
  'fulham': {
    id: 'ful',
    name: 'Fulham',
    form: ['D', 'L', 'W', 'D', 'D'],
    stats: {
      goalsScored: 36,
      goalsConceded: 38,
      wins: 8,
      draws: 8,
      losses: 5,
      cleanSheets: 4,
      possession: 50,
      shotsOnTarget: 90,
      passAccuracy: 76
    }
  },
  'brentford': {
    id: 'bre',
    name: 'Brentford',
    form: ['W', 'L', 'D', 'W', 'L'],
    stats: {
      goalsScored: 39,
      goalsConceded: 40,
      wins: 8,
      draws: 6,
      losses: 7,
      cleanSheets: 3,
      possession: 48,
      shotsOnTarget: 88,
      passAccuracy: 75
    }
  },
  'crystal palace': {
    id: 'cry',
    name: 'Crystal Palace',
    form: ['D', 'D', 'L', 'W', 'D'],
    stats: {
      goalsScored: 32,
      goalsConceded: 38,
      wins: 7,
      draws: 9,
      losses: 5,
      cleanSheets: 4,
      possession: 47,
      shotsOnTarget: 82,
      passAccuracy: 74
    }
  },
  'nottingham forest': {
    id: 'nfo',
    name: 'Nottingham Forest',
    form: ['L', 'W', 'D', 'L', 'W'],
    stats: {
      goalsScored: 34,
      goalsConceded: 40,
      wins: 7,
      draws: 7,
      losses: 7,
      cleanSheets: 3,
      possession: 46,
      shotsOnTarget: 80,
      passAccuracy: 73
    }
  },
  'everton': {
    id: 'eve',
    name: 'Everton',
    form: ['D', 'L', 'D', 'D', 'L'],
    stats: {
      goalsScored: 28,
      goalsConceded: 42,
      wins: 6,
      draws: 8,
      losses: 7,
      cleanSheets: 3,
      possession: 45,
      shotsOnTarget: 75,
      passAccuracy: 72
    }
  },
  'bournemouth': {
    id: 'bou',
    name: 'Bournemouth',
    form: ['L', 'D', 'W', 'L', 'D'],
    stats: {
      goalsScored: 30,
      goalsConceded: 44,
      wins: 6,
      draws: 7,
      losses: 8,
      cleanSheets: 2,
      possession: 44,
      shotsOnTarget: 72,
      passAccuracy: 71
    }
  },
  'wolves': {
    id: 'wol',
    name: 'Wolves',
    form: ['L', 'L', 'D', 'W', 'L'],
    stats: {
      goalsScored: 26,
      goalsConceded: 46,
      wins: 5,
      draws: 7,
      losses: 9,
      cleanSheets: 2,
      possession: 43,
      shotsOnTarget: 68,
      passAccuracy: 70
    }
  },
  'ipswich': {
    id: 'ips',
    name: 'Ipswich',
    form: ['L', 'D', 'L', 'L', 'D'],
    stats: {
      goalsScored: 24,
      goalsConceded: 48,
      wins: 4,
      draws: 8,
      losses: 9,
      cleanSheets: 2,
      possession: 42,
      shotsOnTarget: 65,
      passAccuracy: 69
    }
  },
  'leicester': {
    id: 'lei',
    name: 'Leicester',
    form: ['L', 'L', 'D', 'L', 'W'],
    stats: {
      goalsScored: 22,
      goalsConceded: 50,
      wins: 4,
      draws: 6,
      losses: 11,
      cleanSheets: 1,
      possession: 41,
      shotsOnTarget: 62,
      passAccuracy: 68
    }
  },
  'southampton': {
    id: 'sou',
    name: 'Southampton',
    form: ['L', 'L', 'L', 'D', 'L'],
    stats: {
      goalsScored: 20,
      goalsConceded: 52,
      wins: 3,
      draws: 7,
      losses: 11,
      cleanSheets: 1,
      possession: 40,
      shotsOnTarget: 58,
      passAccuracy: 67
    }
  }
};
