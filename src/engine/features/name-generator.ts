import type { ChartAnalysis, Element } from '../types';
import { GENERATES } from '../constants/elements';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NameSuggestion {
  name: string;
  nativeScript: string;
  romanization: string;
  meaning: string;
  elementBalance: string;
  deficiencyAddressed: string;
}

export interface NameGeneratorInput {
  chart: ChartAnalysis;
  nameType: 'korean' | 'vietnamese' | 'english';
  targetGender: 'male' | 'female' | 'neutral';
}

// ---------------------------------------------------------------------------
// Element-to-name-theme mappings
// ---------------------------------------------------------------------------

type NameEntry = { native: string; roman: string; meaning: string };

const ELEMENT_NAMES: Record<string, Record<'korean' | 'vietnamese' | 'english', Record<'male' | 'female' | 'neutral', NameEntry[]>>> = {
  Wood: {
    korean: {
      male: [
        { native: '수림', roman: 'Surim', meaning: 'Forest of longevity' },
        { native: '동현', roman: 'Donghyeon', meaning: 'Eastern brilliance, spring growth' },
        { native: '재민', roman: 'Jaemin', meaning: 'Talented and sharp like new wood' },
        { native: '성목', roman: 'Seongmok', meaning: 'Flourishing tree' },
      ],
      female: [
        { native: '수진', roman: 'Sujin', meaning: 'Precious like a forest spring' },
        { native: '하린', roman: 'Harin', meaning: 'Abundant growth' },
        { native: '초은', roman: 'Choeun', meaning: 'Grace of new grass' },
        { native: '봄이', roman: 'Bomi', meaning: 'Child of spring' },
      ],
      neutral: [
        { native: '나무', roman: 'Namu', meaning: 'Tree, steady growth' },
        { native: '새봄', roman: 'Saebom', meaning: 'New spring' },
      ],
    },
    vietnamese: {
      male: [
        { native: 'Xu\u00e2n L\u00e2m', roman: 'Xuan Lam', meaning: 'Spring forest' },
        { native: 'M\u1ed9c Minh', roman: 'Moc Minh', meaning: 'Bright wood element' },
        { native: 'Th\u00e0nh Xu\u00e2n', roman: 'Thanh Xuan', meaning: 'Spring of success' },
      ],
      female: [
        { native: 'Xu\u00e2n Mai', roman: 'Xuan Mai', meaning: 'Apricot blossom of spring' },
        { native: 'Thanh Tr\u00fac', roman: 'Thanh Truc', meaning: 'Green bamboo' },
        { native: 'B\u00edch L\u00e2m', roman: 'Bich Lam', meaning: 'Jade green forest' },
      ],
      neutral: [
        { native: 'Xu\u00e2n', roman: 'Xuan', meaning: 'Spring season, renewal' },
        { native: 'L\u00e2m', roman: 'Lam', meaning: 'Forest' },
      ],
    },
    english: {
      male: [
        { native: 'Rowan', roman: 'Rowan', meaning: 'Rowan tree, protection and vision' },
        { native: 'Forest', roman: 'Forest', meaning: 'Strength and abundance of the forest' },
        { native: 'Ash', roman: 'Ash', meaning: 'World tree, connection of realms' },
      ],
      female: [
        { native: 'Ivy', roman: 'Ivy', meaning: 'Tenacity and evergreen life' },
        { native: 'Willow', roman: 'Willow', meaning: 'Flexibility and grace' },
        { native: 'Laurel', roman: 'Laurel', meaning: 'Victory and honor' },
      ],
      neutral: [
        { native: 'Sage', roman: 'Sage', meaning: 'Wisdom and vitality' },
        { native: 'Reed', roman: 'Reed', meaning: 'Resilience and adaptability' },
      ],
    },
  },

  Fire: {
    korean: {
      male: [
        { native: '빛나', roman: 'Bitna', meaning: 'Shining brilliance' },
        { native: '태양', roman: 'Taeyang', meaning: 'The sun, radiant power' },
        { native: '광민', roman: 'Gwangmin', meaning: 'Bright and sharp' },
        { native: '열정', roman: 'Yeoljeong', meaning: 'Passionate fire spirit' },
      ],
      female: [
        { native: '하늘', roman: 'Haneul', meaning: 'Sky lit by flame' },
        { native: '지연', roman: 'Jiyeon', meaning: 'Radiant beauty' },
        { native: '단비', roman: 'Danbi', meaning: 'Sweet warmth like rain after fire' },
        { native: '소라', roman: 'Sora', meaning: 'Glowing shell, inner light' },
      ],
      neutral: [
        { native: '불꽃', roman: 'Bulkkot', meaning: 'Flame blossom' },
        { native: '빛', roman: 'Bit', meaning: 'Light' },
      ],
    },
    vietnamese: {
      male: [
        { native: 'Vinh Quang', roman: 'Vinh Quang', meaning: 'Glory and radiance' },
        { native: 'Minh H\u1ecfa', roman: 'Minh Hoa', meaning: 'Bright fire' },
        { native: '\u0110\u1ea1t H\u1ecfa', roman: 'Dat Hoa', meaning: 'Fire achiever' },
      ],
      female: [
        { native: 'Ng\u1ecdc \u00c1nh', roman: 'Ngoc Anh', meaning: 'Jewel of light' },
        { native: 'H\u1ed3ng H\u00e0', roman: 'Hong Ha', meaning: 'Rose of the river' },
        { native: 'Thanh H\u1ecfa', roman: 'Thanh Hoa', meaning: 'Pure fire beauty' },
      ],
      neutral: [
        { native: 'Quang', roman: 'Quang', meaning: 'Radiance' },
        { native: 'Minh', roman: 'Minh', meaning: 'Brightness, clarity' },
      ],
    },
    english: {
      male: [
        { native: 'Blaze', roman: 'Blaze', meaning: 'Fierce and radiant fire' },
        { native: 'Phoenix', roman: 'Phoenix', meaning: 'Rebirth through fire' },
        { native: 'Ray', roman: 'Ray', meaning: 'Ray of sunlight' },
      ],
      female: [
        { native: 'Ember', roman: 'Ember', meaning: 'Glowing warmth that endures' },
        { native: 'Soleil', roman: 'Soleil', meaning: 'The sun' },
        { native: 'Aurora', roman: 'Aurora', meaning: 'Dawn light' },
      ],
      neutral: [
        { native: 'Flare', roman: 'Flare', meaning: 'Sudden brilliance' },
        { native: 'Lux', roman: 'Lux', meaning: 'Light itself' },
      ],
    },
  },

  Earth: {
    korean: {
      male: [
        { native: '지호', roman: 'Jiho', meaning: 'Earth and lake, vast stability' },
        { native: '대산', roman: 'Daesan', meaning: 'Great mountain' },
        { native: '중원', roman: 'Jungwon', meaning: 'Center, grounded foundation' },
        { native: '건토', roman: 'Geonto', meaning: 'Firm earth, reliability' },
      ],
      female: [
        { native: '지아', roman: 'Jia', meaning: 'Beautiful earth energy' },
        { native: '은토', roman: 'Eunto', meaning: 'Hidden earth, gentle strength' },
        { native: '서현', roman: 'Seohyeon', meaning: 'Bright and steadfast' },
        { native: '민지', roman: 'Minji', meaning: 'Wisdom grounded in the earth' },
      ],
      neutral: [
        { native: '대지', roman: 'Daeji', meaning: 'The great earth' },
        { native: '중심', roman: 'Jungsim', meaning: 'Center' },
      ],
    },
    vietnamese: {
      male: [
        { native: 'Ki\u00ean Th\u1ed5', roman: 'Kien Tho', meaning: 'Strong earth' },
        { native: 'B\u00ecnh \u0110\u1ecba', roman: 'Binh Dia', meaning: 'Peaceful ground' },
        { native: '\u0110\u1ea5t An', roman: 'Dat An', meaning: 'Safe land' },
      ],
      female: [
        { native: 'Th\u1ed5 Lan', roman: 'Tho Lan', meaning: 'Earth orchid' },
        { native: 'B\u00ecnh Y\u00ean', roman: 'Binh Yen', meaning: 'Peaceful and stable' },
        { native: 'Hi\u1ec1n Th\u1ed5', roman: 'Hien Tho', meaning: 'Gentle earth' },
      ],
      neutral: [
        { native: 'B\u00ecnh', roman: 'Binh', meaning: 'Peace and balance' },
        { native: '\u0110\u1ea5t', roman: 'Dat', meaning: 'Earth, land' },
      ],
    },
    english: {
      male: [
        { native: 'Clay', roman: 'Clay', meaning: 'Malleable and strong earth' },
        { native: 'Stone', roman: 'Stone', meaning: 'Enduring and unshakable' },
        { native: 'Ridge', roman: 'Ridge', meaning: 'Mountain ridge, elevation' },
      ],
      female: [
        { native: 'Terra', roman: 'Terra', meaning: 'The earth itself' },
        { native: 'Sienna', roman: 'Sienna', meaning: 'Warm earth tones' },
        { native: 'Gaia', roman: 'Gaia', meaning: 'Mother earth' },
      ],
      neutral: [
        { native: 'Eden', roman: 'Eden', meaning: 'Paradise, fertile ground' },
        { native: 'Dale', roman: 'Dale', meaning: 'Valley, sheltered earth' },
      ],
    },
  },

  Metal: {
    korean: {
      male: [
        { native: '강철', roman: 'Gangcheol', meaning: 'Steel, unyielding strength' },
        { native: '예준', roman: 'Yejun', meaning: 'Sharp and refined' },
        { native: '금선', roman: 'Geumseon', meaning: 'Golden thread, precision' },
        { native: '세민', roman: 'Semin', meaning: 'Refined and sharp mind' },
      ],
      female: [
        { native: '은별', roman: 'Eunbyeol', meaning: 'Silver star' },
        { native: '금비', roman: 'Geumbi', meaning: 'Golden rain' },
        { native: '세은', roman: 'Seeun', meaning: 'Refined silver' },
        { native: '예린', roman: 'Yerin', meaning: 'Sharp and graceful' },
      ],
      neutral: [
        { native: '금속', roman: 'Geumsok', meaning: 'Pure metal' },
        { native: '예리', roman: 'Yeri', meaning: 'Sharp, keen' },
      ],
    },
    vietnamese: {
      male: [
        { native: 'Kim C\u01b0\u01a1ng', roman: 'Kim Cuong', meaning: 'Diamond, indestructible' },
        { native: 'Anh Kim', roman: 'Anh Kim', meaning: 'Golden hero' },
        { native: 'Kim S\u01a1n', roman: 'Kim Son', meaning: 'Golden mountain' },
      ],
      female: [
        { native: 'Kim Ng\u1ecdc', roman: 'Kim Ngoc', meaning: 'Golden jade' },
        { native: 'B\u1ea1ch Kim', roman: 'Bach Kim', meaning: 'White gold, platinum' },
        { native: 'Kim Y\u1ebfn', roman: 'Kim Yen', meaning: 'Golden swallow' },
      ],
      neutral: [
        { native: 'Kim', roman: 'Kim', meaning: 'Gold, metal element' },
        { native: 'Anh', roman: 'Anh', meaning: 'Crystal, brilliance' },
      ],
    },
    english: {
      male: [
        { native: 'Sterling', roman: 'Sterling', meaning: 'Pure silver, excellent quality' },
        { native: 'Flint', roman: 'Flint', meaning: 'Spark-creating stone, decisive' },
        { native: 'Steele', roman: 'Steele', meaning: 'Strength and precision' },
      ],
      female: [
        { native: 'Crystal', roman: 'Crystal', meaning: 'Clear and pure like refined metal' },
        { native: 'Silver', roman: 'Silver', meaning: 'Precious and luminous' },
        { native: 'Aurelia', roman: 'Aurelia', meaning: 'The golden one' },
      ],
      neutral: [
        { native: 'Ferris', roman: 'Ferris', meaning: 'Of iron, strength' },
        { native: 'Bronte', roman: 'Bronte', meaning: 'Thunder, powerful metal energy' },
      ],
    },
  },

  Water: {
    korean: {
      male: [
        { native: '해준', roman: 'Haejun', meaning: 'Ocean of talent' },
        { native: '수민', roman: 'Sumin', meaning: 'Wisdom of water' },
        { native: '강현', roman: 'Ganghyeon', meaning: 'River, brilliant flow' },
        { native: '지수', roman: 'Jisu', meaning: 'Wisdom and water depth' },
      ],
      female: [
        { native: '수아', roman: 'Sua', meaning: 'Elegant water' },
        { native: '해린', roman: 'Haerin', meaning: 'Ocean rain, abundant flow' },
        { native: '미수', roman: 'Misu', meaning: 'Beautiful water' },
        { native: '은하', roman: 'Eunha', meaning: 'Silver river, Milky Way' },
      ],
      neutral: [
        { native: '흐름', roman: 'Heureum', meaning: 'Flow, the way of water' },
        { native: '깊음', roman: 'Gipeum', meaning: 'Depth' },
      ],
    },
    vietnamese: {
      male: [
        { native: 'Th\u1ee7y Minh', roman: 'Thuy Minh', meaning: 'Bright water' },
        { native: 'H\u1ea3i Giang', roman: 'Hai Giang', meaning: 'Ocean river' },
        { native: 'Minh H\u1ea3i', roman: 'Minh Hai', meaning: 'Bright sea' },
      ],
      female: [
        { native: 'Th\u1ee7y Ti\u00ean', roman: 'Thuy Tien', meaning: 'Water fairy' },
        { native: 'H\u00e0 Giang', roman: 'Ha Giang', meaning: 'River of rivers' },
        { native: 'B\u00edch Th\u1ee7y', roman: 'Bich Thuy', meaning: 'Jade water' },
      ],
      neutral: [
        { native: 'Th\u1ee7y', roman: 'Thuy', meaning: 'Water element' },
        { native: 'H\u1ea3i', roman: 'Hai', meaning: 'Ocean' },
      ],
    },
    english: {
      male: [
        { native: 'River', roman: 'River', meaning: 'Flowing strength and direction' },
        { native: 'Brooks', roman: 'Brooks', meaning: 'Small streams, quiet power' },
        { native: 'Caspian', roman: 'Caspian', meaning: 'Great inland sea' },
      ],
      female: [
        { native: 'Marina', roman: 'Marina', meaning: 'Of the sea' },
        { native: 'Brooke', roman: 'Brooke', meaning: 'Gentle stream' },
        { native: 'Coral', roman: 'Coral', meaning: 'Ocean treasure' },
      ],
      neutral: [
        { native: 'Quinn', roman: 'Quinn', meaning: 'Wisdom and counsel' },
        { native: 'Bay', roman: 'Bay', meaning: 'Calm harbor' },
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// Find deficient elements from chart
// ---------------------------------------------------------------------------

function getDeficientElements(chart: ChartAnalysis): Element[] {
  const balance = chart.elementBalance;
  const entries: { element: Element; score: number }[] = [
    { element: 'Wood' as Element, score: balance.wood },
    { element: 'Fire' as Element, score: balance.fire },
    { element: 'Earth' as Element, score: balance.earth },
    { element: 'Metal' as Element, score: balance.metal },
    { element: 'Water' as Element, score: balance.water },
  ];

  // Elements with score below average are deficient
  const avg = entries.reduce((sum, e) => sum + e.score, 0) / 5;
  const deficient = entries
    .filter(e => e.score < avg)
    .sort((a, b) => a.score - b.score)
    .map(e => e.element);

  // Always include the Useful God if not already present
  if (!deficient.includes(chart.usefulGod)) {
    deficient.unshift(chart.usefulGod);
  }

  return deficient;
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

export function generateNameSuggestions(input: NameGeneratorInput): NameSuggestion[] {
  const { chart, nameType, targetGender } = input;
  const deficients = getDeficientElements(chart);
  const suggestions: NameSuggestion[] = [];

  // Priority: Useful God element first, then other deficient elements
  const elementPriority: Element[] = [chart.usefulGod];
  for (const el of deficients) {
    if (!elementPriority.includes(el)) {
      elementPriority.push(el);
    }
  }
  // Also consider the element that generates the Useful God
  const generatingElement = (Object.entries(GENERATES) as [Element, Element][])
    .find(([, v]) => v === chart.usefulGod)?.[0];
  if (generatingElement && !elementPriority.includes(generatingElement)) {
    elementPriority.push(generatingElement);
  }

  for (const element of elementPriority) {
    const elementStr = element as string;
    const namePool = ELEMENT_NAMES[elementStr]?.[nameType];
    if (!namePool) continue;

    const names = namePool[targetGender] ?? namePool.neutral;
    for (const entry of names) {
      suggestions.push({
        name: entry.native,
        nativeScript: entry.native,
        romanization: entry.roman,
        meaning: entry.meaning,
        elementBalance: `Strengthens ${elementStr} energy`,
        deficiencyAddressed: elementStr === chart.usefulGod.toString()
          ? `Addresses Useful God (${elementStr})`
          : `Supplements deficient ${elementStr}`,
      });
    }
  }

  // Return top 10
  return suggestions.slice(0, 10);
}
