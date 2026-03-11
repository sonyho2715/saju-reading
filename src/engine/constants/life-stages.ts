import { LifeStage } from '../types';

// Life stage sequence (forward direction)
export const LIFE_STAGE_SEQUENCE: LifeStage[] = [
  LifeStage.Birth, LifeStage.Bath, LifeStage.CapAndBelt, LifeStage.Prosperity,
  LifeStage.Crowned, LifeStage.Decline, LifeStage.Illness, LifeStage.Death,
  LifeStage.Tomb, LifeStage.Extinction, LifeStage.Embryo, LifeStage.Nurture,
];

// Starting branch for Birth (장생) for each stem
export const BIRTH_BRANCH: Record<number, number> = {
  0: 11,  // 甲 -> 亥
  1: 6,   // 乙 -> 午
  2: 2,   // 丙 -> 寅
  3: 9,   // 丁 -> 酉
  4: 2,   // 戊 -> 寅
  5: 9,   // 己 -> 酉
  6: 5,   // 庚 -> 巳
  7: 0,   // 辛 -> 子
  8: 8,   // 壬 -> 申
  9: 3,   // 癸 -> 卯
};

// Direction: all forward in standard school
export const LIFE_STAGE_DIRECTION: Record<number, 1 | -1> = {
  0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1,
};

export function getLifeStage(stemIndex: number, branchIndex: number): LifeStage {
  const birthBranch = BIRTH_BRANCH[stemIndex];
  const direction = LIFE_STAGE_DIRECTION[stemIndex];
  let offset = (branchIndex - birthBranch) * direction;
  offset = ((offset % 12) + 12) % 12;
  return LIFE_STAGE_SEQUENCE[offset];
}
