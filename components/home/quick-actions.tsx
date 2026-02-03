import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Award, Trophy } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
      {/* Quick Predict CTA */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-blue-500 transition-all">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Search className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Hurtig Forudsigelse</h3>
                <p className="text-sm text-slate-300">
                  Indtast selv holdnavne og få øjeblikkelig prediction
                </p>
              </div>
            </div>
            <Link href="/quick-predict">
              <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4" />
                Prøv Nu
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Superliga CTA */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-yellow-500 transition-all">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Award className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Alle Superliga Kampe</h3>
                <p className="text-sm text-slate-300">
                  Se alle predictions inkl. lavere tillid
                </p>
              </div>
            </div>
            <Link href="/superliga">
              <Button size="lg" variant="outline" className="gap-2 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
                <Award className="h-4 w-4" />
                Se Alle
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Ligue 1 CTA */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-purple-500 transition-all">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Alle Ligue 1 Kampe</h3>
                <p className="text-sm text-slate-300">
                  Se alle predictions inkl. lavere tillid
                </p>
              </div>
            </div>
            <Link href="/ligue1">
              <Button size="lg" variant="outline" className="gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                <Trophy className="h-4 w-4" />
                Se Alle
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Premier League CTA */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-pink-500 transition-all">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-pink-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Alle Premier League Kampe</h3>
                <p className="text-sm text-slate-300">
                  Se alle predictions inkl. lavere tillid
                </p>
              </div>
            </div>
            <Link href="/premier-league">
              <Button size="lg" variant="outline" className="gap-2 border-pink-500/30 text-pink-400 hover:bg-pink-500/10">
                <Trophy className="h-4 w-4" />
                Se Alle
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
