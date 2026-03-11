import type { Language } from './prompt-builder';

export function annualForecastInstructions(language: Language, targetYear: number): string {
  const yearLabel = language === 'ko' ? `${targetYear}년 운세` : language === 'vi' ? `Van Menh Nam ${targetYear}` : `${targetYear} Annual Forecast`;

  return `READING TYPE: ${yearLabel}

This is an ANNUAL FORECAST for the year ${targetYear}. You must calculate and discuss the interactions between the ${targetYear} annual pillar and the natal chart.

Focus on:
1. The ${targetYear} Annual Pillar (세운):
   - Identify the Heavenly Stem and Earthly Branch for ${targetYear}
   - What Ten God does the annual stem represent relative to the Day Master?
   - What element energy dominates this year?

2. Annual stem interactions with natal chart:
   - Does the ${targetYear} stem combine with any natal stem? (Combination = opportunity, transformation)
   - Does the ${targetYear} stem clash with any natal stem? (Clash = conflict, disruption)
   - Which pillar does it most affect? (Year pillar = external world, Month = career, Day = self/spouse, Hour = children/projects)

3. Annual branch interactions with natal chart:
   - Six Harmony, Three Harmony, or Seasonal Combination forming?
   - Six Clash, Punishment, Harm, or Break activated?
   - Is the Day Branch (spouse palace) affected?
   - Is the Month Branch (career palace) affected?

4. Annual pillar vs. Useful God:
   - Does ${targetYear} bring more Useful God energy? (Favorable year)
   - Does ${targetYear} bring more Jealousy God energy? (Challenging year)

5. Month-by-month energy overview:
   - Which months in ${targetYear} carry the strongest positive energy?
   - Which months require caution?
   - When do combinations or clashes peak?

6. Key life areas for ${targetYear}:
   - Career & finances
   - Relationships & family
   - Health & wellness
   - Personal growth & spirituality

Write in 5 sections:
- Year Overview & Theme (1-2 paragraphs setting the tone)
- Key Interactions & Turning Points (detailed analysis of stem/branch interactions)
- Favorable Months & Opportunities (bulleted with specific months)
- Challenging Months & Precautions (bulleted with specific months)
- Actionable Advice for ${targetYear} (5 specific recommendations)

Total length: 800-1000 words.`;
}
