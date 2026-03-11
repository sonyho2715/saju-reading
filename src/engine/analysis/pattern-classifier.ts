import { FourPillars, DayMasterStrength, TenGod } from '../types';
import { HIDDEN_STEMS } from '../constants/hidden-stems';
import { getTenGod } from './ten-gods-resolver';

export function classifyChartPattern(
  fourPillars: FourPillars,
  dayMasterStrength: DayMasterStrength
): { pattern: string; patternKorean: string; quality: 'favorable' | 'unfavorable' | 'mixed'; description: string } {
  const dayMaster = fourPillars.day.stem;
  const monthBranch = fourPillars.month.branch;

  // Special patterns for extreme strength
  if (dayMasterStrength === DayMasterStrength.ExtremelyStrong) {
    return { pattern: 'jonwangyeok', patternKorean: '종왕격', quality: 'favorable', description: 'Following the Strong, ride the dominant element' };
  }
  if (dayMasterStrength === DayMasterStrength.ExtremelyWeak) {
    return { pattern: 'jongyeok', patternKorean: '종격', quality: 'mixed', description: 'Following the Dominant, conform to the ruling element' };
  }

  // Prosperity branch for each stem
  const PROSPERITY_BRANCH: Record<number, number> = { 0: 2, 1: 3, 2: 6, 3: 7, 4: 6, 5: 7, 6: 9, 7: 10, 8: 0, 9: 1 };
  // Blade branch for Yang stems only
  const BLADE_BRANCH: Record<number, number> = { 0: 3, 2: 6, 4: 6, 6: 9, 8: 0 };

  if (PROSPERITY_BRANCH[dayMaster.index] === monthBranch.index) {
    return { pattern: 'geonnokyeok', patternKorean: '건록격', quality: 'favorable', description: 'Prosperity Pattern, strong self-made career energy' };
  }
  if (dayMaster.index in BLADE_BRANCH && BLADE_BRANCH[dayMaster.index] === monthBranch.index) {
    return { pattern: 'yangin', patternKorean: '양인격', quality: 'mixed', description: 'Blade of Yang Pattern, powerful but requires discipline' };
  }

  // Standard: based on month branch main hidden stem's Ten God
  const monthHidden = HIDDEN_STEMS[monthBranch.index];
  if (!monthHidden || monthHidden.length === 0) {
    return { pattern: 'unknown', patternKorean: '미분류', quality: 'mixed', description: 'Pattern unclear' };
  }

  const mainHidden = monthHidden[0];
  const tenGod = getTenGod(dayMaster, mainHidden.stem);

  const PATTERN_MAP: Record<TenGod, { en: string; ko: string; quality: 'favorable' | 'unfavorable' | 'mixed'; desc: string }> = {
    [TenGod.DirectOfficer]:    { en: 'jeonggwanyeok',  ko: '정관격',  quality: 'favorable',   desc: 'Direct Officer, authority through structure and integrity' },
    [TenGod.SevenKillings]:    { en: 'pyeongwanyeok',  ko: '편관격',  quality: 'mixed',       desc: 'Seven Killings, power through discipline and pressure' },
    [TenGod.DirectSeal]:       { en: 'jeonginyeok',    ko: '정인격',  quality: 'favorable',   desc: 'Direct Seal, wisdom through learning and mentorship' },
    [TenGod.IndirectSeal]:     { en: 'pyeoninyeok',    ko: '편인격',  quality: 'mixed',       desc: 'Indirect Seal, intuition through unconventional paths' },
    [TenGod.DirectWealth]:     { en: 'jeongjaeeyeok',  ko: '정재격',  quality: 'favorable',   desc: 'Direct Wealth, stability through diligence and consistency' },
    [TenGod.IndirectWealth]:   { en: 'pyeonjaeyeok',   ko: '편재격',  quality: 'mixed',       desc: 'Indirect Wealth, adventure through entrepreneurial risk' },
    [TenGod.EatingGod]:        { en: 'siksinyeok',     ko: '식신격',  quality: 'favorable',   desc: 'Eating God, fulfillment through creativity and natural talent' },
    [TenGod.HurtingOfficer]:   { en: 'sangwanyeok',    ko: '상관격',  quality: 'mixed',       desc: 'Hurting Officer, innovation through rebellion and brilliance' },
    [TenGod.Companion]:        { en: 'bigyeonyeok',    ko: '비견격',  quality: 'mixed',       desc: 'Companion, independence through self-reliance' },
    [TenGod.RobWealth]:        { en: 'geopjaeyeok',    ko: '겁재격',  quality: 'unfavorable', desc: 'Rob Wealth, competition and instability in resources' },
  };

  const pattern = PATTERN_MAP[tenGod];
  return { pattern: pattern.en, patternKorean: pattern.ko, quality: pattern.quality, description: pattern.desc };
}
