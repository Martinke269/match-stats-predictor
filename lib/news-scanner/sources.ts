import { NewsSource } from './types';

/**
 * Configuration for news sources
 * These sources provide sports news via RSS feeds or JSON APIs
 */
export const NEWS_SOURCES: NewsSource[] = [
  {
    name: 'BBC Sport Football',
    url: 'https://feeds.bbci.co.uk/sport/football/rss.xml',
    type: 'rss',
    leagues: ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1']
  },
  {
    name: 'Sky Sports Football',
    url: 'https://www.skysports.com/rss/12040',
    type: 'rss',
    leagues: ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1']
  },
  {
    name: 'ESPN Football',
    url: 'https://www.espn.com/espn/rss/soccer/news',
    type: 'rss',
    leagues: ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'Eredivisie']
  },
  {
    name: 'Goal.com',
    url: 'https://www.goal.com/feeds/en/news',
    type: 'rss',
    leagues: ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'Eredivisie', 'Primeira Liga']
  },
  {
    name: 'The Guardian Football',
    url: 'https://www.theguardian.com/football/rss',
    type: 'rss',
    leagues: ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1']
  }
];

/**
 * Keywords for detecting different event types
 */
export const EVENT_KEYWORDS = {
  injury: [
    'injury', 'injured', 'hurt', 'strain', 'sprain', 'fracture', 'torn', 'rupture',
    'sidelined', 'out for', 'ruled out', 'miss', 'unavailable', 'fitness concern',
    'medical', 'surgery', 'rehabilitation', 'recovering', 'setback'
  ],
  suspension: [
    'suspended', 'suspension', 'banned', 'ban', 'red card', 'yellow cards',
    'accumulation', 'disciplinary', 'ineligible', 'serve ban'
  ],
  lineup_change: [
    'starting xi', 'lineup', 'line-up', 'team news', 'expected to start',
    'likely to start', 'set to start', 'confirmed lineup', 'team selection',
    'rotation', 'rested', 'benched', 'dropped'
  ],
  transfer: [
    'transfer', 'signing', 'signed', 'deal', 'contract', 'loan', 'permanent',
    'agreement', 'fee', 'medical', 'unveiled', 'joins', 'leaves'
  ],
  return: [
    'return', 'returns', 'back', 'recovered', 'fit again', 'available',
    'comeback', 'training', 'ready', 'cleared'
  ],
  doubt: [
    'doubt', 'doubtful', 'uncertain', 'question mark', 'fitness test',
    'late decision', 'touch and go', 'race against time', 'assessed'
  ],
  rumor: [
    'rumor', 'rumour', 'speculation', 'linked', 'interest', 'target',
    'reportedly', 'allegedly', 'sources say', 'understood'
  ]
};

/**
 * Severity indicators for events
 */
export const SEVERITY_KEYWORDS = {
  critical: [
    'season-ending', 'long-term', 'months', 'serious', 'major', 'significant',
    'key player', 'star', 'captain', 'crucial'
  ],
  high: [
    'weeks', 'several weeks', 'extended', 'important', 'regular starter',
    'first team', 'starting eleven'
  ],
  medium: [
    'days', 'short-term', 'minor', 'slight', 'precautionary', 'rotation player'
  ],
  low: [
    'training', 'rest', 'tactical', 'choice', 'decision', 'squad player'
  ]
};

/**
 * Team name variations and aliases for better matching
 */
export const TEAM_ALIASES: Record<string, string[]> = {
  'Manchester United': ['Man Utd', 'Man United', 'United', 'MUFC'],
  'Manchester City': ['Man City', 'City', 'MCFC'],
  'Liverpool': ['Liverpool FC', 'LFC', 'The Reds'],
  'Arsenal': ['Arsenal FC', 'The Gunners'],
  'Chelsea': ['Chelsea FC', 'The Blues'],
  'Tottenham': ['Tottenham Hotspur', 'Spurs', 'THFC'],
  'Newcastle': ['Newcastle United', 'The Magpies', 'NUFC'],
  'Real Madrid': ['Real', 'Madrid', 'Los Blancos'],
  'Barcelona': ['Barca', 'Barça', 'FCB'],
  'Bayern Munich': ['Bayern', 'FCB', 'Die Roten'],
  'Paris Saint-Germain': ['PSG', 'Paris SG'],
  'Juventus': ['Juve', 'The Old Lady'],
  'Inter Milan': ['Inter', 'Internazionale'],
  'AC Milan': ['Milan', 'Rossoneri'],
  'Ajax': ['Ajax Amsterdam', 'AFC Ajax'],
  'Benfica': ['SL Benfica', 'Benfica Lisbon'],
  'Porto': ['FC Porto', 'Porto FC']
};
