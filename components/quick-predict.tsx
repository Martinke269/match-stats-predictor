"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, TrendingUp, Target, Shield, Zap, AlertCircle } from 'lucide-react';
import { Team, Prediction } from '@/lib/types';
import { PredictionEngine } from '@/lib/prediction-engine';
import { Progress } from '@/components/ui/progress';
import { CalculationLoggerClient } from '@/lib/calculation-logger-client';

export function QuickPredict() {
  const [homeTeamName, setHomeTeamName] = useState('');
  const [awayTeamName, setAwayTeamName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!homeTeamName.trim() || !awayTeamName.trim()) {
      setError('Indtast begge holdnavne');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Fetch team stats from API
      const response = await fetch('/api/quick-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeTeam: homeTeamName.trim(),
          awayTeam: awayTeamName.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Kunne ikke finde holddata');
      }

      setHomeTeam(data.homeTeam);
      setAwayTeam(data.awayTeam);

      // Generate prediction
      const startTime = Date.now();
      const pred = await PredictionEngine.predictMatch(
        data.homeTeam,
        data.awayTeam,
        `quick-${Date.now()}`
      );
      const calculationDuration = Date.now() - startTime;
      
      setPrediction(pred);

      // Log calculation to database (async, don't wait)
      CalculationLoggerClient.logCalculation({
        homeTeam: data.homeTeam,
        awayTeam: data.awayTeam,
        prediction: pred,
        league: data.homeTeam.league,
        calculationDurationMs: calculationDuration,
        requestSource: 'quick-predict',
      }).catch(err => {
        console.error('Failed to log calculation:', err);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Der opstod en fejl');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePredict();
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Hurtig Forudsigelse
          </CardTitle>
          <CardDescription>
            Indtast to holdnavne for at få øjeblikkelig statistik og forudsigelse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="homeTeam">Hjemmehold</Label>
              <Input
                id="homeTeam"
                placeholder="f.eks. FC København"
                value={homeTeamName}
                onChange={(e) => setHomeTeamName(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="awayTeam">Udehold</Label>
              <Input
                id="awayTeam"
                placeholder="f.eks. Brøndby IF"
                value={awayTeamName}
                onChange={(e) => setAwayTeamName(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
            </div>
          </div>

          <Button 
            onClick={handlePredict} 
            disabled={isLoading || !homeTeamName.trim() || !awayTeamName.trim()}
            className="w-full gap-2"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Henter data...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Forudsig Kamp
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {prediction && homeTeam && awayTeam && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Match Header */}
          <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 text-center">
                  <h3 className="text-2xl font-bold mb-2">{homeTeam.name}</h3>
                  <Badge variant="outline" className="text-xs">Hjemme</Badge>
                </div>
                <div className="px-6">
                  <div className="text-4xl font-bold text-primary">VS</div>
                </div>
                <div className="flex-1 text-center">
                  <h3 className="text-2xl font-bold mb-2">{awayTeam.name}</h3>
                  <Badge variant="outline" className="text-xs">Ude</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prediction Result */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Forudsigelse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Predicted Score */}
              <div className="text-center py-4">
                <div className="text-sm text-muted-foreground mb-2">Forventet resultat</div>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-5xl font-bold">{prediction.predictedScore.home}</span>
                  <span className="text-3xl text-muted-foreground">-</span>
                  <span className="text-5xl font-bold">{prediction.predictedScore.away}</span>
                </div>
              </div>

              {/* Win Probabilities */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{homeTeam.name} sejr</span>
                    <span className="text-muted-foreground">{prediction.homeWinProbability}%</span>
                  </div>
                  <Progress value={prediction.homeWinProbability} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Uafgjort</span>
                    <span className="text-muted-foreground">{prediction.drawProbability}%</span>
                  </div>
                  <Progress value={prediction.drawProbability} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{awayTeam.name} sejr</span>
                    <span className="text-muted-foreground">{prediction.awayWinProbability}%</span>
                  </div>
                  <Progress value={prediction.awayWinProbability} className="h-3" />
                </div>
              </div>

              {/* Confidence */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sikkerhed</span>
                  <Badge 
                    variant={prediction.confidence >= 70 ? 'default' : 'secondary'}
                    className="text-lg px-3 py-1"
                  >
                    {prediction.confidence}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Stats Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Home Team Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{homeTeam.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Form (sidste 5)</span>
                  <span className="font-mono font-semibold">{homeTeam.form.join(' ')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mål scoret</span>
                  <span className="font-semibold">{homeTeam.stats.goalsScored}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mål imod</span>
                  <span className="font-semibold">{homeTeam.stats.goalsConceded}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sejre / Uafgjort / Nederlag</span>
                  <span className="font-semibold">
                    {homeTeam.stats.wins} / {homeTeam.stats.draws} / {homeTeam.stats.losses}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Clean sheets</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {homeTeam.stats.cleanSheets}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Away Team Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{awayTeam.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Form (sidste 5)</span>
                  <span className="font-mono font-semibold">{awayTeam.form.join(' ')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mål scoret</span>
                  <span className="font-semibold">{awayTeam.stats.goalsScored}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mål imod</span>
                  <span className="font-semibold">{awayTeam.stats.goalsConceded}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sejre / Uafgjort / Nederlag</span>
                  <span className="font-semibold">
                    {awayTeam.stats.wins} / {awayTeam.stats.draws} / {awayTeam.stats.losses}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Clean sheets</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {awayTeam.stats.cleanSheets}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Factors */}
          {prediction.factors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Nøglefaktorer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prediction.factors.map((factor, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        factor.impact === 'positive' 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                          : factor.impact === 'negative'
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                          : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                      }`}>
                        {factor.impact === 'positive' ? '↑' : factor.impact === 'negative' ? '↓' : '→'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{factor.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {factor.description}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(factor.weight * 100)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
