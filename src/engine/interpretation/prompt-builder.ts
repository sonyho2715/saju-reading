import type { ChartAnalysis, Pillar, HiddenStem, SpecialStar, Combination, Clash, LuckCycle } from '../types';
import { TEN_GOD_INFO } from '../constants/ten-gods';
import { personalityInstructions } from './personality';
import { careerInstructions } from './career';
import { relationshipInstructions } from './relationships';
import { healthInstructions } from './health';
import { annualForecastInstructions } from './annual-forecast';
import { monthlyForecastInstructions } from './monthly-forecast';
import { compatibilityInstructions } from './compatibility';
import { fullReadingInstructions } from './full-reading';

export type ReadingType = 'quick' | 'full' | 'personality' | 'career' | 'love' | 'health' | 'annual' | 'monthly' | 'compatibility';
export type Language = 'en' | 'ko' | 'vi';

export interface ReadingOptions {
  targetYear?: number;
  partnerChart?: ChartAnalysis;
  specificQuestion?: string;
}

// ---------------------------------------------------------------------------
// Main prompt builder
// ---------------------------------------------------------------------------

export function buildReadingPrompt(
  chart: ChartAnalysis,
  readingType: ReadingType,
  language: Language,
  options?: ReadingOptions
): string {
  const sections: string[] = [];

  // Section 0: System role
  sections.push(buildSystemRole(language));

  // Section 1: Chart data
  sections.push(buildChartDataSection(chart, language));

  // Section 2: Partner chart (if compatibility)
  if (readingType === 'compatibility' && options?.partnerChart) {
    sections.push(buildPartnerChartSection(options.partnerChart, language));
  }

  // Section 3: Reading-type instructions
  sections.push(getReadingInstructions(readingType, language, options));

  // Section 4: Language instructions
  sections.push(buildLanguageInstructions(language));

  // Section 5: Specific question (if any)
  if (options?.specificQuestion) {
    sections.push(`SPECIFIC QUESTION FROM THE USER:\n"${options.specificQuestion}"\nAddress this question within the context of the reading.`);
  }

  // Section 6: Quality directive
  sections.push(buildQualityDirective());

  return sections.join('\n\n---\n\n');
}

// ---------------------------------------------------------------------------
// System role
// ---------------------------------------------------------------------------

function buildSystemRole(language: Language): string {
  const roleByLang: Record<Language, string> = {
    en: 'You are a master Korean saju (四柱推命) practitioner with 30 years of experience interpreting birth charts. You combine deep knowledge of traditional Korean fortune-telling with modern psychological insight. Your readings are specific, grounded in actual chart data, and delivered with wisdom and compassion. You never give generic horoscope-style advice.',
    ko: '당신은 30년 경력의 사주명리학 대가입니다. 전통 한국 명리학의 깊은 지식과 현대 심리학적 통찰을 결합하여 해석합니다. 모든 분석은 실제 사주 데이터에 근거하며, 일반적인 운세 조언이 아닌 구체적이고 개인화된 해석을 제공합니다. 존댓말을 사용하여 정중하게 말씀드립니다.',
    vi: 'Ban la mot chuyen gia Tu Tru Suy Menh (Saju) Han Quoc voi 30 nam kinh nghiem. Ban ket hop kien thuc sau rong ve menh ly hoc truyen thong Han Quoc voi cai nhin tam ly hoc hien dai. Moi phan tich deu dua tren du lieu tu tru thuc te, khong dua ra loi khuyen chung chung.',
  };
  return `ROLE:\n${roleByLang[language]}`;
}

// ---------------------------------------------------------------------------
// Chart data section
// ---------------------------------------------------------------------------

