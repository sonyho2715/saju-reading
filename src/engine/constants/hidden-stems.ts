import { HiddenStem } from '../types';
import { STEMS } from './stems';

// Hidden stems (지장간) for all 12 branches
// Format: [main (weight 1.0), middle (weight 0.6), residual (weight 0.3)]
export const HIDDEN_STEMS: Record<number, HiddenStem[]> = {
  0:  [{ stem: STEMS[9], weight: 1.0, type: 'main' }],                                                               // 子: 癸
  1:  [{ stem: STEMS[5], weight: 1.0, type: 'main' }, { stem: STEMS[9], weight: 0.6, type: 'middle' }, { stem: STEMS[7], weight: 0.3, type: 'residual' }], // 丑: 己癸辛
  2:  [{ stem: STEMS[0], weight: 1.0, type: 'main' }, { stem: STEMS[2], weight: 0.6, type: 'middle' }, { stem: STEMS[4], weight: 0.3, type: 'residual' }], // 寅: 甲丙戊
  3:  [{ stem: STEMS[1], weight: 1.0, type: 'main' }],                                                               // 卯: 乙
  4:  [{ stem: STEMS[4], weight: 1.0, type: 'main' }, { stem: STEMS[1], weight: 0.6, type: 'middle' }, { stem: STEMS[9], weight: 0.3, type: 'residual' }], // 辰: 戊乙癸
  5:  [{ stem: STEMS[2], weight: 1.0, type: 'main' }, { stem: STEMS[6], weight: 0.6, type: 'middle' }, { stem: STEMS[4], weight: 0.3, type: 'residual' }], // 巳: 丙庚戊
  6:  [{ stem: STEMS[3], weight: 1.0, type: 'main' }, { stem: STEMS[5], weight: 0.6, type: 'middle' }],             // 午: 丁己
  7:  [{ stem: STEMS[5], weight: 1.0, type: 'main' }, { stem: STEMS[3], weight: 0.6, type: 'middle' }, { stem: STEMS[1], weight: 0.3, type: 'residual' }], // 未: 己丁乙
  8:  [{ stem: STEMS[6], weight: 1.0, type: 'main' }, { stem: STEMS[8], weight: 0.6, type: 'middle' }, { stem: STEMS[4], weight: 0.3, type: 'residual' }], // 申: 庚壬戊
  9:  [{ stem: STEMS[7], weight: 1.0, type: 'main' }],                                                               // 酉: 辛
  10: [{ stem: STEMS[4], weight: 1.0, type: 'main' }, { stem: STEMS[7], weight: 0.6, type: 'middle' }, { stem: STEMS[3], weight: 0.3, type: 'residual' }], // 戌: 戊辛丁
  11: [{ stem: STEMS[8], weight: 1.0, type: 'main' }, { stem: STEMS[0], weight: 0.6, type: 'middle' }],             // 亥: 壬甲
};
