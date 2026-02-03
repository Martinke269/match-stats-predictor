'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, Target, BarChart3, Activity, Shield, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link href="/">
          <Button variant="outline" className="mb-6 border-slate-600 text-slate-300 hover:bg-slate-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tilbage til forsiden
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="h-12 w-12 text-blue-400" />
            <h1 className="text-5xl font-bold text-white">Sådan Virker Det</h1>
          </div>
          <p className="text-xl text-blue-200">Forstå hvordan vores AI-drevne predictions beregnes</p>
        </div>

        {/* Confidence Score Explanation */}
        <Card className="mb-8 bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-400" />
              Hvad er Tillid (Confidence)?
            </CardTitle>
            <CardDescription className="text-slate-300">
              Tillid er vores mål for hvor sikre vi er på en prediction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-slate-300">
              <p className="mb-4">
                Tillid-scoren viser hvor pålidelig en prediction er baseret på statistiske data. 
                Jo højere tillid, jo stærkere er indikatorerne for resultatet.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-500 text-white">85-95%</Badge>
                  <span>Meget høj tillid - Stærke indikatorer peger i samme retning</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-600 text-white">80-84%</Badge>
                  <span>Høj tillid - Klare fordele for ét hold</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-yellow-500 text-white">70-79%</Badge>
                  <span>Moderat tillid - Nogle fordele, men ikke afgørende</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-orange-500 text-white">60-69%</Badge>
                  <span>Lav tillid - Tæt kamp, svært at forudsige</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-500 text-white">&lt;60%</Badge>
                  <span>Meget lav tillid - Meget usikkert resultat</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How Confidence is Calculated */}
        <Card className="mb-8 bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-400" />
              Hvordan Beregnes Tillid?
            </CardTitle>
            <CardDescription className="text-slate-300">
              Tillid-scoren bygger på flere faktorer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {/* Base Confidence */}
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Basis Tillid: 50%</h3>
                </div>
                <p className="text-slate-300 text-sm">
                  Alle predictions starter med en basis tillid på 50%
                </p>
              </div>

              {/* Probability Difference */}
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Sandsynlighedsforskel: Op til +30%</h3>
                </div>
                <p className="text-slate-300 text-sm mb-2">
                  Jo større forskel mellem hjemmesejr og udesejr sandsynlighed, jo højere tillid
                </p>
                <div className="bg-slate-900/50 p-3 rounded text-xs text-slate-400">
                  Eksempel: Hvis hjemmesejr er 67.5% og udesejr er 7.5%, giver det en forskel på 60%, 
                  hvilket tilføjer 36 point til tilliden (60% × 0.6 = 36, men max 30)
                </div>
              </div>

              {/* Form Difference */}
              <div className="border-l-4 border-yellow-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Formforskel: Op til +15%</h3>
                </div>
                <p className="text-slate-300 text-sm mb-2">
                  Baseret på de seneste 5 kampes resultater (W/D/L)
                </p>
                <div className="bg-slate-900/50 p-3 rounded text-xs text-slate-400">
                  Eksempel: Hold med form WWWWD vs LLDLL har stor formforskel, 
                  hvilket kan tilføje op til 15 point
                </div>
              </div>

              {/* Win Rate Difference */}
              <div className="border-l-4 border-purple-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Sejrsrate Forskel: Op til +10%</h3>
                </div>
                <p className="text-slate-300 text-sm mb-2">
                  Historisk sejrsrate gennem sæsonen
                </p>
                <div className="bg-slate-900/50 p-3 rounded text-xs text-slate-400">
                  Eksempel: Hold med 70% sejrsrate vs hold med 20% sejrsrate 
                  tilføjer 10 point (50% forskel × 20 = 10)
                </div>
              </div>

              {/* Goal Difference */}
              <div className="border-l-4 border-red-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-white">Målforskel: Op til +10%</h3>
                </div>
                <p className="text-slate-300 text-sm mb-2">
                  Forskel i målscore (mål scoret minus mål indkasseret)
                </p>
                <div className="bg-slate-900/50 p-3 rounded text-xs text-slate-400">
                  Eksempel: Hold med +18 målforskel vs hold med -2 målforskel 
                  giver en forskel på 20, hvilket tilføjer 10 point (20 × 0.5 = 10, max 10)
                </div>
              </div>
            </div>

            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mt-6">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-400" />
                Samlet Beregning
              </h4>
              <p className="text-slate-300 text-sm mb-3">
                Tillid = 50% (basis) + Sandsynlighedsforskel + Formforskel + Sejrsrate + Målforskel
              </p>
              <p className="text-slate-400 text-xs">
                Maksimum tillid er begrænset til 95% for at reflektere at fodbold altid har et element af uforudsigelighed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Other Factors */}
        <Card className="mb-8 bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-6 w-6 text-green-400" />
              Andre Faktorer i Predictions
            </CardTitle>
            <CardDescription className="text-slate-300">
              Hvad påvirker selve prediction resultatet?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-slate-300">
              <div className="flex items-start gap-3">
                <Home className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Hjemmebanefordel</h4>
                  <p className="text-sm">Hjemmeholdet får automatisk en fordel, da statistik viser bedre præstation hjemme</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Aktuel Form</h4>
                  <p className="text-sm">De seneste 5 kampes resultater vægtes højere end ældre resultater</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Angrebsstyrke</h4>
                  <p className="text-sm">Gennemsnitligt antal mål scoret per kamp</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Defensiv Styrke</h4>
                  <p className="text-sm">Antal clean sheets og mål indkasseret</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Note */}
        <Card className="mb-8 bg-yellow-900/20 border-yellow-700">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-yellow-400 text-2xl">⚠️</div>
              <div>
                <h3 className="text-white font-semibold mb-2">Vigtigt at Huske</h3>
                <p className="text-slate-300 text-sm mb-2">
                  Selv predictions med høj tillid er ikke garantier. Fodbold er uforudsigeligt, 
                  og mange faktorer kan påvirke resultatet:
                </p>
                <ul className="list-disc list-inside text-slate-300 text-sm space-y-1 ml-4">
                  <li>Skader og suspenderinger</li>
                  <li>Vejrforhold</li>
                  <li>Motivation og psykologi</li>
                  <li>Dommerbeslutninger</li>
                  <li>Held og tilfældigheder</li>
                </ul>
                <p className="text-slate-400 text-xs mt-3">
                  Brug predictions som vejledning, ikke som absolutte sandheder.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Link href="/">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Trophy className="h-5 w-5 mr-2" />
              Se Dagens Predictions
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
