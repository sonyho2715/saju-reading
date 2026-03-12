import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateFullChart } from '@/engine';
import type { ChartAnalysis } from '@/engine/types';
import { streamReading } from '@/lib/reading-generator';
import { getChart, saveCompatibility } from '@/lib/db';
import { checkCompatibilityRateLimit } from '@/lib/rate-limiter';
import type { Language } from '@/engine/interpretation/prompt-builder';

const VALID_LANGUAGES: Language[] = ['en', 'ko', 'vi'];

const birthDataSchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
  gender: z.enum(['male', 'female']),
  calendarType: z.enum(['solar', 'lunar']).default('solar'),
  isLeapMonth: z.boolean().default(false),
  timezone: z.string().default('Asia/Seoul'),
});

const inputSchema = z.object({
  chartAId: z.string().uuid().optional(),
  chartBId: z.string().uuid().optional(),
  birthDataA: birthDataSchema.optional(),
  birthDataB: birthDataSchema.optional(),
  language: z.string().refine(
    (v): v is Language => VALID_LANGUAGES.includes(v as Language),
    { message: 'Invalid language' }
  ).default('en'),
});

function birthDataToChart(data: z.infer<typeof birthDataSchema>): ChartAnalysis {
  return calculateFullChart({
    birthDate: data.birthDate,
    birthTime: data.birthTime ?? undefined,
    gender: data.gender,
    timezone: data.timezone,
    calendarType: data.calendarType,
    leapMonth: data.isLeapMonth,
  });
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const rateCheck = await checkCompatibilityRateLimit(ip);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Compatibility rate limit reached. Try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const input = inputSchema.parse(body);
    const language = (input.language ?? 'en') as Language;

    // Resolve chart A
    let chartA: ChartAnalysis;
    let chartAId = input.chartAId;
    if (input.chartAId) {
      const row = await getChart(input.chartAId);
      if (!row) {
        return NextResponse.json({ success: false, error: 'Chart A not found' }, { status: 404 });
      }
      // For simplicity, require birthDataA if chartAId reconstruction not available
      if (!input.birthDataA) {
        return NextResponse.json(
          { success: false, error: 'birthDataA required when using chartAId (chart reconstruction not yet implemented)' },
          { status: 400 }
        );
      }
      chartA = birthDataToChart(input.birthDataA);
    } else if (input.birthDataA) {
      chartA = birthDataToChart(input.birthDataA);
    } else {
      return NextResponse.json(
        { success: false, error: 'Provide chartAId or birthDataA' },
        { status: 400 }
      );
    }

    // Resolve chart B
    let chartB: ChartAnalysis;
    let chartBId = input.chartBId;
    if (input.chartBId) {
      const row = await getChart(input.chartBId);
      if (!row) {
        return NextResponse.json({ success: false, error: 'Chart B not found' }, { status: 404 });
      }
      if (!input.birthDataB) {
        return NextResponse.json(
          { success: false, error: 'birthDataB required when using chartBId (chart reconstruction not yet implemented)' },
          { status: 400 }
        );
      }
      chartB = birthDataToChart(input.birthDataB);
    } else if (input.birthDataB) {
      chartB = birthDataToChart(input.birthDataB);
    } else {
      return NextResponse.json(
        { success: false, error: 'Provide chartBId or birthDataB' },
        { status: 400 }
      );
    }

    // Calculate compatibility score (synchronous, fast)
    const score = calculateCompatibilityScore(chartA, chartB);
    const userId = req.headers.get('x-user-id');

    // Stream the compatibility reading via SSE to avoid Vercel timeout
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial metadata before streaming tokens
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ meta: { chartA, chartB, score } })}\n\n`));

          const readingResult = await streamReading(
            chartA,
            'compatibility',
            language,
            (token: string) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
            },
            { partnerChart: chartB }
          );

          // Send completion event
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, sections: readingResult.sections })}\n\n`));
          controller.close();

          // Post-stream: save reading (fire and forget)
          if (userId && chartAId && chartBId) {
            try {
              await saveCompatibility(chartAId, chartBId, score, {
                readingText: readingResult.rawText,
                sections: readingResult.sections,
              });
            } catch (saveErr) {
              console.error('[compatibility] Failed to save:', saveErr);
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
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('[compatibility] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate compatibility reading' },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Simple compatibility scoring
// ---------------------------------------------------------------------------

function calculateCompatibilityScore(a: ChartAnalysis, b: ChartAnalysis): number {
  let score = 50; // base

  // Day master element interaction
  const dmA = a.dayMaster.element;
  const dmB = b.dayMaster.element;

  // Same element: moderate compatibility
  if (dmA === dmB) score += 10;

  // Productive cycle (Wood->Fire->Earth->Metal->Water->Wood)
  const productive: Record<string, string> = {
    Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood',
  };
  if (productive[dmA] === dmB || productive[dmB] === dmA) score += 20;

  // Destructive cycle
  const destructive: Record<string, string> = {
    Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood',
  };
  if (destructive[dmA] === dmB || destructive[dmB] === dmA) score -= 10;

  // Yin-Yang balance (opposites attract)
  if (a.dayMaster.yinYang !== b.dayMaster.yinYang) score += 10;

  // Element balance complementarity
  const balA = a.elementBalance;
  const balB = b.elementBalance;
  const elements = ['wood', 'fire', 'earth', 'metal', 'water'] as const;
  for (const el of elements) {
    // If one is weak and other is strong in same element, they complement
    if ((balA[el] < 1 && balB[el] > 2) || (balB[el] < 1 && balA[el] > 2)) {
      score += 3;
    }
  }

  // Clamp to 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}
