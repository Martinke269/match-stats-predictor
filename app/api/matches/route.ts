import { NextResponse } from 'next/server';
import { fetchAllLeaguesFixtures, isAPIConfigured } from '@/lib/api/football-api';
import { fetchGoogleSportsMatchesWithFallback } from '@/lib/api/google-sports-scraper';
import { allMatches } from '@/lib/sample-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Try Google Sports first
    console.log('Attempting to fetch matches from Google Sports...');
    const googleMatches = await fetchGoogleSportsMatchesWithFallback();
    
    if (googleMatches.length > 0) {
      return NextResponse.json({
        matches: googleMatches,
        source: 'google',
        message: 'Data hentet fra Google Sports'
      });
    }

    // Check if API-Football is configured as fallback
    if (isAPIConfigured()) {
      console.log('Google returned no matches, trying API-Football...');
      const liveMatches = await fetchAllLeaguesFixtures();
      
      if (liveMatches.length > 0) {
        return NextResponse.json({
          matches: liveMatches,
          source: 'api',
          message: 'Live data from API-Football'
        });
      }
    }

    // Fallback to sample data
    return NextResponse.json({
      matches: allMatches,
      source: 'sample',
      message: 'Bruger eksempel data (ingen live data tilgængelig)'
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    
    // Return sample data on error
    return NextResponse.json({
      matches: allMatches,
      source: 'sample',
      message: 'Fejl ved hentning af live data, bruger eksempel data'
    });
  }
}
