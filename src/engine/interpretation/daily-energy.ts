import type { ChartAnalysis, Pillar } from '../types';
import { STEMS } from '../constants/stems';
import { BRANCHES } from '../constants/branches';
import { Element } from '../types';

/**
 * Builds a short prompt for today's energy reading.
 * Target: 100-150 words. One actionable tip.
 */
export function buildDailyEnergyPrompt(
  todayPillar: { stem: number; branch: number },
  userChart: ChartAnalysis
): string {
  const todayStem = STEMS[todayPillar.stem];
  const todayBranch = BRANCHES[todayPillar.branch];

  const dayMaster = userChart.dayMaster;
  const usefulGod = userChart.usefulGod;

  // Determine relationship between today's stem and Day Master
  const todayElement = todayStem.element;
  const dmElement = dayMaster.element;
  const relationship = describeRelation(dmElement, todayElement);

  // Is today's energy aligned with Useful God?
  const usefulGodAligned = todayElement === usefulGod;
  const jealousyGodAligned = todayElement === userChart.jealousyGod;

  return `You are a concise saju daily energy advisor. Write a brief, warm daily energy reading.

TODAY'S PILLAR:
- Stem: ${todayStem.korean} (${todayStem.hanja}) - ${todayStem.element} ${todayStem.yinYang}
- Branch: ${todayBranch.korean} (${todayBranch.hanja}, ${todayBranch.animal}) - ${todayBranch.element} ${todayBranch.yinYang}
- Dominant element today: ${todayElement}

USER'S DAY MASTER:
- ${dayMaster.korean} (${dayMaster.hanja}) - ${dmElement} ${dayMaster.yinYang}
- Strength: ${userChart.dayMasterStrength}
- Useful God: ${usefulGod}

INTERACTION:
- Today's stem element (${todayElement}) ${relationship} the Day Master (${dmElement})
- Useful God alignment: ${usefulGodAligned ? 'YES - favorable day' : 'No'}
- Jealousy God alignment: ${jealousyGodAligned ? 'YES - use caution' : 'No'}

WRITE:
1. One sentence describing today's energy (reference the element and animal)
2. One sentence on how it specifically interacts with this person's Day Master
3. One actionable tip for the day (be specific: timing, activity, color to wear, etc.)

Total: 100-150 words maximum. Be warm, concise, and specific. No generic horoscope language.`;
}

/**
 * Get today's pillar data (stem and branch indices).
 * Uses the standard sexagenary cycle calculation.
 */
export function getTodayPillar(date: Date = new Date()): { stem: number; branch: number } {
  // Reference: Jan 1, 1900 = 庚子 (stem 6, branch 0) is day 1 of the cycle
  // JDN of Jan 1, 1900 = 2415021
  const referenceDate = new Date(1900, 0, 1);
  const diffDays = Math.floor((date.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));

  // Jan 1, 1900 is 庚子 day (cycle position: stem=6, branch=0)
  const stemIndex = ((diffDays % 10) + 6) % 10;
  const branchIndex = ((diffDays % 12) + 0) % 12;

  return {
    stem: ((stemIndex % 10) + 10) % 10,
    branch: ((branchIndex % 12) + 12) % 12,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function describeRelation(dayMaster: Element, todayElement: Element): string {
  if (dayMaster === todayElement) return 'is the SAME element as';

  const generates: Record<Element, Element> = {
    [Element.Wood]: Element.Fire,
    [Element.Fire]: Element.Earth,
    [Element.Earth]: Element.Metal,
    [Element.Metal]: Element.Water,
    [Element.Water]: Element.Wood,
  };

  if (generates[dayMaster] === todayElement) return 'PRODUCES (outputs energy to)';
  if (generates[todayElement] === dayMaster) return 'NOURISHES (feeds energy to)';

  const controls: Record<Element, Element> = {
    [Element.Wood]: Element.Earth,
    [Element.Fire]: Element.Metal,
    [Element.Earth]: Element.Water,
    [Element.Metal]: Element.Wood,
    [Element.Water]: Element.Fire,
  };

  if (controls[dayMaster] === todayElement) return 'CONTROLS (dominates)';
  if (controls[todayElement] === dayMaster) return 'PRESSURES (challenges)';

  return 'interacts with';
}
