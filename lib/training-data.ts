import { TrainingData } from './ml-prediction-engine';
import { superligaenTeams } from './sample-data';

// Use superligaenTeams for training data
const sampleTeams = superligaenTeams;

/**
 * Historical match data for training the ML model
 * This represents past matches with actual results
 */
export const historicalMatches: TrainingData[] = [
  // FC København matches
  {
    homeTeam: sampleTeams['fc-copenhagen'],
    awayTeam: sampleTeams['brondby'],
    actualResult: 'home',
    actualScore: { home: 3, away: 1 }
  },
  {
    homeTeam: sampleTeams['fc-copenhagen'],
    awayTeam: sampleTeams['fc-midtjylland'],
    actualResult: 'draw',
    actualScore: { home: 2, away: 2 }
  },
  {
    homeTeam: sampleTeams['fc-copenhagen'],
    awayTeam: sampleTeams['nordsjaelland'],
    actualResult: 'home',
    actualScore: { home: 2, away: 0 }
  },
  {
    homeTeam: sampleTeams['aab'],
    awayTeam: sampleTeams['fc-copenhagen'],
    actualResult: 'away',
    actualScore: { home: 1, away: 3 }
  },
  {
    homeTeam: sampleTeams['silkeborg'],
    awayTeam: sampleTeams['fc-copenhagen'],
    actualResult: 'draw',
    actualScore: { home: 1, away: 1 }
  },

  // FC Midtjylland matches
  {
    homeTeam: sampleTeams['fc-midtjylland'],
    awayTeam: sampleTeams['brondby'],
    actualResult: 'home',
    actualScore: { home: 3, away: 0 }
  },
  {
    homeTeam: sampleTeams['fc-midtjylland'],
    awayTeam: sampleTeams['aab'],
    actualResult: 'home',
    actualScore: { home: 4, away: 1 }
  },
  {
    homeTeam: sampleTeams['fc-midtjylland'],
    awayTeam: sampleTeams['nordsjaelland'],
    actualResult: 'home',
    actualScore: { home: 2, away: 1 }
  },
  {
    homeTeam: sampleTeams['viborg'],
    awayTeam: sampleTeams['fc-midtjylland'],
    actualResult: 'away',
    actualScore: { home: 0, away: 3 }
  },
  {
    homeTeam: sampleTeams['randers'],
    awayTeam: sampleTeams['fc-midtjylland'],
    actualResult: 'draw',
    actualScore: { home: 2, away: 2 }
  },

  // Brøndby matches
  {
    homeTeam: sampleTeams['brondby'],
    awayTeam: sampleTeams['aab'],
    actualResult: 'home',
    actualScore: { home: 2, away: 1 }
  },
  {
    homeTeam: sampleTeams['brondby'],
    awayTeam: sampleTeams['silkeborg'],
    actualResult: 'home',
    actualScore: { home: 3, away: 2 }
  },
  {
    homeTeam: sampleTeams['brondby'],
    awayTeam: sampleTeams['viborg'],
    actualResult: 'home',
    actualScore: { home: 4, away: 0 }
  },
  {
    homeTeam: sampleTeams['nordsjaelland'],
    awayTeam: sampleTeams['brondby'],
    actualResult: 'home',
    actualScore: { home: 2, away: 1 }
  },
  {
    homeTeam: sampleTeams['randers'],
    awayTeam: sampleTeams['brondby'],
    actualResult: 'draw',
    actualScore: { home: 1, away: 1 }
  },

  // FC Nordsjælland matches
  {
    homeTeam: sampleTeams['nordsjaelland'],
    awayTeam: sampleTeams['aab'],
    actualResult: 'home',
    actualScore: { home: 3, away: 1 }
  },
  {
    homeTeam: sampleTeams['nordsjaelland'],
    awayTeam: sampleTeams['silkeborg'],
    actualResult: 'home',
    actualScore: { home: 2, away: 0 }
  },
  {
    homeTeam: sampleTeams['nordsjaelland'],
    awayTeam: sampleTeams['randers'],
    actualResult: 'home',
    actualScore: { home: 3, away: 0 }
  },
  {
    homeTeam: sampleTeams['viborg'],
    awayTeam: sampleTeams['nordsjaelland'],
    actualResult: 'away',
    actualScore: { home: 1, away: 2 }
  },

  // Silkeborg matches
  {
    homeTeam: sampleTeams['silkeborg'],
    awayTeam: sampleTeams['randers'],
    actualResult: 'home',
    actualScore: { home: 2, away: 1 }
  },
  {
    homeTeam: sampleTeams['silkeborg'],
    awayTeam: sampleTeams['viborg'],
    actualResult: 'home',
    actualScore: { home: 3, away: 0 }
  },
  {
    homeTeam: sampleTeams['silkeborg'],
    awayTeam: sampleTeams['aab'],
    actualResult: 'draw',
    actualScore: { home: 1, away: 1 }
  },
  {
    homeTeam: sampleTeams['brondby'],
    awayTeam: sampleTeams['silkeborg'],
    actualResult: 'home',
    actualScore: { home: 2, away: 0 }
  },

  // AaB matches
  {
    homeTeam: sampleTeams['aab'],
    awayTeam: sampleTeams['viborg'],
    actualResult: 'home',
    actualScore: { home: 2, away: 0 }
  },
  {
    homeTeam: sampleTeams['aab'],
    awayTeam: sampleTeams['randers'],
    actualResult: 'draw',
    actualScore: { home: 1, away: 1 }
  },
  {
    homeTeam: sampleTeams['fc-midtjylland'],
    awayTeam: sampleTeams['aab'],
    actualResult: 'home',
    actualScore: { home: 3, away: 0 }
  },
  {
    homeTeam: sampleTeams['nordsjaelland'],
    awayTeam: sampleTeams['aab'],
    actualResult: 'home',
    actualScore: { home: 2, away: 1 }
  },

  // Randers matches
  {
    homeTeam: sampleTeams['randers'],
    awayTeam: sampleTeams['viborg'],
    actualResult: 'draw',
    actualScore: { home: 0, away: 0 }
  },
  {
    homeTeam: sampleTeams['randers'],
    awayTeam: sampleTeams['aab'],
    actualResult: 'home',
    actualScore: { home: 2, away: 1 }
  },
  {
    homeTeam: sampleTeams['fc-copenhagen'],
    awayTeam: sampleTeams['randers'],
    actualResult: 'home',
    actualScore: { home: 3, away: 0 }
  },
  {
    homeTeam: sampleTeams['silkeborg'],
    awayTeam: sampleTeams['randers'],
    actualResult: 'home',
    actualScore: { home: 2, away: 1 }
  },

  // Viborg matches
  {
    homeTeam: sampleTeams['viborg'],
    awayTeam: sampleTeams['randers'],
    actualResult: 'draw',
    actualScore: { home: 1, away: 1 }
  },
  {
    homeTeam: sampleTeams['viborg'],
    awayTeam: sampleTeams['aab'],
    actualResult: 'away',
    actualScore: { home: 0, away: 2 }
  },
  {
    homeTeam: sampleTeams['fc-copenhagen'],
    awayTeam: sampleTeams['viborg'],
    actualResult: 'home',
    actualScore: { home: 4, away: 0 }
  },
  {
    homeTeam: sampleTeams['brondby'],
    awayTeam: sampleTeams['viborg'],
    actualResult: 'home',
    actualScore: { home: 3, away: 1 }
  },

  // Additional cross matches for better training
  {
    homeTeam: sampleTeams['aab'],
    awayTeam: sampleTeams['nordsjaelland'],
    actualResult: 'away',
    actualScore: { home: 1, away: 3 }
  },
  {
    homeTeam: sampleTeams['viborg'],
    awayTeam: sampleTeams['silkeborg'],
    actualResult: 'away',
    actualScore: { home: 0, away: 2 }
  },
  {
    homeTeam: sampleTeams['randers'],
    awayTeam: sampleTeams['fc-copenhagen'],
    actualResult: 'away',
    actualScore: { home: 1, away: 2 }
  },
  {
    homeTeam: sampleTeams['silkeborg'],
    awayTeam: sampleTeams['fc-midtjylland'],
    actualResult: 'away',
    actualScore: { home: 1, away: 3 }
  },
  {
    homeTeam: sampleTeams['nordsjaelland'],
    awayTeam: sampleTeams['viborg'],
    actualResult: 'home',
    actualScore: { home: 3, away: 0 }
  },
  {
    homeTeam: sampleTeams['aab'],
    awayTeam: sampleTeams['brondby'],
    actualResult: 'away',
    actualScore: { home: 0, away: 2 }
  },
  {
    homeTeam: sampleTeams['randers'],
    awayTeam: sampleTeams['nordsjaelland'],
    actualResult: 'away',
    actualScore: { home: 1, away: 2 }
  },
  {
    homeTeam: sampleTeams['viborg'],
    awayTeam: sampleTeams['fc-copenhagen'],
    actualResult: 'away',
    actualScore: { home: 0, away: 3 }
  }
];
