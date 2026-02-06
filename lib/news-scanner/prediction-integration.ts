import { NewsEvent } from './types';
import { getCriticalTeamEvents } from './scanner';

/**
 * Calculate impact of news events on match prediction
 */
export interface NewsImpact {
  homeTeamImpact: number; // -1 to 1 (negative = weakened, positive = strengthened)
  awayTeamImpact: number;
  affectedEvents: NewsEvent[];
  impactSummary: string[];
}

/**
 * Analyze news events and calculate their impact on a match
 */
export async function analyzeNewsImpact(
  homeTeam: string,
  awayTeam: string
): Promise<NewsImpact> {
  // Get recent critical events for both teams
  const events = await getCriticalTeamEvents([homeTeam, awayTeam], 7);
  
  let homeTeamImpact = 0;
  let awayTeamImpact = 0;
  const impactSummary: string[] = [];
  
  for (const event of events) {
    const impact = calculateEventImpact(event);
    
    if (event.team === homeTeam) {
      homeTeamImpact += impact;
      if (Math.abs(impact) > 0.05) {
        impactSummary.push(formatEventImpact(event, 'home', impact));
      }
    } else if (event.team === awayTeam) {
      awayTeamImpact += impact;
      if (Math.abs(impact) > 0.05) {
        impactSummary.push(formatEventImpact(event, 'away', impact));
      }
    }
  }
  
  // Cap impacts at reasonable limits
  homeTeamImpact = Math.max(-0.3, Math.min(0.3, homeTeamImpact));
  awayTeamImpact = Math.max(-0.3, Math.min(0.3, awayTeamImpact));
  
  return {
    homeTeamImpact,
    awayTeamImpact,
    affectedEvents: events,
    impactSummary
  };
}

/**
 * Calculate numerical impact of a single news event
 */
function calculateEventImpact(event: NewsEvent): number {
  let impact = 0;
  
  // Base impact by event type
  const eventTypeImpacts: Record<string, number> = {
    injury: -0.08,
    suspension: -0.06,
    doubt: -0.03,
    return: 0.05,
    lineup_change: -0.02,
    transfer: 0,
    rumor: 0
  };
  
  impact = eventTypeImpacts[event.event_type] || 0;
  
  // Multiply by severity
  const severityMultipliers: Record<string, number> = {
    critical: 2.0,
    high: 1.5,
    medium: 1.0,
    low: 0.5
  };
  
  const multiplier = severityMultipliers[event.severity || 'medium'] || 1.0;
  impact *= multiplier;
  
  // If player is mentioned, it's more significant
  if (event.player) {
    impact *= 1.2;
  }
  
  return impact;
}

/**
 * Format event impact for logging
 */
function formatEventImpact(event: NewsEvent, side: 'home' | 'away', impact: number): string {
  const direction = impact < 0 ? 'weakens' : 'strengthens';
  const magnitude = Math.abs(impact) > 0.1 ? 'significantly' : 'slightly';
  const player = event.player ? ` (${event.player})` : '';
  
  return `${event.event_type}${player} ${magnitude} ${direction} ${side} team (${(impact * 100).toFixed(1)}%)`;
}

/**
 * Apply news impact to prediction probabilities
 */
export function applyNewsImpactToProbabilities(
  baseProbabilities: { home: number; draw: number; away: number },
  newsImpact: NewsImpact
): { home: number; draw: number; away: number } {
  // Calculate net impact (positive means home team advantage)
  const netImpact = newsImpact.homeTeamImpact - newsImpact.awayTeamImpact;
  
  // If no significant impact, return base probabilities
  if (Math.abs(netImpact) < 0.01) {
    return baseProbabilities;
  }
  
  // Adjust probabilities based on net impact
  // Positive impact favors home, negative favors away
  let { home, draw, away } = baseProbabilities;
  
  // Shift probability mass
  const shift = netImpact * 0.5; // Scale down the impact
  
  if (shift > 0) {
    // Home team strengthened
    const takeFromAway = shift * 0.7;
    const takeFromDraw = shift * 0.3;
    
    home = Math.min(0.95, home + takeFromAway + takeFromDraw);
    away = Math.max(0.05, away - takeFromAway);
    draw = Math.max(0.05, draw - takeFromDraw);
  } else {
    // Away team strengthened
    const takeFromHome = Math.abs(shift) * 0.7;
    const takeFromDraw = Math.abs(shift) * 0.3;
    
    away = Math.min(0.95, away + takeFromHome + takeFromDraw);
    home = Math.max(0.05, home - takeFromHome);
    draw = Math.max(0.05, draw - takeFromDraw);
  }
  
  // Normalize to ensure sum is 1.0
  const total = home + draw + away;
  return {
    home: home / total,
    draw: draw / total,
    away: away / total
  };
}

/**
 * Get news context for logging in prediction calculations
 */
export function getNewsContextForLogging(newsImpact: NewsImpact): string {
  if (newsImpact.affectedEvents.length === 0) {
    return 'No recent news events affecting this match';
  }
  
  const lines = [
    `News Impact Analysis (${newsImpact.affectedEvents.length} events):`,
    `  Home Team Impact: ${(newsImpact.homeTeamImpact * 100).toFixed(1)}%`,
    `  Away Team Impact: ${(newsImpact.awayTeamImpact * 100).toFixed(1)}%`,
    ''
  ];
  
  if (newsImpact.impactSummary.length > 0) {
    lines.push('Key Events:');
    newsImpact.impactSummary.forEach(summary => {
      lines.push(`  - ${summary}`);
    });
  }
  
  return lines.join('\n');
}
