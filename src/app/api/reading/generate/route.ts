import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateFullChart } from '@/engine';
import type { ChartAnalysis } from '@/engine/types';
import { streamReading } from '@/lib/reading-generator';
import type { ReadingType, Language } from '@/engine/interpretation/prompt-builder';
import { getChart, saveReading, getUserCreditBalance, deductCredit } from '@/lib/db';
import { checkReadingRateLimit } from '@/lib/rate-limiter';

const VALID_READING_TYPES: ReadingType[] = [
  'quick', 'full', 'personality', 'career', 'love', 'health', 'annual', 'monthly', 'compatibility',
];
const VALID_LANGUAGES: Language[] = ['en', 'ko', 'vi'];

// Credit cost per reading type
const CREDIT_COST: Record<ReadingType, number> = {
  quick: 0,
  personality: 1,
  career: 1,
  love: 1,
  health: 1,
  annual: 2,
  monthly: 2,
  compatibility: 2,
  full: 3,
};

const inputSchema = z.object({
  chartId: z.string().uuid().optional(),
  chartData: z.record(z.string(), z.unknown()).optional(),
  birthData: z.object({
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    birthTime: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
    gender: z.enum(['male', 'female']),
    calendarType: z.enum(['solar', 'lunar']).default('solar'),
    isLeapMonth: z.boolean().default(false),
    timezone: z.string().default('Asia/Seoul'),
  }).optional(),
  readingType: z.string().refine(
    (v): v is ReadingType => VALID_READING_TYPES.includes(v as ReadingType),
    { message: 'Invalid reading type' }
  ),
  language: z.string().refine(
    (v): v is Language => VALID_LANGUAGES.includes(v as Language),
    { message: 'Invalid language' }
  ).default('en'),
  options: z.object({
    targetYear: z.number().int().min(1900).max(2100).optional(),
    specificQuestion: z.string().max(500).optional(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = inputSchema.parse(body);
    const readingType = input.readingType as ReadingType;
    const language = (input.language ?? 'en') as Language;

    // Get user session
    const userId = req.headers.get('x-user-id');

    // Rate limit check (by user ID or IP)
    if (userId) {
      const rateCheck = await checkReadingRateLimit(userId);
      if (!rateCheck.success) {
        return NextResponse.json(
          { success: false, error: 'Daily reading limit reached. Upgrade for more readings.' },
          { status: 429 }
        );
      }
    }

    // Check credits for non-free reading types
    const cost = CREDIT_COST[readingType];
    if (cost > 0 && userId) {
      const balance = await getUserCreditBalance(userId);
      if (balance < cost) {
        return NextResponse.json(
          { success: false, error: `Insufficient credits. Need ${cost}, have ${balance}.` },
          { status: 402 }
        );
      }
    }

    // Resolve chart data
    let chart: ChartAnalysis;
    let chartId = input.chartId;

    if (input.chartId) {
      // Load from database
      const chartRow = await getChart(input.chartId);
      // The DB stores the full chart as JSON columns. For now, we recalculate
      // from the birth profile to get a proper ChartAnalysis object.
      // This is a simplification; in production you would reconstruct from stored data.
      chart = input.chartData as unknown as ChartAnalysis;
      if (!chart || !chart.fourPillars) {
        return NextResponse.json(
          { success: false, error: 'Chart data is required when chartId is provided but chart cannot be reconstructed. Provide chartData or birthData.' },
          { status: 400 }
        );
      }
      // Verify the chartId exists
      if (!chartRow) {
        return NextResponse.json(
          { success: false, error: 'Chart not found' },
          { status: 404 }
        );
      }
    } else if (input.chartData && typeof input.chartData === 'object' && 'fourPillars' in input.chartData) {
      chart = input.chartData as unknown as ChartAnalysis;
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
        { success: false, error: 'Provide chartId with chartData, chartData alone, or birthData' },
        { status: 400 }
      );
    }

    // Build reading options
    const readingOptions = {
      targetYear: input.options?.targetYear,
      specificQuestion: input.options?.specificQuestion,
    };

    // Stream the reading
    const encoder = new TextEncoder();
    let readingResult: Awaited<ReturnType<typeof streamReading>> | null = null;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          readingResult = await streamReading(
            chart,
            readingType,
            language,
            (token: string) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
            },
            readingOptions
          );

          // Send completion event
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          controller.close();

          // Post-stream: save reading and deduct credits (fire and forget)
          if (userId && readingResult) {
            try {
              await saveReading(
                chartId ?? '',
                userId,
                readingResult,
                {
                  readingType,
                  language,
                  targetYear: input.options?.targetYear,
                }
              );
              if (cost > 0) {
                await deductCredit(userId, cost, `${readingType} reading`);
              }
            } catch (saveErr) {
              console.error('[reading/generate] Failed to save reading:', saveErr);
            }
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Stream error';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('[reading/generate] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate reading' },
      { status: 500 }
    );
  }
}
