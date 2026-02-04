'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Trophy, Target, Calendar, Home, Info, Download } from 'lucide-react';
import Link from 'next/link';
import { exportLeaguePredictionsToPDF } from '@/lib/utils/league-pdf-helper';
import { AIDisclaimer } from '@/components/ai-disclaimer';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface MatchWithPrediction {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  prediction: {
    homeWinProbability: number;
    drawProbability: number;
    awayWinProbability: number;
    predictedScore: {
      home: number;
      away: number;
    };
    confidence: number;
    factors: Array<{
      name: string;
      impact: string;
      weight: number;
      description: string;
    }>;
  } | null;
}

export default function PremierLeaguePage() {
  const [matches, setMatches] = useState<MatchWithPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          date,
          home_team:teams!matches_home_team_id_fkey(name),
          away_team:teams!matches_away_team_id_fkey(name),
          predictions(
            home_win_probability,
            draw_probability,
            away_win_probability,
            predicted_home_score,
            predicted_away_score,
            confidence,
            factors
          )
        `)
        .eq('league', 'Premier League')
        .eq('status', 'scheduled')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching matches:', error);
      }

      if (data) {
        console.log('Fetched matches:', data);
        const formattedMatches: MatchWithPrediction[] = data.map((match: any) => ({
          id: match.id,
          date: match.date,
          homeTeam: match.home_team?.name || 'Unknown',
          awayTeam: match.away_team?.name || 'Unknown',
          prediction: match.predictions ? {
            homeWinProbability: match.predictions.home_win_probability,
            drawProbability: match.predictions.draw_probability,
            awayWinProbability: match.predictions.away_win_probability,
            predictedScore: {
              home: match.predictions.predicted_home_score,
              away: match.predictions.predicted_away_score
            },
            confidence: match.predictions.confidence,
            factors: match.predictions.factors || []
          } : null
        }));
        console.log('Formatted matches:', formattedMatches);
        setMatches(formattedMatches);
      }
      
      setLoading(false);
    }

    fetchMatches();
  }, []);

  const handleExportAllPDF = () => {
    const predictionsForExport = matches.map(m => ({
      match: `${m.homeTeam} vs ${m.awayTeam}`,
      prediction: m.prediction || {
        homeWinProbability: 33.3,
        drawProbability: 33.3,
        awayWinProbability: 33.3,
        predictedScore: { home: 0, away: 0 },
        confidence: 50,
        factors: []
      }
    }));
    exportLeaguePredictionsToPDF(predictionsForExport, 'Premier League', 'Kampdag 25');
  };

  const getResultIcon = (homeProb: number, awayProb: number) => {
    if (homeProb > awayProb + 10) return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (awayProb > homeProb + 10) return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-yellow-500" />;
  };


  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
    const day = days[date.getDay()];
    const time = date.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
    return { day, time };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Indlæser kampe...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Home Link */}
        <div className="mb-8 px-4">
          <Link href="/">
            <Button className="mb-4 bg-white/90 text-blue-900 hover:bg-white border-0 w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Tilbage til forsiden
            </Button>
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
              <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-400 flex-shrink-0" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Premier League</h1>
            </div>
            <p className="text-lg sm:text-xl text-blue-200 px-4">AI-drevne predictions på denne rundes kampe</p>
            <div className="flex items-center justify-center gap-2 mt-4 text-blue-300 text-sm sm:text-base">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Kampdag 25 af 38</span>
            </div>
            <div className="mt-4">
              <Button 
                onClick={handleExportAllPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto"
              >
                <Download className="h-4 w-4" />
                Eksporter Alle til PDF
              </Button>
            </div>
          </div>
        </div>

        {/* AI Disclaimer */}
        <AIDisclaimer />

        {/* Match Predictions */}
        {matches.length === 0 ? (
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center text-slate-300 py-8">
                <p className="text-xl mb-2">Ingen kampe fundet</p>
                <p className="text-sm text-slate-400">Der er ingen planlagte Premier League kampe i databasen.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => {
            const { day, time } = formatMatchDate(match.date);
            const prediction = match.prediction;

            if (!prediction) {
              return null;
            }

            return (
              <Card key={match.id} className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-blue-500 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-blue-300 border-blue-400 text-xs sm:text-sm">
                      {day} {time}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-base sm:text-lg">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate flex-1 text-left">{match.homeTeam}</span>
                      {getResultIcon(prediction.homeWinProbability, prediction.awayWinProbability)}
                      <span className="truncate flex-1 text-right">{match.awayTeam}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Predicted Score */}
                  <div className="text-center mb-4">
                    <div className="text-3xl sm:text-4xl font-bold text-white">
                      {prediction.predictedScore.home} - {prediction.predictedScore.away}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-400 mt-1">Forudsagt resultat</div>
                  </div>

                  {/* Probabilities */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs sm:text-sm text-slate-300 flex-shrink-0">Hjemmesejr</span>
                      <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
                        <div className="w-16 sm:w-24 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${prediction.homeWinProbability}%` }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-white w-10 sm:w-12 text-right">
                          {prediction.homeWinProbability}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs sm:text-sm text-slate-300 flex-shrink-0">Uafgjort</span>
                      <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
                        <div className="w-16 sm:w-24 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all"
                            style={{ width: `${prediction.drawProbability}%` }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-white w-10 sm:w-12 text-right">
                          {prediction.drawProbability}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs sm:text-sm text-slate-300 flex-shrink-0">Udesejr</span>
                      <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
                        <div className="w-16 sm:w-24 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full transition-all"
                            style={{ width: `${prediction.awayWinProbability}%` }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-white w-10 sm:w-12 text-right">
                          {prediction.awayWinProbability}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Key Factors */}
                  {prediction.factors.length > 0 && (
                    <div className="border-t border-slate-700 pt-3">
                      <div className="text-xs font-semibold text-slate-400 mb-2">Nøglefaktorer:</div>
                      <div className="space-y-1">
                        {prediction.factors.slice(0, 3).map((factor, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-xs">
                              {factor.impact === 'positive' ? '✅' : '⚠️'}
                            </span>
                            <span className="text-xs text-slate-300 leading-tight">
                              {factor.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
            })}
          </div>
        )}

        {/* Footer Info */}
        <Card className="mt-8 bg-slate-800/30 backdrop-blur-sm border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center text-slate-400 text-sm">
              <p className="mb-2">
                Predictions er baseret på holdenes aktuelle form, statistikker, målforskel, 
                sejrsrater og hjemmebanefordel.
              </p>
              <p className="text-xs text-slate-500">
                Husk: Fodbold er uforudsigeligt. Brug predictions som vejledning, ikke garanti.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home Button */}
        <div className="mt-8 text-center px-4">
          <Link href="/">
            <Button className="bg-white/90 text-blue-900 hover:bg-white border-0 w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Tilbage til forsiden
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
