import { calculateFullChart } from '../index';
import { calculateFourPillars } from '../calendar/four-pillars';

describe('Integration Tests -- Known Charts', () => {
  test('1984-02-03: Born BEFORE Ipchun -> year pillar should be 1983 (Gye-Hae)', () => {
    // Ipchun 1984 was around Feb 4-5 KST. Feb 3 noon is BEFORE.
    const date = new Date('1984-02-03T12:00:00Z');
    const pillars = calculateFourPillars(date, { hour: 12, minute: 0 }, 'Asia/Seoul');

    // 1983 in sexagenary: stem = (1983-4) % 10 = 1979 % 10 = 9 (癸), branch = (1983-4) % 12 = 1979 % 12 = 11 (亥)
    expect(pillars.year.stem.index).toBe(9);   // 癸
    expect(pillars.year.branch.index).toBe(11); // 亥
    expect(pillars.year.stem.hanja).toBe('癸');
    expect(pillars.year.branch.hanja).toBe('亥');
  });

  test('1984-02-05: Born AFTER Ipchun -> year pillar should be 1984 (Gap-Ja)', () => {
    const date = new Date('1984-02-05T12:00:00Z');
    const pillars = calculateFourPillars(date, { hour: 12, minute: 0 }, 'Asia/Seoul');

    // 1984 in sexagenary: stem = (1984-4) % 10 = 0 (甲), branch = (1984-4) % 12 = 0 (子)
    expect(pillars.year.stem.index).toBe(0);  // 甲
    expect(pillars.year.branch.index).toBe(0); // 子
  });

  test('Day pillar reference: 2000-01-01 = Byeong-Ja (丙子), cycle index 13', () => {
    const date = new Date('2000-01-01T12:00:00Z');
    const pillars = calculateFourPillars(date, null, 'UTC');

    // Reference: 2000-01-01 = 丙子 (stem 2, branch 0)
    expect(pillars.day.stem.index).toBe(2);    // 丙
    expect(pillars.day.branch.index).toBe(0);  // 子
    expect(pillars.day.stem.hanja).toBe('丙');
    expect(pillars.day.branch.hanja).toBe('子');
  });

  test('Year pillar formula: multiple known years (mid-year to avoid Ipchun boundary)', () => {
    const knownYears: { year: number; stem: number; branch: number }[] = [
      { year: 1984, stem: 0, branch: 0 },   // 甲子
      { year: 1990, stem: 6, branch: 6 },   // 庚午
      { year: 2000, stem: 6, branch: 4 },   // 庚辰
      { year: 2024, stem: 0, branch: 4 },   // 甲辰
      { year: 2025, stem: 1, branch: 5 },   // 乙巳
    ];

    for (const { year, stem, branch } of knownYears) {
      const date = new Date(`${year}-06-15T12:00:00Z`);
      const pillars = calculateFourPillars(date, null, 'Asia/Seoul');
      expect(pillars.year.stem.index).toBe(stem);
      expect(pillars.year.branch.index).toBe(branch);
    }
  });

  test('Male + Yang year -> forward luck cycles', () => {
    // 1984 year stem 甲 (index 0) is Yang. Male + Yang = forward.
    const chart = calculateFullChart({
      birthDate: '1984-05-15',
      birthTime: '10:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    expect(chart.luckDirection).toBe('forward');
    expect(chart.luckCycles.length).toBe(8);
    expect(chart.luckStartAge).toBeGreaterThan(0);
    expect(chart.luckStartAge).toBeLessThan(10);
  });

  test('Female + Yang year -> backward luck cycles', () => {
    // 1984 year stem 甲 (index 0) is Yang. Female + Yang = backward.
    const chart = calculateFullChart({
      birthDate: '1984-05-15',
      birthTime: '10:00',
      gender: 'female',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    expect(chart.luckDirection).toBe('backward');
  });

  test('Male vs Female same birth date have different luck directions for Yang year', () => {
    const chartM = calculateFullChart({
      birthDate: '1984-05-15',
      birthTime: '10:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });
    const chartF = calculateFullChart({
      birthDate: '1984-05-15',
      birthTime: '10:00',
      gender: 'female',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    expect(chartM.luckDirection).toBe('forward');
    expect(chartF.luckDirection).toBe('backward');
    // Different directions produce different first cycle stems
    expect(chartM.luckCycles[0].pillar.stem.index).not.toBe(
      chartF.luckCycles[0].pillar.stem.index
    );
  });

  test('Full chart calculation returns all fields', () => {
    const chart = calculateFullChart({
      birthDate: '1985-03-15',
      birthTime: '14:30',
      gender: 'female',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    expect(chart.fourPillars).toBeDefined();
    expect(chart.fourPillars.year).toBeDefined();
    expect(chart.fourPillars.month).toBeDefined();
    expect(chart.fourPillars.day).toBeDefined();
    expect(chart.fourPillars.hour).toBeDefined();

    expect(chart.dayMaster).toBeDefined();
    expect(chart.dayMaster.index).toBeGreaterThanOrEqual(0);
    expect(chart.dayMaster.index).toBeLessThan(10);

    expect(chart.dayMasterStrength).toBeDefined();
    expect(['extremely_strong', 'strong', 'neutral', 'weak', 'extremely_weak']).toContain(
      chart.dayMasterStrength
    );

    expect(chart.elementBalance).toBeDefined();
    expect(chart.elementBalance.wood).toBeGreaterThanOrEqual(0);
    expect(chart.elementBalance.fire).toBeGreaterThanOrEqual(0);
    expect(chart.elementBalance.earth).toBeGreaterThanOrEqual(0);
    expect(chart.elementBalance.metal).toBeGreaterThanOrEqual(0);
    expect(chart.elementBalance.water).toBeGreaterThanOrEqual(0);

    const validElements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    expect(validElements).toContain(chart.usefulGod);
    expect(validElements).toContain(chart.jealousyGod);

    expect(chart.chartPattern).toBeTruthy();
    expect(chart.chartPatternKorean).toBeTruthy();

    expect(chart.luckCycles).toHaveLength(8);
    expect(chart.specialStars).toBeDefined();
    expect(chart.combinations).toBeDefined();
    expect(chart.clashes).toBeDefined();
    expect(chart.hiddenStems).toBeDefined();
    expect(chart.lifeStages).toBeDefined();
    expect(chart.engineVersion).toBe('1.0.0');
  });

  test('No birth time -> null hour pillar', () => {
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

  test('Luck cycles have correct structure and 10-year spans', () => {
    const chart = calculateFullChart({
      birthDate: '1990-06-15',
      birthTime: '10:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    expect(chart.luckCycles).toHaveLength(8);

    for (const cycle of chart.luckCycles) {
      expect(cycle.pillar).toBeDefined();
      expect(cycle.pillar.stem).toBeDefined();
      expect(cycle.pillar.branch).toBeDefined();
      expect(cycle.ageEnd).toBe(cycle.ageStart + 9);
      expect(cycle.stemTenGod).toBeDefined();
      expect(cycle.branchMainTenGod).toBeDefined();
    }
  });

  test('Lunar calendar conversion works', () => {
    const chart = calculateFullChart({
      birthDate: '1990-01-01',
      gender: 'female',
      timezone: 'Asia/Seoul',
      calendarType: 'lunar',
    });

    expect(chart.originalLunarDate).toBeDefined();
    expect(chart.originalLunarDate?.year).toBe(1990);
    expect(chart.originalLunarDate?.month).toBe(1);
    expect(chart.originalLunarDate?.day).toBe(1);
  });

  test('Multiple birth dates calculate without throwing', () => {
    const testCases = [
      { birthDate: '1970-01-01', gender: 'male' as const },
      { birthDate: '1975-06-15', gender: 'female' as const },
      { birthDate: '1980-12-31', gender: 'male' as const },
      { birthDate: '1988-08-08', gender: 'female' as const },
      { birthDate: '1992-02-29', gender: 'male' as const },  // Leap year
      { birthDate: '1995-11-11', gender: 'female' as const },
      { birthDate: '2000-01-01', gender: 'male' as const },
      { birthDate: '2005-07-20', gender: 'female' as const },
      { birthDate: '2010-03-10', gender: 'male' as const },
      { birthDate: '2020-06-21', gender: 'female' as const },
      { birthDate: '2025-01-15', gender: 'male' as const },
    ];

    for (const tc of testCases) {
      expect(() =>
        calculateFullChart({
          birthDate: tc.birthDate,
          gender: tc.gender,
          timezone: 'Asia/Seoul',
          calendarType: 'solar',
        })
      ).not.toThrow();
    }
  });

  test('Same date, different birth times produce different hour pillars', () => {
    const chartMorning = calculateFullChart({
      birthDate: '1990-06-15',
      birthTime: '06:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    const chartEvening = calculateFullChart({
      birthDate: '1990-06-15',
      birthTime: '18:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    // Same day = same day pillar
    expect(chartMorning.fourPillars.day.stem.index).toBe(chartEvening.fourPillars.day.stem.index);
    expect(chartMorning.fourPillars.day.branch.index).toBe(chartEvening.fourPillars.day.branch.index);

    // Different time = different hour pillar
    expect(chartMorning.fourPillars.hour).not.toBeNull();
    expect(chartEvening.fourPillars.hour).not.toBeNull();
    expect(chartMorning.fourPillars.hour!.branch.index).not.toBe(
      chartEvening.fourPillars.hour!.branch.index
    );
  });

  test('Element balance sums are consistent', () => {
    const chart = calculateFullChart({
      birthDate: '1990-06-15',
      birthTime: '10:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    const total =
      chart.elementBalance.wood +
      chart.elementBalance.fire +
      chart.elementBalance.earth +
      chart.elementBalance.metal +
      chart.elementBalance.water;

    // Total should be positive (chart has elements)
    expect(total).toBeGreaterThan(0);

    // Support + drain scores should be reasonable
    expect(chart.supportScore).toBeGreaterThanOrEqual(0);
    expect(chart.drainScore).toBeGreaterThanOrEqual(0);
  });
});

describe('Integration Tests -- Feature Modules', () => {
  test('Daily energy calculates for today', () => {
    const { calculateDailyEnergy } = require('../features/daily-energy');
    const result = calculateDailyEnergy(new Date());

    expect(result.date).toBeTruthy();
    expect(result.pillar).toBeDefined();
    expect(result.dominantElement).toBeTruthy();
    expect(['high', 'medium', 'low']).toContain(result.energyLevel);
  });

  test('Daily energy with user chart produces personalized result', () => {
    const { calculateDailyEnergy } = require('../features/daily-energy');
    const chart = calculateFullChart({
      birthDate: '1990-06-15',
      birthTime: '10:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    const result = calculateDailyEnergy(new Date(), chart);
    expect(result.userInteraction).toBeDefined();
    expect(result.userInteraction?.summary).toBeTruthy();
    expect(result.userInteraction?.doToday).toBeTruthy();
    expect(result.userInteraction?.avoidToday).toBeTruthy();
    expect(result.userInteraction?.luckyColor).toBeTruthy();
    expect(result.userInteraction?.luckyDirection).toBeTruthy();
  });

  test('Lucky dates returns scored results', () => {
    const { findLuckyDates } = require('../features/lucky-dates');
    const chart = calculateFullChart({
      birthDate: '1990-06-15',
      birthTime: '10:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    const start = new Date('2025-06-01');
    const end = new Date('2025-06-30');
    const results = findLuckyDates(chart, 'general', start, end, 5);

    expect(results.length).toBe(5);
    for (const r of results) {
      expect(r.date).toBeTruthy();
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
      expect(['excellent', 'good', 'neutral', 'caution', 'avoid']).toContain(r.rating);
      expect(r.dayPillarHanja.length).toBe(2);
    }

    // Should be sorted by score descending
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  test('Name generator returns suggestions', () => {
    const { generateNameSuggestions } = require('../features/name-generator');
    const chart = calculateFullChart({
      birthDate: '1990-06-15',
      birthTime: '10:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    const suggestions = generateNameSuggestions({
      chart,
      nameType: 'korean',
      targetGender: 'male',
    });

    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.length).toBeLessThanOrEqual(10);
    for (const s of suggestions) {
      expect(s.name).toBeTruthy();
      expect(s.meaning).toBeTruthy();
      expect(s.elementBalance).toBeTruthy();
      expect(s.deficiencyAddressed).toBeTruthy();
    }
  });

  test('Wellness plan generates for chart', () => {
    const { generateWellnessPlan } = require('../features/element-wellness');
    const chart = calculateFullChart({
      birthDate: '1990-06-15',
      birthTime: '10:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    const plan = generateWellnessPlan(chart);

    expect(plan.primaryElement).toBeTruthy();
    expect(plan.minimizeElement).toBeTruthy();
    expect(plan.diet.favorable.length).toBeGreaterThan(0);
    expect(plan.exercise.recommended.length).toBeGreaterThan(0);
    expect(plan.colors.wear.length).toBeGreaterThan(0);
    expect(plan.crystals.length).toBeGreaterThan(0);
    expect(plan.dailyRituals.length).toBeGreaterThan(0);
    expect(plan.seasonalAdvice).toBeTruthy();
  });

  test('Ritual calendar generates for chart and year', () => {
    const { generateRitualCalendar } = require('../features/ritual-calendar');
    const chart = calculateFullChart({
      birthDate: '1990-06-15',
      birthTime: '10:00',
      gender: 'male',
      timezone: 'Asia/Seoul',
      calendarType: 'solar',
    });

    const calendar = generateRitualCalendar(chart, 2025);

    expect(calendar.powerDays.length).toBeGreaterThan(0);
    expect(calendar.monthlyThemes).toHaveLength(12);
    expect(calendar.seasonalTransitions).toHaveLength(4);

    for (const pd of calendar.powerDays) {
      expect(pd.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(pd.reason).toBeTruthy();
      expect(pd.action).toBeTruthy();
    }

    for (const mt of calendar.monthlyThemes) {
      expect(mt.month).toBeGreaterThanOrEqual(1);
      expect(mt.month).toBeLessThanOrEqual(12);
      expect(mt.theme).toBeTruthy();
      expect(mt.focus).toBeTruthy();
    }
  });
});
