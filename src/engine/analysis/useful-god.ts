import { FourPillars, DayMasterStrength, ElementBalance, Element } from '../types';
import { GENERATES, CONTROLS } from '../constants/elements';

export function determineUsefulGod(
  fourPillars: FourPillars,
  dayMasterStrength: DayMasterStrength,
  elementBalance: ElementBalance
): { usefulGod: Element; jealousyGod: Element; reasoning: string } {
  const dm = fourPillars.day.stem.element;

  let usefulGod: Element;
  let reasoning: string;

  if (dayMasterStrength === DayMasterStrength.ExtremelyStrong) {
    // Reinforce the dominant energy
    usefulGod = dm;
    reasoning = 'Extremely strong: Useful God is own element, reinforce the dominant energy';
  } else if (dayMasterStrength === DayMasterStrength.ExtremelyWeak) {
    // Follow the dominant element
    const dominant = getDominantElement(elementBalance, dm);
    usefulGod = dominant;
    reasoning = `Extremely weak: Following dominant element ${dominant}`;
  } else if (dayMasterStrength === DayMasterStrength.Strong || dayMasterStrength === DayMasterStrength.Neutral) {
    // Strong: needs draining. Priority: Wealth > Authority > Output
    const wealthEl = CONTROLS[dm]; // Day Master controls = Wealth
    const wealthScore = elementBalance[wealthEl.toLowerCase() as keyof ElementBalance];

    // Find what controls Day Master = Authority
    const authorityElement = (Object.entries(CONTROLS) as [Element, Element][])
      .find(([_, v]) => v === dm)?.[0];

    if (wealthScore < 2 && wealthEl) {
      usefulGod = wealthEl;
      reasoning = `Strong DM: Wealth (${wealthEl}) element balances, DM has authority over it`;
    } else if (authorityElement) {
      usefulGod = authorityElement;
      reasoning = `Strong DM: Authority (${authorityElement}) element needed for discipline`;
    } else {
      usefulGod = GENERATES[dm]; // Output
      reasoning = `Strong DM: Output (${GENERATES[dm]}) element drains excess energy`;
    }
  } else {
    // Weak: needs support. Priority: Seal > Companion
    const sealEl = (Object.entries(GENERATES) as [Element, Element][]).find(([_, v]) => v === dm)?.[0];
    if (sealEl) {
      usefulGod = sealEl;
      reasoning = `Weak DM: Seal (${sealEl}) element nourishes and strengthens`;
    } else {
      usefulGod = dm; // Companion
      reasoning = `Weak DM: Companion (${dm}) element provides peer support`;
    }
  }

  // Jealousy God: element that controls the Useful God
  const jealousyGod = CONTROLS[usefulGod];

  return { usefulGod, jealousyGod, reasoning };
}

function getDominantElement(balance: ElementBalance, exclude: Element): Element {
  const entries = (Object.entries(balance) as [string, number][])
    .map(([k, v]) => ({ element: (k.charAt(0).toUpperCase() + k.slice(1)) as Element, score: v }))
    .filter(e => e.element !== exclude)
    .sort((a, b) => b.score - a.score);
  return entries[0]?.element ?? exclude;
}
