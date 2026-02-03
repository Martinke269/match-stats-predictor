"use client";

import { Match, Prediction } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, TrendingUp, Shield, Target } from 'lucide-react';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

interface MatchCardProps {
  match: Match;
  prediction: Prediction;
}

export function MatchCard({ match, prediction }: MatchCardProps) {
  const { homeTeam, awayTeam, date, league } = match;
  
  const getFormBadgeColor = (result: string) => {
    switch (result) {
      case 'W': return 'bg-green-500 hover:bg-green-600';
      case 'D': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'L': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return 'text-green-600 dark:text-green-400';
    if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const maxProbability = Math.max(
    prediction.homeWinProbability,
    prediction.drawProbability,
    prediction.awayWinProbability
  );

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-semibold">
              {league}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {format(date, 'EEE d. MMM, HH:mm', { locale: da })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className={`h-4 w-4 ${getConfidenceColor(prediction.confidence)}`} />
            <span className={`text-sm font-semibold ${getConfidenceColor(prediction.confidence)}`}>
              {prediction.confidence}% sikkerhed
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Teams and Score Prediction */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-6">
          {/* Home Team */}
          <div className="text-right">
            <h3 className="text-xl font-bold mb-2">{homeTeam.name}</h3>
            <div className="flex justify-end gap-1 mb-2">
              {homeTeam.form.map((result, idx) => (
                <Badge
                  key={idx}
                  className={`w-6 h-6 p-0 flex items-center justify-center text-xs ${getFormBadgeColor(result)}`}
                >
                  {result}
                </Badge>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              {homeTeam.stats.wins}S-{homeTeam.stats.draws}U-{homeTeam.stats.losses}N
            </div>
          </div>

          {/* Predicted Score */}
          <div className="flex flex-col items-center justify-center px-6">
            <div className="text-4xl font-bold text-primary mb-1">
              {prediction.predictedScore.home} - {prediction.predictedScore.away}
            </div>
            <div className="text-xs text-muted-foreground">Forudsagt</div>
          </div>

          {/* Away Team */}
          <div className="text-left">
            <h3 className="text-xl font-bold mb-2">{awayTeam.name}</h3>
            <div className="flex gap-1 mb-2">
              {awayTeam.form.map((result, idx) => (
                <Badge
                  key={idx}
                  className={`w-6 h-6 p-0 flex items-center justify-center text-xs ${getFormBadgeColor(result)}`}
                >
                  {result}
                </Badge>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              {awayTeam.stats.wins}S-{awayTeam.stats.draws}U-{awayTeam.stats.losses}N
            </div>
          </div>
        </div>

        {/* Win Probabilities */}
        <div className="space-y-3 mb-6">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{homeTeam.name} sejr</span>
              <span className={`font-bold ${prediction.homeWinProbability === maxProbability ? 'text-primary' : ''}`}>
                {prediction.homeWinProbability}%
              </span>
            </div>
            <Progress 
              value={prediction.homeWinProbability} 
              className="h-2"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Uafgjort</span>
              <span className={`font-bold ${prediction.drawProbability === maxProbability ? 'text-primary' : ''}`}>
                {prediction.drawProbability}%
              </span>
            </div>
            <Progress 
              value={prediction.drawProbability} 
              className="h-2"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{awayTeam.name} sejr</span>
              <span className={`font-bold ${prediction.awayWinProbability === maxProbability ? 'text-primary' : ''}`}>
                {prediction.awayWinProbability}%
              </span>
            </div>
            <Progress 
              value={prediction.awayWinProbability} 
              className="h-2"
            />
          </div>
        </div>

        {/* Key Stats Comparison */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Mål</span>
            </div>
            <div className="text-sm font-bold">
              {homeTeam.stats.goalsScored} - {awayTeam.stats.goalsScored}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Clean Sheets</span>
            </div>
            <div className="text-sm font-bold">
              {homeTeam.stats.cleanSheets} - {awayTeam.stats.cleanSheets}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-xs text-muted-foreground">Målforskel</span>
            </div>
            <div className="text-sm font-bold">
              +{homeTeam.stats.goalsScored - homeTeam.stats.goalsConceded} / +{awayTeam.stats.goalsScored - awayTeam.stats.goalsConceded}
            </div>
          </div>
        </div>

        {/* Prediction Factors */}
        {prediction.factors.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-2">Nøglefaktorer:</h4>
            <div className="space-y-1">
              {prediction.factors.map((factor, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <span className={`mt-0.5 ${
                    factor.impact === 'positive' ? 'text-green-600 dark:text-green-400' :
                    factor.impact === 'negative' ? 'text-red-600 dark:text-red-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {factor.impact === 'positive' ? '↑' : factor.impact === 'negative' ? '↓' : '•'}
                  </span>
                  <span className="text-muted-foreground">{factor.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
