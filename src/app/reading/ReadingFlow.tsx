'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BirthForm, { type BirthFormData } from '@/components/input/BirthForm';
import FourPillarsDisplay from '@/components/chart/FourPillarsDisplay';
import ElementChart from '@/components/chart/ElementChart';
import SpecialStarsBadges from '@/components/chart/SpecialStarsBadges';
import CombinationDisplay from '@/components/chart/CombinationDisplay';
import LuckCycleTimeline from '@/components/chart/LuckCycleTimeline';
import LoadingOracle from '@/components/shared/LoadingOracle';
import ReadingSection from '@/components/reading/ReadingSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ChartAnalysis } from '@/engine/types';
import type { ReadingSection as ReadingSectionType } from '@/lib/reading-generator';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface ReadingTypeOption {
  type: string;
  label: string;
  korean: string;
  description: string;
  credits: number;
  icon: string;
}

const READING_TYPES: ReadingTypeOption[] = [
  { type: 'quick', label: 'Quick Reading', korean: '간단 풀이', description: 'A brief overview of your chart highlights and day master analysis.', credits: 0, icon: 'sparkles' },
  { type: 'personality', label: 'Personality', korean: '성격 분석', description: 'Deep dive into your character, strengths, weaknesses, and hidden talents.', credits: 1, icon: 'user' },
  { type: 'career', label: 'Career & Wealth', korean: '직업과 재물', description: 'Career aptitude, wealth potential, and ideal professional paths.', credits: 1, icon: 'briefcase' },
  { type: 'love', label: 'Love & Relationships', korean: '연애 운세', description: 'Romantic tendencies, ideal partner profile, and relationship dynamics.', credits: 1, icon: 'heart' },
  { type: 'health', label: 'Health', korean: '건강 운세', description: 'Health tendencies based on elemental balance and vulnerable areas.', credits: 1, icon: 'activity' },
  { type: 'annual', label: 'Annual Forecast', korean: '올해 운세', description: 'Month-by-month forecast for the current year based on your chart.', credits: 2, icon: 'calendar' },
];

const READING_ICONS: Record<string, string> = {
  quick: '\u2728',
  personality: '\uD83D\uDE4E',
  career: '\uD83D\uDCBC',
  love: '\u2764\uFE0F',
  health: '\uD83C\uDF3F',
  annual: '\uD83D\uDCC5',
};

