import { PredictionEngine } from '../lib/prediction-engine';
import { premierLeagueTeams } from '../lib/data/leagues/premier-league';

// Match IDs and team names from the database
const matches = [
  { id: '061da1b9-2c29-408e-a952-244ad04593e0', home: 'leeds', away: 'nottingham forest' },
  { id: '4eae4bd6-5881-4e97-b2da-3fdafa0a1298', home: 'manchester united', away: 'tottenham' },
  { id: '48d55f9e-54db-457e-9b60-29430ca4fb6f', home: 'fulham', away: 'everton' },
  { id: '1c0b6a09-2cf3-4650-b978-7712adc797e1', home: 'burnley', away: 'west ham' },
  { id: '7964c02b-8af4-415d-9168-68ba5b4743bc', home: 'arsenal', away: 'sunderland' },
  { id: 'd5cf49ec-45c6-424f-bf59-6c66aa410065', home: 'wolves', away: 'chelsea' },
  { id: 'd69a12fe-9b3b-403d-92b0-8caa9de20ce9', home: 'bournemouth', away: 'aston villa' },
  { id: '69dc920f-bccd-49f9-858f-50aed3fcba47', home: 'newcastle', away: 'brentford' },
  { id: 'fa3be874-76f1-4619-9454-bf42255693a3', home: 'brighton', away: 'crystal palace' },
  { id: 'd20ffe5d-d27f-47db-9c1a-0733aaa4bf81', home: 'liverpool', away: 'manchester city' }
];

console.log('-- SQL to insert Premier League Matchday 25 predictions\n');

for (const match of matches) {
  const homeTeam = premierLeagueTeams[match.home];
  const awayTeam = premierLeagueTeams[match.away];

  if (!homeTeam || !awayTeam) {
    console.log(`-- Skipping ${match.home} vs ${match.away} - team data not found`);
    continue;
  }

  const prediction = PredictionEngine.predictMatch(homeTeam, awayTeam, match.id);
  
  const factorsJson = JSON.stringify(prediction.factors).replace(/'/g, "''");
  
  console.log(`INSERT INTO predictions (match_id, home_win_probability, draw_probability, away_win_probability, predicted_home_score, predicted_away_score, confidence, factors)
VALUES ('${match.id}', ${prediction.homeWinProbability}, ${prediction.drawProbability}, ${prediction.awayWinProbability}, ${prediction.predictedScore.home}, ${prediction.predictedScore.away}, ${prediction.confidence}, '${factorsJson}'::jsonb)
ON CONFLICT (match_id) DO UPDATE SET
  home_win_probability = EXCLUDED.home_win_probability,
  draw_probability = EXCLUDED.draw_probability,
  away_win_probability = EXCLUDED.away_win_probability,
  predicted_home_score = EXCLUDED.predicted_home_score,
  predicted_away_score = EXCLUDED.predicted_away_score,
  confidence = EXCLUDED.confidence,
  factors = EXCLUDED.factors;
`);
}
