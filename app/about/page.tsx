import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrendingUp, Shield, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Om os | AI Match Predictor',
  description: 'Lær mere om projektet bag AI Match Predictor - et datadrevet analyseværktøj til fodboldkampe.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Om projektet
          </h1>
          <p className="text-xl text-blue-200">
            Et datadrevet analyseværktøj til fodboldkampe
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 mb-8">
          <CardContent className="pt-6">
            <div className="prose prose-invert max-w-none">
              <div className="text-slate-200 space-y-6 leading-relaxed">
                <p>
                  Projektet udspringer af mere end to årtiers arbejde med fodboldstatistikker. Siden 1999 har jeg analyseret kampe, mønstre og tendenser — både for min egen nysgerrighed og for at forstå spillet bedre. Gennem årene har jeg vundet mange penge på at kombinere data og intuition, men processen var altid den samme: timevis af manuelle analyser, Excel‑ark og mavefornemmelser, der i sidste ende var svære at gøre konsistente.
                </p>

                <p>
                  På et tidspunkt blev det tydeligt, at jeg ikke længere ville bruge min tid på at gennemgå data kamp for kamp. Jeg ville bygge noget, der kunne gøre arbejdet for mig — objektivt, stabilt og uden bias. Derfor begyndte udviklingen af en AI‑model, der kunne erstatte min egen mavefornemmelse og analysere fodboldkampe på en mere systematisk måde.
                </p>

                <p>
                  AI‑motoren bag siden er udviklet som et teknisk eksperiment, ikke som et forsøg på at "slå bookmakerne". Tværtimod: projektet handler om at automatisere en proces, jeg tidligere selv brugte enorme mængder tid på. Modellen gennemgår store datamængder, finder mønstre og evaluerer alle kampe i alle ligaer — uden cherry‑picking, uden skjulte perioder og uden selektive resultater. Alt måles gennem åben statistik og hitrate.
                </p>

                <p className="text-lg font-semibold text-blue-300">
                  Det her er ikke en tipster‑tjeneste. Det er et datadrevet analyseværktøj, skabt til at give et mere gennemsigtigt, stabilt og objektivt blik på fodboldkampe.
                </p>

                <p>
                  Modellen mister ikke værdi af, at flere bruger den — den er bygget til at skalere, og dens styrke ligger i data, ikke i hemmelige spil.
                </p>

                <p>
                  Projektet udvikles løbende med fokus på transparens, teknologi og brugervenlighed. Målet er ikke at love gevinster, men at give fodboldinteresserede et værktøj, der kan hjælpe dem med at forstå kampene på en ny måde.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Brain className="h-6 w-6 text-blue-400" />
                AI-drevet analyse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Avanceret maskinlæring analyserer store mængder data for at finde mønstre og levere objektive forudsigelser.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <TrendingUp className="h-6 w-6 text-green-400" />
                Åben statistik
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Alle resultater måles gennem åben statistik og hitrate. Ingen skjulte perioder eller selektive resultater.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Shield className="h-6 w-6 text-purple-400" />
                Transparens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Fokus på gennemsigtighed i metoder og resultater. Ingen cherry-picking eller manipulation af data.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Users className="h-6 w-6 text-orange-400" />
                Kontinuerlig udvikling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Projektet forbedres løbende med fokus på nøjagtighed, stabilitet og brugervenlighed.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Klar til at udforske forudsigelserne?
              </h2>
              <p className="text-blue-200 mb-6">
                Se de seneste AI‑genererede analyser for alle de store europæiske ligaer.
              </p>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/">
                  Se forudsigelser
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
