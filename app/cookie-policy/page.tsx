import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookiepolitik | Match Stats Predictor',
  description: 'Læs om hvordan Match Stats Predictor bruger cookies på hjemmesiden.',
};

export default function CookiePolicyPage() {
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
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">Cookiepolitik</h1>
          
          <div className="space-y-6 text-slate-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Hvad er cookies?</h2>
              <p>
                Cookies er små tekstfiler, som gemmes på din computer, tablet eller smartphone, 
                når du besøger vores hjemmeside. Cookies hjælper os med at gøre hjemmesiden mere 
                brugervenlig og give dig en bedre oplevelse.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Hvordan bruger vi cookies?</h2>
              <p className="mb-3">
                Match Stats Predictor bruger cookies til følgende formål:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-white">Nødvendige cookies:</strong> Disse cookies er nødvendige 
                  for at hjemmesiden kan fungere korrekt. De bruges til at huske dine præferencer og 
                  indstillinger, såsom dit cookievalg og login-status.
                </li>
                <li>
                  <strong className="text-white">Funktionelle cookies:</strong> Disse cookies hjælper os 
                  med at forbedre hjemmesidens funktionalitet og give dig en bedre brugeroplevelse.
                </li>
                <li>
                  <strong className="text-white">Analytiske cookies:</strong> Vi bruger cookies til at 
                  indsamle anonymiserede data om, hvordan besøgende bruger vores hjemmeside. Dette hjælper 
                  os med at forbedre hjemmesiden og dens indhold.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Hvilke cookies bruger vi?</h2>
              <div className="space-y-4">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Nødvendige cookies</h3>
                  <ul className="space-y-2 text-sm">
                    <li><strong>cookie-consent:</strong> Gemmer dit valg om cookies</li>
                    <li><strong>Supabase auth cookies:</strong> Bruges til at håndtere login og autentificering</li>
                  </ul>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Funktionelle cookies</h3>
                  <ul className="space-y-2 text-sm">
                    <li><strong>localStorage data:</strong> Gemmer dine præferencer og indstillinger lokalt i din browser</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Hvordan styrer du cookies?</h2>
              <p className="mb-3">
                Du kan til enhver tid ændre eller trække dit samtykke til cookies tilbage. 
                Du kan gøre dette ved at:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Slette cookies i din browsers indstillinger</li>
                <li>Blokere cookies i din browsers indstillinger</li>
                <li>Rydde din browsers cache og cookies</li>
              </ul>
              <p className="mt-3">
                Bemærk, at hvis du vælger at blokere eller slette cookies, kan det påvirke 
                hjemmesidens funktionalitet, og nogle funktioner vil muligvis ikke fungere korrekt.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Tredjepartscookies</h2>
              <p>
                Vi bruger Supabase til autentificering og database-funktionalitet. Supabase kan 
                sætte deres egne cookies for at levere deres tjenester. Du kan læse mere om 
                Supabase's cookiepolitik på deres hjemmeside.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Opdateringer af cookiepolitikken</h2>
              <p>
                Vi forbeholder os retten til at opdatere denne cookiepolitik fra tid til anden. 
                Eventuelle ændringer vil blive offentliggjort på denne side.
              </p>
              <p className="mt-3">
                <strong className="text-white">Sidst opdateret:</strong> 4. februar 2026
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Kontakt</h2>
              <p>
                Hvis du har spørgsmål til vores cookiepolitik, er du velkommen til at kontakte os.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-slate-700">
              <Link 
                href="/terms"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Læs vores brugerbetingelser →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
