# Flashscore.dk Integration

This document explains how the Match Stats Predictor integrates with Flashscore.dk to fetch today's matches.

## Overview

The application now includes a web scraper that attempts to fetch live match data from Flashscore.dk (https://www.flashscore.dk/). This provides real-time match information for Danish and international football leagues.

## How It Works

### 1. Flashscore Scraper (`lib/api/flashscore-scraper.ts`)

The scraper module includes:

- **fetchFlashscoreMatches()**: Attempts to scrape match data from Flashscore.dk
- **fetchFlashscoreMatchesWithFallback()**: Tries to scrape, falls back to mock data if unsuccessful
- **Mock Data**: Provides sample Danish Superliga matches when scraping fails

### 2. API Route (`app/api/matches/route.ts`)

The API route now follows this priority:

1. **First**: Try to fetch from Flashscore.dk
2. **Second**: Fall back to API-Football (if configured)
3. **Third**: Use sample data

### 3. Data Flow

```
User loads page
    ↓
Frontend calls /api/matches
    ↓
API tries Flashscore scraper
    ↓
If successful → Return Flashscore data
    ↓
If fails → Try API-Football
    ↓
If fails → Return sample data
```

## Important Notes

### Web Scraping Limitations

1. **Dynamic Content**: Flashscore.dk uses heavy JavaScript rendering, which means:
   - The HTML scraper may not capture all matches
   - Match data might be loaded dynamically after page load
   - The scraper currently provides mock data as a fallback

2. **Terms of Service**: Web scraping may violate Flashscore's terms of service. Consider:
   - Using their official API if available
   - Respecting rate limits
   - Adding appropriate delays between requests

3. **Reliability**: The scraper may break if Flashscore changes their HTML structure

### Current Implementation

The current implementation includes:

- ✅ Basic HTML parsing with Cheerio
- ✅ Fallback to mock Danish Superliga matches
- ✅ Proper error handling
- ✅ User-friendly data source indicators
- ⚠️ Limited success with actual scraping (due to JavaScript rendering)

### Recommended Improvements

For production use, consider:

1. **Use Official APIs**: 
   - API-Football (already integrated)
   - Other sports data providers

2. **Headless Browser**: 
   - Use Puppeteer or Playwright for JavaScript-rendered content
   - Note: This requires more resources and setup

3. **Caching**: 
   - Cache scraped data to reduce requests
   - Implement rate limiting

4. **Legal Compliance**: 
   - Review Flashscore's terms of service
   - Consider contacting them for API access

## Testing

To test the Flashscore integration:

1. Load the application
2. Check the data source alert at the top of the page
3. Look for the 🇩🇰 Flashscore.dk indicator
4. Click "Opdater" (Refresh) to fetch new data

## Mock Data

When scraping fails, the system provides mock Danish Superliga matches:

- FC København vs Brøndby IF (14:00)
- FC Midtjylland vs AGF (16:00)
- FC Nordsjælland vs Randers FC (18:00)
- Silkeborg IF vs Viborg FF (19:00)

This ensures the application always has data to display and demonstrate functionality.

## Configuration

No additional configuration is needed. The scraper is automatically used by the API route.

To disable Flashscore scraping, modify `app/api/matches/route.ts` to skip the Flashscore fetch step.

## Dependencies

- `cheerio`: HTML parsing library (already installed)

## Future Enhancements

Potential improvements:

1. Implement Puppeteer for better JavaScript handling
2. Add match details scraping (odds, statistics, etc.)
3. Support for multiple dates (not just today)
4. League filtering at the scraper level
5. Real-time score updates
6. Match event tracking (goals, cards, etc.)
