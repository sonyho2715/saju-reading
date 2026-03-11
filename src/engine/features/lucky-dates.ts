import type { ChartAnalysis, Element } from '../types';
import { getDayPillar } from '../calendar/day-pillar';
import { STEMS } from '../constants/stems';
import { BRANCHES } from '../constants/branches';
import { GENERATES, CONTROLS } from '../constants/elements';
import { getTenGod } from '../analysis/ten-gods-resolver';
import { TenGod } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LuckyDateResult {
  date: string;           // YYYY-MM-DD
  score: number;          // 0-100
  rating: 'excellent' | 'good' | 'neutral' | 'caution' | 'avoid';
  reasons: string[];
  dayPillarHanja: string;
  dominantElement: string;
}

export type Purpose = 'wedding' | 'business' | 'move' | 'surgery' | 'travel' | 'signing' | 'general';

// ---------------------------------------------------------------------------
// Three Harmony groups (삼합)
// ---------------------------------------------------------------------------

const THREE_HARMONY_GROUPS: number[][] = [
  [8, 0, 4],   // Monkey-Rat-Dragon (Water)
  [5, 9, 1],   // Snake-Rooster-Ox (Metal)
  [2, 6, 10],  // Tiger-Horse-Dog (Fire)
  [11, 3, 7],  // Pig-Rabbit-Goat (Wood)
];

// Six Clash pairs (육충)
const SIX_CLASH: Record<number, number> = {
  0: 6, 1: 7, 2: 8, 3: 9, 4: 10, 5: 11,
  6: 0, 7: 1, 8: 2, 9: 3, 10: 4, 11: 5,
};

// Purpose-specific favorable Ten Gods
const PURPOSE_TENGODS: Record<Purpose, TenGod[]> = {
  wedding: [TenGod.DirectOfficer, TenGod.DirectWealth, TenGod.DirectSeal],
  business: [TenGod.IndirectWealth, TenGod.DirectWealth, TenGod.DirectOfficer],
  move: [TenGod.DirectSeal, TenGod.IndirectSeal],
  surgery: [TenGod.DirectSeal, TenGod.EatingGod],
  travel: [TenGod.EatingGod, TenGod.HurtingOfficer],
  signing: [TenGod.DirectOfficer, TenGod.DirectWealth],
  general: [],
};

// ---------------------------------------------------------------------------
// Scoring engine
// ---------------------------------------------------------------------------

function scoreDate(
  dateStr: string,
  chart: ChartAnalysis,
  purpose: Purpose,
): LuckyDateResult {
  const date = new Date(dateStr + 'T12:00:00Z');
  const pillar = getDayPillar(date, 'UTC');
  const stem = STEMS[pillar.stem.index];
  const branch = BRANCHES[pillar.branch.index];

  let score = 50;
  const reasons: string[] = [];

  const dayElement = stem.element;
  const branchElement = branch.element;
  const usefulGod = chart.usefulGod;
  const jealousyGod = chart.jealousyGod;
  const dayMaster = chart.dayMaster;
  const dayBranch = chart.fourPillars.day.branch;

  // 1. Useful God element alignment: +30
  if (dayElement === usefulGod) {
    score += 30;
    reasons.push(`Day stem element (${dayElement}) is your Useful God`);
  } else if (branchElement === usefulGod) {
    score += 15;
    reasons.push(`Day branch element (${branchElement}) supports your Useful God`);
  }

  // 2. Jealousy God penalty: -20
  if (dayElement === jealousyGod) {
    score -= 20;
    reasons.push(`Day stem element (${dayElement}) is your Jealousy God`);
  }

  // 3. Day Master harmony (productive relationship): +20
  if (GENERATES[dayElement] === dayMaster.element) {
    score += 20;
    reasons.push(`${dayElement} generates your Day Master (${dayMaster.element})`);
  }

  // 4. Day Master clash (control relationship): -40
  if (CONTROLS[dayElement] === dayMaster.element) {
    score -= 40;
    reasons.push(`${dayElement} controls your Day Master, conflict energy`);
  }

  // 5. Three Harmony with Day Branch: +15
  for (const group of THREE_HARMONY_GROUPS) {
    if (group.includes(branch.index) && group.includes(dayBranch.index) && branch.index !== dayBranch.index) {
      score += 15;
      reasons.push(`Three Harmony (${branch.hanja}-${dayBranch.hanja})`);
      break;
    }
  }

  // 6. Six Clash with Day Branch: -35
  if (SIX_CLASH[branch.index] === dayBranch.index) {
    score -= 35;
    reasons.push(`Six Clash between ${branch.hanja} and ${dayBranch.hanja}`);
  }

  // 7. Purpose-specific Ten God bonuses: +15
  const tenGodForDay = getTenGod(dayMaster, stem);
  const favorableTenGods = PURPOSE_TENGODS[purpose];
  if (favorableTenGods.includes(tenGodForDay)) {
    score += 15;
    reasons.push(`Day's Ten God (${tenGodForDay}) is favorable for ${purpose}`);
  }

  // 8. Travel: Traveling Horse activation +10
  if (purpose === 'travel') {
    const travelStars = chart.specialStars.filter(s => s.name === 'yeokma_sal');
    if (travelStars.length > 0) {
      score += 10;
      reasons.push('Traveling Horse star active in your chart, favorable for travel');
    }
  }

  // 9. Business: Wealth or Officer Ten Gods +15
  if (purpose === 'business') {
    if ([TenGod.DirectWealth, TenGod.IndirectWealth, TenGod.DirectOfficer].includes(tenGodForDay)) {
      score += 15;
      reasons.push(`Day produces ${tenGodForDay}, good for business`);
    }
  }

  // 10. Yin-Yang balance bonus: +5
  if (stem.yinYang !== dayMaster.yinYang) {
    score += 5;
    reasons.push('Yin-Yang balance with Day Master');
  }

  // Clamp score 0-100
  const finalScore = Math.max(0, Math.min(100, score));

  // Determine rating
  let rating: LuckyDateResult['rating'];
  if (finalScore >= 80) rating = 'excellent';
  else if (finalScore >= 65) rating = 'good';
  else if (finalScore >= 45) rating = 'neutral';
  else if (finalScore >= 30) rating = 'caution';
  else rating = 'avoid';

  return {
    date: dateStr,
    score: finalScore,
    rating,
    reasons: reasons.length > 0 ? reasons : ['Neutral day with no strong interactions'],
    dayPillarHanja: `${stem.hanja}${branch.hanja}`,
    dominantElement: dayElement as string,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function findLuckyDates(
  chart: ChartAnalysis,
  purpose: Purpose,
  startDate: Date,
  endDate: Date,
  limit = 10,
): LuckyDateResult[] {
  const results: LuckyDateResult[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const dateStr = current.toISOString().slice(0, 10);
    results.push(scoreDate(dateStr, chart, purpose));
    current.setDate(current.getDate() + 1);
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit);
}
