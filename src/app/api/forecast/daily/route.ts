import { NextRequest, NextResponse } from 'next/server';
import { getDayPillar } from '@/engine/calendar/day-pillar';
import { STEMS } from '@/engine/constants/stems';
import { BRANCHES } from '@/engine/constants/branches';
import { getDailyEnergy, saveDailyEnergy } from '@/lib/db';
import { getCachedDailyEnergy, cacheDailyEnergy } from '@/lib/cache';
import type { Element } from '@/engine/types';

// Element interaction descriptions for daily energy
const ELEMENT_THEMES: Record<Element, { energy: string; advice: string }> = {
  Wood: {
    energy: 'Growth and expansion energy dominates today. Good for new beginnings and planning.',
    advice: 'Start new projects. Connect with nature. Focus on personal growth.',
  },
  Fire: {
    energy: 'Passionate, dynamic energy today. Visibility and expression are amplified.',
    advice: 'Share your ideas. Network and socialize. Be mindful of impulsiveness.',
  },
  Earth: {
    energy: 'Stable, grounding energy today. Good for building foundations and nurturing.',
    advice: 'Focus on practical tasks. Strengthen relationships. Take care of health.',
  },
  Metal: {
    energy: 'Precise, decisive energy today. Clarity and structure are favored.',
    advice: 'Make decisions. Organize and declutter. Focus on quality over quantity.',
  },
  Water: {
    energy: 'Flowing, intuitive energy today. Good for reflection and deep thinking.',
    advice: 'Trust your instincts. Learn something new. Rest and recharge.',
  },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chartId = searchParams.get('chartId');
    const dateParam = searchParams.get('date');

    // Use provided date or today (in Asia/Seoul timezone)
    const now = new Date();
    const seoulFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const todayStr = dateParam ?? seoulFormatter.format(now);

    // Check cache first
    const cached = await getCachedDailyEnergy(todayStr);
    if (cached) {
      return NextResponse.json({
        success: true,
        data: {
          date: todayStr,
          ...cached,
          cached: true,
        },
      });
    }

    // Check database
    const dbEnergy = await getDailyEnergy(todayStr) as {
      stem_index: number;
      branch_index: number;
      element_highlights: Record<string, unknown>;
    } | null;
    if (dbEnergy) {
      const result = {
        stemIndex: dbEnergy.stem_index,
        branchIndex: dbEnergy.branch_index,
        elementHighlights: dbEnergy.element_highlights,
      };
      await cacheDailyEnergy(todayStr, result);
      return NextResponse.json({
        success: true,
        data: {
          date: todayStr,
          ...result,
          cached: false,
        },
      });
    }

    // Calculate today's day pillar
    const todayDate = new Date(todayStr + 'T12:00:00Z');
    const dayPillar = getDayPillar(todayDate, 'Asia/Seoul');

    const stem = STEMS[dayPillar.stem.index];
    const branch = BRANCHES[dayPillar.branch.index];

    if (!stem || !branch) {
      return NextResponse.json(
        { success: false, error: 'Failed to resolve day pillar' },
        { status: 500 }
      );
    }

    const dominantElement = stem.element;
    const themes = ELEMENT_THEMES[dominantElement];

    const elementHighlights: Record<string, unknown> = {
      dominant: dominantElement,
      stemElement: stem.element,
      branchElement: branch.element,
      yinYang: stem.yinYang,
      energy: themes.energy,
      advice: themes.advice,
      animal: branch.animal,
      stemKorean: stem.korean,
      stemHanja: stem.hanja,
      branchKorean: branch.korean,
      branchHanja: branch.hanja,
    };

    // Save to DB and cache
    try {
      await saveDailyEnergy(todayStr, stem.index, branch.index, elementHighlights);
    } catch (saveErr) {
      console.error('[forecast/daily] Failed to save daily energy:', saveErr);
    }
    await cacheDailyEnergy(todayStr, {
      stemIndex: stem.index,
      branchIndex: branch.index,
      elementHighlights,
    });

    return NextResponse.json({
      success: true,
      data: {
        date: todayStr,
        stemIndex: stem.index,
        branchIndex: branch.index,
        elementHighlights,
        cached: false,
      },
    });
  } catch (error) {
    console.error('[forecast/daily] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get daily forecast' },
      { status: 500 }
    );
  }
}
