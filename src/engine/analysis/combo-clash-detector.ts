import { FourPillars, Combination, Clash } from '../types';
import {
  STEM_COMBINATIONS, STEM_CLASHES, SIX_HARMONIES,
  THREE_HARMONIES, SEASONAL_COMBOS, SIX_CLASHES,
  PUNISHMENTS, HARMS, BREAKS,
} from '../constants/combinations';
import { STEMS } from '../constants/stems';
import { BRANCHES } from '../constants/branches';

interface StemEntry { key: string; stem: typeof STEMS[number] }
interface BranchEntry { key: string; branch: typeof BRANCHES[number] }

function getStemPairs(fp: FourPillars): StemEntry[] {
  const result: StemEntry[] = [
    { key: 'year', stem: fp.year.stem },
    { key: 'month', stem: fp.month.stem },
    { key: 'day', stem: fp.day.stem },
  ];
  if (fp.hour) result.push({ key: 'hour', stem: fp.hour.stem });
  return result;
}

function getBranchList(fp: FourPillars): BranchEntry[] {
  const result: BranchEntry[] = [
    { key: 'year', branch: fp.year.branch },
    { key: 'month', branch: fp.month.branch },
    { key: 'day', branch: fp.day.branch },
  ];
  if (fp.hour) result.push({ key: 'hour', branch: fp.hour.branch });
  return result;
}

