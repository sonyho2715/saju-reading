import type { Language } from './prompt-builder';

export function careerInstructions(language: Language): string {
  const monthPillarLabel = language === 'ko' ? '월주 (사회궁)' : language === 'vi' ? 'Nguyet Tru (Cung Su Nghiep)' : 'Month Pillar (career palace)';
  const usefulGodLabel = language === 'ko' ? '용신' : language === 'vi' ? 'Dung Than' : 'Useful God';

  return `READING TYPE: CAREER & PROFESSIONAL PATH

Focus on:
1. ${monthPillarLabel} analysis. The Month Pillar governs career energy, social standing, and professional relationships
2. Wealth Ten Gods (편재/정재) positions. Where do they appear? What kind of wealth path do they suggest?
3. Officer Ten Gods (편관/정관) positions. Authority, leadership, and career advancement patterns
4. ${usefulGodLabel} element for career. Which industries, environments, and work styles align with the Useful God element?
5. Special stars relevant to career:
   - 문창귀인 (Literary Star) = academic, writing, intellectual careers
   - 역마살 (Traveling Horse) = travel-based career, frequent relocation, international work
   - 천을귀인 (Heavenly Nobleman) = benefactor support in career
   - 괴강살 (Mighty Star) = military, law enforcement, decisive authority roles
6. Chart pattern implications for career style (e.g., 편관격 = leadership/management, 식신격 = creative/service, 정재격 = finance/steady income)
7. Day Master strength: Strong Day Master = entrepreneurship potential. Weak Day Master = partnership/support roles preferred

Write in 5 sections:
- Career Archetype & Natural Professional Identity (1-2 paragraphs)
- Ideal Industries & Work Environments (bulleted with element reasoning)
- Wealth Pattern & Financial Potential (1-2 paragraphs)
- Career Timing. When are peak opportunity windows based on luck cycles? (1 paragraph referencing specific luck cycle ages)
- Actionable Career Advice (3-5 specific, chart-grounded recommendations)

Total length: 600-800 words.`;
}
