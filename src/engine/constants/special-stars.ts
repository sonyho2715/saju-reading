// Cheonil Guiin (Heavenly Nobleman) - Day stem -> noble branch indices
export const CHEONIL_GUIIN: Record<number, number[]> = {
  0: [1, 7], 4: [1, 7], 6: [1, 7],
  1: [0, 8], 5: [0, 8],
  2: [11, 9], 3: [11, 9],
  7: [6, 2],
  8: [3, 5], 9: [3, 5],
};

// Munchang Guiin (Literary Star) - Day stem -> branch index
export const MUNCHANG_GUIIN: Record<number, number> = {
  0: 5, 1: 6, 2: 8, 3: 9, 4: 8, 5: 9, 6: 11, 7: 0, 8: 2, 9: 3,
};

// Hakdang Guiin (Academic Hall) - Day stem -> branch index
export const HAKDANG_GUIIN: Record<number, number> = {
  0: 11, 1: 6, 2: 2, 3: 9, 4: 2, 5: 9, 6: 5, 7: 0, 8: 8, 9: 3,
};

// Hongyeom Sal (Red Flame) - Day stem -> branch index
export const HONGYEOM_SAL: Record<number, number> = {
  0: 6, 1: 6, 2: 2, 3: 7, 4: 4, 5: 4, 6: 10, 7: 9, 8: 0, 9: 8,
};

// Yangin Sal (Blade of Yang) - Yang stems only
export const YANGIN_SAL: Record<number, number> = {
  0: 3, 2: 6, 4: 6, 6: 9, 8: 0,
};

// Branch frames for determining frame-based stars
export const BRANCH_FRAME: Record<number, 'water' | 'fire' | 'metal' | 'wood'> = {
  8: 'water', 0: 'water', 4: 'water',
  2: 'fire',  6: 'fire',  10: 'fire',
  5: 'metal', 9: 'metal', 1: 'metal',
  11: 'wood', 3: 'wood',  7: 'wood',
};

export const YEOKMA_SAL: Record<string, number> = { water: 2, fire: 8, metal: 11, wood: 5 };
export const HWAGAE_SAL: Record<string, number> = { water: 4, fire: 10, metal: 1, wood: 7 };
export const DOHWA_SAL:  Record<string, number> = { water: 9, fire: 3, metal: 6, wood: 0 };

// Cheonduk Guiin (Heavenly Virtue) - Month branch -> stem or branch match
export const CHEONDUK_GUIIN: Record<number, { type: 'stem' | 'branch'; index: number }> = {
  2: { type: 'stem', index: 3 }, 3: { type: 'branch', index: 8 }, 4: { type: 'stem', index: 8 },
  5: { type: 'stem', index: 7 }, 6: { type: 'branch', index: 11 }, 7: { type: 'stem', index: 0 },
  8: { type: 'stem', index: 9 }, 9: { type: 'branch', index: 2 }, 10: { type: 'stem', index: 2 },
  11: { type: 'stem', index: 1 }, 0: { type: 'branch', index: 5 }, 1: { type: 'stem', index: 6 },
};

// Weolduk Guiin (Monthly Virtue) - frame -> stem index
export const WEOLDUK_GUIIN: Record<string, number> = {
  fire: 2, water: 8, wood: 0, metal: 6,
};

// Baekho Dasal (White Tiger) - specific stem*12+branch combinations
export const BAEKHO_DASAL = new Set([
  0 * 12 + 4, 1 * 12 + 5, 2 * 12 + 2, 3 * 12 + 11, 4 * 12 + 8,
  5 * 12 + 3, 6 * 12 + 0, 7 * 12 + 9, 8 * 12 + 6, 9 * 12 + 7,
]);

// Wonjin Sal (Far Distance) - branch pair map
export const WONJIN_SAL: Record<number, number> = {
  0: 7, 7: 0, 1: 6, 6: 1, 2: 9, 9: 2, 3: 8, 8: 3, 4: 11, 11: 4, 5: 10, 10: 5,
};

// Gwimun pairs (Ghost Gate)
export const GWIMUN_PAIRS: [number, number][] = [
  [0, 9], [1, 3], [2, 6], [4, 7], [5, 10], [8, 11],
];

// Goegang Sal (Mighty Star) - specific day pillar combos
export const GOEGANG_SAL = new Set([6 * 12 + 4, 6 * 12 + 10, 8 * 12 + 4, 8 * 12 + 10]);

// Gongmang (Void/Emptiness) - 60-cycle index -> pair of void branches
function buildGongmangTable(): Record<number, [number, number]> {
  const table: Record<number, [number, number]> = {};
  // Each 旬 of 10 days has 2 void branches
  // Cycle 1-10: void branches are 10,11 (戌亥)
  // Cycle 11-20: void branches are 8,9 (申酉)
  // Cycle 21-30: void branches are 6,7 (午未)
  // Cycle 31-40: void branches are 4,5 (辰巳)
  // Cycle 41-50: void branches are 2,3 (寅卯)
  // Cycle 51-60: void branches are 0,1 (子丑)
  const voidPairs: [number, number][] = [[10, 11], [8, 9], [6, 7], [4, 5], [2, 3], [0, 1]];
  for (let group = 0; group < 6; group++) {
    for (let i = 0; i < 10; i++) {
      table[group * 10 + i + 1] = voidPairs[group];
    }
  }
  return table;
}

export const GONGMANG_TABLE: Record<number, [number, number]> = buildGongmangTable();
