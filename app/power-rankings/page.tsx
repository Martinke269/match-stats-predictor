import { getAllLeaguePowerRankings } from '@/lib/power-rankings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Zap, Shield, Target } from 'lucide-react';
import Link from 'next/link';
import { AIDisclaimer } from '@/components/ai-disclaimer';

export const metadata = {
  title: 'Power Rankings - Mesterskabsfavoritter | Fodbold Prædiktioner',
  description: 'Se vores power rankings og find ud af, hvem der er favoritter til at vinde mesterskabet i Superligaen, Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Primeira Liga og Eredivisie.',
};

export default function PowerRankingsPage() {
  const allRankings = getAllLeaguePowerRankings();

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-white" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-white" />;
    return <Minus className="h-4 w-4 text-white" />;
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return 'bg-green-600 text-white border-green-400';
    if (trend === 'down') return 'bg-red-600 text-white border-red-400';
    return 'bg-gray-600 text-white border-gray-400';
  };

  const getLeagueColor = (leagueId: string) => {
    const colors: Record<string, string> = {
      'superliga': 'from-yellow-600/30 to-green-600/30 border-yellow-400',
      'premier-league': 'from-pink-600/30 to-purple-600/30 border-pink-400',
      'la-liga': 'from-orange-600/30 to-red-600/30 border-orange-400',
      'serie-a': 'from-blue-600/30 to-cyan-600/30 border-blue-400',
      'bundesliga': 'from-red-600/30 to-yellow-600/30 border-red-400',
      'ligue1': 'from-purple-600/30 to-blue-600/30 border-purple-400',
      'primeira-liga': 'from-green-600/30 to-emerald-600/30 border-green-400',
      'eredivisie': 'from-orange-600/30 to-amber-600/30 border-orange-400',
    };
    return colors[leagueId] || 'from-gray-600/30 to-slate-600/30 border-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-12 w-12 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Power Rankings
            </h1>
            <Trophy className="h-12 w-12 text-yellow-400" />
          </div>
          <p className="text-xl text-white max-w-3xl mx-auto font-semibold">
            Hvem bliver mestre? Se vores avancerede power rankings baseret på form, statistik og præstationer
          </p>
          
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link href="/">
              <Badge variant="outline" className="cursor-pointer hover:bg-white/20 text-white border-white/50 px-4 py-2 font-semibold">
                🏠 Forside
              </Badge>
            </Link>
            <Link href="/how-it-works">
              <Badge variant="outline" className="cursor-pointer hover:bg-white/20 text-white border-white/50 px-4 py-2 font-semibold">
                ℹ️ Sådan virker det
              </Badge>
            </Link>
            <Link href="/quick-predict">
              <Badge variant="outline" className="cursor-pointer hover:bg-white/20 text-white border-white/50 px-4 py-2 font-semibold">
                ⚡ Hurtig Prædiktion
              </Badge>
            </Link>
          </div>
        </div>

        <AIDisclaimer />

        {/* League Power Rankings */}
        {allRankings.map((leagueRanking) => (
          <div key={leagueRanking.leagueId} className="mb-12">
            <Card className={`bg-gradient-to-br ${getLeagueColor(leagueRanking.leagueId)} bg-slate-900/95 border-2 backdrop-blur-sm`}>
              <CardHeader className="bg-slate-900/60 rounded-t-lg">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle className="text-3xl text-white flex items-center gap-3 font-bold">
                      <Trophy className="h-8 w-8 text-yellow-400" />
                      {leagueRanking.leagueName}
                    </CardTitle>
                    <CardDescription className="text-white mt-2 text-lg font-semibold">
                      {leagueRanking.analysis}
                    </CardDescription>
                  </div>
                  <Link href={`/${leagueRanking.leagueId}`} className="inline-block">
                    <Badge className="bg-white/30 hover:bg-white/40 text-white border-white/50 cursor-pointer px-4 py-2 font-bold">
                      Se alle kampe →
                    </Badge>
                  </Link>
                </div>

                {/* Top Contender & Dark Horse */}
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-yellow-600/30 border-2 border-yellow-400 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-5 w-5 text-yellow-300" />
                      <h3 className="text-lg font-bold text-white">Topfavorit</h3>
                    </div>
                    <p className="text-white text-xl font-bold">{leagueRanking.topContender.team.name}</p>
                    <p className="text-white font-bold text-base">
                      {leagueRanking.topContender.championshipProbability}% sandsynlighed for mesterskab
                    </p>
                  </div>

                  <div className="bg-purple-600/30 border-2 border-purple-400 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-purple-300" />
                      <h3 className="text-lg font-bold text-white">Dark Horse</h3>
                    </div>
                    <p className="text-white text-xl font-bold">{leagueRanking.darkHorse.team.name}</p>
                    <p className="text-white font-bold text-base">
                      Stigende form - kan overraske
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="bg-slate-900/60">
                {/* Rankings Table */}
                <div className="space-y-3">
                  {leagueRanking.rankings.map((ranking) => (
                    <div
                      key={ranking.team.id}
                      className={`bg-slate-800 backdrop-blur-sm rounded-lg p-4 border-2 transition-all hover:scale-[1.02] ${
                        ranking.rank === 1
                          ? 'border-yellow-400 bg-yellow-900/20'
                          : ranking.rank <= 3
                          ? 'border-blue-400'
                          : 'border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        {/* Rank & Team */}
                        <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                          <div
                            className={`text-2xl font-bold w-10 h-10 rounded-full flex items-center justify-center ${
                              ranking.rank === 1
                                ? 'bg-yellow-500 text-slate-900'
                                : ranking.rank === 2
                                ? 'bg-gray-300 text-slate-900'
                                : ranking.rank === 3
                                ? 'bg-orange-500 text-white'
                                : 'bg-slate-600 text-white'
                            }`}
                          >
                            {ranking.rank}
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-white">{ranking.team.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`${getTrendColor(ranking.trend)} border-2 font-bold`}>
                                {getTrendIcon(ranking.trend)}
                                <span className="ml-1">
                                  {ranking.trend === 'up' ? 'Stigende' : ranking.trend === 'down' ? 'Faldende' : 'Stabil'}
                                </span>
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 flex-wrap">
                          <div className="text-center">
                            <div className="text-sm text-white font-bold">Power Score</div>
                            <div className="text-2xl font-bold text-white">{ranking.powerScore}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-white font-bold">Mesterskab</div>
                            <div className="text-2xl font-bold text-yellow-300">
                              {ranking.championshipProbability}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Strengths & Weaknesses */}
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-green-300" />
                            <span className="text-sm font-bold text-white">Styrker</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {ranking.strengths.map((strength, idx) => (
                              <Badge key={idx} className="bg-green-600 text-white border-green-400 border-2 font-bold">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-4 w-4 text-red-300" />
                            <span className="text-sm font-bold text-white">Svagheder</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {ranking.weaknesses.map((weakness, idx) => (
                              <Badge key={idx} className="bg-red-600 text-white border-red-400 border-2 font-bold">
                                {weakness}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Form */}
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-sm text-white font-bold">Seneste form:</span>
                        <div className="flex gap-1">
                          {ranking.team.form.map((result, idx) => (
                            <div
                              key={idx}
                              className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                result === 'W'
                                  ? 'bg-green-500 text-white'
                                  : result === 'D'
                                  ? 'bg-yellow-500 text-slate-900'
                                  : 'bg-red-500 text-white'
                              }`}
                            >
                              {result}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Methodology */}
        <Card className="bg-slate-900/95 border-slate-600 border-2 backdrop-blur-sm mt-12">
          <CardHeader>
            <CardTitle className="text-2xl text-white font-bold">Sådan beregnes Power Rankings</CardTitle>
          </CardHeader>
          <CardContent className="text-white space-y-4">
            <p className="font-semibold text-base">
              Vores power ranking system analyserer flere faktorer for at vurdere hvert holds mesterskabschancer:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 font-semibold text-base">
              <li><strong className="text-white">Aktuel form (25%):</strong> Resultater fra de seneste 5 kampe</li>
              <li><strong className="text-white">Offensiv styrke (25%):</strong> Mål scoret, skudpræcision og angrebseffektivitet</li>
              <li><strong className="text-white">Defensiv styrke (20%):</strong> Mål indkasseret, clean sheets og defensiv stabilitet</li>
              <li><strong className="text-white">Konsistens (20%):</strong> Sejrsrate og præstationsstabilitet</li>
              <li><strong className="text-white">Boldbesiddelse (5%):</strong> Kontrol over kampen</li>
              <li><strong className="text-white">Pasningspræcision (5%):</strong> Teknisk kvalitet</li>
            </ul>
            <p className="text-white mt-4 font-semibold text-base">
              Mesterskabssandsynligheden beregnes ved hjælp af en eksponentiel fordeling, der favoriserer tophold, 
              men stadig giver lavere rangerede hold en realistisk chance baseret på deres præstationer.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
