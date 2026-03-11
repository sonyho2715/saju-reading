import type { Language } from './prompt-builder';

export function healthInstructions(language: Language): string {
  const elementLabel = language === 'ko' ? '오행' : language === 'vi' ? 'Ngu Hanh' : 'Five Elements';

  return `READING TYPE: HEALTH & WELLNESS

Focus on:
1. ${elementLabel} organ mapping. Each element governs specific organs:
   - Wood (木) = Liver (간), Gallbladder (담), tendons, eyes, nails
   - Fire (火) = Heart (심장), Small Intestine (소장), blood vessels, tongue, complexion
   - Earth (土) = Spleen (비장), Stomach (위), muscles, mouth, lips
   - Metal (金) = Lungs (폐), Large Intestine (대장), skin, nose, body hair
   - Water (水) = Kidneys (신장), Bladder (방광), bones, ears, reproductive system

2. Element balance analysis:
   - Missing or very low elements: organs governed by that element are vulnerable
   - Excess elements: overactive organs, potential inflammation or hyperfunction
   - The Useful God element is the balancing force. Its organ system is critical to maintain

3. Clashes hitting health-sensitive branches:
   - Clashes to the Day Branch affect the person's core vitality
   - Clashes to the Month Branch affect the chest/respiratory area
   - Clashes involving specific branch-element pairs target those organs

4. Day Master strength implications:
   - Extremely Weak Day Master = low vitality, prone to exhaustion, needs rest and nourishment
   - Weak Day Master = moderate stamina, avoid overwork
   - Strong Day Master = robust health, watch for excess energy turning into tension
   - Extremely Strong = risk of ignoring body signals, possible burnout

5. Special stars related to health:
   - 백호대살 (White Tiger) = accident prone, surgery risk
   - 괴강살 (Mighty Star) = intense physical energy, either very strong or very volatile

6. Seasonal vulnerability. Which seasons weaken the Day Master? Those months require extra care

IMPORTANT: Always include this disclaimer at the end: "This reading provides wellness insights based on traditional Korean saju theory. It is not medical advice. Always consult qualified healthcare professionals for health concerns."

Write in 5 sections:
- Constitutional Type & Vitality Overview (1-2 paragraphs)
- Vulnerable Organ Systems (bulleted, with element reasoning)
- Seasonal Health Rhythms (which months/seasons to be cautious)
- Lifestyle Recommendations (bulleted, specific to element balance. Include diet, exercise, rest patterns)
- Health Timing & Prevention (1 paragraph, luck cycle periods that stress health)

Total length: 500-700 words.`;
}