function buildChartDataSection(chart: ChartAnalysis, language: Language): string {
  const lines: string[] = ['CHART DATA (사주팔자):'];

  // Four pillars table (traditional right-to-left: Hour | Day | Month | Year)
  lines.push('');
  lines.push('Four Pillars (right to left = traditional Korean order):');
  lines.push('');
  lines.push('| Position | Hour (시주) | Day (일주) | Month (월주) | Year (연주) |');
  lines.push('|----------|-----------|----------|------------|-----------|');

  // Stem row
  const hourStem = chart.fourPillars.hour ? formatStem(chart.fourPillars.hour.stem.korean, chart.fourPillars.hour.stem.hanja) : 'Unknown';
  const dayStem = formatStem(chart.fourPillars.day.stem.korean, chart.fourPillars.day.stem.hanja);
  const monthStem = formatStem(chart.fourPillars.month.stem.korean, chart.fourPillars.month.stem.hanja);
  const yearStem = formatStem(chart.fourPillars.year.stem.korean, chart.fourPillars.year.stem.hanja);
  lines.push(`| Stem (천간) | ${hourStem} | ${dayStem} [DAY MASTER] | ${monthStem} | ${yearStem} |`);

  // Branch row
  const hourBranch = chart.fourPillars.hour ? formatBranch(chart.fourPillars.hour.branch) : 'Unknown';
  const dayBranch = formatBranch(chart.fourPillars.day.branch);
  const monthBranch = formatBranch(chart.fourPillars.month.branch);
  const yearBranch = formatBranch(chart.fourPillars.year.branch);
  lines.push(`| Branch (지지) | ${hourBranch} | ${dayBranch} | ${monthBranch} | ${yearBranch} |`);

  // Hidden stems row
  lines.push(`| Hidden Stems | ${formatHiddenStems(chart.hiddenStems.hour)} | ${formatHiddenStems(chart.hiddenStems.day)} | ${formatHiddenStems(chart.hiddenStems.month)} | ${formatHiddenStems(chart.hiddenStems.year)} |`);

  // Ten Gods row
  const pillarKeys: Array<'year' | 'month' | 'day' | 'hour'> = ['hour', 'day', 'month', 'year'];
  const tenGodRow = pillarKeys.map(key => {
    if (key === 'day') return 'Self (본인)';
    const pillar = chart.fourPillars[key];
    if (!pillar) return '-';
    const tenGodKey = `${key}Stem`;
    const tg = chart.tenGods[tenGodKey];
    if (!tg) return '-';
    const info = TEN_GOD_INFO[tg];
    return info ? `${info.korean} (${info.english})` : String(tg);
  });
  lines.push(`| Ten God (십신) | ${tenGodRow.join(' | ')} |`);

  // Life Stages row
  const lifeStageRow = pillarKeys.map(key => {
    const ls = chart.lifeStages[key];
    return ls ?? '-';
  });
  lines.push(`| Life Stage (십이운성) | ${lifeStageRow.join(' | ')} |`);

  // Day Master identity
  lines.push('');
  lines.push('DAY MASTER (일간):');
  lines.push(`- Element: ${chart.dayMaster.element} (${chart.dayMaster.yinYang})`);
  lines.push(`- Stem: ${chart.dayMaster.korean} (${chart.dayMaster.hanja}) - ${chart.dayMaster.nature}`);
  lines.push(`- Strength: ${formatStrength(chart.dayMasterStrength)}`);
  lines.push(`- Support Score: ${chart.supportScore.toFixed(1)} | Drain Score: ${chart.drainScore.toFixed(1)}`);
  lines.push(`- Useful God (용신): ${chart.usefulGod}`);
  lines.push(`- Jealousy God (기신): ${chart.jealousyGod}`);

  // Element balance
  lines.push('');
  lines.push('ELEMENT BALANCE (오행 점수):');
  lines.push(`- Wood (목): ${chart.elementBalance.wood.toFixed(1)}`);
  lines.push(`- Fire (화): ${chart.elementBalance.fire.toFixed(1)}`);
  lines.push(`- Earth (토): ${chart.elementBalance.earth.toFixed(1)}`);
  lines.push(`- Metal (금): ${chart.elementBalance.metal.toFixed(1)}`);
  lines.push(`- Water (수): ${chart.elementBalance.water.toFixed(1)}`);

  // Chart pattern
  lines.push('');
  lines.push(`CHART PATTERN (격국): ${chart.chartPattern} (${chart.chartPatternKorean})`);

  // Combinations
  if (chart.combinations.length > 0) {
    lines.push('');
    lines.push('COMBINATIONS (합):');
    chart.combinations.forEach((c: Combination) => {
      lines.push(`- ${c.type}: ${c.elements.join(' + ')} ${c.transforms ? `-> transforms to ${c.result}` : '(no transform)'} - ${c.description}`);
    });
  }

  // Clashes
  if (chart.clashes.length > 0) {
    lines.push('');
    lines.push('CLASHES (충/형/해/파):');
    chart.clashes.forEach((c: Clash) => {
      lines.push(`- ${c.type} [severity ${c.severity}/10]: ${c.elements.join(' vs ')} (${c.positions.join('-')}) - ${c.description}`);
    });
  }

  // Special stars
  if (chart.specialStars.length > 0) {
    lines.push('');
    lines.push('SPECIAL STARS (신살):');
    chart.specialStars.forEach((s: SpecialStar) => {
      lines.push(`- ${s.korean} (${s.name}) [${s.pillar} pillar, ${s.strength}]: ${s.meaning}`);
    });
  }

  // Luck cycles
  if (chart.luckCycles.length > 0) {
    lines.push('');
    lines.push(`LUCK CYCLES (대운) - Direction: ${chart.luckDirection}, Start Age: ${chart.luckStartAge}:`);
    chart.luckCycles.forEach((lc: LuckCycle) => {
      const stemInfo = TEN_GOD_INFO[lc.stemTenGod];
      const branchInfo = TEN_GOD_INFO[lc.branchMainTenGod];
      lines.push(`- Cycle ${lc.index + 1}: Age ${lc.ageStart}-${lc.ageEnd} | ${lc.pillar.stem.korean}${lc.pillar.branch.korean} (${lc.pillar.stem.hanja}${lc.pillar.branch.hanja}) | Stem: ${stemInfo?.korean ?? ''} (${stemInfo?.english ?? ''}) | Branch: ${branchInfo?.korean ?? ''} (${branchInfo?.english ?? ''})`);
    });
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Partner chart section (for compatibility)
// ---------------------------------------------------------------------------

function buildPartnerChartSection(chart: ChartAnalysis, language: Language): string {
  const header = language === 'ko' ? 'PARTNER CHART (상대방 사주):' : 'PARTNER CHART (Person B):';
  // Reuse the same chart formatting
  const chartData = buildChartDataSection(chart, language);
  return `${header}\n\n${chartData.replace('CHART DATA (사주팔자):', 'PERSON B CHART DATA:')}`;
}

// ---------------------------------------------------------------------------
// Reading type instructions
// ---------------------------------------------------------------------------

function getReadingInstructions(readingType: ReadingType, language: Language, options?: ReadingOptions): string {
  switch (readingType) {
    case 'personality':
      return personalityInstructions(language);
    case 'career':
      return careerInstructions(language);
    case 'love':
      return relationshipInstructions(language);
    case 'health':
      return healthInstructions(language);
    case 'annual':
      if (!options?.targetYear) throw new Error('targetYear is required for annual forecast');
      return annualForecastInstructions(language, options.targetYear);
    case 'monthly':
      if (!options?.targetYear) throw new Error('targetYear is required for monthly forecast');
      return monthlyForecastInstructions(language, options.targetYear);
    case 'compatibility':
      return compatibilityInstructions(language);
    case 'full':
      return fullReadingInstructions(language);
    case 'quick':
      return quickReadingInstructions(language);
    default: {
      const _exhaustive: never = readingType;
      throw new Error(`Unknown reading type: ${_exhaustive}`);
    }
  }
}

function quickReadingInstructions(language: Language): string {
  const label = language === 'ko' ? '간단 운세' : language === 'vi' ? 'Xem Nhanh' : 'Quick Reading';

  return `READING TYPE: ${label} (QUICK OVERVIEW)

Provide a concise but insightful overview of the person's saju chart. Cover:
1. Day Master identity in one compelling sentence
2. Top 3 strengths from the chart
3. Top 2 challenges or blind spots
4. Current life phase (based on approximate age from luck cycles)
5. One key piece of advice

Total length: 200-300 words. Be punchy and memorable.`;
}

// ---------------------------------------------------------------------------
// Language instructions
// ---------------------------------------------------------------------------

function buildLanguageInstructions(language: Language): string {
  switch (language) {
    case 'ko':
      return `LANGUAGE: Korean (한국어)
- Write entirely in Korean
- Use formal 존댓말 throughout
- Use proper Korean saju terminology (십신, 오행, 격국, etc.)
- Include hanja in parentheses for key terms on first use
- Keep the warm but authoritative tone of a respected 사주 선생님`;
    case 'vi':
      return `LANGUAGE: Vietnamese (Tieng Viet)
- Write entirely in Vietnamese
- Use respectful and culturally sensitive language
- Korean saju terms should be translated to Vietnamese equivalents where they exist (e.g., Tu Tru = 四柱, Ngu Hanh = 五行)
- Include original Korean/Chinese terms in parentheses for reference
- Be mindful that Vietnamese readers may be more familiar with Chinese astrology concepts`;
    case 'en':
      return `LANGUAGE: English
- Write in accessible but evocative English
- Include Korean terms in parentheses for authenticity (e.g., "Day Master (일간)")
- Use metaphorical language that brings the elements to life
- Maintain a tone that is mystical but grounded, never vague`;
    default:
      return 'LANGUAGE: English';
  }
}

// ---------------------------------------------------------------------------
// Quality directive
// ---------------------------------------------------------------------------

function buildQualityDirective(): string {
  return `QUALITY REQUIREMENTS:
- Be specific. Reference exact stems, branches, and their interactions by name
- Avoid generic astrology statements that could apply to anyone
- Every sentence should be grounded in this person's actual chart data
- When mentioning a Ten God, name which stem produces it and in which pillar
- When mentioning an element balance issue, cite the actual scores
- When discussing timing, reference specific luck cycle age ranges
- Use the chart data provided above. Do not fabricate additional chart elements
- Write in clear sections with headers using markdown ## format`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatStem(korean: string, hanja: string): string {
  return `${korean} (${hanja})`;
}

function formatBranch(branch: { korean: string; hanja: string; animal: string }): string {
  return `${branch.korean} (${branch.hanja}, ${branch.animal})`;
}

function formatHiddenStems(stems: HiddenStem[]): string {
  if (stems.length === 0) return '-';
  return stems.map(s => `${s.stem.hanja}(${s.type[0]}${s.weight})`).join(', ');
}

function formatStrength(strength: string): string {
  const map: Record<string, string> = {
    extremely_strong: 'Extremely Strong (극강)',
    strong: 'Strong (강)',
    neutral: 'Neutral (중)',
    weak: 'Weak (약)',
    extremely_weak: 'Extremely Weak (극약)',
  };
  return map[strength] ?? strength;
}
