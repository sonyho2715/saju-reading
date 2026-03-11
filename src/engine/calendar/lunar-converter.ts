import KoreanLunarCalendar from 'korean-lunar-calendar';

export function lunarToSolar(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  isLeapMonth: boolean
): Date | null {
  if (lunarYear < 1900 || lunarYear > 2050) return null;
  const calendar = new KoreanLunarCalendar();
  const valid = calendar.setLunarDate(lunarYear, lunarMonth, lunarDay, isLeapMonth);
  if (!valid) return null;
  const solar = calendar.getSolarCalendar();
  if (!solar.year) return null;
  return new Date(solar.year, solar.month - 1, solar.day);
}

export function solarToLunar(solarDate: Date): {
  year: number; month: number; day: number; isLeapMonth: boolean;
} {
  const calendar = new KoreanLunarCalendar();
  calendar.setSolarDate(
    solarDate.getFullYear(),
    solarDate.getMonth() + 1,
    solarDate.getDate()
  );
  const lunar = calendar.getLunarCalendar();
  return {
    year: lunar.year,
    month: lunar.month,
    day: lunar.day,
    isLeapMonth: lunar.intercalation ?? false,
  };
}

export function isLeapMonthExists(lunarYear: number, lunarMonth: number): boolean {
  try {
    const calendar = new KoreanLunarCalendar();
    const valid = calendar.setLunarDate(lunarYear, lunarMonth, 1, true);
    if (!valid) return false;
    return calendar.getSolarCalendar().year !== 0;
  } catch {
    return false;
  }
}
