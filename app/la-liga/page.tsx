'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateLaLigaPredictions } from '@/lib/la-liga-predictions';
import { TrendingUp, TrendingDown, Minus, Trophy, Target, Calendar, Home, Info, Download } from 'lucide-react';
import Link from 'next/link';
import { exportLeaguePredictionsToPDF } from '@/lib/utils/league-pdf-helper';
import { AIDisclaimer } from '@/components/ai-disclaimer';

export default function LaLigaPage() {
  const predictions = generateLaLigaPredictions();

  const handleExportAllPDF = () => {
    exportLeaguePredictionsToPDF(predictions, 'La Liga', 'Kampdag 23');
  };

  const getResultIcon = (homeProb: number, awayProb: number) => {
    if (homeProb > awayProb + 10) return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (awayProb > homeProb + 10) return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-yellow-500" />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  // Match schedule from the user's image - Kampdag 23 af 38
  const matchSchedule = [
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
        {/* Header with Home Link */}
        <div className="mb-8">
          <Link href="/">
            <Button className="mb-4 bg-white/90 text-blue-900 hover:bg-white border-0">
              <Home className="h-4 w-4 mr-2" />
              Tilbage til forsiden
            </Button>
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-12 w-12 text-yellow-400" />
              <h1 className="text-5xl font-bold text-white">La Liga</h1>
            </div>
            <p className="text-xl text-blue-200">AI-drevne predictions på denne rundes kampe</p>
            <div className="flex items-center justify-center gap-2 mt-4 text-blue-300">
              <Calendar className="h-5 w-5" />
              <span>Kampdag 23 af 38</span>
            </div>
            <div className="mt-4">
              <Button 
                onClick={handleExportAllPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {predictions.map(({ match, prediction }, index) => {
            const schedule = matchSchedule[index];
            const homeTeam = match.split(' vs ')[0];
            const awayTeam = match.split(' vs ')[1];

            return (
              <Card key={match} className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-blue-500 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-blue-300 border-blue-400">
                      {schedule.day} {schedule.time}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-lg">
                    <div className="flex items-center justify-between">
                      <span>{homeTeam}</span>
                      {getResultIcon(prediction.homeWinProbability, prediction.awayWinProbability)}
                      <span>{awayTeam}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Predicted Score */}
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-white">
                      {prediction.predictedScore.home} - {prediction.predictedScore.away}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">Forudsagt resultat</div>
                  </div>

                  {/* Probabilities */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Hjemmesejr</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${prediction.homeWinProbability}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-white w-12 text-right">
                          {prediction.homeWinProbability}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Uafgjort</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all"
                            style={{ width: `${prediction.drawProbability}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-white w-12 text-right">
                          {prediction.drawProbability}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Udesejr</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full transition-all"
                            style={{ width: `${prediction.awayWinProbability}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-white w-12 text-right">
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
        <div className="mt-8 text-center">
          <Link href="/">
            <Button className="bg-white/90 text-blue-900 hover:bg-white border-0">
              <Home className="h-4 w-4 mr-2" />
              Tilbage til forsiden
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
