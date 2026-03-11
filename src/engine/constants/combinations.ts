import { Element } from '../types';

// Heavenly Stem combinations -> result element
export const STEM_COMBINATIONS: [number, number, Element][] = [
  [0, 5, Element.Earth],   // 甲+己->Earth
  [1, 6, Element.Metal],   // 乙+庚->Metal
  [2, 7, Element.Water],   // 丙+辛->Water
  [3, 8, Element.Wood],    // 丁+壬->Wood
  [4, 9, Element.Fire],    // 戊+癸->Fire
];

// Heavenly Stem clashes (pairs)
export const STEM_CLASHES: [number, number][] = [
  [0, 6], // 甲<->庚
  [1, 7], // 乙<->辛
  [2, 8], // 丙<->壬
  [3, 9], // 丁<->癸
];

// Six Harmonies branch pairs -> result element
export const SIX_HARMONIES: [number, number, Element][] = [
  [0, 1, Element.Earth],   // 子+丑->Earth
  [2, 11, Element.Wood],   // 寅+亥->Wood
  [3, 10, Element.Fire],   // 卯+戌->Fire
  [4, 9, Element.Metal],   // 辰+酉->Metal
  [5, 8, Element.Water],   // 巳+申->Water
  [6, 7, Element.Fire],    // 午+未->Fire
];

// Three Harmonies: all three branches needed
export const THREE_HARMONIES: [number, number, number, Element][] = [
  [2, 6, 10, Element.Fire],    // 寅午戌->Fire
  [5, 9, 1, Element.Metal],    // 巳酉丑->Metal
  [8, 0, 4, Element.Water],    // 申子辰->Water
  [11, 3, 7, Element.Wood],    // 亥卯未->Wood
];

// Seasonal combinations
export const SEASONAL_COMBOS: [number, number, number, Element][] = [
  [2, 3, 4, Element.Wood],     // 寅卯辰->Wood
  [5, 6, 7, Element.Fire],     // 巳午未->Fire
  [8, 9, 10, Element.Metal],   // 申酉戌->Metal
  [11, 0, 1, Element.Water],   // 亥子丑->Water
];

// Six Clashes
export const SIX_CLASHES: [number, number][] = [
  [0, 6],   // 子<->午
  [1, 7],   // 丑<->未
  [2, 8],   // 寅<->申
  [3, 9],   // 卯<->酉
  [4, 10],  // 辰<->戌
  [5, 11],  // 巳<->亥
];

// Punishments
export const PUNISHMENTS: [number[], string][] = [
  [[2, 5, 8], 'ungrateful'],    // 寅巳申 ungrateful punishment
  [[1, 10, 7], 'rude'],         // 丑戌未 rude punishment
  [[0, 0], 'self'],             // 子<->子 self-punishment
  [[6, 6], 'self'],             // 午<->午
  [[9, 9], 'self'],             // 酉<->酉
  [[11, 11], 'self'],           // 亥<->亥
];

// Harms
export const HARMS: [number, number][] = [
  [0, 7],   // 子+未
  [1, 6],   // 丑+午
  [2, 5],   // 寅+巳
  [3, 4],   // 卯+辰
  [8, 11],  // 申+亥
  [9, 10],  // 酉+戌
];

// Breaks
export const BREAKS: [number, number][] = [
  [0, 9],   // 子+酉
  [1, 4],   // 丑+辰
  [2, 11],  // 寅+亥
  [3, 6],   // 卯+午
  [5, 8],   // 巳+申
  [7, 10],  // 未+戌
];
