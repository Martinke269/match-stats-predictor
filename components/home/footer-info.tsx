'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import Link from 'next/link';

export function FooterInfo() {
  return (
    <Card className="mt-8 bg-slate-800/30 backdrop-blur-sm border-slate-700">
      <CardContent className="pt-6">
        <div className="text-center text-slate-400 text-sm">
          <p className="mb-2">
            Predictions er baseret på holdenes aktuelle form, statistikker, målforskel, 
            sejrsrater og hjemmebanefordel.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto mt-4">
            <Button variant="outline" className="w-full border-blue-600/30 bg-blue-600/10 text-blue-300 hover:bg-blue-600/20 hover:border-blue-500/50" asChild>
              <Link href="/superliga">
                Superliga
              </Link>
            </Button>
            <Button variant="outline" className="w-full border-blue-600/30 bg-blue-600/10 text-blue-300 hover:bg-blue-600/20 hover:border-blue-500/50" asChild>
              <Link href="/ligue1">
                Ligue 1
              </Link>
            </Button>
            <Button variant="outline" className="w-full border-blue-600/30 bg-blue-600/10 text-blue-300 hover:bg-blue-600/20 hover:border-blue-500/50" asChild>
              <Link href="/premier-league">
                Premier League
              </Link>
            </Button>
            <Button variant="outline" className="w-full border-blue-600/30 bg-blue-600/10 text-blue-300 hover:bg-blue-600/20 hover:border-blue-500/50" asChild>
              <Link href="/serie-a">
                Serie A
              </Link>
            </Button>
            <Button variant="outline" className="w-full border-blue-600/30 bg-blue-600/10 text-blue-300 hover:bg-blue-600/20 hover:border-blue-500/50" asChild>
              <Link href="/la-liga">
                La Liga
              </Link>
            </Button>
            <Button variant="outline" className="w-full border-blue-600/30 bg-blue-600/10 text-blue-300 hover:bg-blue-600/20 hover:border-blue-500/50" asChild>
              <Link href="/bundesliga">
                Bundesliga
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
