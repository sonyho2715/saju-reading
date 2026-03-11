import { generateText, streamText } from './claude-client';
import { buildReadingPrompt } from '../engine/interpretation/prompt-builder';
import type { ReadingType, Language, ReadingOptions } from '../engine/interpretation/prompt-builder';
import type { ChartAnalysis } from '../engine/types';

export interface ReadingSection {
  title: string;
  content: string;
  sectionType: string;
}

export interface ReadingResult {
  sections: ReadingSection[];
  rawText: string;
  tokenCount: { input: number; output: number };
  readingType: string;
  language: string;
  generatedAt: Date;
}

// ---------------------------------------------------------------------------
// Max tokens by reading type
// ---------------------------------------------------------------------------

const MAX_TOKENS_BY_TYPE: Record<ReadingType, number> = {
  quick: 1024,
  personality: 2048,
  career: 2048,
  love: 2048,
  health: 2048,
  annual: 3072,
  monthly: 4096,
  compatibility: 3072,
  full: 6144,
};

// ---------------------------------------------------------------------------
// Generate a complete reading (non-streaming)
// ---------------------------------------------------------------------------

export async function generateReading(
  chart: ChartAnalysis,
  readingType: ReadingType,
  language: Language,
  options?: ReadingOptions
): Promise<ReadingResult> {
  const prompt = buildReadingPrompt(chart, readingType, language, options);
  const maxTokens = MAX_TOKENS_BY_TYPE[readingType] ?? 4096;

  const response = await generateText(prompt, { maxTokens });

  const sections = parseReadingIntoSections(response.text);

  return {
    sections,
    rawText: response.text,
    tokenCount: { input: response.inputTokens, output: response.outputTokens },
    readingType,
    language,
    generatedAt: new Date(),
  };
}

// ---------------------------------------------------------------------------
// Stream a reading (for real-time UI)
// ---------------------------------------------------------------------------

export async function streamReading(
  chart: ChartAnalysis,
  readingType: ReadingType,
  language: Language,
  onToken: (token: string) => void,
  options?: ReadingOptions
): Promise<ReadingResult> {
  const prompt = buildReadingPrompt(chart, readingType, language, options);
  const maxTokens = MAX_TOKENS_BY_TYPE[readingType] ?? 4096;

  return new Promise<ReadingResult>((resolve, reject) => {
    let fullText = '';

    streamText(prompt, {
      maxTokens,
      onToken: (token: string) => {
        fullText += token;
        onToken(token);
      },
      onComplete: (completedText: string) => {
        const sections = parseReadingIntoSections(completedText);
        resolve({
          sections,
          rawText: completedText,
          // Token counts are not available in streaming mode; use estimates
          tokenCount: { input: 0, output: 0 },
          readingType,
          language,
          generatedAt: new Date(),
        });
      },
      onError: (error: Error) => {
        reject(error);
      },
    }).catch(reject);
  });
}

// ---------------------------------------------------------------------------
// Parse markdown into sections
// ---------------------------------------------------------------------------

export function parseReadingIntoSections(rawText: string): ReadingSection[] {
  const sections: ReadingSection[] = [];
  const lines = rawText.split('\n');

  let currentTitle = '';
  let currentContent: string[] = [];
  let sectionIndex = 0;

  for (const line of lines) {
    // Match ## or ### headers
    const headerMatch = line.match(/^#{2,3}\s+(?:\d+\.\s*)?(.+)$/);
    if (headerMatch) {
      // Save previous section
      if (currentTitle || currentContent.length > 0) {
        sections.push({
          title: currentTitle || 'Introduction',
          content: currentContent.join('\n').trim(),
          sectionType: sectionIndex === 0 && !currentTitle ? 'intro' : slugify(currentTitle),
        });
        sectionIndex++;
      }
      currentTitle = headerMatch[1].trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // Push the last section
  if (currentTitle || currentContent.length > 0) {
    sections.push({
      title: currentTitle || (sections.length === 0 ? 'Reading' : 'Conclusion'),
      content: currentContent.join('\n').trim(),
      sectionType: slugify(currentTitle || 'conclusion'),
    });
  }

  // If no sections were parsed (no headers found), wrap everything as one section
  if (sections.length === 0) {
    sections.push({
      title: 'Reading',
      content: rawText.trim(),
      sectionType: 'reading',
    });
  }

  return sections;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50) || 'section';
}
