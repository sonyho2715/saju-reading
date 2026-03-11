import type { Language } from './prompt-builder';

export function personalityInstructions(language: Language): string {
  const dayMasterLabel = language === 'ko' ? '일간' : language === 'vi' ? 'Nhật Can' : 'the Day Master';
  const patternLabel = language === 'ko' ? '격국' : language === 'vi' ? 'Cach Cuc' : 'chart pattern';

  return `READING TYPE: PERSONALITY & CORE IDENTITY

Focus on:
1. Day Master element analysis. What does ${dayMasterLabel} reveal about core nature?
2. Day Branch (spouse palace) energy influencing identity
3. Day Master strength and what it means for self-expression
4. Hidden stems in Day Branch. Inner world vs outer presentation
5. Ten Gods in prominent positions and what they reveal
6. Chart pattern (${patternLabel}) and what it says about life direction

Write in 5 sections:
- Core Nature (2-3 paragraphs)
- Inner World vs. Outer Presentation (1-2 paragraphs)
- Natural Gifts & Strengths (bulleted)
- Shadow Traits & Blind Spots (bulleted, be honest but compassionate)
- Life Theme & Soul Purpose (1-2 paragraphs)

Total length: 600-800 words.`;
}
