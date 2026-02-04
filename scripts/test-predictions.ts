import { PredictionEngine } from '../lib/prediction-engine';
import { premierLeagueTeams } from '../lib/data/leagues/premier-league';

// Test Arsenal vs Sunderland
const arsenal = premierLeagueTeams['arsenal'];
const sunderland = premierLeagueTeams['sunderland'];
const prediction1 = PredictionEngine.predictMatch(arsenal, sunderland, 'test-1');

console.log('='.repeat(60));
console.log('Arsenal vs Sunderland:');
console.log('='.repeat(60));
console.log('Score:', prediction1.predictedScore.home + '-' + prediction1.predictedScore.away);
console.log('Home Win:', prediction1.homeWinProbability + '%');
console.log('Draw:', prediction1.drawProbability + '%');
console.log('Away Win:', prediction1.awayWinProbability + '%');
console.log('Confidence:', prediction1.confidence + '%');
console.log('\nFactors:');
prediction1.factors.forEach(f => {
  console.log(`  ${f.impact === 'positive' ? '✅' : '⚠️'} ${f.name}: ${f.description}`);
});

console.log('\n' + '='.repeat(60));
console.log('Fulham vs Everton:');
console.log('='.repeat(60));

// Test Fulham vs Everton
const fulham = premierLeagueTeams['fulham'];
const everton = premierLeagueTeams['everton'];
const prediction2 = PredictionEngine.predictMatch(fulham, everton, 'test-2');

console.log('Score:', prediction2.predictedScore.home + '-' + prediction2.predictedScore.away);
console.log('Home Win:', prediction2.homeWinProbability + '%');
console.log('Draw:', prediction2.drawProbability + '%');
console.log('Away Win:', prediction2.awayWinProbability + '%');
console.log('Confidence:', prediction2.confidence + '%');
console.log('\nFactors:');
prediction2.factors.forEach(f => {
  console.log(`  ${f.impact === 'positive' ? '✅' : '⚠️'} ${f.name}: ${f.description}`);
});

console.log('\n' + '='.repeat(60));
console.log('Leeds vs Nottingham Forest:');
console.log('='.repeat(60));

// Test Leeds vs Nottingham Forest
const leeds = premierLeagueTeams['leeds'];
const nottinghamForest = premierLeagueTeams['nottingham forest'];
const prediction3 = PredictionEngine.predictMatch(leeds, nottinghamForest, 'test-3');

console.log('Score:', prediction3.predictedScore.home + '-' + prediction3.predictedScore.away);
console.log('Home Win:', prediction3.homeWinProbability + '%');
console.log('Draw:', prediction3.drawProbability + '%');
console.log('Away Win:', prediction3.awayWinProbability + '%');
console.log('Confidence:', prediction3.confidence + '%');
console.log('\nFactors:');
prediction3.factors.forEach(f => {
  console.log(`  ${f.impact === 'positive' ? '✅' : '⚠️'} ${f.name}: ${f.description}`);
});

console.log('\n' + '='.repeat(60));
console.log('COMPARISON:');
console.log('='.repeat(60));
console.log(`Arsenal vs Sunderland: ${prediction1.confidence}% confidence`);
console.log(`Fulham vs Everton: ${prediction2.confidence}% confidence`);
console.log(`Leeds vs Nottingham Forest: ${prediction3.confidence}% confidence`);
console.log('='.repeat(60));
