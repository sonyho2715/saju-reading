import { Pillar, Element, TenGod } from '../types';

export function formatPillar(pillar: Pillar): string {
  return `${pillar.stem.hanja}${pillar.branch.hanja} (${pillar.stem.romanized}-${pillar.branch.romanized})`;
}

export function formatElement(element: Element): string {
  return element;
}

export function formatTenGod(tenGod: TenGod): string {
  const englishMap: Record<TenGod, string> = {
    [TenGod.Companion]: 'Companion',
    [TenGod.RobWealth]: 'Rob Wealth',
    [TenGod.EatingGod]: 'Eating God',
    [TenGod.HurtingOfficer]: 'Hurting Officer',
    [TenGod.IndirectWealth]: 'Indirect Wealth',
    [TenGod.DirectWealth]: 'Direct Wealth',
    [TenGod.SevenKillings]: 'Seven Killings',
    [TenGod.DirectOfficer]: 'Direct Officer',
    [TenGod.IndirectSeal]: 'Indirect Seal',
    [TenGod.DirectSeal]: 'Direct Seal',
  };
  return `${tenGod} (${englishMap[tenGod]})`;
}
