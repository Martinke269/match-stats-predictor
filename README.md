# Match Stats Predictor

<!-- Vercel deployment update -->

En avanceret match statistik og forudsigelsesmotor for sportskampe med **Machine Learning**, bygget med Next.js, TypeScript, og Tailwind CSS.

## 🎯 Features

- **Machine Learning Prediction Engine**: Neural network med deep learning til intelligente forudsigelser
- **Dual Prediction Modes**: Vælg mellem statistisk analyse eller ML-baserede forudsigelser
- **Live Training**: Træn ML-modellen direkte i browseren med historiske data
- **Intelligent Prediction Engine**: Analyserer flere faktorer for at forudsige kampresultater
- **Detaljerede Statistikker**: Viser omfattende holdstatistikker og form
- **Sandsynlighedsberegning**: Beregner sandsynligheder for sejr, uafgjort og nederlag
- **Visuel Præsentation**: Moderne UI med progress bars, badges og farvekodning
- **Confidence Score**: Viser hvor sikker forudsigelsen er baseret på datagrundlaget

## 🧠 Machine Learning Engine

### Neural Network Arkitektur
- **3 skjulte lag**: [10, 8, 6] neuroner for deep learning
- **21 input features**: Omfattende holdstatistikker normaliseret til 0-1 range
- **3 output neuroner**: One-hot encoding for sejr/uafgjort/nederlag
- **Sigmoid activation**: Optimal for sandsynlighedsberegning
- **20,000 iterations**: Grundig træning for høj nøjagtighed

### Input Features (per hold)
1. Form score (seneste 5 kampe)
2. Sejrsrate
3. Uafgjort rate
4. Nederlags rate
5. Scorede mål (normaliseret)
6. Indkasserede mål (normaliseret)
7. Clean sheet rate
8. Boldbesiddelse
9. Skud på mål (normaliseret)
10. Pasningsnøjagtighed
11. Hjemmebanefordel indikator

### Træningsdata
- **40+ historiske kampe** fra Superligaen
- Reelle kampresultater og statistikker
- Kontinuerlig opdatering mulig
- Model kan genoptrænes med nye data

## 🧮 Prediction Engines

### 1. Statistisk Engine (Regelbaseret)
Analyserer følgende faktorer:
- **Form** (20% vægt): Holdets seneste 5 kampe (W/D/L)
- **Målforskel** (15% vægt): Difference mellem scorede og indkasserede mål
- **Hjemmebanefordel** (15% vægt): Statistisk fordel ved at spille hjemme
- **Sejrsrate** (10% vægt): Procentdel af vundne kampe
- **Defensiv Styrke** (10% vægt): Antal clean sheets
- **Angrebsstyrke**: Gennemsnitligt antal mål per kamp

### 2. Machine Learning Engine (Neural Network)
- Lærer automatisk mønstre fra historiske data
- Identificerer komplekse sammenhænge mellem features
- Adaptiv vægtning baseret på træningsdata
- Højere præcision ved tilstrækkelig træningsdata

## 📊 Statistikker

For hvert hold vises:
- Seneste 5 kampes form (W/D/L badges)
- Samlet rekord (Sejre-Uafgjort-Nederlag)
- Scorede og indkasserede mål
- Clean sheets
- Målforskel
- Boldbesiddelse
- Skud på mål
- Pasningsnøjagtighed

## 🎨 Design

Projektet bruger:
- **shadcn/ui** komponenter for konsistent UI
- **Tailwind CSS** for styling
- **Lucide Icons** for ikoner
- **date-fns** for datoformatering
- **brain.js** for neural network machine learning
- Responsivt design der fungerer på alle skærmstørrelser

## 🚀 Kom i gang

```bash
# Installer dependencies
npm install

# Kør development server
npm run dev
```

Åbn [http://localhost:3000](http://localhost:3000) i din browser.

### Brug ML-funktionalitet
1. Klik på "Træn ML Model" knappen
2. Vent mens neural network trænes (progress bar vises)
3. Skift til "Machine Learning" tab for at se ML-forudsigelser
4. Sammenlign med statistiske forudsigelser ved at skifte tabs

## 📁 Projektstruktur

```
├── app/
│   ├── page.tsx          # Hovedside med ML-integration
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles og tema
├── components/
│   ├── match-card.tsx    # Match kort komponent
│   └── ui/               # shadcn/ui komponenter
├── lib/
│   ├── types.ts          # TypeScript type definitioner
│   ├── prediction-engine.ts      # Statistisk forudsigelsesalgoritme
│   ├── ml-prediction-engine.ts   # ML neural network engine
│   ├── training-data.ts          # Historiske kampe til træning
│   ├── sample-data.ts            # Sample data til demonstration
│   ├── brain.d.ts                # TypeScript definitions for brain.js
│   └── utils.ts                  # Utility funktioner
```

## 🔬 Teknisk Implementation

### Neural Network Training
```typescript
// Træn modellen
await mlEngine.train(historicalMatches, (progress) => {
  console.log(`Training: ${progress}%`);
});

// Lav forudsigelse
const prediction = mlEngine.predict(homeTeam, awayTeam, matchId);
```

### Feature Normalisering
Alle input features normaliseres til 0-1 range for optimal neural network performance:
- Procentbaserede værdier (sejrsrate, boldbesiddelse) divideres med 100
- Absolutte værdier (mål, skud) normaliseres med max-værdier
- Form scores beregnes som vægtet sum af seneste resultater

### Model Persistence
```typescript
// Export trænet model
const modelJson = mlEngine.exportModel();
localStorage.setItem('mlModel', modelJson);

// Import tidligere trænet model
const savedModel = localStorage.getItem('mlModel');
mlEngine.importModel(savedModel);
```

## 🔮 Fremtidige forbedringer

- ✅ Machine Learning baserede forudsigelser (IMPLEMENTERET)
- ✅ Neural network træning i browseren (IMPLEMENTERET)
- Integration med live sports API'er
- Historisk data tracking og nøjagtighed
- Avancerede ML-modeller (LSTM, Transformer)
- Bruger konti og favorit hold
- Push notifikationer for kampe
- Detaljeret statistik side for hvert hold
- Sammenligning af flere hold
- Export af forudsigelser
- Model accuracy tracking over tid
- A/B testing af forskellige ML-arkitekturer

## 📝 Bemærk

Forudsigelser er baseret på machine learning analyse af historiske data og statistisk modellering. Faktiske kampresultater kan afvige på grund af faktorer som skader, vejrforhold, taktiske ændringer og andre uforudsigelige elementer.

ML-modellen forbedres kontinuerligt med mere træningsdata og kan genoptrænes når nye historiske kampe tilføjes.

## 🛠️ Teknologier

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- date-fns
- Lucide Icons
- **brain.js** - Neural Network Machine Learning
- Deep Learning (3-layer neural network)

## 📈 ML Model Performance

Modellen trænes på 40+ historiske Superliga kampe med følgende konfiguration:
- **Iterations**: 20,000
- **Error Threshold**: 0.005
- **Learning Rate**: 0.01
- **Architecture**: Input(21) → Hidden(10) → Hidden(8) → Hidden(6) → Output(3)

Confidence scores beregnes baseret på forskellen mellem højeste og næsthøjeste sandsynlighed, hvilket giver et mål for hvor sikker modellen er på sin forudsigelse.
