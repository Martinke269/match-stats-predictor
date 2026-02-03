export interface Team {
  id: string;
  name: string;
  logo?: string;
  form: string[]; // Last 5 results: 'W', 'D', 'L'
  stats: TeamStats;
}

export interface TeamStats {
  goalsScored: number;
  goalsConceded: number;
  wins: number;
  draws: number;
  losses: number;
  cleanSheets: number;
  possession: number;
  shotsOnTarget: number;
  passAccuracy: number;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: Date;
  league: string;
  status: 'upcoming' | 'live' | 'finished';
  score?: {
    home: number;
    away: number;
  };
}

export interface Prediction {
  matchId: string;
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  predictedScore: {
    home: number;
    away: number;
  };
  confidence: number;
  factors: PredictionFactor[];
}

export interface PredictionFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}
