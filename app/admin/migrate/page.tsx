'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function MigratePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runMigration = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/migrate-data', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.results);
      } else {
        setError(data.error || 'Migration failed');
      }
    } catch (err) {
      setError('Failed to run migration: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="container mx-auto max-w-2xl">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Data Migration</CardTitle>
            <CardDescription className="text-slate-300">
              Migrate all teams and matches from code files to Supabase database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={runMigration}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Migrating...' : 'Run Migration'}
            </Button>

            {result && (
              <Alert className="bg-green-500/10 border-green-500/50">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-200">
                  <div className="font-semibold mb-2">Migration Successful!</div>
                  <div className="space-y-1 text-sm">
                    <div>✅ Teams migrated: {result.teams}</div>
                    <div>✅ Matches migrated: {result.matches}</div>
                    {result.errors.length > 0 && (
                      <div className="mt-2">
                        <div className="font-semibold text-yellow-300">Errors:</div>
                        {result.errors.map((err: string, i: number) => (
                          <div key={i} className="text-yellow-200">⚠️ {err}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="bg-red-500/10 border-red-500/50">
                <XCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-200">
                  <div className="font-semibold mb-2">Migration Failed</div>
                  <div className="text-sm">{error}</div>
                </AlertDescription>
              </Alert>
            )}

            <div className="text-sm text-slate-400 mt-4">
              <p className="font-semibold mb-2">What this does:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Migrates all teams from all leagues to database</li>
                <li>Migrates Premier League match schedule</li>
                <li>Sets up data for automatic updates</li>
                <li>Only needs to be run once</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
