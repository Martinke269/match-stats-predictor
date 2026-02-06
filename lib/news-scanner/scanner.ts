import { createClient } from '@supabase/supabase-js';
import { NewsEvent } from './types';
import { NEWS_SOURCES } from './sources';
import { fetchFromMultipleSources } from './rss-parser';
import { detectEvents, assignLeague } from './event-detector';
import crypto from 'crypto';

/**
 * Main news scanner that fetches, analyzes, and stores news events
 */
export async function scanNews(): Promise<{
  success: boolean;
  eventsFound: number;
  eventsStored: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let eventsFound = 0;
  let eventsStored = 0;

  try {
    // Initialize Supabase client with service role key for write access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch news from all sources
    console.log('Fetching news from sources...');
    const sourceUrls = NEWS_SOURCES.map(source => source.url);
    const newsItems = await fetchFromMultipleSources(sourceUrls);
    console.log(`Fetched ${newsItems.length} news items`);

    // Filter to recent news (last 48 hours)
    const twoDaysAgo = new Date();
    twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);
    const recentNews = newsItems.filter(item => item.publishedAt >= twoDaysAgo);
    console.log(`${recentNews.length} items from last 48 hours`);

    // Detect events from news items
    const allDetectedEvents = [];
    for (const newsItem of recentNews) {
      const events = detectEvents(newsItem);
      allDetectedEvents.push(...events);
    }
    
    eventsFound = allDetectedEvents.length;
    console.log(`Detected ${eventsFound} potential events`);

    // Convert to NewsEvent format and store
    const newsEvents: NewsEvent[] = [];
    
    for (const event of allDetectedEvents) {
      // Skip events without team (can't assign league)
      if (!event.team) {
        continue;
      }

      const league = assignLeague(event.team);
      if (!league) {
        continue; // Skip if we can't determine the league
      }

      // Create content hash to prevent duplicates
      const hashContent = `${league}|${event.team}|${event.player || ''}|${event.event_type}|${event.summary}`;
      const contentHash = crypto.createHash('md5').update(hashContent).digest('hex');

      const newsEvent: NewsEvent = {
        league,
        team: event.team,
        player: event.player,
        event_type: event.event_type,
        severity: event.severity,
        source_url: event.source_url,
        summary: event.summary,
        detected_at: new Date(),
        content_hash: contentHash
      };

      newsEvents.push(newsEvent);
    }

    console.log(`Prepared ${newsEvents.length} events for storage`);

    // Store events in database (skip duplicates)
    for (const event of newsEvents) {
      try {
        const { error } = await supabase
          .from('news_events')
          .insert(event);

        if (error) {
          // If it's a duplicate (unique constraint violation), skip silently
          if (error.code === '23505') {
            continue;
          }
          errors.push(`Failed to store event: ${error.message}`);
        } else {
          eventsStored++;
        }
      } catch (err) {
        errors.push(`Error storing event: ${err}`);
      }
    }

    console.log(`Successfully stored ${eventsStored} new events`);

    return {
      success: true,
      eventsFound,
      eventsStored,
      errors
    };

  } catch (error) {
    console.error('Error in news scanner:', error);
    errors.push(`Scanner error: ${error}`);
    
    return {
      success: false,
      eventsFound,
      eventsStored,
      errors
    };
  }
}

/**
 * Get recent news events for specific teams
 */
export async function getTeamNewsEvents(
  teams: string[],
  daysBack: number = 7
): Promise<NewsEvent[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    const { data, error } = await supabase
      .from('news_events')
      .select('*')
      .in('team', teams)
      .gte('detected_at', cutoffDate.toISOString())
      .order('detected_at', { ascending: false });

    if (error) {
      console.error('Error fetching team news events:', error);
      return [];
    }

    return (data || []).map(row => ({
      ...row,
      detected_at: new Date(row.detected_at)
    }));

  } catch (error) {
    console.error('Error in getTeamNewsEvents:', error);
    return [];
  }
}

/**
 * Get critical news events (injuries, suspensions) for teams
 */
export async function getCriticalTeamEvents(
  teams: string[],
  daysBack: number = 7
): Promise<NewsEvent[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    const { data, error } = await supabase
      .from('news_events')
      .select('*')
      .in('team', teams)
      .in('event_type', ['injury', 'suspension', 'doubt'])
      .in('severity', ['high', 'critical'])
      .gte('detected_at', cutoffDate.toISOString())
      .order('severity', { ascending: false })
      .order('detected_at', { ascending: false });

    if (error) {
      console.error('Error fetching critical events:', error);
      return [];
    }

    return (data || []).map(row => ({
      ...row,
      detected_at: new Date(row.detected_at)
    }));

  } catch (error) {
    console.error('Error in getCriticalTeamEvents:', error);
    return [];
  }
}
