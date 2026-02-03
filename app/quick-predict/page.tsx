import { QuickPredict } from '@/components/quick-predict';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, TrendingUp, Target } from 'lucide-react';

export default function QuickPredictPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                Hurtig Forudsigelse
              </h1>
              <p className="text-muted-foreground mt-1">
                Indtast to holdnavne og få øjeblikkelig statistik og betting-forudsigelse
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Hurtig Søgning</h3>
                  <p className="text-sm text-muted-foreground">Automatisk team lookup</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Live Statistikker</h3>
                  <p className="text-sm text-muted-foreground">Opdaterede team stats</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Betting Insights</h3>
                  <p className="text-sm text-muted-foreground">Præcise forudsigelser</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Predict Component */}
        <QuickPredict />
      </main>
    </div>
  );
}