const SECTION_ICONS: Record<string, string> = {
  intro: '\uD83D\uDD2E',
  'day-master': '\u2600\uFE0F',
  personality: '\uD83C\uDFAD',
  strengths: '\uD83D\uDCAA',
  weaknesses: '\u26A0\uFE0F',
  career: '\uD83D\uDCBC',
  wealth: '\uD83D\uDCB0',
  love: '\u2764\uFE0F',
  relationships: '\uD83E\uDD1D',
  health: '\uD83C\uDF3F',
  forecast: '\uD83D\uDCC5',
  advice: '\uD83D\uDCA1',
  reading: '\uD83D\uDD2E',
  conclusion: '\u2728',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ReadingFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialStep = (parseInt(searchParams.get('step') ?? '1') || 1) as Step;

  const [step, setStep] = useState<Step>(initialStep > 6 ? 1 : initialStep);
  const [chartData, setChartData] = useState<ChartAnalysis | null>(null);
  const [selectedReadingType, setSelectedReadingType] = useState('');
  const [readingText, setReadingText] = useState('');
  const [readingSections, setReadingSections] = useState<ReadingSectionType[]>([]);
  const [error, setError] = useState('');
  const [calcProgress, setCalcProgress] = useState(0);
  const [birthYear, setBirthYear] = useState(1990);

  const streamRef = useRef<boolean>(false);

  // Update URL when step changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('step', String(step));
    router.replace(`/reading?${params.toString()}`, { scroll: false });
  }, [step, router]);

  // ---------------------------------------------------------------------------
  // Step 1 -> 2: Calculate chart
  // ---------------------------------------------------------------------------
  const handleBirthSubmit = useCallback(async (formData: BirthFormData) => {
    setError('');
    setStep(2);
    setCalcProgress(0);
    setBirthYear(formData.year);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setCalcProgress((prev) => Math.min(prev + Math.random() * 15, 90));
    }, 300);

    try {
      const birthDate = `${formData.year}-${String(formData.month).padStart(2, '0')}-${String(formData.day).padStart(2, '0')}`;
      let birthTime: string | null = null;
      if (formData.birthTimeKnown && formData.hour !== undefined && formData.minute !== undefined) {
        birthTime = `${String(formData.hour).padStart(2, '0')}:${String(formData.minute).padStart(2, '0')}`;
      }

      const res = await fetch('/api/chart/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate,
          birthTime,
          gender: formData.gender,
          calendarType: formData.calendarType,
          isLeapMonth: formData.isLeapMonth,
        }),
      });

      const result = await res.json();

      clearInterval(progressInterval);
      setCalcProgress(100);

      if (!result.success) {
        setError(result.error ?? 'Failed to calculate chart');
        setStep(1);
        return;
      }

      setChartData(result.data);
      setTimeout(() => setStep(3), 500);
    } catch {
      clearInterval(progressInterval);
      setError('Network error. Please try again.');
      setStep(1);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Step 4 -> 5: Generate reading
  // ---------------------------------------------------------------------------
  const handleReadingSelect = useCallback(async (type: string) => {
    if (!chartData) return;
    setSelectedReadingType(type);
    setReadingText('');
    setReadingSections([]);
    setError('');
    setStep(5);
    streamRef.current = true;

    try {
      const lang = typeof window !== 'undefined' ? localStorage.getItem('saju-lang') ?? 'en' : 'en';

      const res = await fetch('/api/reading/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chartData,
          readingType: type,
          language: lang,
          options: type === 'annual' ? { targetYear: new Date().getFullYear() } : undefined,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        setError(errBody?.error ?? 'Failed to generate reading');
        setStep(4);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError('Streaming not supported');
        setStep(4);
        return;
      }

      const decoder = new TextDecoder();
      let fullText = '';

      while (streamRef.current) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6);
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.token) {
              fullText += parsed.token;
              setReadingText(fullText);
            }
            if (parsed.done) {
              streamRef.current = false;
            }
            if (parsed.error) {
              setError(parsed.error);
              streamRef.current = false;
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }

      // Parse completed text into sections
      const sections = parseTextIntoSections(fullText);
      setReadingSections(sections);
      setStep(6);
    } catch {
      setError('Network error during reading generation');
      setStep(4);
    }
  }, [chartData]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-background">
      {/* Progress indicator */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    s <= step
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  } ${s === step ? 'ring-2 ring-primary/50 ring-offset-2' : ''}`}
                >
                  {s}
                </div>
                {s < 6 && (
                  <div
                    className={`w-6 sm:w-12 h-0.5 ${
                      s < step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-md bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Birth Form */}
        {step === 1 && (
          <div className="max-w-lg mx-auto">
            <BirthForm onSubmit={handleBirthSubmit} />
          </div>
        )}

        {/* Step 2: Calculating */}
        {step === 2 && (
          <LoadingOracle
            message="Calculating your Four Pillars..."
            showProgress
            progress={calcProgress}
          />
        )}

        {/* Step 3: Chart Display */}
        {step === 3 && chartData && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Your Saju Chart</h2>
              <p className="text-muted-foreground">
                Day Master: {chartData.dayMaster.korean} ({chartData.dayMaster.hanja}) - {chartData.dayMaster.element} {chartData.dayMaster.yinYang}
              </p>
            </div>

            <FourPillarsDisplay
              fourPillars={chartData.fourPillars}
              tenGods={chartData.tenGods}
              lifeStages={chartData.lifeStages}
              dayMaster={chartData.dayMaster}
              hiddenStems={chartData.hiddenStems}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ElementChart
                elementBalance={chartData.elementBalance}
                usefulGod={chartData.usefulGod}
              />
              <SpecialStarsBadges specialStars={chartData.specialStars} />
            </div>

            <CombinationDisplay
              combinations={chartData.combinations}
              clashes={chartData.clashes}
            />

            <LuckCycleTimeline
              luckCycles={chartData.luckCycles}
              birthYear={birthYear}
            />

            <div className="flex justify-center pt-4">
              <Button size="lg" onClick={() => setStep(4)}>
                Get Your Reading
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Select Reading Type */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Choose Your Reading</h2>
              <p className="text-muted-foreground">
                Select the type of insight you want from your chart
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {READING_TYPES.map((rt) => (
                <Card
                  key={rt.type}
                  className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                  onClick={() => handleReadingSelect(rt.type)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        <span className="mr-2">{READING_ICONS[rt.type] ?? '\uD83D\uDD2E'}</span>
                        {rt.label}
                      </CardTitle>
                      <Badge variant={rt.credits === 0 ? 'default' : 'secondary'} className="text-xs">
                        {rt.credits === 0 ? 'Free' : `${rt.credits} credit${rt.credits > 1 ? 's' : ''}`}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{rt.korean}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{rt.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back to Chart
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Streaming Reading */}
        {step === 5 && (
          <div className="max-w-3xl mx-auto space-y-6">
            <LoadingOracle message="The Oracle is reading your chart..." />

            {readingText && (
              <Card>
                <CardContent className="pt-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {readingText.split('\n').map((line, i) => {
                      if (line.startsWith('## ') || line.startsWith('### ')) {
                        return <h3 key={i} className="text-lg font-bold mt-4 mb-2">{line.replace(/^#{2,3}\s*/, '')}</h3>;
                      }
                      if (!line.trim()) return <br key={i} />;
                      return <p key={i} className="text-sm text-muted-foreground leading-relaxed">{line}</p>;
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 6: Reading Results */}
        {step === 6 && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">
                {READING_ICONS[selectedReadingType] ?? '\uD83D\uDD2E'}{' '}
                {READING_TYPES.find((r) => r.type === selectedReadingType)?.label ?? 'Your Reading'}
              </h2>
              {chartData && (
                <p className="text-muted-foreground">
                  Day Master: {chartData.dayMaster.korean} ({chartData.dayMaster.hanja})
                </p>
              )}
            </div>

            <div className="space-y-3">
              {readingSections.map((section, idx) => (
                <ReadingSection
                  key={idx}
                  title={section.title}
                  icon={SECTION_ICONS[section.sectionType] ?? '\uD83D\uDD2E'}
                  content={section.content}
                  defaultExpanded={idx === 0}
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button variant="outline" onClick={() => setStep(4)}>
                Try Another Reading
              </Button>
              <Button variant="outline" onClick={() => setStep(3)}>
                View Chart
              </Button>
              <Button onClick={() => { setStep(1); setChartData(null); }}>
                New Chart
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper: Parse raw text into sections
// ---------------------------------------------------------------------------

function parseTextIntoSections(rawText: string): ReadingSectionType[] {
  const sections: ReadingSectionType[] = [];
  const lines = rawText.split('\n');
  let currentTitle = '';
  let currentContent: string[] = [];
  let sectionIndex = 0;

  for (const line of lines) {
    const headerMatch = line.match(/^#{2,3}\s+(?:\d+\.\s*)?(.+)$/);
    if (headerMatch) {
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

  if (currentTitle || currentContent.length > 0) {
    sections.push({
      title: currentTitle || (sections.length === 0 ? 'Reading' : 'Conclusion'),
      content: currentContent.join('\n').trim(),
      sectionType: slugify(currentTitle || 'conclusion'),
    });
  }

  if (sections.length === 0) {
    sections.push({
      title: 'Reading',
      content: rawText.trim(),
      sectionType: 'reading',
    });
  }

  return sections;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50) || 'section';
}
