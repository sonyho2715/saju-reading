import { FourPillars, LuckCycle, Pillar } from '../types';
import { STEMS } from '../constants/stems';
import { BRANCHES } from '../constants/branches';
import { getTenGod } from './ten-gods-resolver';
import { HIDDEN_STEMS } from '../constants/hidden-stems';
import { getSeasonalNode } from '../calendar/seasonal-nodes';

const NODE_NAMES = [
  '소한', '입춘', '경칩', '청명', '입하', '망종',
  '소서', '입추', '백로', '한로', '입동', '대설',
];

function getNextSeasonalNode(date: Date, forward: boolean): Date {
  const year = date.getFullYear();

  if (forward) {
    // Find next node after the birth date
    for (let y = year; y <= year + 1; y++) {
      for (const name of NODE_NAMES) {
        const nodeDate = getSeasonalNode(name, y);
        if (nodeDate > date) return nodeDate;
      }
    }
  } else {
    // Find previous node before the birth date
    for (let y = year; y >= year - 1; y--) {
      for (let i = NODE_NAMES.length - 1; i >= 0; i--) {
        const nodeDate = getSeasonalNode(NODE_NAMES[i], y);
        if (nodeDate < date) return nodeDate;
      }
    }
  }

  return date; // fallback
}

export function calculateLuckCycles(
  birthDate: Date,
  gender: 'male' | 'female',
  fourPillars: FourPillars,
  _timezone: string
): { direction: 'forward' | 'backward'; startAge: number; cycles: LuckCycle[] } {
  const yearStem = fourPillars.year.stem;
  const isYangYear = yearStem.index % 2 === 0;
  const isMale = gender === 'male';

  // Forward: Male+Yang OR Female+Yin
  const direction: 'forward' | 'backward' =
    (isMale && isYangYear) || (!isMale && !isYangYear) ? 'forward' : 'backward';

  // Calculate start age: days to nearest seasonal node / 3 = years
  const nodeDate = getNextSeasonalNode(birthDate, direction === 'forward');
  const daysDiff = Math.abs(nodeDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24);
  const startAge = Math.round((daysDiff / 3) * 10) / 10;

  // Generate 8 luck cycles starting from month pillar
  const monthPillar = fourPillars.month;
  const dayMaster = fourPillars.day.stem;
  const cycles: LuckCycle[] = [];

  let stemIdx = monthPillar.stem.index;
  let branchIdx = monthPillar.branch.index;

  for (let i = 0; i < 8; i++) {
    if (direction === 'forward') {
      stemIdx = (stemIdx + 1) % 10;
      branchIdx = (branchIdx + 1) % 12;
    } else {
      stemIdx = ((stemIdx - 1) + 10) % 10;
      branchIdx = ((branchIdx - 1) + 12) % 12;
    }

    const pillar: Pillar = { stem: STEMS[stemIdx], branch: BRANCHES[branchIdx] };
    const stemTenGod = getTenGod(dayMaster, STEMS[stemIdx]);
    const branchHidden = HIDDEN_STEMS[branchIdx];
    const mainHidden = branchHidden?.[0];
    const branchMainTenGod = mainHidden ? getTenGod(dayMaster, mainHidden.stem) : stemTenGod;

    const ageStart = Math.round(startAge) + i * 10;
    const ageEnd = ageStart + 9;

    cycles.push({
      index: i,
      ageStart,
      ageEnd,
      pillar,
      stemTenGod,
      branchMainTenGod,
      themes: [],
    });
  }

  return { direction, startAge, cycles };
}

export function calculateAnnualPillar(year: number): Pillar {
  const stemIndex = ((year - 4) % 10 + 10) % 10;
  const branchIndex = ((year - 4) % 12 + 12) % 12;
  return { stem: STEMS[stemIndex], branch: BRANCHES[branchIndex] };
}

export function calculateMonthlyPillar(year: number, month: number): Pillar {
  const annualPillar = calculateAnnualPillar(year);
  const MONTH_STEM_BASE: Record<number, number> = { 0: 2, 5: 2, 1: 4, 6: 4, 2: 6, 7: 6, 3: 8, 8: 8, 4: 0, 9: 0 };
  const base = MONTH_STEM_BASE[annualPillar.stem.index];
  const stemIdx = (base + month + 1) % 10;
  const branchIdx = (2 + month) % 12;
  return { stem: STEMS[stemIdx], branch: BRANCHES[branchIdx] };
}
