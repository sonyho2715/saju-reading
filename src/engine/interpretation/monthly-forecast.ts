import type { Language } from './prompt-builder';

export function monthlyForecastInstructions(language: Language, targetYear: number): string {
  const yearLabel = language === 'ko' ? `${targetYear}년 월별 운세` : language === 'vi' ? `Van Menh Hang Thang ${targetYear}` : `${targetYear} Monthly Forecast`;

  return `READING TYPE: ${yearLabel} (MONTH-BY-MONTH BREAKDOWN)

This is a MONTHLY FORECAST for each month of ${targetYear}. You must analyze how each monthly pillar interacts with the natal chart.

For EACH of the 12 months (February ${targetYear} through January ${targetYear + 1}, following the saju solar calendar where the year starts at 입춘/Ipchun):

Analyze:
1. The monthly pillar (Heavenly Stem + Earthly Branch)
2. What Ten God the monthly stem is relative to Day Master
3. Whether the monthly branch forms combinations or clashes with natal branches
4. Whether the monthly stem combines or clashes with natal stems
5. The overall element energy of that month
6. How it interacts with the Useful God / Jealousy God

For each month, provide:
- Month name (both solar calendar and saju month name)
- Energy rating: High (순풍), Moderate (보통), Caution (주의)
- 2-3 sentences on what to expect
- One actionable tip

Format each month as:
### [Month Name] ([Stem][Branch])
**Energy: [Rating]**
[Analysis and tip]

After all 12 months, add:
### Summary
- Best months for action: [list]
- Best months for rest/planning: [list]
- Months requiring caution: [list]

Total length: 1200-1500 words.`;
}
