'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generatePrimeiraLigaPredictions } from '@/lib/primeira-liga-predictions';
import { TrendingUp, TrendingDown, Minus, Trophy, Target, Calendar, Home, Info, Download } from 'lucide-react';
import Link from 'next/link';
import { exportLeaguePredictionsToPDF } from '@/lib/utils/league-pdf-helper';
import { AIDisclaimer } from '@/components/ai-disclaimer';

export default function PrimeiraLigaPage() {
  const predictions = generatePrimeiraLigaPredictions();

  const handleExportAllPDF = () => {
    exportLeaguePredictionsToPDF(predictions, 'Primeira Liga', 'Kampdag 21');
  };

  const getResultIcon = (homeProb: number, awayProb: number) => {
    if (homeProb > awayProb + 10) return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (awayProb > homeProb + 10) return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-yellow-500" />;
  };


  // Match schedule from the user's image - Kampdag 21 af 34
  const matchSchedule = [
    { match: 'Estrela da Amadora vs Santa Clara', day: 'Lør', time: '7.2 16.30' },
    { match: 'Moreirense vs Gil Vicente', day: 'Lør', time: '7.2 16.30' },
    { match: 'Estoril vs Tondela', day: 'Lør', time: '7.2 19.00' },
    { match: 'Arouca vs Guimaraes', day: 'Lør', time: '7.2 21.30' },
    { match: 'Nacional vs Casa Pia', day: 'Søn', time: '8.2 16.30' },
    { match: 'Braga vs Rio Ave', day: 'Søn', time: '8.2 19.00' },
    { match: 'Benfica vs Alverca', day: 'Søn', time: '8.2 21.30' },
    { match: 'Famalicao vs AVS', day: 'Man', time: '9.2 19.45' },
    { match: 'Porto vs Sporting', day: 'Man', time: '9.2 21.45' }
  ];

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
              <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-green-400 flex-shrink-0" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Primeira Liga</h1>
            </div>
            <p className="text-lg sm:text-xl text-blue-200 px-4">AI-drevne predictions på denne rundes kampe</p>
            <div className="flex items-center justify-center gap-2 mt-4 text-blue-300 text-sm sm:text-base">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Kampdag 21 af 34</span>
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {predictions.map(({ match, prediction }, index) => {
            const schedule = matchSchedule[index];
            const homeTeam = match.split(' vs ')[0];
            const awayTeam = match.split(' vs ')[1];

            return (
              <Card key={match} className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-green-500 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-green-300 border-green-400 text-xs sm:text-sm">
                      {schedule.day} {schedule.time}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-base sm:text-lg">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate flex-1 text-left">{homeTeam}</span>
                      {getResultIcon(prediction.homeWinProbability, prediction.awayWinProbability)}
                      <span className="truncate flex-1 text-right">{awayTeam}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Predicted Score */}
                  <div className="text-center mb-4">
                    <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                      {prediction.predictedScore.home} - {prediction.predictedScore.away}
                    </div>
                    <div className="text-sm text-slate-400 mb-3">Forudsagt resultat</div>
                    
                    {/* 1X2 Prediction */}
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-slate-300 font-medium">1X2:</span>
                      <div className="flex gap-2">
                        <button className={`px-4 py-2 rounded font-bold text-base ${
                          prediction.homeWinProbability > prediction.drawProbability && 
                          prediction.homeWinProbability > prediction.awayWinProbability
                            ? 'bg-green-500 text-white'
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          1
                        </button>
                        <button className={`px-4 py-2 rounded font-bold text-base ${
                          prediction.drawProbability > prediction.homeWinProbability && 
                          prediction.drawProbability > prediction.awayWinProbability
                            ? 'bg-green-500 text-white'
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          X
                        </button>
                        <button className={`px-4 py-2 rounded font-bold text-base ${
                          prediction.awayWinProbability > prediction.homeWinProbability && 
                          prediction.awayWinProbability > prediction.drawProbability
                            ? 'bg-green-500 text-white'
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          2
                        </button>
                      </div>
                    </div>
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
