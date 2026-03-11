import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateFullChart } from '@/engine';
import { generateText } from '@/lib/claude-client';
import type { Element } from '@/engine/types';

const inputSchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
  gender: z.enum(['male', 'female']),
  calendarType: z.enum(['solar', 'lunar']).default('solar'),
  isLeapMonth: z.boolean().default(false),
  timezone: z.string().default('Asia/Seoul'),
  nameType: z.enum(['korean', 'vietnamese', 'english']),
  targetGender: z.enum(['male', 'female', 'neutral']).default('neutral'),
});

const ELEMENT_HANJA: Record<Element, string[]> = {
  Wood: ['木 (나무 목)', '林 (수풀 림)', '森 (숲 삼)', '松 (소나무 송)', '柏 (잣나무 백)'],
  Fire: ['火 (불 화)', '炎 (불꽃 염)', '煥 (빛날 환)', '熙 (빛날 희)', '暉 (빛 휘)'],
  Earth: ['土 (흙 토)', '坤 (땅 곤)', '培 (북돋을 배)', '垠 (언덕 은)', '堅 (굳을 견)'],
  Metal: ['金 (쇠 금)', '鉉 (쇠줄 현)', '鍊 (단련할 련)', '銀 (은 은)', '鋒 (칼끝 봉)'],
  Water: ['水 (물 수)', '泳 (헤엄칠 영)', '澤 (못 택)', '洙 (물이름 수)', '浩 (넓을 호)'],
};

function identifyDeficientElements(balance: Record<string, number>): Element[] {
  const deficient: Element[] = [];
  const entries: [string, number][] = Object.entries(balance);
  entries.sort((a, b) => a[1] - b[1]);

  for (const [element, score] of entries) {
    if (score < 1.0) {
      deficient.push(element as Element);
    }
  }

  // If no element is below 1.0, return the weakest
  if (deficient.length === 0 && entries.length > 0) {
    deficient.push(entries[0][0] as Element);
  }

  return deficient;
}

function buildNamePrompt(
  nameType: string,
  targetGender: string,
  deficientElements: Element[],
  usefulGod: Element,
  balance: Record<string, number>
): string {
  const elementInfo = deficientElements
    .map((el) => `${el} (score: ${balance[el.toLowerCase()]?.toFixed(1) ?? '0'})`)
    .join(', ');

  const hanjaHints = deficientElements
    .map((el) => `${el}: ${ELEMENT_HANJA[el]?.join(', ') ?? 'N/A'}`)
    .join('\n');

  return `You are a Korean naming expert specializing in 작명 (naming based on saju/four pillars).

TASK: Generate 5 ${nameType} names for a ${targetGender} person that balance their saju chart.

CHART ANALYSIS:
- Deficient elements: ${elementInfo}
- Useful God (용신): ${usefulGod}
- Full element balance: Wood=${balance.wood?.toFixed(1)}, Fire=${balance.fire?.toFixed(1)}, Earth=${balance.earth?.toFixed(1)}, Metal=${balance.metal?.toFixed(1)}, Water=${balance.water?.toFixed(1)}

${nameType === 'korean' ? `REFERENCE HANJA BY ELEMENT:\n${hanjaHints}\n` : ''}

REQUIREMENTS:
${nameType === 'korean' ? `- Provide Korean names in format: 한글 (Hanja) - Romanized
- Each name should have 2-3 syllables
- At least one character in each name should carry the energy of the deficient element(s)
- Names must sound natural and be commonly used in modern Korea` : ''}
${nameType === 'vietnamese' ? `- Provide Vietnamese names that carry the energy of the deficient element(s)
- Names should follow Vietnamese naming conventions
- Include the meaning and element association for each name` : ''}
${nameType === 'english' ? `- Provide English names whose etymology or meaning connects to the deficient element(s)
- Include the origin and meaning of each name
- Names should sound modern and appealing` : ''}

FORMAT your response as JSON array:
[
  {
    "name": "the name",
    "hanja": "hanja characters (Korean only, empty string otherwise)",
    "romanized": "romanized version",
    "meaning": "meaning of the name",
    "elementConnection": "which element(s) this name strengthens and why",
    "score": 8
  }
]

Return ONLY the JSON array, no other text.`;
}

interface NameSuggestion {
  name: string;
  hanja: string;
  romanized: string;
  meaning: string;
  elementConnection: string;
  score: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = inputSchema.parse(body);

    // Calculate chart
    const chart = calculateFullChart({
      birthDate: input.birthDate,
      birthTime: input.birthTime ?? undefined,
      gender: input.gender,
      timezone: input.timezone,
      calendarType: input.calendarType,
      leapMonth: input.isLeapMonth,
    });

    // Identify deficient elements
    const balance: Record<string, number> = {
      wood: chart.elementBalance.wood,
      fire: chart.elementBalance.fire,
      earth: chart.elementBalance.earth,
      metal: chart.elementBalance.metal,
      water: chart.elementBalance.water,
    };
    const deficientElements = identifyDeficientElements(balance);

    // Generate names via Claude
    const prompt = buildNamePrompt(
      input.nameType,
      input.targetGender,
      deficientElements,
      chart.usefulGod,
      balance
    );

    const response = await generateText(prompt, { maxTokens: 2048 });

    // Parse the JSON response
    let names: NameSuggestion[] = [];
    try {
      // Extract JSON from response (handle potential markdown code blocks)
      const jsonStr = response.text
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      names = JSON.parse(jsonStr) as NameSuggestion[];
    } catch {
      console.error('[names/generate] Failed to parse AI response:', response.text);
      return NextResponse.json(
        { success: false, error: 'Failed to parse name suggestions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        names,
        deficientElements,
        usefulGod: chart.usefulGod,
        elementBalance: chart.elementBalance,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('[names/generate] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate names' },
      { status: 500 }
    );
  }
}
