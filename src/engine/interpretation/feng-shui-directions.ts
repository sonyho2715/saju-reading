import type { ChartAnalysis } from '../types';
import { Element } from '../types';

/**
 * Element-to-direction mapping for saju-integrated directional guidance.
 * NOTE: This is a saju-based simplification, not classical 八宅 (Eight Mansions) feng shui.
 */

interface DirectionMapping {
  element: Element;
  directions: string[];
  colors: string[];
  season: string;
  description: string;
}

const ELEMENT_DIRECTIONS: DirectionMapping[] = [
  {
    element: Element.Wood,
    directions: ['East', 'Southeast'],
    colors: ['Green', 'Teal', 'Brown'],
    season: 'Spring',
    description: 'Growth, expansion, new beginnings. Wood energy flows upward and outward.',
  },
  {
    element: Element.Fire,
    directions: ['South'],
    colors: ['Red', 'Orange', 'Pink', 'Purple'],
    season: 'Summer',
    description: 'Visibility, passion, recognition. Fire energy radiates in all directions from the south.',
  },
  {
    element: Element.Earth,
    directions: ['Center', 'Northeast', 'Southwest'],
    colors: ['Yellow', 'Beige', 'Terracotta', 'Sandy brown'],
    season: 'Late Summer (transitional)',
    description: 'Stability, nourishment, grounding. Earth energy anchors and centers.',
  },
  {
    element: Element.Metal,
    directions: ['West', 'Northwest'],
    colors: ['White', 'Silver', 'Gold', 'Gray'],
    season: 'Autumn',
    description: 'Precision, clarity, completion. Metal energy contracts and refines.',
  },
  {
    element: Element.Water,
    directions: ['North'],
    colors: ['Black', 'Dark blue', 'Navy'],
    season: 'Winter',
    description: 'Wisdom, depth, flow. Water energy descends and pools.',
  },
];

function getDirectionMapping(element: Element): DirectionMapping {
  const mapping = ELEMENT_DIRECTIONS.find(d => d.element === element);
  if (!mapping) throw new Error(`No direction mapping for element: ${element}`);
  return mapping;
}

/**
 * Builds a prompt for Claude to generate feng-shui-style directional guidance
 * based on the user's saju chart.
 */
export function buildFengShuiPrompt(chart: ChartAnalysis): string {
  const dayMasterElement = chart.dayMaster.element;
  const usefulGodElement = chart.usefulGod;

  const dayMasterDir = getDirectionMapping(dayMasterElement);
  const usefulGodDir = getDirectionMapping(usefulGodElement);

  // Find weakest and strongest elements
  const balanceEntries: Array<{ element: Element; score: number }> = [
    { element: Element.Wood, score: chart.elementBalance.wood },
    { element: Element.Fire, score: chart.elementBalance.fire },
    { element: Element.Earth, score: chart.elementBalance.earth },
    { element: Element.Metal, score: chart.elementBalance.metal },
    { element: Element.Water, score: chart.elementBalance.water },
  ];
  balanceEntries.sort((a, b) => a.score - b.score);
  const weakest = balanceEntries[0];
  const strongest = balanceEntries[balanceEntries.length - 1];

  const weakestDir = getDirectionMapping(weakest.element);
  const strongestDir = getDirectionMapping(strongest.element);

  return `You are a saju-based directional advisor. Based on the following chart data, provide personalized feng-shui-style directional guidance.

IMPORTANT DISCLAIMER: Include this at the beginning: "This guidance integrates Korean saju (四柱推命) element theory with directional energy principles. It is a saju-based simplification and not classical 八宅 (Eight Mansions) feng shui."

CHART DATA:
- Day Master: ${chart.dayMaster.korean} (${chart.dayMaster.hanja}) - ${dayMasterElement} ${chart.dayMaster.yinYang}
- Day Master Strength: ${chart.dayMasterStrength}
- Useful God (용신): ${usefulGodElement}
- Jealousy God (기신): ${chart.jealousyGod}

ELEMENT BALANCE:
- Wood: ${chart.elementBalance.wood.toFixed(1)}
- Fire: ${chart.elementBalance.fire.toFixed(1)}
- Earth: ${chart.elementBalance.earth.toFixed(1)}
- Metal: ${chart.elementBalance.metal.toFixed(1)}
- Water: ${chart.elementBalance.water.toFixed(1)}
- Weakest: ${weakest.element} (${weakest.score.toFixed(1)})
- Strongest: ${strongest.element} (${strongest.score.toFixed(1)})

DIRECTION MAPPINGS:
- Day Master (${dayMasterElement}): ${dayMasterDir.directions.join(', ')} | Colors: ${dayMasterDir.colors.join(', ')}
- Useful God (${usefulGodElement}): ${usefulGodDir.directions.join(', ')} | Colors: ${usefulGodDir.colors.join(', ')}
- Weakest Element (${weakest.element}): ${weakestDir.directions.join(', ')} | Colors: ${weakestDir.colors.join(', ')}
- Strongest Element (${strongest.element}): ${strongestDir.directions.join(', ')} | Colors: ${strongestDir.colors.join(', ')}

WRITE THESE SECTIONS:

## Favorable Directions
- Primary favorable direction (based on Useful God element)
- Secondary favorable direction (based on weakest element to strengthen)
- Explain WHY these directions support this specific chart

## Colors for Your Space
- Primary palette (Useful God colors)
- Accent colors (to balance weak elements)
- Colors to minimize (Jealousy God / excess element colors)

## Desk & Workspace Orientation
- Which direction to face when working
- Where to place your desk relative to the room
- Reasoning based on career palace (Month Pillar) element

## Bedroom & Rest Orientation
- Which direction the head of the bed should face
- Reasoning based on Day Branch (spouse palace) and health needs

## Seasonal Adjustments
- Which season to be most active (aligned with Useful God)
- Which season to rest more (when Jealousy God element peaks)

Total length: 400-500 words. Be specific and actionable.`;
}
