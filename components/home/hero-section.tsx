'use client';

import { Trophy, Calendar, History, Target, Rocket } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function HeroSection() {
  const [hitRate, setHitRate] = useState<number | null>(null);
  const [totalPredictions, setTotalPredictions] = useState<number>(0);
  const launchDate = '6. februar 2026';

  useEffect(() => {
    async function fetchHitRate() {
      const supabase = createClient();
      
      const { data: stats } = await supabase
        .from('prediction_stats')
        .select('*');

      if (stats && stats.length > 0) {
        const total = stats.reduce((sum, s) => sum + s.total_predictions, 0);
        const correct = stats.reduce((sum, s) => sum + s.correct_predictions, 0);
        const accuracy = total > 0 ? (correct / total) * 100 : 0;
        
        setHitRate(accuracy);
        setTotalPredictions(total);
      }
    }

    fetchHitRate();
  }, []);

  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 px-4">
        <Trophy className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-400 flex-shrink-0" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Match Stats Predictor</h1>
      </div>
      <p className="text-lg sm:text-xl text-blue-200 px-4">AI-drevne predictions</p>
      
      {/* Stats Display - Always visible on homepage */}
      <div className="mt-6 px-4 max-w-2xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hit Rate */}
            {hitRate !== null && totalPredictions > 0 ? (
              <Link href="/predictions" className="block">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4 hover:border-green-400/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="h-6 w-6 text-green-400 flex-shrink-0" />
                    <div className="text-left">
                      <div className="text-3xl font-bold text-white">
                        {hitRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-green-200">
                        Hitrate
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-green-200/80 mt-1">
                    {totalPredictions} afsluttede kampe
                  </div>
                </div>
              </Link>
            ) : (
              <Link href="/predictions" className="block">
                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 hover:border-slate-500 transition-all cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="h-6 w-6 text-slate-500 flex-shrink-0" />
                    <div className="text-left">
                      <div className="text-2xl font-bold text-slate-400">
                        ---%
                      </div>
                      <div className="text-xs text-slate-500">
                        Hitrate
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Ingen data endnu
                  </div>
                </div>
              </Link>
            )}
            
            {/* Launch Date */}
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Rocket className="h-6 w-6 text-blue-400 flex-shrink-0" />
                <div className="text-left">
                  <div className="text-xl font-bold text-white">
                    {launchDate}
                  </div>
                  <div className="text-xs text-blue-200">
                    Lanceret
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
