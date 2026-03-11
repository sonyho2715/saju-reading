import { Pillar, HeavenlyStem } from '../types';
import { STEMS } from '../constants/stems';
import { BRANCHES } from '../constants/branches';

// Hour stem base: which stem starts the 子時 hour for each day stem group
const HOUR_STEM_BASE: Record<number, number> = {
  0: 0,  // 甲/己 day -> starts at 甲 (0)
  5: 0,
  1: 2,  // 乙/庚 day -> starts at 丙 (2)
  6: 2,
  2: 4,  // 丙/辛 day -> starts at 戊 (4)
  7: 4,
  3: 6,  // 丁/壬 day -> starts at 庚 (6)
  8: 6,
  4: 8,  // 戊/癸 day -> starts at 壬 (8)
  9: 8,
};

// Map hour to branch index and offset
// 子時 = 23:00-01:00 (branch 0), offset 0
// 丑時 = 01:00-03:00 (branch 1), offset 1
// ... etc
function getHourBranchAndOffset(hour: number): { branchIndex: number; offset: number } {
  // 23:00 maps to 子 (branch 0, offset 0)
  if (hour === 23) return { branchIndex: 0, offset: 0 };
  // 0:00 also maps to 子 (branch 0, offset 0)
  if (hour === 0) return { branchIndex: 0, offset: 0 };
  // For hours 1-22: offset = ceil(hour / 2)
  const offset = Math.ceil(hour / 2);
  const branchIndex = offset % 12;
  return { branchIndex, offset };
}

export function getHourPillar(
  hour: number,
  _minute: number,
  dayStem: HeavenlyStem,
  _ziShiMode: 'traditional' | 'modern' = 'traditional'
): Pillar | null {
  // 子時 day boundary: traditional = 23:00 belongs to NEXT day's pillar
  // Modern = 23:00 belongs to current day
  // For hour pillar calculation, the branch is always 子 for 23:00-01:00
  // The difference is which DAY's stem we use, handled in four-pillars.ts

  const { branchIndex, offset } = getHourBranchAndOffset(hour);
  const base = HOUR_STEM_BASE[dayStem.index];
  const stemIndex = (base + offset) % 10;

  return { stem: STEMS[stemIndex], branch: BRANCHES[branchIndex] };
}
