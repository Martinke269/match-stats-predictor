import { getPredictionsWithMatches, getPredictionStats } from '@/lib/supabase/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, TrendingUp, CheckCircle2, XCircle, Target, Download } from 'lucide-react';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import Link from 'next/link';
import { Prediction } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function PredictionsPage() {
  const predictionsData = await getPredictionsWithMatches(100);
  const stats = await getPredictionStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Mine Predictions</h1>
          <p className="text-muted-foreground">
            Historik over alle predictions og deres nøjagtighed
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Nøjagtighed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.accuracy}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Eksakt Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats.exactScore}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Korrekt Udfald
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.correctOutcome}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Forkert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {stats.incorrect}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export All Button */}
        {predictionsData.length > 0 && (
          <div className="mb-6 flex justify-end">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/api/export-predictions">
                <Download className="h-4 w-4" />
                Eksporter Alle til PDF
              </Link>
            </Button>
          </div>
        )}

        {/* Predictions List */}
        <div className="space-y-4">
          {predictionsData.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Ingen predictions endnu. Gå til en liga-side for at se predictions.
                </p>
              </CardContent>
            </Card>
          ) : (
            predictionsData.map(({ prediction, match }) => {
              const predictionObj: Prediction = {
                matchId: prediction.match_id,
                homeWinProbability: Number(prediction.home_win_probability),
                drawProbability: Number(prediction.draw_probability),
                awayWinProbability: Number(prediction.away_win_probability),
                predictedScore: {
                  home: prediction.predicted_home_score,
                  away: prediction.predicted_away_score
                },
                confidence: prediction.confidence,
                factors: (prediction.factors as any) || []
              };

              const hasResult = prediction.actual_home_score !== null && prediction.actual_away_score !== null;
              const isCorrect = prediction.was_correct;
              const resultType = prediction.result_type;

              return (
                <Card key={prediction.id} className="overflow-hidden">
                  <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-semibold">
                          {match.league}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(match.date, 'EEE d. MMM, HH:mm', { locale: da })}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {hasResult && (
                          <Badge
                            variant={isCorrect ? 'default' : 'destructive'}
                            className="gap-1"
                          >
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="h-3 w-3" />
                                {resultType === 'exact_score' ? 'Eksakt Score!' : 'Korrekt Udfald'}
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3" />
                                Forkert
                              </>
                            )}
                          </Badge>
                        )}
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-semibold">
                            {predictionObj.confidence}% sikkerhed
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    {/* Teams and Scores */}
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-4">
                      {/* Home Team */}
                      <div className="text-right">
                        <h3 className="text-xl font-bold mb-2">{match.homeTeam.name}</h3>
                      </div>

                      {/* Scores */}
                      <div className="flex flex-col items-center justify-center px-6 min-w-[120px]">
                        <div className="text-sm text-muted-foreground mb-1">Forudsagt</div>
                        <div className="text-3xl font-bold text-primary mb-2">
                          {predictionObj.predictedScore.home} - {predictionObj.predictedScore.away}
                        </div>
                        {hasResult && (
                          <>
                            <div className="text-sm text-muted-foreground mb-1">Faktisk</div>
                            <div className="text-2xl font-bold">
                              {prediction.actual_home_score} - {prediction.actual_away_score}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Away Team */}
                      <div className="text-left">
                        <h3 className="text-xl font-bold mb-2">{match.awayTeam.name}</h3>
                      </div>
                    </div>

                    {/* Win Probabilities */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 text-center">
                          {match.homeTeam.name} sejr
                        </div>
                        <div className="text-center font-bold mb-1">
                          {predictionObj.homeWinProbability}%
                        </div>
                        <Progress value={predictionObj.homeWinProbability} className="h-2" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 text-center">
                          Uafgjort
                        </div>
                        <div className="text-center font-bold mb-1">
                          {predictionObj.drawProbability}%
                        </div>
                        <Progress value={predictionObj.drawProbability} className="h-2" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 text-center">
                          {match.awayTeam.name} sejr
                        </div>
                        <div className="text-center font-bold mb-1">
                          {predictionObj.awayWinProbability}%
                        </div>
                        <Progress value={predictionObj.awayWinProbability} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
