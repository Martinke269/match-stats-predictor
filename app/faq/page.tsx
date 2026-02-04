import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'FAQ - Ofte stillede spørgsmål | AI Match Predictor',
  description: 'Find svar på de mest stillede spørgsmål om AI Match Predictor og vores AI-drevne fodboldforudsigelser.',
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <HelpCircle className="h-16 w-16 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ofte stillede spørgsmål
          </h1>
          <p className="text-xl text-blue-200">
            Find svar på dine spørgsmål om AI Match Predictor
          </p>
        </div>

        {/* FAQ Accordion */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 mb-8">
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              
              {/* Generelt */}
              <AccordionItem value="item-1" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-300">
                  Hvad er AI Match Predictor?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  AI Match Predictor er et datadrevet analyseværktøj, der bruger kunstig intelligens til at forudsige resultater af fodboldkampe. Systemet analyserer store mængder data fra de største europæiske ligaer og leverer objektive forudsigelser baseret på statistiske mønstre.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-300">
                  Hvilke ligaer dækker I?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Vi dækker seks store europæiske ligaer:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Superligaen (Danmark)</li>
                    <li>Premier League (England)</li>
                    <li>La Liga (Spanien)</li>
                    <li>Serie A (Italien)</li>
                    <li>Bundesliga (Tyskland)</li>
                    <li>Ligue 1 (Frankrig)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-300">
                  Er AI Match Predictor en tipster-tjeneste?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Nej. AI Match Predictor er ikke en tipster-tjeneste. Det er et teknisk analyseværktøj bygget til at automatisere dataanalyse og levere objektive forudsigelser. Vi lover ikke gevinster, men tilbyder et værktøj til at forstå kampene på en mere datadrevet måde.
                </AccordionContent>
              </AccordionItem>

              {/* Om AI og forudsigelser */}
              <AccordionItem value="item-4" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-300">
                  Hvordan fungerer jeres AI-model?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Vores AI-model analyserer historiske kampdata, holdstatistikker og andre relevante faktorer for at identificere mønstre. Modellen er trænet på store datasæt og evaluerer hver kamp objektivt uden menneskelig bias. De specifikke detaljer om algoritmen og vægtningen af forskellige faktorer holder vi fortrolige for at bevare systemets integritet.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4b" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-300">
                  Hvilke faktorer indgår i beregningen?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Vores AI-model analyserer en række forskellige faktorer for at lave forudsigelser:
                  <ul className="list-disc list-inside mt-3 space-y-2">
                    <li><strong>Holdkvalitet:</strong> Samlet vurdering baseret på sejrsrate, målforskel, form og defensive præstationer</li>
                    <li><strong>Seneste form:</strong> Resultater fra de seneste kampe, hvor nyere resultater vægtes højere</li>
                    <li><strong>Hjemmebanefordel:</strong> Statistisk fordel ved at spille på hjemmebane</li>
                    <li><strong>Målforskel:</strong> Forskellen mellem scorede og indkasserede mål</li>
                    <li><strong>Sejrsrate:</strong> Procentdel af vundne kampe i sæsonen</li>
                    <li><strong>Defensiv styrke:</strong> Evne til at holde modstanderen fra at score (clean sheets)</li>
                    <li><strong>Angrebsstyrke:</strong> Gennemsnitligt antal mål scoret per kamp</li>
                    <li><strong>⚡ Overraskelsesfaktor:</strong> Giver underdogs en realistisk chance for at vinde baseret på deres form og kampens kontekst</li>
                    <li><strong>Vinterpause-effekt:</strong> Reduceret vægt på historiske data efter lange pauser</li>
                    <li><strong>Kampbelastning:</strong> Europæiske kampe og pokalkampe der kan påvirke holdets præstation</li>
                  </ul>
                  <p className="mt-3 text-slate-400 italic">
                    De præcise vægtninger af disse faktorer holder vi fortrolige for at bevare systemets integritet, men alle faktorer bidrager til den endelige forudsigelse.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-300">
                  Hvor præcise er jeres forudsigelser?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Vores model måles gennem åben statistik og hitrate. Præcisionen varierer afhængigt af liga og kamptype, men vi stræber efter gennemsigtighed i alle resultater. Ingen forudsigelsesmodel kan være 100% præcis, da fodbold indeholder mange uforudsigelige elementer. Vi fokuserer på at levere konsistente, datadrevne analyser frem for at cherry-picke succeshistorier.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-300">
                  Hvad betyder "confidence" i forudsigelserne?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Confidence-værdien angiver, hvor sikker modellen er på sin forudsigelse, udtrykt i procent. En højere confidence betyder, at modellen har identificeret stærkere mønstre og statistiske indikatorer for det forudsagte resultat. Det er dog vigtigt at huske, at selv høj confidence ikke garanterer et korrekt resultat.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-300">
                  Opdateres forudsigelserne løbende?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Ja, systemet opdaterer forudsigelser automatisk baseret på nye data og kampresultater. Modellen lærer kontinuerligt af nye resultater og justerer sine analyser derefter. Dette sikrer, at forudsigelserne altid er baseret på de mest aktuelle data.
                </AccordionContent>
              </AccordionItem>

              {/* Brug af platformen */}
              <AccordionItem value="item-8" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-300">
                  Er AI Match Predictor gratis at bruge?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Ja, alle forudsigelser og analyser på platformen er gratis tilgængelige. Vores mål er at gøre datadrevet fodboldanalyse tilgængelig for alle interesserede.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-300">
                  Skal jeg oprette en konto for at se forudsigelser?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Nej, du kan se alle forudsigelser uden at oprette en konto. Platformen er åben og tilgængelig for alle besøgende.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-300">
                  Kan jeg eksportere forudsigelserne?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Ja, på hver liga-side finder du en "Eksporter til PDF" knap, der giver dig mulighed for at downloade forudsigelserne i et læsevenligt PDF-format.
                </AccordionContent>
              </AccordionItem>

              {/* Datakilder og metode */}
              <AccordionItem value="item-11" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-300">
                  Hvor kommer jeres data fra?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Vi indsamler data fra offentligt tilgængelige kilder, herunder officielle ligastatistikker og kampresultater. Alle data behandles og analyseres af vores AI-model for at generere forudsigelser.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-12" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-300">
                  Tager I højde for skader og suspenderinger?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Vores model fokuserer primært på historiske præstationsdata og statistiske mønstre. Aktuelle holdnyheder som skader og suspenderinger indgår ikke direkte i modellen, da disse data er svære at kvantificere konsistent. Vi anbefaler derfor altid at supplere vores forudsigelser med egen research om aktuelle holdforhold.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-13" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-300">
                  Hvorfor deler I jeres forudsigelser gratis?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Projektet startede som et teknisk eksperiment for at se, om AI kunne analysere fodboldkampe mere objektivt end manuel analyse. Ved at dele forudsigelserne åbent bidrager vi til transparens og giver fodboldinteresserede adgang til datadrevet analyse. Modellen mister ikke værdi af, at flere bruger den – tværtimod bliver den bedre med mere data.
                </AccordionContent>
              </AccordionItem>

              {/* Ansvar og anbefalinger */}
              <AccordionItem value="item-14" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-300">
                  Kan jeg bruge jeres forudsigelser til betting?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  AI Match Predictor er et analyseværktøj, ikke en betting-rådgivning. Hvis du vælger at bruge forudsigelserne i forbindelse med betting, gør du det på eget ansvar. Vi opfordrer altid til ansvarligt spil og anbefaler aldrig at satse mere, end du har råd til at tabe. Husk, at ingen forudsigelsesmodel kan garantere gevinster.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-15" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-300">
                  Hvad er jeres ansvarsfraskrivelse?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  AI Match Predictor leverer forudsigelser baseret på dataanalyse og maskinlæring. Vi garanterer ikke nøjagtigheden af forudsigelserne, og vi påtager os intet ansvar for eventuelle tab eller skader, der måtte opstå som følge af brug af vores tjeneste. Alle beslutninger truffet på baggrund af vores forudsigelser er brugerens eget ansvar.
                </AccordionContent>
              </AccordionItem>

              {/* Teknisk og support */}
              <AccordionItem value="item-16" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-300">
                  Hvordan kan jeg kontakte jer?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  For spørgsmål eller feedback er du velkommen til at kontakte os gennem vores kontaktformular eller via de sociale medier, hvis vi har sådanne kanaler. Vi bestræber os på at svare på alle henvendelser inden for rimelig tid.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-17" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-300">
                  Udvikles platformen stadig?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Ja, AI Match Predictor er et løbende projekt. Vi arbejder kontinuerligt på at forbedre modellens nøjagtighed, tilføje nye funktioner og optimere brugeroplevelsen. Feedback fra brugere er værdifuld i denne proces.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-18" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-300">
                  Bruger I cookies på siden?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Ja, vi bruger cookies til at forbedre brugeroplevelsen og analysere trafikken på siden. Du kan læse mere om vores brug af cookies i vores <Link href="/cookie-policy" className="text-blue-400 hover:text-blue-300 underline">cookie-politik</Link>.
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Har du flere spørgsmål?
              </h2>
              <p className="text-blue-200 mb-6">
                Læs mere om projektet, eller se vores seneste forudsigelser
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/about">
                    Om projektet
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-600/20">
                  <Link href="/">
                    Se forudsigelser
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
