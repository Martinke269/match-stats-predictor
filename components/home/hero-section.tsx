import { Trophy, Calendar } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Trophy className="h-12 w-12 text-yellow-400" />
        <h1 className="text-5xl font-bold text-white">Match Stats Predictor</h1>
      </div>
      <p className="text-xl text-blue-200">AI-drevne predictions</p>
      <div className="flex items-center justify-center gap-2 mt-4 text-blue-300">
        <Calendar className="h-5 w-5" />
        <span>Denne weekend - Højeste predictions</span>
      </div>
    </div>
  );
}
