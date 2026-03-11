import { Pillar } from '../types';
import { STEMS } from '../constants/stems';
import { BRANCHES } from '../constants/branches';

// Verified reference: January 1, 2000 UTC = 丙子 (Byeong-Ja), 60-cycle index 13 (1-indexed)
// Stem index 2 (丙), Branch index 0 (子)
const REFERENCE_DATE_JDN = 2451545; // Julian Day Number for 2000-01-01
const REFERENCE_CYCLE_INDEX = 12;   // 0-indexed (13-1=12)

function dateToJulianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();

  const a = Math.floor((14 - m) / 12);
  const yr = y + 4800 - a;
  const mo = m + 12 * a - 3;

  return d + Math.floor((153 * mo + 2) / 5) + 365 * yr +
    Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045;
}

export function getDayPillar(solarDate: Date, _timezone: string): Pillar {
  const jdn = dateToJulianDay(solarDate);
  const daysDiff = jdn - REFERENCE_DATE_JDN;
  const cycleIndex = ((REFERENCE_CYCLE_INDEX + daysDiff) % 60 + 60) % 60;

  const stemIndex = cycleIndex % 10;
  const branchIndex = cycleIndex % 12;

  return { stem: STEMS[stemIndex], branch: BRANCHES[branchIndex] };
}
