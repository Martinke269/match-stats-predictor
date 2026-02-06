/**
 * News Scanner Module
 * 
 * Monitors sports news sources for match-relevant events like injuries,
 * suspensions, and lineup changes that impact match predictions.
 */

export * from './types';
export * from './scanner';
export * from './prediction-integration';
export { NEWS_SOURCES, EVENT_KEYWORDS, SEVERITY_KEYWORDS, TEAM_ALIASES } from './sources';
