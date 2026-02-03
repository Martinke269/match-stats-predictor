'use client';

import { generateSuperligaPredictions } from '@/lib/superliga-predictions';
import { generateLigue1Predictions } from '@/lib/ligue1-predictions';
import { generatePremierLeaguePredictions } from '@/lib/premier-league-predictions';
import { serieAPredictions } from '@/lib/serie-a-predictions';
import { generateBundesligaPredictions } from '@/lib/bundesliga-predictions';
import { generateLaLigaPredictions } from '@/lib/la-liga-predictions';
import { Trophy } from 'lucide-react';
import { HeroSection } from '@/components/home/hero-section';
import { LeagueMatchesSection } from '@/components/home/league-matches-section';
import { FooterInfo } from '@/components/home/footer-info';

export default function HomePage() {
  // Get all predictions from all leagues
  const allSuperligaPredictions = generateSuperligaPredictions();
  const allLigue1Predictions = generateLigue1Predictions();
  const allPremierLeaguePredictions = generatePremierLeaguePredictions();
  const allSerieAPredictions = serieAPredictions.map(({ match, prediction }) => ({
    match: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    prediction
  }));
  const allBundesligaPredictions = generateBundesligaPredictions();
  const allLaLigaPredictions = generateLaLigaPredictions();
  
  // Filter to only show predictions with 90%+ confidence
  const highConfidenceSuperliga = allSuperligaPredictions.filter(
    ({ prediction }) => prediction.confidence >= 90
  );
  const highConfidenceLigue1 = allLigue1Predictions.filter(
    ({ prediction }) => prediction.confidence >= 90
  );
  const highConfidencePremierLeague = allPremierLeaguePredictions.filter(
    ({ prediction }) => prediction.confidence >= 90
  );
  const highConfidenceSerieA = allSerieAPredictions.filter(
    ({ prediction }) => prediction.confidence >= 90
  );
  const highConfidenceBundesliga = allBundesligaPredictions.filter(
    ({ prediction }) => prediction.confidence >= 90
  );
  const highConfidenceLaLiga = allLaLigaPredictions.filter(
    ({ prediction }) => prediction.confidence >= 90
  );

  // Match schedules
  const superligaSchedule = [
    { match: 'AGF vs OB', day: 'Fredag', time: '19:00' },
    { match: 'FC Nordsjælland vs SønderjyskE', day: 'Søndag', time: '14:00' },
    { match: 'Silkeborg IF vs Viborg FF', day: 'Søndag', time: '14:00' },
    { match: 'FC Midtjylland vs FC København', day: 'Søndag', time: '16:00' },
    { match: 'Brøndby IF vs Randers FC', day: 'Søndag', time: '18:00' },
    { match: 'Vejle BK vs FC Fredericia', day: 'Mandag', time: '19:00' }
  ];

  const ligue1Schedule = [
    { match: 'Metz vs Lille', day: 'Fredag', time: '20:45' },
    { match: 'Lens vs Rennes', day: 'Lørdag', time: '17:00' },
    { match: 'Brest vs Lorient', day: 'Lørdag', time: '19:00' },
    { match: 'Nantes vs Lyon', day: 'Lørdag', time: '21:05' },
    { match: 'Nice vs Monaco', day: 'Søndag', time: '15:00' },
    { match: 'Auxerre vs Paris FC', day: 'Søndag', time: '17:15' },
    { match: 'Le Havre vs Strasbourg', day: 'Søndag', time: '17:15' },
    { match: 'Angers vs Toulouse', day: 'Søndag', time: '17:15' },
    { match: 'PSG vs Marseille', day: 'Søndag', time: '20:45' }
  ];

  const premierLeagueSchedule = [
    { match: 'Manchester City vs Liverpool', day: 'Lørdag', time: '12:30' },
    { match: 'Arsenal vs Chelsea', day: 'Lørdag', time: '15:00' },
    { match: 'Manchester United vs Tottenham', day: 'Lørdag', time: '17:30' },
    { match: 'Newcastle vs Brighton', day: 'Søndag', time: '14:00' },
    { match: 'Aston Villa vs West Ham', day: 'Søndag', time: '16:30' }
  ];

  const serieASchedule = [
    { match: 'Inter vs AC Milan', day: 'Lørdag', time: '18:00' },
    { match: 'Juventus vs Napoli', day: 'Lørdag', time: '20:45' },
    { match: 'Roma vs Lazio', day: 'Søndag', time: '15:00' },
    { match: 'Atalanta vs Fiorentina', day: 'Søndag', time: '18:00' }
  ];

  const bundesligaSchedule = [
    { match: 'Union Berlin vs Eintracht Frankfurt', day: 'Fredag', time: '6.2 20:30' },
    { match: 'Heidenheim vs Hamburger SV', day: 'Lørdag', time: '7.2 15:30' },
    { match: 'Wolfsburg vs Dortmund', day: 'Lørdag', time: '7.2 15:30' },
    { match: 'St. Pauli vs Stuttgart', day: 'Lørdag', time: '7.2 15:30' },
    { match: 'Mainz 05 vs Augsburg', day: 'Lørdag', time: '7.2 15:30' },
    { match: 'Freiburg vs Werder Bremen', day: 'Lørdag', time: '7.2 15:30' },
    { match: 'Mönchengladbach vs Leverkusen', day: 'Lørdag', time: '7.2 18:30' },
    { match: '1. FC Köln vs RB Leipzig', day: 'Søndag', time: '8.2 15:30' },
    { match: 'Bayern vs Hoffenheim', day: 'Søndag', time: '8.2 17:30' }
  ];

  const laLigaSchedule = [
    { match: 'Celta Vigo vs Osasuna', day: 'Fre', time: '6.2 21.00' },
    { match: 'Rayo vs R. Oviedo', day: 'Fre', time: '7.2 14.00' },
    { match: 'Barcelona vs Mallorca', day: 'Lør', time: '7.2 16.15' },
    { match: 'Sevilla vs Girona', day: 'Lør', time: '7.2 18.30' },
    { match: 'Real Sociedad vs Elche', day: 'Lør', time: '7.2 21.00' },
    { match: 'Alaves vs Getafe', day: 'Søn', time: '8.2 14.00' },
    { match: 'Athletic Bilbao vs Levante', day: 'Søn', time: '8.2 16.15' },
    { match: 'Atlético Madrid vs Betis', day: 'Søn', time: '8.2 18.30' },
    { match: 'Valencia vs Real Madrid', day: 'Søn', time: '8.2 21.00' },
    { match: 'Villarreal vs Espanyol', day: 'Man', time: '9.2 21.00' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        
        <FooterInfo />

        {/* Superligaen - High Confidence Matches */}
        <LeagueMatchesSection
          leagueName="Superligaen"
          leagueIcon={<Trophy className="h-8 w-8 text-yellow-400" />}
          predictions={highConfidenceSuperliga}
          matchSchedule={superligaSchedule}
          leagueLink="/superliga"
          badgeColor="bg-green-500"
          borderColor="hover:border-yellow-500"
          timeColor="text-blue-300"
        />

        {/* Ligue 1 - High Confidence Matches */}
        <LeagueMatchesSection
          leagueName="Ligue 1"
          leagueIcon={<Trophy className="h-8 w-8 text-purple-400" />}
          predictions={highConfidenceLigue1}
          matchSchedule={ligue1Schedule}
          leagueLink="/ligue1"
          badgeColor="bg-green-500"
          borderColor="hover:border-purple-500"
          timeColor="text-purple-300"
        />

        {/* Premier League - High Confidence Matches */}
        <LeagueMatchesSection
          leagueName="Premier League"
          leagueIcon={<Trophy className="h-8 w-8 text-pink-400" />}
          predictions={highConfidencePremierLeague}
          matchSchedule={premierLeagueSchedule}
          leagueLink="/premier-league"
          badgeColor="bg-green-500"
          borderColor="hover:border-pink-500"
          timeColor="text-pink-300"
        />

        {/* Serie A - High Confidence Matches */}
        <LeagueMatchesSection
          leagueName="Serie A"
          leagueIcon={<Trophy className="h-8 w-8 text-blue-400" />}
          predictions={highConfidenceSerieA}
          matchSchedule={serieASchedule}
          leagueLink="/serie-a"
          badgeColor="bg-green-500"
          borderColor="hover:border-blue-500"
          timeColor="text-blue-300"
        />

        {/* Bundesliga - High Confidence Matches */}
        <LeagueMatchesSection
          leagueName="Bundesliga"
          leagueIcon={<Trophy className="h-8 w-8 text-red-400" />}
          predictions={highConfidenceBundesliga}
          matchSchedule={bundesligaSchedule}
          leagueLink="/bundesliga"
          badgeColor="bg-green-500"
          borderColor="hover:border-red-500"
          timeColor="text-red-300"
        />

        {/* La Liga - High Confidence Matches */}
        <LeagueMatchesSection
          leagueName="La Liga"
          leagueIcon={<Trophy className="h-8 w-8 text-orange-400" />}
          predictions={highConfidenceLaLiga}
          matchSchedule={laLigaSchedule}
          leagueLink="/la-liga"
          badgeColor="bg-green-500"
          borderColor="hover:border-orange-500"
          timeColor="text-orange-300"
        />
      </div>
    </div>
  );
}
