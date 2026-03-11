import { Pillar, HeavenlyStem } from '../types';
import { STEMS } from '../constants/stems';
import { BRANCHES } from '../constants/branches';
import { getSeasonalNode } from './seasonal-nodes';

// Month stem base: which stem starts the 寅 month for each year stem group
const MONTH_STEM_BASE: Record<number, number> = {
  0: 2,  // 甲/己 year -> starts at 丙 (index 2) for 寅 month
  5: 2,
  1: 4,  // 乙/庚 year -> starts at 戊 (index 4)
  6: 4,
  2: 6,  // 丙/辛 year -> starts at 庚 (index 6)
  7: 6,
  3: 8,  // 丁/壬 year -> starts at 壬 (index 8)
  8: 8,
  4: 0,  // 戊/癸 year -> starts at 甲 (index 0)
  9: 0,
};

export function getMonthPillar(
  solarDate: Date,
  yearStem: HeavenlyStem,
  _timezone: string
): Pillar {
  const year = solarDate.getFullYear();

  // The 12 seasonal nodes in order (starting from 소한 in January)
  const nodeOrder = ['소한', '입춘', '경칩', '청명', '입하', '망종',
                     '소서', '입추', '백로', '한로', '입동', '대설'];
  // Corresponding branch indices (丑=1, 寅=2, 卯=3, ...)
  const branchOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];

  // Find which month the date falls in
  let monthBranchIndex = 1; // default to 丑 (소한 month)
  let monthOffset = 0; // how many months past 寅 (index 2 in the year)

  for (let i = nodeOrder.length - 1; i >= 0; i--) {
    const nodeName = nodeOrder[i];
    const nodeDate = getSeasonalNode(nodeName, year);

    if (solarDate >= nodeDate) {
      monthBranchIndex = branchOrder[i];
      monthOffset = i;
      break;
    }
  }

  const base = MONTH_STEM_BASE[yearStem.index];
  // 소한 is offset 0, 입춘 is offset 1, etc.
  // 寅 month (입춘, offset 1) should use the base stem
  // So: stemIndex = base + (monthOffset - 1)
  const stemIndex = ((base + monthOffset - 1) % 10 + 10) % 10;

  return { stem: STEMS[stemIndex], branch: BRANCHES[monthBranchIndex] };
}
