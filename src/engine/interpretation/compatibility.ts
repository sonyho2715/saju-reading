import type { Language } from './prompt-builder';

export function compatibilityInstructions(language: Language): string {
  const compatLabel = language === 'ko' ? '궁합' : language === 'vi' ? 'Hop Menh' : 'Compatibility';

  return `READING TYPE: ${compatLabel} (RELATIONSHIP COMPATIBILITY)

You have been given TWO charts: Person A (primary) and Person B (partner). Analyze their compatibility across multiple dimensions.

Focus on:
1. Day Master Element Compatibility:
   - What is each person's Day Master element and polarity?
   - Do their elements generate, control, or clash with each other?
   - Same element = comfortable but potentially stagnant
   - Generating cycle = nurturing dynamic (who gives, who receives?)
   - Controlling cycle = power dynamic (who dominates?)

2. Day Branch (Spouse Palace) Harmony/Clash:
   - Do Person A's and Person B's Day Branches form a Six Harmony? (Excellent compatibility)
   - Do they form a Six Clash? (Intense friction, magnetic but volatile)
   - Do they form a Harm or Punishment? (Hidden resentment or conflict patterns)
   - Neutral? (Stability without strong magnetic pull)

3. Useful God Cross-Compatibility:
   - Is Person A's Day Master element Person B's Useful God? (B benefits greatly from A)
   - Is Person B's Day Master element Person A's Useful God? (A benefits greatly from B)
   - Mutual Useful God = extremely beneficial relationship
   - Mutual Jealousy God = challenging but growth-oriented

4. Ten God Pairing:
   - What Ten God is Person A's Day Master from Person B's perspective, and vice versa?
   - 정관/정재 pairing = traditional complementary partnership
   - 편관/편재 pairing = intense, passionate but volatile
   - 비견/비견 pairing = equal partners, potential rivalry

5. Special Stars Comparison:
   - Do both have 도화살 (Peach Blossom)? = very attractive couple, jealousy risk
   - Does one have 천을귀인 matching the other's branch? = nobleman support
   - 홍염살 in both charts = extremely passionate, possibly unstable

6. Overall Element Balance:
   - Do they complement each other's weaknesses? (One has excess Metal, the other needs Metal)
   - Or do they amplify imbalances? (Both excess in same element)

Write in 6 sections:
- Overall Compatibility Score & Theme (1 paragraph, give a score out of 100 with reasoning)
- Element Dynamics Between Partners (1-2 paragraphs)
- Emotional & Romantic Chemistry (1-2 paragraphs, based on Day Branch and special stars)
- Strengths of This Pairing (bulleted)
- Challenges & Growth Areas (bulleted, be honest but constructive)
- Advice for This Partnership (3-5 actionable recommendations)

Total length: 800-1000 words.`;
}
