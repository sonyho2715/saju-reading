import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateFullChart } from '@/engine';
import { getDayPillar } from '@/engine/calendar/day-pillar';
import { STEMS } from '@/engine/constants/stems';
import { BRANCHES } from '@/engine/constants/branches';
import { Element } from '@/engine/types';
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
  purpose: z.string().min(1).max(200),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  language: z.string().refine(
    (v): v is Language => VALID_LANGUAGES.includes(v as Language),
    { message: 'Invalid language' }
  ).default('en'),
});

// Element productive cycle: what element is PRODUCED by each
const PRODUCES: Record<Element, Element> = {
  [Element.Wood]: Element.Fire,
  [Element.Fire]: Element.Earth,
  [Element.Earth]: Element.Metal,
  [Element.Metal]: Element.Water,
  [Element.Water]: Element.Wood,
};

// Element destructive cycle: what element is DESTROYED by each
const DESTROYS: Record<Element, Element> = {
  [Element.Wood]: Element.Earth,
  [Element.Earth]: Element.Water,
  [Element.Water]: Element.Fire,
  [Element.Fire]: Element.Metal,
  [Element.Metal]: Element.Wood,
};

// Purpose-to-favorable-element mapping
const PURPOSE_ELEMENTS: Record<string, Element[]> = {
  wedding: [Element.Fire, Element.Earth],
  marriage: [Element.Fire, Element.Earth],
  business: [Element.Metal, Element.Water],
  travel: [Element.Wood, Element.Water],
  moving: [Element.Earth, Element.Metal],
  interview: [Element.Metal, Element.Fire],
  surgery: [Element.Metal, Element.Water],
  investment: [Element.Metal, Element.Water],
  study: [Element.Water, Element.Wood],
  ceremony: [Element.Fire, Element.Earth],
};

function getPurposeElements(purpose: string): Element[] {
  const lower = purpose.toLowerCase();
  for (const [key, elements] of Object.entries(PURPOSE_ELEMENTS)) {
    if (lower.includes(key)) return elements;
  }
  // Default: favor the useful god element
  return [];
}

interface DateScore {
  date: string;
  score: number;
  dayPillar: { stemHanja: string; branchHanja: string; stemKorean: string; branchKorean: string };
  element: Element;
  animal: string;
  explanation: string;
}

function scoreDateForChart(
  dateStr: string,
  chart: ChartAnalysis,
  purposeElements: Element[]
): DateScore {
  const date = new Date(dateStr + 'T12:00:00Z');
  const pillar = getDayPillar(date, 'Asia/Seoul');
  const stem = STEMS[pillar.stem.index];
  const branch = BRANCHES[pillar.branch.index];

  if (!stem || !branch) {
    return {
      date: dateStr,
      score: 0,
      dayPillar: { stemHanja: '?', branchHanja: '?', stemKorean: '?', branchKorean: '?' },
      element: 'Earth' as Element,
      animal: 'Unknown',
      explanation: 'Could not calculate',
    };
  }

  let score = 50;
  const reasons: string[] = [];
  const dayElement = stem.element;
  const usefulGod = chart.usefulGod;
  const jealousyGod = chart.jealousyGod;

  // Useful God alignment
  if (dayElement === usefulGod) {
    score += 25;
    reasons.push(`Day element (${dayElement}) matches your Useful God`);
  }
  if (branch.element === usefulGod) {
    score += 15;
    reasons.push(`Branch element (${branch.element}) supports your Useful God`);
  }

  // Jealousy God penalty
  if (dayElement === jealousyGod) {
    score -= 20;
    reasons.push(`Day element clashes with your Jealousy God (${jealousyGod})`);
  }

  // Productive relationship with Day Master
  if (PRODUCES[dayElement] === chart.dayMaster.element) {
    score += 10;
    reasons.push(`${dayElement} produces your Day Master element`);
  }

  // Destructive relationship with Day Master
  if (DESTROYS[dayElement] === chart.dayMaster.element) {
    score -= 15;
    reasons.push(`${dayElement} controls your Day Master element`);
  }

  // Purpose-specific elements
  for (const pe of purposeElements) {
    if (dayElement === pe) {
      score += 15;
      reasons.push(`${dayElement} is favorable for this purpose`);
    }
    if (branch.element === pe) {
      score += 8;
      reasons.push(`Branch ${branch.element} supports this purpose`);
    }
  }

  // Yin-Yang harmony with Day Master
  if (stem.yinYang !== chart.dayMaster.yinYang) {
    score += 5;
    reasons.push('Yin-Yang balance with Day Master');
  }

  // Branch clash with Day Branch
  if (branch.index === ((chart.fourPillars.day.branch.index + 6) % 12)) {
    score -= 15;
    reasons.push('Branch clashes with your Day Branch');
  }

  return {
    date: dateStr,
    score: Math.max(0, Math.min(100, score)),
    dayPillar: {
      stemHanja: stem.hanja,
      branchHanja: branch.hanja,
      stemKorean: stem.korean,
      branchKorean: branch.korean,
    },
    element: dayElement,
    animal: branch.animal,
    explanation: reasons.join('. ') || 'Neutral day',
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = inputSchema.parse(body);

    // Resolve chart
    let chart: ChartAnalysis;
    if (input.birthData) {
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
        { success: false, error: 'birthData is required' },
        { status: 400 }
      );
    }

    // Validate date range (max 90 days)
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return NextResponse.json(
        { success: false, error: 'endDate must be after startDate' },
        { status: 400 }
      );
    }
    if (diffDays > 90) {
      return NextResponse.json(
        { success: false, error: 'Date range cannot exceed 90 days' },
        { status: 400 }
      );
    }

    // Get purpose-specific favorable elements
    const purposeElements = getPurposeElements(input.purpose);

    // Score each date
    const allScores: DateScore[] = [];
    const current = new Date(start);

    while (current <= end) {
      const dateStr = current.toISOString().slice(0, 10);
      const scored = scoreDateForChart(dateStr, chart, purposeElements);
      allScores.push(scored);
      current.setDate(current.getDate() + 1);
    }

    // Sort by score descending, take top 10
    allScores.sort((a, b) => b.score - a.score);
    const topDates = allScores.slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        purpose: input.purpose,
        dateRange: { start: input.startDate, end: input.endDate },
        luckyDates: topDates,
        usefulGod: chart.usefulGod,
        dayMasterElement: chart.dayMaster.element,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('[lucky-dates] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to find lucky dates' },
      { status: 500 }
    );
  }
}
