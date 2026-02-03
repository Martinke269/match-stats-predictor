/**
 * Google Sports scraper for fetching today's football matches
 * Uses simple regex parsing instead of cheerio to avoid native dependencies
 */

import { Match, Team } from '../types';

/**
 * Create a Team object with default stats
 */
function createTeam(name: string, id: string): Team {
  return {
    id,
    name,
    form: ['W', 'D', 'W', 'L', 'W'], // Default form
    stats: {
      goalsScored: 0,
      goalsConceded: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      cleanSheets: 0,
      possession: 50,
      shotsOnTarget: 0,
      passAccuracy: 75
    }
  };
}

/**
 * Parse match status
 */
function parseMatchStatus(statusText: string): 'upcoming' | 'live' | 'finished' {
  const lowerStatus = statusText.toLowerCase();
  
  if (lowerStatus.includes('slut') || lowerStatus.includes('ft') || 
      lowerStatus.includes('finished') || lowerStatus.includes('final')) {
    return 'finished';
  }
  
  if (lowerStatus.includes('live') || lowerStatus.includes("'") || 
      lowerStatus.includes('halvleg') || lowerStatus.includes('min')) {
    return 'live';
  }
  
  return 'upcoming';
}

/**
 * Parse time string to Date object
 */
function parseMatchTime(timeStr: string): Date {
  const today = new Date();
  
  // If time is in format "HH:MM"
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    const hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    
    const matchDate = new Date(today);
    matchDate.setHours(hours, minutes, 0, 0);
    
    return matchDate;
  }
  
  return today;
}

/**
 * Determine league from team names or context
 */
function determineLeague(homeTeam: string, awayTeam: string): string {
  const danishTeams = ['fc københavn', 'brøndby', 'fc midtjylland', 'aab', 'agf', 
                       'fc nordsjælland', 'randers', 'silkeborg', 'viborg', 'odense'];
  
  const home = homeTeam.toLowerCase();
  const away = awayTeam.toLowerCase();
  
  if (danishTeams.some(team => home.includes(team) || away.includes(team))) {
    return 'Superligaen';
  }
  
  const englishTeams = ['liverpool', 'manchester', 'arsenal', 'chelsea', 'tottenham', 
                        'city', 'united', 'everton', 'leicester', 'west ham'];
  if (englishTeams.some(team => home.includes(team) || away.includes(team))) {
    return 'Premier League';
  }
  
  const germanTeams = ['bayern', 'dortmund', 'leipzig', 'leverkusen', 'frankfurt', 'stuttgart'];
  if (germanTeams.some(team => home.includes(team) || away.includes(team))) {
    return 'Bundesliga';
  }
  
  const spanishTeams = ['real madrid', 'barcelona', 'atletico', 'sevilla', 'valencia', 'athletic'];
  if (spanishTeams.some(team => home.includes(team) || away.includes(team))) {
    return 'La Liga';
  }
  
  const italianTeams = ['inter', 'milan', 'juventus', 'napoli', 'roma', 'lazio'];
  if (italianTeams.some(team => home.includes(team) || away.includes(team))) {
    return 'Serie A';
  }
  
  const frenchTeams = ['psg', 'paris', 'marseille', 'lyon', 'monaco', 'lille'];
  if (frenchTeams.some(team => home.includes(team) || away.includes(team))) {
    return 'Ligue 1';
  }
  
  return 'International';
}

/**
 * Fetch today's matches from Google Sports
 * Note: Google's HTML structure is complex and JavaScript-heavy,
 * so this implementation returns mock data as a demonstration
 */
