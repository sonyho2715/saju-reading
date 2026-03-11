import type { DayPillarArchetype } from '../constants/sixty-pillars';
import type { ChartAnalysis } from '../types';
import type { Language } from './prompt-builder';

/**
 * Builds a prompt for Claude to generate a short, viral-shareable archetype narrative.
 * Target: ~300 words. Designed for social sharing and engagement.
 */
export function buildArchetypePrompt(
  archetype: DayPillarArchetype,
  chart: ChartAnalysis,
  language: Language
): string {
  const languageInstruction = getLanguageInstruction(language);

  return `You are a poetic saju (四柱推命) storyteller. Write a vivid, shareable personality snapshot based on this person's Day Pillar archetype.

ARCHETYPE DATA:
- Pillar: ${archetype.hanja} (${archetype.korean})
- Name: ${archetype.name}
- Imagery: ${archetype.imagery}
- Core Identity: ${archetype.coreIdentity}
- Element Dynamic: ${archetype.elementDynamic}
- Life Theme: ${archetype.lifeTheme}

CHART CONTEXT:
- Day Master: ${chart.dayMaster.korean} (${chart.dayMaster.hanja}) - ${chart.dayMaster.element} ${chart.dayMaster.yinYang}
- Day Master Strength: ${chart.dayMasterStrength}
- Useful God: ${chart.usefulGod}
- Chart Pattern: ${chart.chartPattern} (${chart.chartPatternKorean})
- Element Balance: Wood ${chart.elementBalance.wood.toFixed(1)}, Fire ${chart.elementBalance.fire.toFixed(1)}, Earth ${chart.elementBalance.earth.toFixed(1)}, Metal ${chart.elementBalance.metal.toFixed(1)}, Water ${chart.elementBalance.water.toFixed(1)}

WRITING INSTRUCTIONS:
1. Open with the archetype's nature metaphor in ONE powerful, dramatic sentence. Make it visceral and memorable
2. Explain what the stem (${archetype.hanja[0]}) + branch (${archetype.hanja[1]}) together create. Describe the internal dynamic as an elemental interaction the reader can FEEL
3. Connect to this specific person's chart. Reference their Day Master strength (${chart.dayMasterStrength}), useful god (${chart.usefulGod}), and chart pattern (${chart.chartPatternKorean})
4. Make it personal. Reference their actual element scores. If an element is very high or very low, call it out
5. End with the life lesson/theme in one resonant sentence that feels like a personal mantra

${languageInstruction}

FORMATTING:
- No headers or bullet points. Write as flowing prose
- Target exactly 250-300 words
- Write for social media sharing. Make every sentence quotable
- Tone: poetic, personal, slightly mystical, but never vague
- Every claim must trace back to the archetype or chart data above`;
}

function getLanguageInstruction(language: Language): string {
  switch (language) {
    case 'ko':
      return `LANGUAGE: Write entirely in Korean (한국어). Use 존댓말. Include saju terms naturally (일간, 오행, 격국). Make it sound like a wise 사주 선생님 speaking warmly to a client.`;
    case 'vi':
      return `LANGUAGE: Write entirely in Vietnamese. Use respectful, warm language. Include Korean/Chinese terms in parentheses on first mention. Make it feel culturally authentic.`;
    case 'en':
      return `LANGUAGE: Write in evocative English. Include Korean terms in parentheses for authenticity. Use vivid nature metaphors. Make it feel like a personal letter from a wise mentor.`;
  }
}
