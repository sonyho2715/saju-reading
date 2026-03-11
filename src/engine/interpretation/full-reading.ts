import type { Language } from './prompt-builder';

export function fullReadingInstructions(language: Language): string {
  const overviewLabel = language === 'ko' ? '종합 사주 분석' : language === 'vi' ? 'Phan Tich Tu Tru Tong Hop' : 'Comprehensive Saju Analysis';

  return `READING TYPE: ${overviewLabel} (FULL COMPREHENSIVE READING)

This is a COMPLETE saju reading covering all life domains. Be thorough, specific, and grounded in the chart data at every point.

Write the following sections IN ORDER:

## 1. Chart Overview & Day Master Identity
- Who is this person at their core? Day Master element + polarity analysis
- Day Master strength assessment and what it means
- Chart pattern (격국) and its significance
- The Useful God element and how it shapes their life path
- Overall element balance. What is abundant? What is lacking?
(3-4 paragraphs)

## 2. Personality & Inner World
- Core personality traits derived from Day Master + Day Branch combination
- Hidden stems in Day Branch: the inner world others don't see
- Ten Gods in prominent positions shaping personality
- Contrast between outward presentation (Year/Month pillars) and inner nature (Day/Hour pillars)
(2-3 paragraphs)

## 3. Career & Financial Destiny
- Month Pillar (career palace) analysis
- Wealth Ten Gods and financial patterns
- Officer Ten Gods and authority/leadership style
- Best career paths based on Useful God element
- Special stars supporting career (문창귀인, 역마살, etc.)
(2-3 paragraphs + bulleted career suggestions)

## 4. Love & Relationships
- Day Branch (spouse palace) analysis
- Romantic special stars (도화살, 홍염살)
- Ideal partner profile based on chart
- Relationship challenges from clashes or harms
(2-3 paragraphs)

## 5. Health & Wellness
- Constitutional type based on element balance
- Vulnerable organ systems (element-organ mapping)
- Seasonal health rhythms
- Lifestyle recommendations
(1-2 paragraphs + bulleted recommendations)
INCLUDE DISCLAIMER: "This is not medical advice. Consult healthcare professionals for health concerns."

## 6. Luck Cycle Narrative
- Walk through each of the 8 luck cycles provided
- For each cycle: age range, ruling pillar, Ten God energy, major themes, and what to expect
- Highlight the best cycles and most challenging cycles
- Current cycle analysis (if determinable from context)
(4-6 paragraphs covering all cycles)

## 7. Key Combinations & Clashes
- Explain each combination found in the chart and its positive implications
- Explain each clash found and what life tensions it creates
- How do these interact with luck cycles?
(1-2 paragraphs)

## 8. Special Stars & Hidden Talents
- List each special star found and what gift or challenge it brings
- Connect stars to specific life areas
(1 paragraph + bulleted list)

## 9. Life Advice & Summary
- 5-7 actionable life recommendations grounded in chart data
- Final encouraging message that honors the complexity of the chart

Total length: 2000-2500 words. This is a premium reading. Be detailed, insightful, and specific.`;
}
