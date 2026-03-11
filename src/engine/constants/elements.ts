import { Element } from '../types';

// Generating cycle: Wood->Fire->Earth->Metal->Water->Wood
export const GENERATES: Record<Element, Element> = {
  [Element.Wood]:  Element.Fire,
  [Element.Fire]:  Element.Earth,
  [Element.Earth]: Element.Metal,
  [Element.Metal]: Element.Water,
  [Element.Water]: Element.Wood,
};

// Controlling cycle: Wood->Earth->Water->Fire->Metal->Wood
export const CONTROLS: Record<Element, Element> = {
  [Element.Wood]:  Element.Earth,
  [Element.Fire]:  Element.Metal,
  [Element.Earth]: Element.Water,
  [Element.Metal]: Element.Wood,
  [Element.Water]: Element.Fire,
};

export function generates(a: Element, b: Element): boolean { return GENERATES[a] === b; }
export function controls(a: Element, b: Element): boolean { return CONTROLS[a] === b; }
export function generatedBy(a: Element, b: Element): boolean { return GENERATES[b] === a; }
export function controlledBy(a: Element, b: Element): boolean { return CONTROLS[b] === a; }
export function sameElement(a: Element, b: Element): boolean { return a === b; }

export function getElementRelation(from: Element, to: Element):
  'same' | 'generates' | 'controls' | 'generated_by' | 'controlled_by' {
  if (sameElement(from, to)) return 'same';
  if (generates(from, to)) return 'generates';
  if (controls(from, to)) return 'controls';
  if (generatedBy(from, to)) return 'generated_by';
  if (controlledBy(from, to)) return 'controlled_by';
  // This should never happen with valid elements
  throw new Error(`No relation between ${from} and ${to}`);
}
