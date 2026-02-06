/**
 * Algorithm Version Loader
 * Loads the latest active algorithm version and its weights
 */

import { createClient } from '@supabase/supabase-js';
import { AlgorithmWeights } from './tuner';

export interface AlgorithmVersion {
  id: string;
  version: string;
  version_number: number;
  weights: AlgorithmWeights;
  description: string;
  notes: string | null;
  deployed_at: string;
  is_active: boolean;
}

let cachedVersion: AlgorithmVersion | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get the latest active algorithm version
 * Uses caching to avoid excessive database queries
 */
export async function getLatestAlgorithmVersion(
  supabaseUrl: string,
  supabaseKey: string,
  forceRefresh: boolean = false
): Promise<AlgorithmVersion> {
  const now = Date.now();
  
  // Return cached version if still valid
  if (!forceRefresh && cachedVersion && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedVersion;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('algorithm_versions')
    .select('*')
    .eq('is_active', true)
    .order('version_number', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    throw new Error(`Failed to load algorithm version: ${error?.message || 'No active version found'}`);
  }

  cachedVersion = data as AlgorithmVersion;
  cacheTimestamp = now;

  return cachedVersion;
}

/**
 * Get weights from the latest algorithm version
 */
export async function getLatestWeights(
  supabaseUrl: string,
  supabaseKey: string
): Promise<AlgorithmWeights> {
  const version = await getLatestAlgorithmVersion(supabaseUrl, supabaseKey);
  return version.weights;
}

/**
 * Get all algorithm versions (for history/comparison)
 */
export async function getAllAlgorithmVersions(
  supabaseUrl: string,
  supabaseKey: string
): Promise<AlgorithmVersion[]> {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('algorithm_versions')
    .select('*')
    .order('version_number', { ascending: false });

  if (error) {
    throw new Error(`Failed to load algorithm versions: ${error.message}`);
  }

  return (data || []) as AlgorithmVersion[];
}

/**
 * Clear the version cache (useful after auto-tuning)
 */
export function clearVersionCache(): void {
  cachedVersion = null;
  cacheTimestamp = 0;
}

/**
 * Get default weights (fallback if database is unavailable)
 */
export function getDefaultWeights(): AlgorithmWeights {
  return {
    formWeight: 0.20,
    goalDifferenceWeight: 0.15,
    headToHeadWeight: 0.20,
    homeAdvantageWeight: 0.15,
    winRateWeight: 0.10,
    defensiveStrengthWeight: 0.10,
    qualityGapWeight: 0.25,
    upsetFactorWeight: 0.15,
    fixtureCongestionWeight: 0.15,
    winterBreakWeight: 0.25,
    homeAdvantageBonus: 10,
    awayHandicap: 5
  };
}
