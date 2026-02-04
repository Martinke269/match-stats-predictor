import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Brugerbetingelser | Match Stats Predictor',
  description: 'Læs brugerbetingelserne for Match Stats Predictor.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Tilbage til forsiden
        </Link>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">Brugerbetingelser</h1>
          
          <div className="space-y-6 text-slate-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">1. Acceptering af betingelser</h2>
              <p>
                Ved at bruge Match Stats Predictor accepterer du disse brugerbetingelser. 
                Hvis du ikke accepterer betingelserne, bedes du ikke bruge hjemmesiden.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">2. Beskrivelse af tjenesten</h2>
              <p className="mb-3">
                Match Stats Predictor er en platform, der leverer AI-drevne fodboldkamp-predictions 
                for forskellige europæiske ligaer, herunder:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Superligaen (Danmark)</li>
                <li>Premier League (England)</li>
                <li>La Liga (Spanien)</li>
                <li>Serie A (Italien)</li>
                <li>Bundesliga (Tyskland)</li>
                <li>Ligue 1 (Frankrig)</li>
              </ul>
              <p className="mt-3">
                Vores predictions er baseret på statistisk analyse og maskinlæring, men er ikke 
                garantier for faktiske resultater.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">3. Ansvarsfraskrivelse</h2>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-3">
                <p className="font-semibold text-yellow-200 mb-2">⚠️ Vigtigt</p>
                <p>
                  Match Stats Predictor leverer predictions til underholdningsformål. 
                  Vi garanterer ikke nøjagtigheden af vores predictions, og de bør ikke 
                  bruges som grundlag for væddemål eller finansielle beslutninger.
                </p>
              </div>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Predictions er baseret på historiske data og statistisk analyse</li>
                <li>Faktiske kampresultater kan afvige fra vores predictions</li>
                <li>Vi er ikke ansvarlige for tab eller skader som følge af brug af vores predictions</li>
                <li>Brug af hjemmesiden sker på eget ansvar</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">4. Brugeradfærd</h2>
              <p className="mb-3">Ved at bruge Match Stats Predictor accepterer du at:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Bruge hjemmesiden lovligt og i overensstemmelse med disse betingelser</li>
                <li>Ikke misbruge eller forsøge at hacke hjemmesiden</li>
                <li>Ikke kopiere, distribuere eller modificere indhold uden tilladelse</li>
                <li>Ikke bruge hjemmesiden til kommercielle formål uden forudgående aftale</li>
                <li>Respektere andre brugeres privatliv og rettigheder</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">5. Intellektuel ejendomsret</h2>
              <p>
                Alt indhold på Match Stats Predictor, herunder tekst, grafik, logoer, ikoner, 
                billeder, lydklip, digitale downloads og software, er ejet af Match Stats Predictor 
                eller dets licensgivere og er beskyttet af dansk og international ophavsret.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">6. Brugerkonti</h2>
              <p className="mb-3">
                Hvis du opretter en konto på Match Stats Predictor, er du ansvarlig for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>At holde dine loginoplysninger fortrolige</li>
                <li>Alle aktiviteter, der sker under din konto</li>
                <li>At informere os øjeblikkeligt om uautoriseret brug af din konto</li>
              </ul>
              <p className="mt-3">
                Vi forbeholder os retten til at suspendere eller slette konti, der overtræder 
                disse betingelser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">7. Databeskyttelse</h2>
              <p>
                Vi tager din privatliv alvorligt. Læs vores{' '}
                <Link href="/cookie-policy" className="text-blue-400 hover:text-blue-300 underline">
                  cookiepolitik
                </Link>
                {' '}for at forstå, hvordan vi indsamler, bruger og beskytter dine personlige oplysninger.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">8. Tredjepartslinks</h2>
              <p>
                Match Stats Predictor kan indeholde links til tredjepartswebsteder. Vi er ikke 
                ansvarlige for indholdet eller privatlivspraksis på disse websteder. Brug af 
                tredjepartswebsteder sker på eget ansvar.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">9. Ændringer af betingelser</h2>
              <p>
                Vi forbeholder os retten til at ændre disse brugerbetingelser til enhver tid. 
                Ændringer træder i kraft, når de offentliggøres på hjemmesiden. Din fortsatte 
                brug af hjemmesiden efter ændringer udgør din accept af de nye betingelser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">10. Opsigelse</h2>
              <p>
                Vi forbeholder os retten til at opsige eller suspendere din adgang til 
                Match Stats Predictor uden varsel, hvis du overtræder disse betingelser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">11. Ansvarsbegrænsning</h2>
              <p>
                Match Stats Predictor leveres "som den er" uden garantier af nogen art. 
                Vi er ikke ansvarlige for direkte, indirekte, tilfældige eller følgeskader, 
                der opstår som følge af brug af hjemmesiden.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">12. Gældende lov</h2>
              <p>
                Disse brugerbetingelser er underlagt dansk lov. Eventuelle tvister skal 
                afgøres ved danske domstole.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">13. Kontakt</h2>
              <p>
                Hvis du har spørgsmål til disse brugerbetingelser, er du velkommen til at 
                kontakte os.
              </p>
              <p className="mt-3">
                <strong className="text-white">Sidst opdateret:</strong> 4. februar 2026
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-slate-700">
              <Link 
                href="/cookie-policy"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Læs vores cookiepolitik →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
