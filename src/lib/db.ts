import { createServerClient } from './supabase';
import type { ChartAnalysis, Element } from '../engine/types';
import type { ReadingResult } from './reading-generator';
import type { Json } from '../types/supabase';

// ---------------------------------------------------------------------------
// Element index mapping (Element enum string -> integer for DB storage)
// ---------------------------------------------------------------------------

const ELEMENT_TO_INDEX: Record<string, number> = {
  Wood: 0, Fire: 1, Earth: 2, Metal: 3, Water: 4,
};

function elementToIndex(element: Element): number {
  return ELEMENT_TO_INDEX[element] ?? -1;
}

// ---------------------------------------------------------------------------
// Chart operations
// ---------------------------------------------------------------------------

/**
 * Save a calculated chart to the database.
 * Returns the chart ID.
 */
export async function saveChart(profileId: string, chartData: ChartAnalysis): Promise<string> {
  const db = createServerClient();

  const { data, error } = await db
    .from('charts')
    .insert({
      profile_id: profileId,
      hour_stem: chartData.fourPillars.hour?.stem.index ?? null,
      hour_branch: chartData.fourPillars.hour?.branch.index ?? null,
      day_stem: chartData.fourPillars.day.stem.index,
      day_branch: chartData.fourPillars.day.branch.index,
      month_stem: chartData.fourPillars.month.stem.index,
      month_branch: chartData.fourPillars.month.branch.index,
      year_stem: chartData.fourPillars.year.stem.index,
      year_branch: chartData.fourPillars.year.branch.index,
      day_master: chartData.dayMaster.index,
      day_master_strength: chartData.dayMasterStrength,
      element_balance: chartData.elementBalance as unknown as Json,
      ten_gods: chartData.tenGods as unknown as Json,
      hidden_stems: chartData.hiddenStems as unknown as Json,
      useful_god: elementToIndex(chartData.usefulGod),
      jealousy_god: elementToIndex(chartData.jealousyGod),
      chart_pattern: chartData.chartPattern,
      special_stars: chartData.specialStars as unknown as Json,
      combinations: chartData.combinations as unknown as Json,
      clashes: chartData.clashes as unknown as Json,
      life_stages: chartData.lifeStages as unknown as Json,
      luck_cycles: chartData.luckCycles as unknown as Json,
      engine_version: chartData.engineVersion,
    })
    .select('id')
    .single();

  if (error) throw new Error(`Failed to save chart: ${error.message}`);
  if (!data) throw new Error('Failed to save chart: no data returned');
  return data.id;
}

/**
 * Retrieve a chart by ID.
 * Returns the raw chart row (not reconstructed ChartAnalysis).
 */
export async function getChart(chartId: string) {
  const db = createServerClient();

  const { data, error } = await db
    .from('charts')
    .select('*')
    .eq('id', chartId)
    .single();

  if (error) throw new Error(`Failed to get chart: ${error.message}`);
  return data;
}

// ---------------------------------------------------------------------------
// Reading operations
// ---------------------------------------------------------------------------

interface SaveReadingParams {
  readingType: string;
  language: string;
  targetYear?: number;
  targetMonth?: number;
  partnerChartId?: string;
}

/**
 * Save an AI-generated reading to the database.
 * Returns the reading ID.
 */
export async function saveReading(
  chartId: string,
  userId: string | null,
  readingData: ReadingResult,
  params: SaveReadingParams
): Promise<string> {
  const db = createServerClient();

  const contentJson: Json = {
    sections: readingData.sections.map(s => ({
      title: s.title,
      content: s.content,
      sectionType: s.sectionType,
    })),
    rawText: readingData.rawText,
  };

  const { data, error } = await db
    .from('readings')
    .insert({
      chart_id: chartId,
      user_id: userId,
      reading_type: params.readingType,
      language: params.language,
      content: contentJson,
      target_year: params.targetYear ?? null,
      target_month: params.targetMonth ?? null,
      partner_chart_id: params.partnerChartId ?? null,
      ai_model: 'claude-opus-4-6',
      token_count: readingData.tokenCount.input + readingData.tokenCount.output,
    })
    .select('id')
    .single();

  if (error) throw new Error(`Failed to save reading: ${error.message}`);
  if (!data) throw new Error('Failed to save reading: no data returned');
  return data.id;
}

/**
 * Get a reading by ID.
 */
export async function getReading(readingId: string) {
  const db = createServerClient();

  const { data, error } = await db
    .from('readings')
    .select('*')
    .eq('id', readingId)
    .single();

  if (error) throw new Error(`Failed to get reading: ${error.message}`);
  return data;
}

/**
 * Get all readings for a user.
 */
