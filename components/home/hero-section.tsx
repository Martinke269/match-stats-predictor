'use client';

import { Trophy, Calendar, History } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Trophy className="h-12 w-12 text-yellow-400" />
        <h1 className="text-5xl font-bold text-white">Match Stats Predictor</h1>
      </div>
      <p className="text-xl text-blue-200">AI-drevne predictions</p>
      <div className="flex items-center justify-center gap-4 mt-6">
        <div className="flex items-center gap-2 text-blue-300">
          <Calendar className="h-5 w-5" />
          <span>Denne weekend - Top 3 kampe per liga</span>
        </div>
        <Link 
          href="/predictions"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-transparent px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <History className="h-4 w-4" />
          Mine Predictions
        </Link>
      </div>
    </div>
  );
}
