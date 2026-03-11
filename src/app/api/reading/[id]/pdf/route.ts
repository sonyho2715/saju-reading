import { NextRequest, NextResponse } from 'next/server';
import { getReading, getChart } from '@/lib/db';
import { generateReadingPDF, renderPDFToBuffer } from '@/lib/pdf-generator';
import { STEMS } from '@/engine/constants/stems';
import { BRANCHES } from '@/engine/constants/branches';
import type { ChartAnalysis, FourPillars, Element, DayMasterStrength, Combination, Clash, SpecialStar, LuckCycle, LifeStage, HiddenStem } from '@/engine/types';
import type { ReadingResult, ReadingSection } from '@/lib/reading-generator';

export const runtime = 'nodejs';

/**
 * Reconstruct a ChartAnalysis from a database chart row.
 * The DB stores indexes; we need to rebuild full objects.
 */
function reconstructChart(row: Record<string, unknown>): ChartAnalysis {
  const yearStem = STEMS[row.yearStem as number];
  const yearBranch = BRANCHES[row.yearBranch as number];
  const monthStem = STEMS[row.monthStem as number];
  const monthBranch = BRANCHES[row.monthBranch as number];
  const dayStem = STEMS[row.dayStem as number];
  const dayBranch = BRANCHES[row.dayBranch as number];
  const hourStem = row.hourStem !== null ? STEMS[row.hourStem as number] : null;
  const hourBranch = row.hourBranch !== null ? BRANCHES[row.hourBranch as number] : null;

  const fourPillars: FourPillars = {
    year: { stem: yearStem, branch: yearBranch },
    month: { stem: monthStem, branch: monthBranch },
    day: { stem: dayStem, branch: dayBranch },
    hour: hourStem && hourBranch ? { stem: hourStem, branch: hourBranch } : null,
  };

  const INDEX_TO_ELEMENT: Record<number, Element> = {
    0: 'Wood' as Element,
    1: 'Fire' as Element,
    2: 'Earth' as Element,
    3: 'Metal' as Element,
    4: 'Water' as Element,
  };

  return {
    fourPillars,
    dayMaster: dayStem,
    hiddenStems: (row.hiddenStems as Record<string, HiddenStem[]>) ?? { year: [], month: [], day: [], hour: [] },
    tenGods: (row.tenGods as Record<string, never>) ?? {},
    elementBalance: (row.elementBalance as ChartAnalysis['elementBalance']) ?? { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 },
    dayMasterStrength: (row.dayMasterStrength as DayMasterStrength) ?? 'neutral',
    supportScore: 0,
    drainScore: 0,
    usefulGod: INDEX_TO_ELEMENT[row.usefulGod as number] ?? ('Earth' as Element),
    jealousyGod: INDEX_TO_ELEMENT[row.jealousyGod as number] ?? ('Wood' as Element),
    chartPattern: (row.chartPattern as string) ?? 'Normal',
    chartPatternKorean: '',
    combinations: (row.combinations as Combination[]) ?? [],
    clashes: (row.clashes as Clash[]) ?? [],
    specialStars: (row.specialStars as SpecialStar[]) ?? [],
    lifeStages: (row.lifeStages as Record<'year' | 'month' | 'day' | 'hour', LifeStage | null>) ?? { year: null, month: null, day: null, hour: null },
    luckCycles: (row.luckCycles as LuckCycle[]) ?? [],
    luckDirection: 'forward',
    luckStartAge: 0,
    engineVersion: (row.engineVersion as string) ?? '1.0.0',
  };
}

/**
 * Reconstruct a ReadingResult from a database reading row.
 */
function reconstructReading(row: Record<string, unknown>): ReadingResult {
  const content = row.content as { sections?: ReadingSection[]; rawText?: string } | null;
  return {
    sections: content?.sections ?? [],
    rawText: content?.rawText ?? '',
    tokenCount: { input: 0, output: row.tokenCount as number ?? 0 },
    readingType: (row.readingType as string) ?? 'full',
    language: (row.language as string) ?? 'en',
    generatedAt: new Date((row.createdAt as string) ?? Date.now()),
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch reading from DB
    const readingRow = await getReading(id);
    if (!readingRow) {
      return NextResponse.json({ error: 'Reading not found' }, { status: 404 });
    }

    // Fetch associated chart
    if (!readingRow.chartId) {
      return NextResponse.json({ error: 'Reading has no associated chart' }, { status: 404 });
    }
    const chartRow = await getChart(readingRow.chartId);
    if (!chartRow) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
    }

    // Reconstruct objects
    const chart = reconstructChart(chartRow as unknown as Record<string, unknown>);
    const reading = reconstructReading(readingRow as unknown as Record<string, unknown>);

    // Generate PDF
    const pdfElement = generateReadingPDF(chart, reading);
    const pdfBuffer = await renderPDFToBuffer(pdfElement);

    // Return PDF
    const uint8 = new Uint8Array(pdfBuffer);
    return new NextResponse(uint8, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="saju-reading-${id}.pdf"`,
        'Content-Length': String(pdfBuffer.length),
      },
    });
  } catch (error) {
    console.error('[reading/pdf] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
