import { ParsedNewsItem } from './types';

/**
 * Parse RSS feed XML and extract news items
 */
export async function parseRSSFeed(url: string): Promise<ParsedNewsItem[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AIMatchPredictor/1.0'
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch RSS feed from ${url}: ${response.status}`);
      return [];
    }

    const xmlText = await response.text();
    const items = extractItemsFromXML(xmlText);
    
    return items;
  } catch (error) {
    console.error(`Error parsing RSS feed from ${url}:`, error);
    return [];
  }
}

/**
 * Extract items from RSS XML
 */
function extractItemsFromXML(xml: string): ParsedNewsItem[] {
  const items: ParsedNewsItem[] = [];
  
  // Match all <item> or <entry> tags (RSS 2.0 and Atom)
  const itemRegex = /<(?:item|entry)>([\s\S]*?)<\/(?:item|entry)>/gi;
  const matches = Array.from(xml.matchAll(itemRegex));
  
  for (const match of matches) {
    const itemXml = match[1];
    
    const title = extractTag(itemXml, 'title');
    const link = extractTag(itemXml, 'link');
    const description = extractTag(itemXml, 'description') || extractTag(itemXml, 'summary');
    const pubDate = extractTag(itemXml, 'pubDate') || extractTag(itemXml, 'published') || extractTag(itemXml, 'updated');
    const content = extractTag(itemXml, 'content:encoded') || extractTag(itemXml, 'content');
    
    if (title && link) {
      items.push({
        title: cleanText(title),
        summary: cleanText(description || title),
        url: cleanText(link),
        publishedAt: parseDate(pubDate),
        content: content ? cleanText(content) : undefined
      });
    }
  }
  
  return items;
}

/**
 * Extract content from XML tag
 */
function extractTag(xml: string, tagName: string): string {
  // Handle both self-closing and regular tags
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>|<${tagName}[^>]*\\/>`, 'i');
  const match = xml.match(regex);
  
  if (match) {
    return match[1] || '';
  }
  
  // For link tags that might be attributes
  if (tagName === 'link') {
    const hrefMatch = xml.match(/<link[^>]*href=["']([^"']+)["']/i);
    if (hrefMatch) {
      return hrefMatch[1];
    }
  }
  
  return '';
}

/**
 * Clean HTML entities and tags from text
 */
function cleanText(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') // Remove CDATA
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Parse date string to Date object
 */
function parseDate(dateStr: string): Date {
  if (!dateStr) {
    return new Date();
  }
  
  const date = new Date(dateStr);
  
  // If invalid date, return current date
  if (isNaN(date.getTime())) {
    return new Date();
  }
  
  return date;
}

/**
 * Fetch news from multiple RSS sources
 */
export async function fetchFromMultipleSources(urls: string[]): Promise<ParsedNewsItem[]> {
  const results = await Promise.allSettled(
    urls.map(url => parseRSSFeed(url))
  );
  
  const allItems: ParsedNewsItem[] = [];
  
  for (const result of results) {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  }
  
  // Sort by date (newest first) and remove duplicates
  const uniqueItems = deduplicateItems(allItems);
  uniqueItems.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  
  return uniqueItems;
}

/**
 * Remove duplicate items based on URL
 */
function deduplicateItems(items: ParsedNewsItem[]): ParsedNewsItem[] {
  const seen = new Set<string>();
  const unique: ParsedNewsItem[] = [];
  
  for (const item of items) {
    if (!seen.has(item.url)) {
      seen.add(item.url);
      unique.push(item);
    }
  }
  
  return unique;
}
