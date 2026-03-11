import type { ChartAnalysis } from '../types';
import type { ReadingType, Language, ReadingOptions } from './prompt-builder';
import { buildReadingPrompt } from './prompt-builder';
import { getDayPillarArchetype } from '../constants/sixty-pillars';
import type { DayPillarArchetype } from '../constants/sixty-pillars';

// ---------------------------------------------------------------------------
// Enhanced prompt builder that adds archetype data
// ---------------------------------------------------------------------------

export function buildEnhancedReadingPrompt(
  chart: ChartAnalysis,
  readingType: ReadingType,
  language: Language,
  options?: ReadingOptions
): string {
  // Start with the base prompt
  const basePrompt = buildReadingPrompt(chart, readingType, language, options);

  // Get archetypes
  const dayArchetype = getDayPillarArchetype(
    chart.fourPillars.day.stem.index,
    chart.fourPillars.day.branch.index
  );

  const monthArchetype = getDayPillarArchetype(
    chart.fourPillars.month.stem.index,
    chart.fourPillars.month.branch.index
  );

  const hourArchetype = chart.fourPillars.hour
    ? getDayPillarArchetype(
        chart.fourPillars.hour.stem.index,
        chart.fourPillars.hour.branch.index
      )
    : undefined;

  // Build archetype section
  const archetypeSection = buildArchetypeSection(
    dayArchetype,
    monthArchetype,
    hourArchetype,
    readingType,
    language
  );

  if (!archetypeSection) return basePrompt;

  // Insert archetype data after the chart data section (before reading instructions)
  const separator = '\n\n---\n\n';
  const parts = basePrompt.split(separator);

  // Insert after chart data (index 1 = chart data, or 2 if partner chart exists)
  const insertIndex = readingType === 'compatibility' && options?.partnerChart ? 3 : 2;
  parts.splice(insertIndex, 0, archetypeSection);

  return parts.join(separator);
}

// ---------------------------------------------------------------------------
// Build archetype section
// ---------------------------------------------------------------------------

function buildArchetypeSection(
  dayArchetype: DayPillarArchetype | undefined,
  monthArchetype: DayPillarArchetype | undefined,
  hourArchetype: DayPillarArchetype | undefined,
  readingType: ReadingType,
  language: Language
): string | null {
  if (!dayArchetype) return null;

  const lines: string[] = ['ARCHETYPE DATA (육십갑자 원형):'];

  // Day Pillar archetype (always included)
  lines.push('');
  lines.push(`DAY PILLAR ARCHETYPE (일주 원형): ${dayArchetype.hanja} ${dayArchetype.korean}`);
  lines.push(`- Archetype Name: ${dayArchetype.name}`);
  lines.push(`- Imagery: ${dayArchetype.imagery}`);
  lines.push(`- Core Identity: ${dayArchetype.coreIdentity}`);
  lines.push(`- Element Dynamic: ${dayArchetype.elementDynamic}`);
  lines.push(`- Life Theme: ${dayArchetype.lifeTheme}`);

  // Reading-type-specific archetype instructions
  switch (readingType) {
    case 'personality':
    case 'quick':
    case 'full':
      lines.push('');
      lines.push(buildPersonalityArchetypeInstruction(dayArchetype, language));
      break;

    case 'career':
      if (monthArchetype) {
        lines.push('');
        lines.push(`MONTH PILLAR ARCHETYPE (월주 원형): ${monthArchetype.hanja} ${monthArchetype.korean}`);
        lines.push(`- Archetype Name: ${monthArchetype.name}`);
        lines.push(`- Imagery: ${monthArchetype.imagery}`);
        lines.push(`- Core Identity: ${monthArchetype.coreIdentity}`);
        lines.push(`- Element Dynamic: ${monthArchetype.elementDynamic}`);
        lines.push('');
        lines.push('INSTRUCTION: Use the Month Pillar archetype to describe the person\'s professional identity and career style. The Day Pillar archetype shows who they are; the Month Pillar archetype shows how the world sees their professional contribution.');
      }
      break;

    case 'love':
      lines.push('');
      lines.push(buildLoveArchetypeInstruction(dayArchetype, language));
      break;

    default:
      break;
  }

  // Hour pillar archetype (if available, for full readings)
  if (hourArchetype && (readingType === 'full' || readingType === 'personality')) {
    lines.push('');
    lines.push(`HOUR PILLAR ARCHETYPE (시주 원형): ${hourArchetype.hanja} ${hourArchetype.korean}`);
    lines.push(`- Archetype Name: ${hourArchetype.name}`);
    lines.push(`- Life Theme: ${hourArchetype.lifeTheme}`);
    lines.push('INSTRUCTION: The Hour Pillar archetype reveals inner aspirations, legacy desires, and how they relate to children/projects.');
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Reading-type-specific archetype instructions
// ---------------------------------------------------------------------------

function buildPersonalityArchetypeInstruction(archetype: DayPillarArchetype, language: Language): string {
  const opening = language === 'ko'
    ? `INSTRUCTION: 분석을 다음과 같이 시작하세요: "당신은 '${archetype.name}' 원형입니다. ${archetype.imagery}." 그 다음 핵심 정체성을 사주 데이터와 연결하여 설명하세요.`
    : language === 'vi'
    ? `INSTRUCTION: Mo dau phan tich voi: "Ban la '${archetype.name}'. ${archetype.imagery}." Sau do ket noi ban chat nay voi du lieu tu tru.`
    : `INSTRUCTION: Open the reading with: "You are '${archetype.name}'. ${archetype.imagery}." Then connect this core identity to their actual chart data. The archetype sets the narrative frame; the chart data provides the evidence.`;
  return opening;
}

function buildLoveArchetypeInstruction(archetype: DayPillarArchetype, _language: Language): string {
  return `INSTRUCTION: The Day Pillar archetype directly describes how this person experiences intimate relationships. The Day Branch is the spouse palace.

Use "${archetype.name}" as the lens for understanding their love nature:
- The imagery ("${archetype.imagery}") suggests the emotional atmosphere they create in relationships
- The element dynamic ("${archetype.elementDynamic}") describes the internal energy they bring to partnership
- Their partner must complement this archetype energy

Describe what kind of partner would harmonize with "${archetype.name}" and what kind of partner would clash.`;
}
