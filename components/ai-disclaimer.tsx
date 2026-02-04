'use client';

import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AIDisclaimer() {
  return (
    <Alert className="mb-6 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
      <AlertTitle className="text-amber-900 dark:text-amber-400">
        AI-genererede forudsigelser
      </AlertTitle>
      <AlertDescription className="text-amber-800 dark:text-amber-300">
        Alle forudsigelser på denne side er genereret af kunstig intelligens og er kun vejledende. 
        Resultater kan ikke garanteres, og forudsigelserne bør ikke bruges som grundlag for væddemål 
        eller økonomiske beslutninger. Fodboldkampe er uforudsigelige, og mange faktorer kan påvirke 
        det endelige resultat.
      </AlertDescription>
    </Alert>
  );
}
