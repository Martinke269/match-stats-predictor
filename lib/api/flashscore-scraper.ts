/**
 * Flashscore.dk scraper for fetching today's matches
 * Note: Web scraping should be done responsibly and in compliance with the website's terms of service
 */

// @ts-ignore - cheerio types may not be available
import * as cheerio from 'cheerio';
import { Match, Team } from '../types';

const FLASHSCORE_URL = 'https://www.flashscore.dk';

interface FlashscoreMatch {
  homeTeam: string;
  awayTeam: string;
  time: string;
  league: string;
  score?: {
    home: number;
    away: number;
  };
  status: string;
}

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
 * Parse match status from Flashscore
 */
function parseMatchStatus(statusText: string, time: string): 'upcoming' | 'live' | 'finished' {
  const lowerStatus = statusText.toLowerCase();
  const lowerTime = time.toLowerCase();
  
  if (lowerStatus.includes('slut') || lowerStatus.includes('ft') || lowerStatus.includes('finished')) {
    return 'finished';
  }
  
  if (lowerStatus.includes('live') || lowerStatus.includes("'") || 
      lowerStatus.includes('1h') || lowerStatus.includes('2h') ||
      lowerStatus.includes('ht') || lowerStatus.includes('halvleg')) {
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
 * Fetch today's matches from Flashscore.dk
 */
export async function fetchFlashscoreMatches(): Promise<Match[]> {
  try {
    // Fetch the main page
    const response = await fetch(FLASHSCORE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'da,en-US;q=0.7,en;q=0.3',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Flashscore: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const matches: Match[] = [];
    let matchCounter = 0;

    // Flashscore uses dynamic content, so we'll try to parse what we can from the HTML
    // Note: Flashscore heavily relies on JavaScript, so this may have limited success
    
    // Try to find match elements (this selector may need adjustment based on actual HTML structure)
    $('.event__match, .sportName, [class*="event"]').each((_index: any, element: any) => {
      try {
        const $element = $(element);
        
        // Try to extract team names
        const homeTeam = $element.find('.event__participant--home, [class*="home"]').first().text().trim();
        const awayTeam = $element.find('.event__participant--away, [class*="away"]').first().text().trim();
        
        if (!homeTeam || !awayTeam) return;
        
        // Extract time
        const time = $element.find('.event__time, [class*="time"]').first().text().trim();
        
        // Extract league
        const league = $element.closest('[class*="league"]').find('[class*="league__title"]').text().trim() || 'Unknown League';
        
        // Extract score if available
        const homeScore = $element.find('.event__score--home, [class*="score"][class*="home"]').first().text().trim();
        const awayScore = $element.find('.event__score--away, [class*="score"][class*="away"]').first().text().trim();
        
        // Extract status
        const status = $element.find('[class*="status"]').first().text().trim() || time;
        
        matchCounter++;
        const matchId = `flashscore-${Date.now()}-${matchCounter}`;
        
        const match: Match = {
          id: matchId,
          homeTeam: createTeam(homeTeam, `${matchId}-home`),
          awayTeam: createTeam(awayTeam, `${matchId}-away`),
          date: parseMatchTime(time),
          league: league || 'Flashscore',
          status: parseMatchStatus(status, time)
        };
        
        // Add score if available
        if (homeScore && awayScore && !isNaN(parseInt(homeScore)) && !isNaN(parseInt(awayScore))) {
          match.score = {
            home: parseInt(homeScore),
            away: parseInt(awayScore)
          };
        }
        
        matches.push(match);
      } catch (err) {
        console.error('Error parsing match element:', err);
      }
    });

    console.log(`Scraped ${matches.length} matches from Flashscore`);
    
    return matches;
  } catch (error) {
    console.error('Error fetching from Flashscore:', error);
    throw error;
  }
}

/**
 * Fetch matches with fallback to mock data for demonstration
 */
export async function fetchFlashscoreMatchesWithFallback(): Promise<Match[]> {
  try {
    const matches = await fetchFlashscoreMatches();
    
    if (matches.length > 0) {
      return matches;
    }
    
    // If no matches found, return some mock Flashscore-style data for demonstration
    console.log('No matches found from scraping, returning mock data');
    return getMockFlashscoreMatches();
  } catch (error) {
    console.error('Flashscore scraping failed, using mock data:', error);
    return getMockFlashscoreMatches();
  }
}

/**
 * Get mock matches that simulate Flashscore data structure
 */
function getMockFlashscoreMatches(): Match[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return [
    {
      id: 'fs-1',
      homeTeam: createTeam('FC København', 'fck'),
      awayTeam: createTeam('Brøndby IF', 'bif'),
      date: new Date(today.getTime() + 14 * 60 * 60 * 1000), // 14:00 today
      league: 'Superligaen',
      status: 'upcoming'
    },
    {
      id: 'fs-2',
      homeTeam: createTeam('FC Midtjylland', 'fcm'),
      awayTeam: createTeam('AGF', 'agf'),
      date: new Date(today.getTime() + 16 * 60 * 60 * 1000), // 16:00 today
      league: 'Superligaen',
      status: 'upcoming'
    },
    {
      id: 'fs-3',
      homeTeam: createTeam('FC Nordsjælland', 'fcn'),
      awayTeam: createTeam('Randers FC', 'rfc'),
      date: new Date(today.getTime() + 18 * 60 * 60 * 1000), // 18:00 today
      league: 'Superligaen',
      status: 'upcoming'
    },
    {
      id: 'fs-4',
      homeTeam: createTeam('Silkeborg IF', 'sif'),
      awayTeam: createTeam('Viborg FF', 'vff'),
      date: new Date(today.getTime() + 19 * 60 * 60 * 1000), // 19:00 today
      league: 'Superligaen',
      status: 'upcoming'
    }
  ];
}
