import { db } from './prisma';
import type { ChartAnalysis, Element } from '../engine/types';
import type { ReadingResult } from './reading-generator';
import type { Prisma, BirthProfile, Chart, Reading, Credit, DailyEnergy } from '@/generated/prisma/client';

// ---------------------------------------------------------------------------
// Re-export row types from Prisma (replaces old Supabase types)
// ---------------------------------------------------------------------------

export type ChartRow = Chart;
export type ReadingRow = Reading;
export type BirthProfileRow = BirthProfile;
export type UserRow = Prisma.UserGetPayload<object>;

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
  const chart = await db.chart.create({
    data: {
      profileId,
      hourStem: chartData.fourPillars.hour?.stem.index ?? null,
      hourBranch: chartData.fourPillars.hour?.branch.index ?? null,
      dayStem: chartData.fourPillars.day.stem.index,
      dayBranch: chartData.fourPillars.day.branch.index,
      monthStem: chartData.fourPillars.month.stem.index,
      monthBranch: chartData.fourPillars.month.branch.index,
      yearStem: chartData.fourPillars.year.stem.index,
      yearBranch: chartData.fourPillars.year.branch.index,
      dayMaster: chartData.dayMaster.index,
      dayMasterStrength: chartData.dayMasterStrength,
      elementBalance: chartData.elementBalance as unknown as Prisma.InputJsonValue,
      tenGods: chartData.tenGods as unknown as Prisma.InputJsonValue,
      hiddenStems: chartData.hiddenStems as unknown as Prisma.InputJsonValue,
      usefulGod: elementToIndex(chartData.usefulGod),
      jealousyGod: elementToIndex(chartData.jealousyGod),
      chartPattern: chartData.chartPattern,
      specialStars: chartData.specialStars as unknown as Prisma.InputJsonValue,
      combinations: chartData.combinations as unknown as Prisma.InputJsonValue,
      clashes: chartData.clashes as unknown as Prisma.InputJsonValue,
      lifeStages: chartData.lifeStages as unknown as Prisma.InputJsonValue,
      luckCycles: chartData.luckCycles as unknown as Prisma.InputJsonValue,
      engineVersion: chartData.engineVersion,
    },
  });

  return chart.id;
}

/**
 * Retrieve a chart by ID.
 * Returns the raw chart row (not reconstructed ChartAnalysis).
 */
export async function getChart(chartId: string): Promise<ChartRow> {
  const chart = await db.chart.findUnique({ where: { id: chartId } });
  if (!chart) throw new Error(`Chart not found: ${chartId}`);
  return chart;
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
  const contentJson: Prisma.InputJsonValue = {
    sections: readingData.sections.map(s => ({
      title: s.title,
      content: s.content,
      sectionType: s.sectionType,
    })),
    rawText: readingData.rawText,
  };

  const reading = await db.reading.create({
    data: {
      chartId: chartId || null,
      userId: userId,
      readingType: params.readingType,
      language: params.language,
      content: contentJson,
      targetYear: params.targetYear ?? null,
      targetMonth: params.targetMonth ?? null,
      partnerChartId: params.partnerChartId ?? null,
      aiModel: 'claude-opus-4-6',
      tokenCount: readingData.tokenCount.input + readingData.tokenCount.output,
    },
  });

  return reading.id;
}

/**
 * Get a reading by ID.
 */
export async function getReading(readingId: string): Promise<ReadingRow> {
  const reading = await db.reading.findUnique({ where: { id: readingId } });
  if (!reading) throw new Error(`Reading not found: ${readingId}`);
  return reading;
}

/**
 * Get all readings for a user.
 */
export async function getUserReadings(userId: string, limit = 20): Promise<ReadingRow[]> {
  return db.reading.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

// ---------------------------------------------------------------------------
// Birth profile operations
// ---------------------------------------------------------------------------

/**
 * Get all birth profiles for a user.
 */
export async function getUserProfiles(userId: string): Promise<BirthProfileRow[]> {
  return db.birthProfile.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
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
  const created = await db.birthProfile.create({
    data: {
      userId,
      name: profile.name,
      birthDate: new Date(profile.birthDate),
      birthTime: profile.birthTime ?? null,
      birthTimeKnown: profile.birthTimeKnown ?? (profile.birthTime !== null && profile.birthTime !== undefined),
      gender: profile.gender,
      calendarType: profile.calendarType ?? 'solar',
      isLeapMonth: profile.isLeapMonth ?? false,
      timezone: profile.timezone ?? 'Asia/Seoul',
      isPrimary: profile.isPrimary ?? false,
      notes: profile.notes ?? null,
    },
  });

  return created.id;
}

// ---------------------------------------------------------------------------
// Credit operations
// ---------------------------------------------------------------------------

/**
 * Get the current credit balance for a user.
 */
export async function getUserCreditBalance(userId: string): Promise<number> {
  const credits = await db.credit.findMany({
    where: { userId },
    select: { amount: true, transactionType: true },
  });

  let balance = 0;
  for (const row of credits) {
    switch (row.transactionType) {
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

  await db.credit.create({
    data: {
      userId,
      amount,
      transactionType: 'use',
      description,
    },
  });
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
  await db.credit.create({
    data: {
      userId,
      amount,
      transactionType: 'purchase',
      description,
      stripePaymentId: stripePaymentId ?? null,
    },
  });
}

// ---------------------------------------------------------------------------
// Daily energy operations
// ---------------------------------------------------------------------------

/**
 * Get today's daily energy data.
 */
export async function getDailyEnergy(date: string) {
  return db.dailyEnergy.findUnique({
    where: { date: new Date(date) },
  });
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
  await db.dailyEnergy.upsert({
    where: { date: new Date(date) },
    update: {
      stemIndex,
      branchIndex,
      elementHighlights: elementHighlights as Prisma.InputJsonValue,
    },
    create: {
      date: new Date(date),
      stemIndex,
      branchIndex,
      elementHighlights: elementHighlights as Prisma.InputJsonValue,
    },
  });
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
  const compat = await db.compatibility.create({
    data: {
      chartAId,
      chartBId,
      overallScore,
      analysis: analysis as Prisma.InputJsonValue,
    },
  });

  return compat.id;
}