export async function fetchGoogleSportsMatches(): Promise<Match[]> {
  try {
    // Search for football matches on Google
    const searchQuery = encodeURIComponent('fodbold kampe i dag');
    const url = `https://www.google.com/search?q=${searchQuery}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'da,en-US;q=0.7,en;q=0.3',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sports: ${response.status}`);
    }

    const html = await response.text();
    
    // Try simple regex parsing for team names and scores
    // This is a basic approach - Google's actual structure is much more complex
    const matches: Match[] = [];
    let matchCounter = 0;

    // Look for patterns like "Team A vs Team B" or "Team A - Team B"
    const matchPatterns = [
      /([A-Za-zæøåÆØÅ\s]+)\s+vs\.?\s+([A-Za-zæøåÆØÅ\s]+)/gi,
      /([A-Za-zæøåÆØÅ\s]+)\s+-\s+([A-Za-zæøåÆØÅ\s]+)/gi
    ];

    for (const pattern of matchPatterns) {
      let match;
      while ((match = pattern.exec(html)) !== null && matchCounter < 10) {
        const homeTeam = match[1].trim();
        const awayTeam = match[2].trim();
        
        if (homeTeam && awayTeam && homeTeam !== awayTeam && homeTeam.length > 2 && awayTeam.length > 2) {
          matchCounter++;
          const matchId = `google-${Date.now()}-${matchCounter}`;
          const league = determineLeague(homeTeam, awayTeam);
          
          const newMatch: Match = {
            id: matchId,
            homeTeam: createTeam(homeTeam, `${matchId}-home`),
            awayTeam: createTeam(awayTeam, `${matchId}-away`),
            date: new Date(),
            league: league,
            status: 'upcoming'
          };
          
          matches.push(newMatch);
        }
      }
      if (matchCounter >= 10) break;
    }

    console.log(`Found ${matches.length} potential matches from Google Sports`);
    
    return matches;
  } catch (error) {
    console.error('Error fetching from Google Sports:', error);
    throw error;
  }
}

/**
 * Fetch matches with fallback to mock data
 */
export async function fetchGoogleSportsMatchesWithFallback(): Promise<Match[]> {
  try {
    const matches = await fetchGoogleSportsMatches();
    
    if (matches.length > 0) {
      return matches;
    }
    
    // If no matches found, return mock data
    console.log('No matches found from Google, returning mock data');
    return getMockGoogleMatches();
  } catch (error) {
    console.error('Google Sports scraping failed, using mock data:', error);
    return getMockGoogleMatches();
  }
}

/**
 * Get mock matches that simulate Google Sports data
 */
function getMockGoogleMatches(): Match[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return [
    {
      id: 'google-1',
      homeTeam: createTeam('FC København', 'fck'),
      awayTeam: createTeam('Brøndby IF', 'bif'),
      date: new Date(today.getTime() + 14 * 60 * 60 * 1000), // 14:00 today
      league: 'Superligaen',
      status: 'upcoming'
    },
    {
      id: 'google-2',
      homeTeam: createTeam('FC Midtjylland', 'fcm'),
      awayTeam: createTeam('AGF', 'agf'),
      date: new Date(today.getTime() + 16 * 60 * 60 * 1000), // 16:00 today
      league: 'Superligaen',
      status: 'upcoming'
    },
    {
      id: 'google-3',
      homeTeam: createTeam('FC Nordsjælland', 'fcn'),
      awayTeam: createTeam('Randers FC', 'rfc'),
      date: new Date(today.getTime() + 18 * 60 * 60 * 1000), // 18:00 today
      league: 'Superligaen',
      status: 'upcoming'
    },
    {
      id: 'google-4',
      homeTeam: createTeam('Liverpool', 'liv'),
      awayTeam: createTeam('Manchester City', 'mci'),
      date: new Date(today.getTime() + 17 * 60 * 60 * 1000 + 30 * 60 * 1000), // 17:30 today
      league: 'Premier League',
      status: 'upcoming'
    },
    {
      id: 'google-5',
      homeTeam: createTeam('Real Madrid', 'rma'),
      awayTeam: createTeam('Barcelona', 'bar'),
      date: new Date(today.getTime() + 21 * 60 * 60 * 1000), // 21:00 today
      league: 'La Liga',
      status: 'upcoming'
    }
  ];
}
