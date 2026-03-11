import { calculateFullChart } from '../index';
import { getTenGod } from '../analysis/ten-gods-resolver';
import { STEMS } from '../constants/stems';

describe('Saju Engine Smoke Tests', () => {
  test('calculates chart for known date (1990-06-15)', () => {
    const chart = calculateFullChart({
      birthDate: '1990-06-15',
      birthTime: '10:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    // 1990 = 庚午 year (stem 6, branch 6)
    expect(chart.fourPillars.year.stem.index).toBe(6);
    expect(chart.fourPillars.year.branch.index).toBe(6);
    expect(chart.fourPillars.year.stem.hanja).toBe('庚');
    expect(chart.fourPillars.year.branch.hanja).toBe('午');

    expect(chart.dayMaster).toBeDefined();
    expect(chart.elementBalance).toBeDefined();
    expect(chart.luckCycles).toHaveLength(8);
    expect(chart.engineVersion).toBe('1.0.0');
  });

  test('element balance has all five elements', () => {
    const chart = calculateFullChart({
      birthDate: '1990-06-15',
      birthTime: '10:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    expect(chart.elementBalance.wood).toBeGreaterThanOrEqual(0);
    expect(chart.elementBalance.fire).toBeGreaterThanOrEqual(0);
    expect(chart.elementBalance.earth).toBeGreaterThanOrEqual(0);
    expect(chart.elementBalance.metal).toBeGreaterThanOrEqual(0);
    expect(chart.elementBalance.water).toBeGreaterThanOrEqual(0);
  });

  test('day master strength is a valid enum value', () => {
    const chart = calculateFullChart({
      birthDate: '1990-06-15',
      birthTime: '10:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    const validValues = ['extremely_strong', 'strong', 'neutral', 'weak', 'extremely_weak'];
    expect(validValues).toContain(chart.dayMasterStrength);
  });

  test('useful god and jealousy god are valid elements', () => {
    const chart = calculateFullChart({
      birthDate: '1990-06-15',
      birthTime: '10:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    const validElements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    expect(validElements).toContain(chart.usefulGod);
    expect(validElements).toContain(chart.jealousyGod);
  });

  test('chart pattern is populated', () => {
    const chart = calculateFullChart({
      birthDate: '1990-06-15',
      birthTime: '10:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    expect(chart.chartPattern).toBeTruthy();
    expect(chart.chartPatternKorean).toBeTruthy();
  });

  test('luck cycles have correct structure', () => {
    const chart = calculateFullChart({
      birthDate: '1990-06-15',
      birthTime: '10:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    expect(chart.luckCycles).toHaveLength(8);
    expect(chart.luckDirection).toMatch(/^(forward|backward)$/);
    expect(chart.luckStartAge).toBeGreaterThanOrEqual(0);

    for (const cycle of chart.luckCycles) {
      expect(cycle.pillar).toBeDefined();
      expect(cycle.pillar.stem).toBeDefined();
      expect(cycle.pillar.branch).toBeDefined();
      expect(cycle.ageEnd).toBe(cycle.ageStart + 9);
    }
  });

  test('life stages are populated', () => {
    const chart = calculateFullChart({
      birthDate: '1990-06-15',
      birthTime: '10:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    expect(chart.lifeStages.year).toBeTruthy();
    expect(chart.lifeStages.month).toBeTruthy();
    expect(chart.lifeStages.day).toBeTruthy();
    expect(chart.lifeStages.hour).toBeTruthy();
  });

  test('hidden stems are populated for all pillars', () => {
    const chart = calculateFullChart({
      birthDate: '1990-06-15',
      birthTime: '10:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    expect(chart.hiddenStems.year.length).toBeGreaterThan(0);
    expect(chart.hiddenStems.month.length).toBeGreaterThan(0);
    expect(chart.hiddenStems.day.length).toBeGreaterThan(0);
    expect(chart.hiddenStems.hour.length).toBeGreaterThan(0);
  });

  test('no birth time produces null hour pillar and null hour life stage', () => {
    const chart = calculateFullChart({
      birthDate: '1990-06-15',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    expect(chart.fourPillars.hour).toBeNull();
    expect(chart.lifeStages.hour).toBeNull();
    expect(chart.hiddenStems.hour).toEqual([]);
  });

  test('lunar calendar conversion', () => {
    const chart = calculateFullChart({
      birthDate: '1990-01-01',
      gender: 'female',
      timezone: 'Asia/Seoul',
      calendarType: 'lunar',
    });
    expect(chart.originalLunarDate).toBeDefined();
    expect(chart.originalLunarDate?.month).toBe(1);
  });

  test('ten gods matrix for Gap (甲) Day Master', () => {
    const dm = STEMS[0]; // 甲
    expect(getTenGod(dm, STEMS[0]).valueOf()).toBe('비견');   // Companion
    expect(getTenGod(dm, STEMS[1]).valueOf()).toBe('겁재');   // Rob Wealth
    expect(getTenGod(dm, STEMS[2]).valueOf()).toBe('식신');   // Eating God
    expect(getTenGod(dm, STEMS[6]).valueOf()).toBe('편관');   // Seven Killings
    expect(getTenGod(dm, STEMS[9]).valueOf()).toBe('정인');   // Direct Seal
  });

  test('female + yang year = backward luck direction', () => {
    // 1990 year stem is 庚 (index 6, Yang). Female + Yang = backward
    const chart = calculateFullChart({
      birthDate: '1990-06-15',
      birthTime: '10:00',
      gender: 'female',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });
    expect(chart.luckDirection).toBe('backward');
  });

  test('male + yang year = forward luck direction', () => {
    // 1990 year stem is 庚 (index 6, Yang). Male + Yang = forward
    const chart = calculateFullChart({
      birthDate: '1990-06-15',
      birthTime: '10:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });
    expect(chart.luckDirection).toBe('forward');
  });
});
