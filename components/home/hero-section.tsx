'use client';

import { Trophy, Calendar, History } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 px-4">
        <Trophy className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-400 flex-shrink-0" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Match Stats Predictor</h1>
      </div>
      <p className="text-lg sm:text-xl text-blue-200 px-4">AI-drevne predictions</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 px-4">
        <div className="flex items-center gap-2 text-blue-300 text-sm sm:text-base">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="text-center">Denne weekend - Top 3 kampe per liga</span>
        </div>
        <Link 
          href="/predictions"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-transparent px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors w-full sm:w-auto"
        >
          <History className="h-4 w-4" />
          Mine Predictions
        </Link>
      </div>
    </div>
  );
}
