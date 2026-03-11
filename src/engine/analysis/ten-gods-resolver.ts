import { HeavenlyStem, TenGod, FourPillars } from '../types';
import { HIDDEN_STEMS } from '../constants/hidden-stems';
import { getElementRelation } from '../constants/elements';

export function getTenGod(dayMaster: HeavenlyStem, target: HeavenlyStem): TenGod {
  const relation = getElementRelation(dayMaster.element, target.element);
  const samePolarity = dayMaster.yinYang === target.yinYang;

  switch (relation) {
    case 'same':
      return samePolarity ? TenGod.Companion : TenGod.RobWealth;
    case 'generates':
      return samePolarity ? TenGod.EatingGod : TenGod.HurtingOfficer;
    case 'controls':
      return samePolarity ? TenGod.IndirectWealth : TenGod.DirectWealth;
    case 'controlled_by':
      return samePolarity ? TenGod.SevenKillings : TenGod.DirectOfficer;
    case 'generated_by':
      return samePolarity ? TenGod.IndirectSeal : TenGod.DirectSeal;
  }
}

export function resolveAllTenGods(
  fourPillars: FourPillars,
  dayMaster: HeavenlyStem
): Record<string, TenGod> {
  const result: Record<string, TenGod> = {};
  const pillars = [
    { key: 'year', pillar: fourPillars.year },
    { key: 'month', pillar: fourPillars.month },
    { key: 'hour', pillar: fourPillars.hour },
  ].filter((p): p is { key: string; pillar: NonNullable<typeof p.pillar> } => p.pillar !== null);

  for (const { key, pillar } of pillars) {
    result[`${key}_stem`] = getTenGod(dayMaster, pillar.stem);
  }

  // Hidden stems
  const allPillarKeys = ['year', 'month', 'day', 'hour'] as const;
  for (const key of allPillarKeys) {
    const pillar = fourPillars[key];
    if (!pillar) continue;
    const hidden = HIDDEN_STEMS[pillar.branch.index];
    hidden.forEach((hs, i) => {
      result[`${key}_hidden_${i}`] = getTenGod(dayMaster, hs.stem);
    });
  }

  return result;
}
