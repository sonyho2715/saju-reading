import { ChartAnalysis, FourPillars } from './types';
import { calculateFourPillars, CalculationOptions } from './calendar/four-pillars';
import { lunarToSolar } from './calendar/lunar-converter';
import { HIDDEN_STEMS } from './constants/hidden-stems';
import { resolveAllTenGods } from './analysis/ten-gods-resolver';
import { calculateElementBalance } from './analysis/element-balance';
import { analyzeDayMasterStrength } from './analysis/day-master-strength';
import { determineUsefulGod } from './analysis/useful-god';
import { classifyChartPattern } from './analysis/pattern-classifier';
import { detectCombosAndClashes } from './analysis/combo-clash-detector';
import { calculateSpecialStars } from './analysis/special-stars';
import { mapLifeStages } from './analysis/life-stage-mapper';
import { calculateLuckCycles } from './analysis/luck-cycles';

export const ENGINE_VERSION = '1.0.0';

export interface ChartInput {
  birthDate: string;           // ISO date "YYYY-MM-DD"
  birthTime?: string | null;   // "HH:mm" or null
  gender: 'male' | 'female';
  timezone: string;
  calendarType: 'solar' | 'lunar';
  leapMonth?: boolean;
  options?: Partial<CalculationOptions>;
}

export function calculateFullChart(input: ChartInput): ChartAnalysis {
  // 1. Parse and convert date
  let birthDate = new Date(input.birthDate + 'T12:00:00Z');
  let originalLunarDate: ChartAnalysis['originalLunarDate'];

  if (input.calendarType === 'lunar') {
    const [year, month, day] = input.birthDate.split('-').map(Number);
    const solarDate = lunarToSolar(year, month, day, input.leapMonth ?? false);
    if (!solarDate) throw new Error(`Invalid lunar date: ${input.birthDate}`);
    originalLunarDate = { year, month, day, isLeapMonth: input.leapMonth ?? false };
    birthDate = solarDate;
  }

  // 2. Parse birth time
  let birthTime: { hour: number; minute: number } | null = null;
  if (input.birthTime) {
    const [hour, minute] = input.birthTime.split(':').map(Number);
    birthTime = { hour, minute };
  }

  // 3. Calculate Four Pillars
  const options: CalculationOptions = {
    ziShiDayBoundary: input.options?.ziShiDayBoundary ?? 'traditional',
    includeLunarConversion: false,
  };
  const fourPillars: FourPillars = calculateFourPillars(birthDate, birthTime, input.timezone, options);
  const dayMaster = fourPillars.day.stem;

  // 4. Hidden stems
  const hiddenStems = {
    year:  HIDDEN_STEMS[fourPillars.year.branch.index] ?? [],
    month: HIDDEN_STEMS[fourPillars.month.branch.index] ?? [],
    day:   HIDDEN_STEMS[fourPillars.day.branch.index] ?? [],
    hour:  fourPillars.hour ? (HIDDEN_STEMS[fourPillars.hour.branch.index] ?? []) : [],
  };

  // 5. Ten Gods
  const tenGods = resolveAllTenGods(fourPillars, dayMaster);

  // 6. Element balance
  const elementBalance = calculateElementBalance(fourPillars);

  // 7. Day Master strength
  const strengthAnalysis = analyzeDayMasterStrength(fourPillars);

  // 8. Useful God
  const { usefulGod, jealousyGod } = determineUsefulGod(fourPillars, strengthAnalysis.strength, elementBalance);

  // 9. Chart pattern
  const { pattern, patternKorean } = classifyChartPattern(fourPillars, strengthAnalysis.strength);

  // 10. Combinations and clashes
  const comboClash = detectCombosAndClashes(fourPillars);
  const allCombinations = [
    ...comboClash.stemCombinations, ...comboClash.branchHarmonies,
    ...comboClash.threeHarmonies, ...comboClash.seasonalCombos,
  ];
  const allClashes = [
    ...comboClash.stemClashes, ...comboClash.branchClashes,
    ...comboClash.punishments, ...comboClash.harms, ...comboClash.breaks,
  ];

  // 11. Special stars
  const specialStars = calculateSpecialStars(fourPillars);

  // 12. Life stages
  const lifeStages = mapLifeStages(fourPillars);

  // 13. Luck cycles
  const luckData = calculateLuckCycles(birthDate, input.gender, fourPillars, input.timezone);

  return {
    fourPillars,
    dayMaster,
    hiddenStems,
    tenGods,
    elementBalance,
    dayMasterStrength: strengthAnalysis.strength,
    supportScore: strengthAnalysis.supportScore,
    drainScore: strengthAnalysis.drainScore,
    usefulGod,
    jealousyGod,
    chartPattern: pattern,
    chartPatternKorean: patternKorean,
    combinations: allCombinations,
    clashes: allClashes,
    specialStars,
    lifeStages,
    luckCycles: luckData.cycles,
    luckDirection: luckData.direction,
    luckStartAge: luckData.startAge,
    originalLunarDate,
    engineVersion: ENGINE_VERSION,
  };
}
