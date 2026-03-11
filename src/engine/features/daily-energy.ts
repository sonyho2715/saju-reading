import type { ChartAnalysis, Pillar, Element } from '../types';
import { getDayPillar } from '../calendar/day-pillar';
import { STEMS } from '../constants/stems';
import { BRANCHES } from '../constants/branches';
import { GENERATES, CONTROLS } from '../constants/elements';
import { getTenGod } from '../analysis/ten-gods-resolver';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DailyEnergyResult {
  date: string;
  pillar: Pillar;
  dominantElement: string;
  energyLevel: 'high' | 'medium' | 'low';
  userInteraction?: {
    dayMasterRelation: string;
    activeStars: string[];
    summary: string;
    doToday: string;
    avoidToday: string;
    luckyColor: string;
    luckyDirection: string;
    luckyNumber: number;
  };
}

// ---------------------------------------------------------------------------
// Element-based daily advice
// ---------------------------------------------------------------------------

const ELEMENT_DAILY_ADVICE: Record<string, { do: string; avoid: string; color: string; direction: string }> = {
  Wood: {
    do: 'Start new projects, plant seeds of ideas, exercise outdoors, connect with nature',
    avoid: 'Being rigid or inflexible, overworking without rest, confrontation',
    color: 'green',
    direction: 'East',
  },
  Fire: {
    do: 'Present ideas, network, express creativity, attend social gatherings',
    avoid: 'Making impulsive decisions, overcommitting, risky financial moves',
    color: 'red',
    direction: 'South',
  },
  Earth: {
    do: 'Focus on stability, organize, plan long-term, nurture relationships',
    avoid: 'Rushing decisions, unnecessary travel, starting too many things at once',
    color: 'yellow',
    direction: 'Center',
  },
  Metal: {
    do: 'Make decisive choices, finalize contracts, focus on discipline and structure',
    avoid: 'Being too harsh or critical, ignoring emotions, overanalyzing',
    color: 'white',
    direction: 'West',
  },
  Water: {
    do: 'Reflect, study, meditate, gather information, plan strategy',
    avoid: 'Being overly passive, procrastinating on important actions, isolation',
    color: 'black',
    direction: 'North',
  },
};

// Element interaction descriptions
const RELATION_DESCRIPTIONS: Record<string, string> = {
  same: 'Companion energy, peer support day',
  generates: 'Productive day, your energy flows outward creatively',
  generated_by: 'Nourishing day, you receive support and resources',
  controls: 'Active day, you have authority and drive',
  controlled_by: 'Challenging day, external pressure tests your resolve',
};

// Lucky numbers by element
const ELEMENT_LUCKY_NUMBERS: Record<string, number[]> = {
  Wood: [3, 8],
  Fire: [2, 7],
  Earth: [5, 10],
  Metal: [4, 9],
  Water: [1, 6],
};

// ---------------------------------------------------------------------------
// Element relation helper
// ---------------------------------------------------------------------------

function getRelation(from: Element, to: Element): string {
  if (from === to) return 'same';
  if (GENERATES[from] === to) return 'generates';
  if (CONTROLS[from] === to) return 'controls';
  // Check reverse
  if (GENERATES[to] === from) return 'generated_by';
  if (CONTROLS[to] === from) return 'controlled_by';
  return 'same';
}

// ---------------------------------------------------------------------------
// Main calculator
// ---------------------------------------------------------------------------

export function calculateDailyEnergy(date: Date, userChart?: ChartAnalysis): DailyEnergyResult {
  const dateStr = date.toISOString().slice(0, 10);
  const pillar = getDayPillar(date, 'UTC');
  const stem = STEMS[pillar.stem.index];
  const branch = BRANCHES[pillar.branch.index];
  const dominantElement = stem.element as string;

  // Determine general energy level based on Yin/Yang of stem
  // Yang stems = higher energy, Yin stems = lower energy
  // Also factor in branch support
  let energyLevel: DailyEnergyResult['energyLevel'] = 'medium';
  if (stem.yinYang === 'Yang' && branch.element === stem.element) {
    energyLevel = 'high';
  } else if (stem.yinYang === 'Yin' && CONTROLS[branch.element] === stem.element) {
    energyLevel = 'low';
  }

  const result: DailyEnergyResult = {
    date: dateStr,
    pillar,
    dominantElement,
    energyLevel,
  };

  // If user chart is provided, generate personalized interaction
  if (userChart) {
    const dayMaster = userChart.dayMaster;
    const relation = getRelation(stem.element, dayMaster.element);
    const usefulGod = userChart.usefulGod;
    const jealousyGod = userChart.jealousyGod;

    // Check active special stars
    const activeStars: string[] = [];
    for (const star of userChart.specialStars) {
      // Check if the day's branch activates any star patterns
      if (star.name === 'yeokma_sal') activeStars.push('Traveling Horse (movement energy)');
      if (star.name === 'dohwa_sal') activeStars.push('Peach Blossom (social charm)');
      if (star.name === 'cheonil_guiin') activeStars.push('Heavenly Nobleman (protection)');
    }

    // Summary based on element relation and useful/jealousy god
    let summary: string;
    if (stem.element === usefulGod) {
      summary = `Excellent day for you. ${dominantElement} energy is your Useful God, strengthening your chart balance.`;
      energyLevel = 'high';
    } else if (stem.element === jealousyGod) {
      summary = `Cautious day. ${dominantElement} energy is your Jealousy God, creating tension.`;
      energyLevel = 'low';
    } else {
      summary = `${RELATION_DESCRIPTIONS[relation] ?? 'Neutral energy day'}. ${dominantElement} element shapes today's energy.`;
    }

    // Personalized advice
    const dayAdvice = ELEMENT_DAILY_ADVICE[dominantElement] ?? ELEMENT_DAILY_ADVICE['Earth'];
    const usefulAdvice = ELEMENT_DAILY_ADVICE[usefulGod as string] ?? dayAdvice;

    // Ten God for today
    const todayTenGod = getTenGod(dayMaster, stem);

    const luckyNumbers = ELEMENT_LUCKY_NUMBERS[usefulGod as string] ?? [5];
    const luckyNumber = luckyNumbers[date.getDate() % luckyNumbers.length];

    result.energyLevel = energyLevel;
    result.userInteraction = {
      dayMasterRelation: `${todayTenGod} (${relation})`,
      activeStars,
      summary,
      doToday: stem.element === usefulGod ? dayAdvice.do : usefulAdvice.do,
      avoidToday: stem.element === jealousyGod
        ? `${dayAdvice.avoid}. Extra caution: ${dominantElement} conflicts with your chart.`
        : dayAdvice.avoid,
      luckyColor: usefulAdvice.color,
      luckyDirection: usefulAdvice.direction,
      luckyNumber,
    };
  }

  return result;
}
