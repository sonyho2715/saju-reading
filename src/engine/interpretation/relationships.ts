import type { Language } from './prompt-builder';

export function relationshipInstructions(language: Language): string {
  const dayBranchLabel = language === 'ko' ? '일지 (배우자궁)' : language === 'vi' ? 'Nhat Chi (Cung Phoi Ngau)' : 'Day Branch (spouse palace)';

  return `READING TYPE: LOVE & RELATIONSHIPS

Focus on:
1. ${dayBranchLabel} analysis. The Day Branch is the spouse palace. Its element, hidden stems, and interactions reveal the nature of intimate partnerships
2. Romantic special stars:
   - 도화살 (Peach Blossom) = attractiveness, charisma, romantic magnetism (which pillar?)
   - 홍염살 (Red Flame) = intense passion, dramatic romance, potential for obsessive love
   - 원진살 (Far Distance) = emotional distance or difficulty in relationships
   - 천을귀인 (Heavenly Nobleman) in Day Branch = attracting high-quality partners
3. Clash patterns involving Day Branch. Any clash to the spouse palace signals relationship turbulence. Identify which pillars clash with it
4. Compatibility of Spouse Palace element with Day Master:
   - Same element = comfort but possible stagnation
   - Day Master generates spouse element = giving/nurturing partner
   - Spouse element generates Day Master = supportive/nourishing partner
   - Day Master controls spouse element = dominant dynamic
   - Spouse element controls Day Master = challenging/growth-inducing partner
5. Hidden stems in Day Branch. These reveal the partner's hidden qualities
6. Ten God associated with Day Branch main hidden stem. This is the relationship archetype
7. Six Harmony or clashes involving Day Branch from other pillars
8. Luck cycle timing for relationship milestones

Write in 5 sections:
- Relationship Nature & Love Style (2 paragraphs)
- Ideal Partner Profile (1-2 paragraphs, based on spouse palace element and hidden stems)
- Romantic Strengths & Challenges (bulleted)
- Relationship Timing. When are key romantic periods? (1 paragraph, referencing luck cycles and annual pillars)
- Advice for Love & Partnership (3-5 specific recommendations grounded in chart data)

Total length: 600-800 words.`;
}
