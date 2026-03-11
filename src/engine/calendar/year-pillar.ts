import { Pillar } from '../types';
import { STEMS } from '../constants/stems';
import { BRANCHES } from '../constants/branches';
import { getSeasonalNode } from './seasonal-nodes';

export function getYearPillar(solarDate: Date, _timezone: string): Pillar {
  const year = solarDate.getFullYear();
  const ipchun = getSeasonalNode('입춘', year);

  // If date is before 입춘, the saju year is the previous calendar year
  const sajuYear = solarDate < ipchun ? year - 1 : year;

  const stemIndex = ((sajuYear - 4) % 10 + 10) % 10;
  const branchIndex = ((sajuYear - 4) % 12 + 12) % 12;

  return { stem: STEMS[stemIndex], branch: BRANCHES[branchIndex] };
}
