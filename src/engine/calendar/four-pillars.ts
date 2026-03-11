import { FourPillars } from '../types';
import { getYearPillar } from './year-pillar';
import { getMonthPillar } from './month-pillar';
import { getDayPillar } from './day-pillar';
import { getHourPillar } from './hour-pillar';

export interface CalculationOptions {
  ziShiDayBoundary: 'traditional' | 'modern';
  includeLunarConversion: boolean;
}

export function calculateFourPillars(
  birthDate: Date,
  birthTime: { hour: number; minute: number } | null,
  timezone: string,
  options: CalculationOptions = { ziShiDayBoundary: 'traditional', includeLunarConversion: false }
): FourPillars {
  // For 子時 (23:00-01:00) in traditional mode, the date counts as the next day
  let dateForDayPillar = birthDate;
  if (birthTime && birthTime.hour === 23 && options.ziShiDayBoundary === 'traditional') {
    dateForDayPillar = new Date(birthDate);
    dateForDayPillar.setUTCDate(dateForDayPillar.getUTCDate() + 1);
  }

  const yearPillar = getYearPillar(birthDate, timezone);
  const monthPillar = getMonthPillar(birthDate, yearPillar.stem, timezone);
  const dayPillar = getDayPillar(dateForDayPillar, timezone);

  let hourPillar = null;
  if (birthTime !== null) {
    hourPillar = getHourPillar(birthTime.hour, birthTime.minute, dayPillar.stem, options.ziShiDayBoundary);
  }

  return { year: yearPillar, month: monthPillar, day: dayPillar, hour: hourPillar };
}
