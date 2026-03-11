import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateReading } from '@/lib/reading-generator';
import { getChart, saveReading, getUserCreditBalance, deductCredit } from '@/lib/db';
import { getCachedReading, cacheReading, generateReadingCacheKey } from '@/lib/cache';
import { calculateFullChart } from '@/engine';
import type { ChartAnalysis } from '@/engine/types';
import type { Language } from '@/engine/interpretation/prompt-builder';

const VALID_LANGUAGES: Language[] = ['en', 'ko', 'vi'];

const inputSchema = z.object({
  chartId: z.string().uuid().optional(),
  birthData: z.object({
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    birthTime: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
    gender: z.enum(['male', 'female']),
    calendarType: z.enum(['solar', 'lunar']).default('solar'),
    isLeapMonth: z.boolean().default(false),
    timezone: z.string().default('Asia/Seoul'),
  }).optional(),
  targetYear: z.number().int().min(1900).max(2100),
  language: z.string().refine(
    (v): v is Language => VALID_LANGUAGES.includes(v as Language),
    { message: 'Invalid language' }
  ).default('en'),
});

const ANNUAL_CREDIT_COST = 2;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = inputSchema.parse(body);
    const language = (input.language ?? 'en') as Language;

    const userId = req.headers.get('x-user-id');

    // Credit check
    if (userId) {
      const balance = await getUserCreditBalance(userId);
      if (balance < ANNUAL_CREDIT_COST) {
        return NextResponse.json(
          { success: false, error: `Insufficient credits. Need ${ANNUAL_CREDIT_COST}, have ${balance}.` },
          { status: 402 }
        );
      }
    }

    // Resolve chart
    let chart: ChartAnalysis;
    let chartId = input.chartId;

    if (input.chartId) {
      // Verify chart exists
      const chartRow = await getChart(input.chartId);
      if (!chartRow) {
        return NextResponse.json({ success: false, error: 'Chart not found' }, { status: 404 });
      }
      // Need birth data to reconstruct
      if (!input.birthData) {
        return NextResponse.json(
          { success: false, error: 'birthData required alongside chartId for annual forecast' },
          { status: 400 }
        );
      }
      chart = calculateFullChart({
        birthDate: input.birthData.birthDate,
        birthTime: input.birthData.birthTime ?? undefined,
        gender: input.birthData.gender,
        timezone: input.birthData.timezone,
        calendarType: input.birthData.calendarType,
        leapMonth: input.birthData.isLeapMonth,
      });
    } else if (input.birthData) {
      chart = calculateFullChart({
        birthDate: input.birthData.birthDate,
        birthTime: input.birthData.birthTime ?? undefined,
        gender: input.birthData.gender,
        timezone: input.birthData.timezone,
        calendarType: input.birthData.calendarType,
        leapMonth: input.birthData.isLeapMonth,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Provide chartId with birthData, or birthData alone' },
        { status: 400 }
      );
    }

    // Check reading cache
    const cacheKey = generateReadingCacheKey(
      chartId ?? 'anon',
      'annual',
      language,
      input.targetYear
    );
    const cachedText = await getCachedReading(cacheKey);
    if (cachedText) {
      return NextResponse.json({
        success: true,
        data: { rawText: cachedText, cached: true },
      });
    }

    // Generate annual forecast
    const reading = await generateReading(chart, 'annual', language, {
      targetYear: input.targetYear,
    });

    // Cache the result
    await cacheReading(cacheKey, reading.rawText);

    // Save reading and deduct credits
    if (userId) {
      try {
        await saveReading(chartId ?? '', userId, reading, {
          readingType: 'annual',
          language,
          targetYear: input.targetYear,
        });
        await deductCredit(userId, ANNUAL_CREDIT_COST, `Annual forecast ${input.targetYear}`);
      } catch (saveErr) {
        console.error('[forecast/annual] Failed to save:', saveErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        sections: reading.sections,
        rawText: reading.rawText,
        tokenCount: reading.tokenCount,
        cached: false,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('[forecast/annual] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate annual forecast' },
      { status: 500 }
    );
  }
}
