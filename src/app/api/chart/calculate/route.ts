import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateFullChart } from '@/engine';
import { saveChart } from '@/lib/db';
import { getCachedChart, cacheChart } from '@/lib/cache';
import { checkChartRateLimit } from '@/lib/rate-limiter';

const inputSchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/,  'birthDate must be YYYY-MM-DD'),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, 'birthTime must be HH:MM').optional().nullable(),
  gender: z.enum(['male', 'female']),
  calendarType: z.enum(['solar', 'lunar']).default('solar'),
  isLeapMonth: z.boolean().default(false),
  timezone: z.string().default('Asia/Seoul'),
  profileId: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const rateCheck = await checkChartRateLimit(ip);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(rateCheck.limit),
            'X-RateLimit-Remaining': String(rateCheck.remaining),
            'X-RateLimit-Reset': String(rateCheck.reset),
          },
        }
      );
    }

    // Parse and validate input
    const body = await req.json();
    const input = inputSchema.parse(body);

    // Check cache if profileId provided
    if (input.profileId) {
      const cached = await getCachedChart(input.profileId);
      if (cached) {
        return NextResponse.json({ success: true, data: cached, cached: true });
      }
    }

    // Calculate chart
    const chart = calculateFullChart({
      birthDate: input.birthDate,
      birthTime: input.birthTime ?? undefined,
      gender: input.gender,
      timezone: input.timezone,
      calendarType: input.calendarType,
      leapMonth: input.isLeapMonth,
    });

    // Get user ID from middleware header (optional for anonymous users)
    const userId = req.headers.get('x-user-id');

    // Save to DB if user is logged in and profileId provided
    let chartId: string | undefined;
    if (userId && input.profileId) {
      try {
        chartId = await saveChart(input.profileId, chart);
      } catch (dbError) {
        console.error('[chart/calculate] Failed to save chart:', dbError);
        // Non-fatal: return the chart even if saving fails
      }
    }

    // Cache result if profileId provided
    if (input.profileId) {
      await cacheChart(input.profileId, chart);
    }

    return NextResponse.json({
      success: true,
      data: chart,
      chartId: chartId ?? null,
      cached: false,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    const msg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack?.split('\n').slice(0, 5).join(' | ') : '';
    console.error('[chart/calculate] Error:', msg, stack);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate chart', detail: msg },
      { status: 500 }
    );
  }
}
