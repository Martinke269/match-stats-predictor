export type EventType = 'injury' | 'suspension' | 'lineup_change' | 'transfer' | 'rumor' | 'return' | 'doubt';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface NewsEvent {
  id?: string;
  league: string;
  team: string;
  player?: string;
  event_type: EventType;
  severity?: Severity;
  source_url?: string;
  summary: string;
  detected_at: Date;
  content_hash: string;
}

export interface NewsSource {
  name: string;
  url: string;
  type: 'rss' | 'json' | 'html';
  leagues: string[];
}

export interface ParsedNewsItem {
  title: string;
  summary: string;
  url: string;
  publishedAt: Date;
  content?: string;
}

export interface DetectedEvent {
  league?: string;
  team?: string;
  player?: string;
  event_type: EventType;
  severity: Severity;
  summary: string;
  source_url: string;
  keywords: string[];
}