export async function getUserReadings(userId: string, limit = 20) {
  const db = createServerClient();

  const { data, error } = await db
    .from('readings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to get user readings: ${error.message}`);
  return data;
}

// ---------------------------------------------------------------------------
// Birth profile operations
// ---------------------------------------------------------------------------

/**
 * Get all birth profiles for a user.
 */
export async function getUserProfiles(userId: string) {
  const db = createServerClient();

  const { data, error } = await db
    .from('birth_profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to get user profiles: ${error.message}`);
  return data;
}

/**
 * Create a new birth profile.
 * Returns the profile ID.
 */
export async function createProfile(
  userId: string,
  profile: {
    name: string;
    birthDate: string;
    birthTime?: string | null;
    birthTimeKnown?: boolean;
    gender: 'male' | 'female';
    calendarType?: 'solar' | 'lunar';
    isLeapMonth?: boolean;
    timezone?: string;
    isPrimary?: boolean;
    notes?: string;
  }
): Promise<string> {
  const db = createServerClient();

  const { data, error } = await db
    .from('birth_profiles')
    .insert({
      user_id: userId,
      name: profile.name,
      birth_date: profile.birthDate,
      birth_time: profile.birthTime ?? null,
      birth_time_known: profile.birthTimeKnown ?? (profile.birthTime !== null && profile.birthTime !== undefined),
      gender: profile.gender,
      calendar_type: profile.calendarType ?? 'solar',
      is_leap_month: profile.isLeapMonth ?? false,
      timezone: profile.timezone ?? 'Asia/Seoul',
      is_primary: profile.isPrimary ?? false,
      notes: profile.notes ?? null,
    })
    .select('id')
    .single();

  if (error) throw new Error(`Failed to create profile: ${error.message}`);
  if (!data) throw new Error('Failed to create profile: no data returned');
  return data.id;
}

// ---------------------------------------------------------------------------
// Credit operations
// ---------------------------------------------------------------------------

/**
 * Get the current credit balance for a user.
 */
export async function getUserCreditBalance(userId: string): Promise<number> {
  const db = createServerClient();

  const { data, error } = await db
    .from('credits')
    .select('amount, transaction_type')
    .eq('user_id', userId);

  if (error) throw new Error(`Failed to get credit balance: ${error.message}`);

  // Sum up: purchases and bonuses add, uses subtract
  let balance = 0;
  for (const row of data) {
    switch (row.transaction_type) {
      case 'purchase':
      case 'bonus':
      case 'refund':
        balance += row.amount;
        break;
      case 'use':
        balance -= row.amount;
        break;
    }
  }

  return balance;
}

/**
 * Deduct credits from a user's balance.
 * Throws if insufficient credits.
 */
export async function deductCredit(userId: string, amount: number, description: string): Promise<void> {
  const balance = await getUserCreditBalance(userId);
  if (balance < amount) {
    throw new Error(`Insufficient credits. Balance: ${balance}, required: ${amount}`);
  }

  const db = createServerClient();

  const { error } = await db
    .from('credits')
    .insert({
      user_id: userId,
      amount,
      transaction_type: 'use',
      description,
    });

  if (error) throw new Error(`Failed to deduct credits: ${error.message}`);
}

/**
 * Add credits to a user's balance.
 */
export async function addCredits(
  userId: string,
  amount: number,
  description: string,
  stripePaymentId?: string
): Promise<void> {
  const db = createServerClient();

  const { error } = await db
    .from('credits')
    .insert({
      user_id: userId,
      amount,
      transaction_type: 'purchase',
      description,
      stripe_payment_id: stripePaymentId ?? null,
    });

  if (error) throw new Error(`Failed to add credits: ${error.message}`);
}

// ---------------------------------------------------------------------------
// Daily energy operations
// ---------------------------------------------------------------------------

/**
 * Get today's daily energy data.
 */
export async function getDailyEnergy(date: string) {
  const db = createServerClient();

  const { data, error } = await db
    .from('daily_energies')
    .select('*')
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get daily energy: ${error.message}`);
  }

  return data;
}

/**
 * Save daily energy data (upsert).
 */
export async function saveDailyEnergy(
  date: string,
  stemIndex: number,
  branchIndex: number,
  elementHighlights: Record<string, unknown>
): Promise<void> {
  const db = createServerClient();

  const { error } = await db
    .from('daily_energies')
    .upsert({
      date,
      stem_index: stemIndex,
      branch_index: branchIndex,
      element_highlights: elementHighlights as unknown as Json,
    }, { onConflict: 'date' });

  if (error) throw new Error(`Failed to save daily energy: ${error.message}`);
}

// ---------------------------------------------------------------------------
// Compatibility operations
// ---------------------------------------------------------------------------

/**
 * Save a compatibility analysis.
 * Returns the compatibility ID.
 */
export async function saveCompatibility(
  chartAId: string,
  chartBId: string,
  overallScore: number,
  analysis: Record<string, unknown>
): Promise<string> {
  const db = createServerClient();

  const { data, error } = await db
    .from('compatibility')
    .insert({
      chart_a_id: chartAId,
      chart_b_id: chartBId,
      overall_score: overallScore,
      analysis: analysis as unknown as Json,
    })
    .select('id')
    .single();

  if (error) throw new Error(`Failed to save compatibility: ${error.message}`);
  if (!data) throw new Error('Failed to save compatibility: no data returned');
  return data.id;
}