export function detectCombosAndClashes(fourPillars: FourPillars): {
  stemCombinations: Combination[];
  stemClashes: Clash[];
  branchHarmonies: Combination[];
  threeHarmonies: Combination[];
  seasonalCombos: Combination[];
  branchClashes: Clash[];
  punishments: Clash[];
  harms: Clash[];
  breaks: Clash[];
} {
  const stems = getStemPairs(fourPillars);
  const branches = getBranchList(fourPillars);
  const branchIndices = branches.map(b => b.branch.index);

  // Stem combinations
  const stemCombinations: Combination[] = [];
  for (const [s1, s2, result] of STEM_COMBINATIONS) {
    const a = stems.find(s => s.stem.index === s1);
    const b = stems.find(s => s.stem.index === s2);
    if (a && b) {
      stemCombinations.push({
        type: 'stemCombination',
        elements: [a.key, b.key],
        result,
        transforms: true,
        description: `${STEMS[s1].hanja}+${STEMS[s2].hanja} -> ${result}`,
      });
    }
  }

  // Stem clashes
  const stemClashes: Clash[] = [];
  for (const [s1, s2] of STEM_CLASHES) {
    const a = stems.find(s => s.stem.index === s1);
    const b = stems.find(s => s.stem.index === s2);
    if (a && b) {
      stemClashes.push({
        type: 'stemClash',
        elements: [STEMS[s1].hanja, STEMS[s2].hanja],
        positions: [a.key, b.key],
        severity: 5,
        nature: 'clash',
        description: `${STEMS[s1].hanja}<->${STEMS[s2].hanja} stem clash`,
      });
    }
  }

  // Six Harmonies
  const branchHarmonies: Combination[] = [];
  for (const [b1, b2, result] of SIX_HARMONIES) {
    const a = branches.find(b => b.branch.index === b1);
    const c = branches.find(b => b.branch.index === b2);
    if (a && c) {
      branchHarmonies.push({
        type: 'sixHarmony',
        elements: [a.key, c.key],
        result,
        transforms: true,
        description: `${BRANCHES[b1].hanja}+${BRANCHES[b2].hanja} -> ${result}`,
      });
    }
  }

  // Three Harmonies
  const threeHarmonies: Combination[] = [];
  for (const [b1, b2, b3, result] of THREE_HARMONIES) {
    const has1 = branchIndices.includes(b1);
    const has2 = branchIndices.includes(b2);
    const has3 = branchIndices.includes(b3);
    const count = [has1, has2, has3].filter(Boolean).length;
    if (count >= 2) {
      threeHarmonies.push({
        type: 'threeHarmony',
        elements: [BRANCHES[b1].hanja, BRANCHES[b2].hanja, BRANCHES[b3].hanja],
        result,
        transforms: count === 3,
        description: `${BRANCHES[b1].hanja}${BRANCHES[b2].hanja}${BRANCHES[b3].hanja} -> ${result} ${count === 2 ? '(partial)' : '(complete)'}`,
      });
    }
  }

  // Seasonal combos
  const seasonalCombos: Combination[] = [];
  for (const [b1, b2, b3, result] of SEASONAL_COMBOS) {
    const count = [b1, b2, b3].filter(b => branchIndices.includes(b)).length;
    if (count >= 2) {
      seasonalCombos.push({
        type: 'seasonalCombo',
        elements: [BRANCHES[b1].hanja, BRANCHES[b2].hanja, BRANCHES[b3].hanja],
        result,
        transforms: count === 3,
        description: `${BRANCHES[b1].hanja}${BRANCHES[b2].hanja}${BRANCHES[b3].hanja} -> ${result} ${count === 2 ? '(partial)' : ''}`,
      });
    }
  }

  // Six Clashes
  const CLASH_SEVERITY: Record<string, number> = {
    'day-month': 10, 'month-day': 10,
    'day-hour': 9, 'hour-day': 9,
    'day-year': 8, 'year-day': 8,
    'month-year': 7, 'year-month': 7,
    'month-hour': 6, 'hour-month': 6,
    'year-hour': 5, 'hour-year': 5,
  };
  const branchClashes: Clash[] = [];
  for (const [b1, b2] of SIX_CLASHES) {
    const a = branches.find(b => b.branch.index === b1);
    const c = branches.find(b => b.branch.index === b2);
    if (a && c) {
      const sevKey = `${a.key}-${c.key}`;
      branchClashes.push({
        type: 'branchClash',
        elements: [BRANCHES[b1].hanja, BRANCHES[b2].hanja],
        positions: [a.key, c.key],
        severity: CLASH_SEVERITY[sevKey] ?? 5,
        nature: 'clash',
        description: `${BRANCHES[b1].hanja}<->${BRANCHES[b2].hanja}`,
      });
    }
  }

  // Punishments
  const punishments: Clash[] = [];
  for (const [group, nature] of PUNISHMENTS) {
    if (group.length === 2 && group[0] === group[1]) {
      // Self-punishment: need 2+ of the same branch
      const count = branchIndices.filter(b => b === group[0]).length;
      if (count >= 2) {
        punishments.push({
          type: 'punishment',
          elements: [BRANCHES[group[0]].hanja, BRANCHES[group[0]].hanja],
          positions: [],
          severity: 7,
          nature: `self-punishment`,
          description: `${BRANCHES[group[0]].hanja}<->${BRANCHES[group[0]].hanja} self-punishment`,
        });
      }
    } else {
      const present = group.filter(b => branchIndices.includes(b));
      if (present.length === group.length) {
        punishments.push({
          type: 'punishment',
          elements: group.map(b => BRANCHES[b].hanja),
          positions: [],
          severity: 8,
          nature: `punishment (${nature})`,
          description: `${group.map(b => BRANCHES[b].hanja).join('')} punishment`,
        });
      }
    }
  }

  // Harms
  const harms: Clash[] = [];
  for (const [b1, b2] of HARMS) {
    const a = branches.find(b => b.branch.index === b1);
    const c = branches.find(b => b.branch.index === b2);
    if (a && c) {
      harms.push({
        type: 'harm',
        elements: [BRANCHES[b1].hanja, BRANCHES[b2].hanja],
        positions: [a.key, c.key],
        severity: 4,
        nature: 'harm',
        description: `${BRANCHES[b1].hanja}+${BRANCHES[b2].hanja} harm`,
      });
    }
  }

  // Breaks
  const breaks: Clash[] = [];
  for (const [b1, b2] of BREAKS) {
    const a = branches.find(b => b.branch.index === b1);
    const c = branches.find(b => b.branch.index === b2);
    if (a && c) {
      breaks.push({
        type: 'break',
        elements: [BRANCHES[b1].hanja, BRANCHES[b2].hanja],
        positions: [a.key, c.key],
        severity: 3,
        nature: 'break',
        description: `${BRANCHES[b1].hanja}+${BRANCHES[b2].hanja} break`,
      });
    }
  }

  return { stemCombinations, stemClashes, branchHarmonies, threeHarmonies, seasonalCombos, branchClashes, punishments, harms, breaks };
}
