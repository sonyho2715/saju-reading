import { FourPillars, ElementBalance, Element } from '../types';
import { HIDDEN_STEMS } from '../constants/hidden-stems';

export function calculateElementBalance(fourPillars: FourPillars): ElementBalance {
  const balance: ElementBalance = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

  const addElement = (el: Element, weight: number) => {
    const key = el.toLowerCase() as keyof ElementBalance;
    balance[key] += weight;
  };

  const pillars = [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour].filter(Boolean);

  for (const pillar of pillars) {
    if (!pillar) continue;
    // Stems count as 1.0
    addElement(pillar.stem.element, 1.0);
    // Branches own element count as 1.0
    addElement(pillar.branch.element, 1.0);
    // Hidden stems weighted
    const hidden = HIDDEN_STEMS[pillar.branch.index] ?? [];
    for (const hs of hidden) {
      addElement(hs.stem.element, hs.weight);
    }
  }

  return balance;
}

export function getElementScore(balance: ElementBalance, element: Element): number {
  return balance[element.toLowerCase() as keyof ElementBalance];
}
