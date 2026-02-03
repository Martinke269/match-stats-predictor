import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, TrendingUp, Target } from 'lucide-react';

export default async function StatsPage() {
  const supabase = await createClient();

  // Get prediction statistics by league
  const { data: stats } = await supabase
    .from('prediction_stats')
    .select('*')
    .order('accuracy_percentage', { ascending: false });

  // Get recent predictions with results
  const { data: recentPredictions } = await supabase
    .from('predictions')
    .select(`
      *,
      match:matches(
        *,
        home_team:teams!matches_home_team_id_fkey(name),
        away_team:teams!matches_away_team_id_fkey(name)
      )
    `)
    .not('actual_result', 'is', null)
    .order('updated_at', { ascending: false })
    .limit(20);

  // Calculate overall statistics
  const totalPredictions = stats?.reduce((sum, s) => sum + s.total_predictions, 0) || 0;
  const totalCorrect = stats?.reduce((sum, s) => sum + s.correct_predictions, 0) || 0;
  const overallAccuracy = totalPredictions > 0 ? (totalCorrect / totalPredictions) * 100 : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Forudsigelsesstatistik</h1>
        <p className="text-muted-foreground">
          Følg nøjagtigheden af systemets forudsigelser i realtid
        </p>
      </div>

      {/* Overall Statistics */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Samlede forudsigelser</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPredictions}</div>
            <p className="text-xs text-muted-foreground">
              Kampe med resultater
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Korrekte forudsigelser</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCorrect}</div>
            <p className="text-xs text-muted-foreground">
              Præcise resultater
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Samlet nøjagtighed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAccuracy.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              På tværs af alle ligaer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* League Statistics */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Nøjagtighed pr. liga</CardTitle>
          <CardDescription>
            Præstationsstatistik for hver liga
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats && stats.length > 0 ? (
            <div className="space-y-4">
              {stats.map((stat) => (
                <div key={stat.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg capitalize">{stat.league}</h3>
                    <p className="text-sm text-muted-foreground">
                      {stat.correct_predictions} af {stat.total_predictions} forudsigelser
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {stat.accuracy_percentage.toFixed(1)}%
                    </div>
                    <Badge 
                      variant={
                        stat.accuracy_percentage >= 60 ? 'default' : 
                        stat.accuracy_percentage >= 50 ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {stat.accuracy_percentage >= 60 ? 'Høj' : 
                       stat.accuracy_percentage >= 50 ? 'Middel' : 
                       'Lav'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Ingen statistik tilgængelig endnu. Vent på at kampe bliver afsluttet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Predictions */}
      <Card>
        <CardHeader>
          <CardTitle>Seneste forudsigelser</CardTitle>
          <CardDescription>
            De 20 seneste kampe med resultater
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentPredictions && recentPredictions.length > 0 ? (
            <div className="space-y-3">
              {recentPredictions.map((pred) => {
                const match = pred.match;
                if (!match) return null;

                const wasCorrect = pred.was_correct;
                const predictedResult = 
                  pred.predicted_home_score > pred.predicted_away_score ? 'home_win' :
                  pred.predicted_home_score < pred.predicted_away_score ? 'away_win' :
                  'draw';

                return (
                  <div 
                    key={pred.id} 
                    className={`p-4 border rounded-lg ${wasCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {wasCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className="font-semibold capitalize">{match.league}</span>
                      </div>
                      <Badge variant={wasCorrect ? 'default' : 'destructive'}>
                        {wasCorrect ? 'Korrekt' : 'Forkert'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Kamp</p>
                        <p className="font-medium">
                          {match.home_team?.name} vs {match.away_team?.name}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground mb-1">Forudsagt</p>
                        <p className="font-medium">
                          {pred.predicted_home_score}-{pred.predicted_away_score}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground mb-1">Faktisk</p>
                        <p className="font-medium">
                          {match.home_score}-{match.away_score}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground">
                      Tillid: {pred.confidence}% • 
                      Forudsagt: {predictedResult === 'home_win' ? 'Hjemmesejr' : predictedResult === 'away_win' ? 'Udesejr' : 'Uafgjort'} • 
                      Resultat: {pred.actual_result === 'home_win' ? 'Hjemmesejr' : pred.actual_result === 'away_win' ? 'Udesejr' : 'Uafgjort'}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Ingen forudsigelser med resultater endnu.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
