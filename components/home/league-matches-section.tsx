'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-react';
import Link from 'next/link';

interface MatchSchedule {
  match: string;
  day: string;
  time: string;
}

interface Prediction {
  match: string;
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
      description: string;
      impact: 'positive' | 'negative' | 'neutral';
    }>;
  };
}

interface LeagueMatchesSectionProps {
  leagueName: string;
  leagueIcon: React.ReactNode;
  predictions: Prediction[];
  matchSchedule: MatchSchedule[];
  leagueLink: string;
  badgeColor: string;
  borderColor: string;
  timeColor: string;
}

export function LeagueMatchesSection({
  leagueName,
  leagueIcon,
  predictions,
  matchSchedule,
  leagueLink,
  badgeColor,
  borderColor,
  timeColor,
}: LeagueMatchesSectionProps) {
  const getResultIcon = (homeProb: number, awayProb: number) => {
    if (homeProb > awayProb + 10) return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (awayProb > homeProb + 10) return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-yellow-500" />;
  };

  // Don't render if no predictions
  if (!predictions || predictions.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
          {leagueIcon}
          {leagueName}
        </h2>
        <Link href={leagueLink}>
          <Badge className={`${badgeColor} text-white text-sm px-4 py-2 cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap`}>
            Udvalgte kampe - Klik for alle
          </Badge>
        </Link>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 mb-8 sm:mb-12 px-4">
        {predictions.map(({ match, prediction }) => {
          const schedule = matchSchedule.find(s => s.match === match);
          const homeTeam = match.split(' vs ')[0];
          const awayTeam = match.split(' vs ')[1];
          
          const predictedOutcome = 
            prediction.homeWinProbability > prediction.awayWinProbability && prediction.homeWinProbability > prediction.drawProbability
              ? '1'
              : prediction.awayWinProbability > prediction.homeWinProbability && prediction.awayWinProbability > prediction.drawProbability
              ? '2'
              : 'X';

          return (
            <Link key={match} href={leagueLink}>
              <Card className={`bg-slate-800/50 backdrop-blur-sm border-slate-700 ${borderColor} transition-all cursor-pointer hover:scale-[1.02]`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className={`${timeColor} border-current text-sm px-3 py-1`}>
                      {schedule?.day} {schedule?.time}
                    </Badge>
                  </div>
                  
                  {/* Team Names and Trend Icon */}
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <div className="text-base sm:text-lg font-bold text-white text-left flex-1 truncate">{homeTeam}</div>
                    <div className="flex-shrink-0">
                      {getResultIcon(prediction.homeWinProbability, prediction.awayWinProbability)}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-white text-right flex-1 truncate">{awayTeam}</div>
                  </div>

                  {/* Large Score Display */}
                  <div className="text-center mb-2">
                    <div className="text-5xl sm:text-6xl font-bold text-white tracking-wider">
                      {prediction.predictedScore.home} - {prediction.predictedScore.away}
                    </div>
                    <div className="text-sm text-slate-400 mt-2">Forudsagt resultat</div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* 1X2 Buttons */}
                  <div className="flex items-center gap-2 justify-center">
                    <span className="text-sm text-slate-300 font-semibold">1X2:</span>
                    <div className="flex gap-2">
                      <div className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold text-lg transition-all ${
                        predictedOutcome === '1' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-slate-700 text-slate-400'
                      }`}>
                        1
                      </div>
                      <div className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold text-lg transition-all ${
                        predictedOutcome === 'X' 
                          ? 'bg-slate-600 text-white' 
                          : 'bg-slate-700 text-slate-400'
                      }`}>
                        X
                      </div>
                      <div className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold text-lg transition-all ${
                        predictedOutcome === '2' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-slate-700 text-slate-400'
                      }`}>
                        2
                      </div>
                    </div>
                  </div>

                  {/* Probability Bars */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-300 w-24 flex-shrink-0">Hjemmesejr</span>
                      <div className="flex-1 bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-green-500 h-full rounded-full transition-all"
                          style={{ width: `${prediction.homeWinProbability}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-white w-12 text-right">
                        {prediction.homeWinProbability.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-300 w-24 flex-shrink-0">Uafgjort</span>
                      <div className="flex-1 bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-yellow-500 h-full rounded-full transition-all"
                          style={{ width: `${prediction.drawProbability}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-white w-12 text-right">
                        {prediction.drawProbability.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-300 w-24 flex-shrink-0">Udesejr</span>
                      <div className="flex-1 bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-red-500 h-full rounded-full transition-all"
                          style={{ width: `${prediction.awayWinProbability}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-white w-12 text-right">
                        {prediction.awayWinProbability.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Key Factors */}
                  {prediction.factors.length > 0 && (
                    <div className="border-t border-slate-700 pt-4 mt-4">
                      <div className="text-sm font-semibold text-slate-300 mb-3">Nøglefaktorer:</div>
                      <div className="space-y-2">
                        {prediction.factors.slice(0, 4).map((factor, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-base flex-shrink-0 mt-0.5">
                              {factor.impact === 'positive' ? '✅' : factor.impact === 'negative' ? '⚠️' : 'ℹ️'}
                            </span>
                            <span className="text-sm text-slate-300 leading-relaxed">
                              {factor.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}
