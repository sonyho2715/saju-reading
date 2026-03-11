import { FourPillars, DayMasterStrength, Element } from '../types';
import { HIDDEN_STEMS } from '../constants/hidden-stems';
import { getElementRelation } from '../constants/elements';

// Seasonal strength: which month branch indices strengthen each element
const SEASONAL_STRENGTH: Record<Element, number[]> = {
  [Element.Wood]:  [2, 3],          // spring
  [Element.Fire]:  [5, 6],          // summer
  [Element.Earth]: [1, 4, 7, 10],   // seasonal transitions
  [Element.Metal]: [8, 9],          // autumn
  [Element.Water]: [0, 11],         // winter
};

// Weak months (out-of-season)
const SEASONAL_WEAKNESS: Record<Element, number[]> = {
  [Element.Wood]:  [8, 9],
  [Element.Fire]:  [11, 0],
  [Element.Earth]: [2, 3, 5, 6, 8, 9, 0, 11],
  [Element.Metal]: [2, 3],
  [Element.Water]: [5, 6],
};

export function analyzeDayMasterStrength(fourPillars: FourPillars): {
  strength: DayMasterStrength;
  supportScore: number;
  drainScore: number;
  seasonalStrength: string;
  hasRoot: boolean;
  details: string[];
} {
  const dayMaster = fourPillars.day.stem;
  const monthBranch = fourPillars.month.branch.index;
  const details: string[] = [];
  let supportScore = 0;
  let drainScore = 0;

  // 1. Seasonal strength (~40% weight)
  let seasonalScore = 0;
  let seasonalLabel = 'neutral';
  if (SEASONAL_STRENGTH[dayMaster.element].includes(monthBranch)) {
    seasonalScore = 3;
    seasonalLabel = 'in-season';
    details.push('In season: +3 support');
  } else if (SEASONAL_WEAKNESS[dayMaster.element].includes(monthBranch)) {
    seasonalScore = -2;
    seasonalLabel = 'out-of-season';
    details.push('Out of season: -2 support');
  }
  supportScore += Math.max(0, seasonalScore);
  drainScore += Math.max(0, -seasonalScore);

  // 2. Check roots: Day Master element in hidden stems of any branch
  let hasRoot = false;
  const allPillars = [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour].filter(Boolean);
  for (const pillar of allPillars) {
    if (!pillar) continue;
    const hidden = HIDDEN_STEMS[pillar.branch.index] ?? [];
    for (const hs of hidden) {
      if (hs.stem.element === dayMaster.element) {
        hasRoot = true;
        supportScore += hs.weight;
        details.push(`Root in ${pillar.branch.hanja}: +${hs.weight}`);
      }
    }
  }

  // 3. Count support vs drain from visible stems (excluding Day Master itself)
  const stemPillars = [fourPillars.year, fourPillars.month, fourPillars.hour].filter(Boolean);
  for (const pillar of stemPillars) {
    if (!pillar) continue;
    const rel = getElementRelation(dayMaster.element, pillar.stem.element);
    if (rel === 'same') {
      supportScore += 1.0;
      details.push(`${pillar.stem.hanja}: same element +1`);
    } else if (rel === 'generated_by') {
      supportScore += 1.0;
      details.push(`${pillar.stem.hanja}: produces DM +1`);
    } else if (rel === 'generates') {
      drainScore += 0.8;
      details.push(`${pillar.stem.hanja}: DM produces (output) -0.8`);
    } else if (rel === 'controls') {
      drainScore += 0.6;
      details.push(`${pillar.stem.hanja}: DM controls (wealth) -0.6`);
    } else if (rel === 'controlled_by') {
      drainScore += 1.0;
      details.push(`${pillar.stem.hanja}: controls DM (authority) -1`);
    }
  }

  // 4. Determine strength ratio
  const total = supportScore + drainScore;
  const ratio = total > 0 ? supportScore / total : 0.5;

  let strength: DayMasterStrength;
  if (ratio > 0.65) strength = DayMasterStrength.ExtremelyStrong;
  else if (ratio > 0.55) strength = DayMasterStrength.Strong;
  else if (ratio >= 0.45) strength = DayMasterStrength.Neutral;
  else if (ratio >= 0.35) strength = DayMasterStrength.Weak;
  else strength = DayMasterStrength.ExtremelyWeak;

  return { strength, supportScore, drainScore, seasonalStrength: seasonalLabel, hasRoot, details };
}
