import { ParsedNewsItem, DetectedEvent, EventType, Severity } from './types';
import { EVENT_KEYWORDS, SEVERITY_KEYWORDS, TEAM_ALIASES } from './sources';

/**
 * Analyze news item and detect relevant events
 */
export function detectEvents(newsItem: ParsedNewsItem): DetectedEvent[] {
  const text = `${newsItem.title} ${newsItem.summary} ${newsItem.content || ''}`.toLowerCase();
  const events: DetectedEvent[] = [];
  
  // Detect event types
  const detectedTypes = detectEventTypes(text);
  
  if (detectedTypes.length === 0) {
    return events;
  }
  
  // Extract teams and players
  const teams = extractTeams(text);
  const players = extractPlayers(text);
  
  // Create events for each detected type
  for (const eventType of detectedTypes) {
    const severity = determineSeverity(text, eventType);
    const keywords = getMatchedKeywords(text, eventType);
    
    // If we found teams, create events for each team
    if (teams.length > 0) {
      for (const team of teams) {
        // Try to find specific player mentions
        const relevantPlayers = players.filter(player => 
          isPlayerRelevantToTeam(player, team, text)
        );
        
        if (relevantPlayers.length > 0) {
          for (const player of relevantPlayers) {
            events.push({
              team,
              player,
              event_type: eventType,
              severity,
              summary: newsItem.summary,
              source_url: newsItem.url,
              keywords
            });
          }
        } else {
          // Team-level event without specific player
          events.push({
            team,
            event_type: eventType,
            severity,
            summary: newsItem.summary,
            source_url: newsItem.url,
            keywords
          });
        }
      }
    } else if (players.length > 0) {
      // Player-level events without team context
      for (const player of players) {
        events.push({
          player,
          event_type: eventType,
          severity,
          summary: newsItem.summary,
          source_url: newsItem.url,
          keywords
        });
      }
    }
  }
  
  return events;
}

/**
 * Detect event types from text
 */
function detectEventTypes(text: string): EventType[] {
  const types: EventType[] = [];
  
  for (const [type, keywords] of Object.entries(EVENT_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
      types.push(type as EventType);
    }
  }
  
  return types;
}

/**
 * Determine severity of event
 */
function determineSeverity(text: string, eventType: EventType): Severity {
  // Check for critical indicators
  if (SEVERITY_KEYWORDS.critical.some(kw => text.includes(kw.toLowerCase()))) {
    return 'critical';
  }
  
  // Check for high severity
  if (SEVERITY_KEYWORDS.high.some(kw => text.includes(kw.toLowerCase()))) {
    return 'high';
  }
  
  // Check for medium severity
  if (SEVERITY_KEYWORDS.medium.some(kw => text.includes(kw.toLowerCase()))) {
    return 'medium';
  }
  
  // Default severities by event type
  const defaultSeverities: Record<EventType, Severity> = {
    injury: 'high',
    suspension: 'high',
    lineup_change: 'medium',
    transfer: 'medium',
    return: 'medium',
    doubt: 'medium',
    rumor: 'low'
  };
  
  return defaultSeverities[eventType] || 'medium';
}

/**
 * Extract team names from text
 */
function extractTeams(text: string): string[] {
  const teams = new Set<string>();
  
  // Check all team aliases
  for (const [teamName, aliases] of Object.entries(TEAM_ALIASES)) {
    const allNames = [teamName, ...aliases];
    
    for (const name of allNames) {
      // Use word boundaries to avoid partial matches
      const regex = new RegExp(`\\b${escapeRegex(name.toLowerCase())}\\b`, 'i');
      if (regex.test(text)) {
        teams.add(teamName);
        break;
      }
    }
  }
  
  return Array.from(teams);
}

/**
 * Extract player names from text
 * This is a simplified version - in production, you'd want a more sophisticated NER system
 */
function extractPlayers(text: string): string[] {
  const players: string[] = [];
  
  // Look for capitalized names (simplified approach)
  // Pattern: Capitalized word followed by capitalized word
  const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g;
  const matches = Array.from(text.matchAll(namePattern));
  
  for (const match of matches) {
    const name = match[1];
    // Filter out common false positives
    if (!isCommonPhrase(name)) {
      players.push(name);
    }
  }
  
  return Array.from(new Set(players)); // Remove duplicates
}

/**
 * Check if a player is relevant to a team based on context
 */
function isPlayerRelevantToTeam(player: string, team: string, text: string): boolean {
  // Simple proximity check - player and team mentioned close together
  const playerIndex = text.toLowerCase().indexOf(player.toLowerCase());
  const teamIndex = text.toLowerCase().indexOf(team.toLowerCase());
  
  if (playerIndex === -1 || teamIndex === -1) {
    return false;
  }
  
  // If within 100 characters, consider them related
  return Math.abs(playerIndex - teamIndex) < 100;
}

/**
 * Get matched keywords for an event type
 */
function getMatchedKeywords(text: string, eventType: EventType): string[] {
  const keywords = EVENT_KEYWORDS[eventType] || [];
  return keywords.filter(kw => text.includes(kw.toLowerCase()));
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Check if a phrase is a common false positive
 */
function isCommonPhrase(phrase: string): boolean {
  const commonPhrases = [
    'Premier League',
    'La Liga',
    'Serie A',
    'Champions League',
    'Europa League',
    'World Cup',
    'United Kingdom',
    'New York',
    'Los Angeles'
  ];
  
  return commonPhrases.some(common => 
    phrase.toLowerCase() === common.toLowerCase()
  );
}

/**
 * Assign league to detected event based on team
 */
export function assignLeague(team: string): string | undefined {
  const leagueMap: Record<string, string> = {
    'Manchester United': 'Premier League',
    'Manchester City': 'Premier League',
    'Liverpool': 'Premier League',
    'Arsenal': 'Premier League',
    'Chelsea': 'Premier League',
    'Tottenham': 'Premier League',
    'Newcastle': 'Premier League',
    'Real Madrid': 'La Liga',
    'Barcelona': 'La Liga',
    'Atletico Madrid': 'La Liga',
    'Bayern Munich': 'Bundesliga',
    'Borussia Dortmund': 'Bundesliga',
    'Paris Saint-Germain': 'Ligue 1',
    'Juventus': 'Serie A',
    'Inter Milan': 'Serie A',
    'AC Milan': 'Serie A',
    'Ajax': 'Eredivisie',
    'PSV': 'Eredivisie',
    'Benfica': 'Primeira Liga',
    'Porto': 'Primeira Liga'
  };
  
  return leagueMap[team];
}
