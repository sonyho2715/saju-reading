'use client';

import { useState, useCallback, useRef } from 'react';
import BirthForm, { type BirthFormData } from '@/components/input/BirthForm';
import LoadingOracle from '@/components/shared/LoadingOracle';
import ReadingSection from '@/components/reading/ReadingSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ChartAnalysis } from '@/engine/types';
import type { ReadingSection as ReadingSectionType } from '@/lib/reading-generator';

type Phase = 'input' | 'calculating' | 'results';

function formatBirthDate(fd: BirthFormData): string {
  return `${fd.year}-${String(fd.month).padStart(2, '0')}-${String(fd.day).padStart(2, '0')}`;
}

function formatBirthTime(fd: BirthFormData): string | null {
  if (!fd.birthTimeKnown || fd.hour === undefined || fd.minute === undefined) return null;
  return `${String(fd.hour).padStart(2, '0')}:${String(fd.minute).padStart(2, '0')}`;
}

export default function CompatibilityPage() {
  const [phase, setPhase] = useState<Phase>('input');
  const [personAData, setPersonAData] = useState<BirthFormData | null>(null);
  const [personBData, setPersonBData] = useState<BirthFormData | null>(null);
  const [chartA, setChartA] = useState<ChartAnalysis | null>(null);
  const [chartB, setChartB] = useState<ChartAnalysis | null>(null);
  const [readingText, setReadingText] = useState('');
  const [readingSections, setReadingSections] = useState<ReadingSectionType[]>([]);
  const [compatScore, setCompatScore] = useState<number | null>(null);
  const [error, setError] = useState('');

  const streamRef = useRef(false);

  const calculateCompatibility = useCallback(async () => {
    if (!personAData || !personBData) return;
    setError('');
    setPhase('calculating');
    setReadingText('');
    setReadingSections([]);
    setCompatScore(null);
    streamRef.current = true;

    try {
      // Calculate both charts
      const [resA, resB] = await Promise.all([
        fetch('/api/chart/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            birthDate: formatBirthDate(personAData),
            birthTime: formatBirthTime(personAData),
            gender: personAData.gender,
            calendarType: personAData.calendarType,
            isLeapMonth: personAData.isLeapMonth,
          }),
        }),
        fetch('/api/chart/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            birthDate: formatBirthDate(personBData),
            birthTime: formatBirthTime(personBData),
            gender: personBData.gender,
            calendarType: personBData.calendarType,
            isLeapMonth: personBData.isLeapMonth,
          }),
        }),
      ]);

      const resultA = await resA.json();
      const resultB = await resB.json();

      if (!resultA.success || !resultB.success) {
        setError('Failed to calculate one or both charts');
        setPhase('input');
        return;
      }

      setChartA(resultA.data);
      setChartB(resultB.data);

      // Generate compatibility reading
      const lang = typeof window !== 'undefined' ? localStorage.getItem('saju-lang') ?? 'en' : 'en';
      const readingRes = await fetch('/api/reading/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chartData: resultA.data,
          readingType: 'compatibility',
          language: lang,
          options: {
            specificQuestion: `Partner chart data: Day Master ${resultB.data.dayMaster.korean} (${resultB.data.dayMaster.hanja}), Element Balance: Wood=${resultB.data.elementBalance.wood}, Fire=${resultB.data.elementBalance.fire}, Earth=${resultB.data.elementBalance.earth}, Metal=${resultB.data.elementBalance.metal}, Water=${resultB.data.elementBalance.water}`,
          },
        }),
      });

      if (!readingRes.ok) {
        setError('Failed to generate compatibility reading');
        setPhase('input');
        return;
      }

      const reader = readingRes.body?.getReader();
      if (!reader) {
        setError('Streaming not supported');
        setPhase('input');
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
          try {
            const parsed = JSON.parse(line.slice(6));
            if (parsed.token) {
              fullText += parsed.token;
              setReadingText(fullText);
            }
            if (parsed.done) streamRef.current = false;
            if (parsed.error) {
              setError(parsed.error);
              streamRef.current = false;
            }
          } catch {
            // Skip
          }
        }
      }

      // Parse sections and extract a score
      const sections = parseIntoSections(fullText);
      setReadingSections(sections);

      // Try to extract score from text (look for patterns like "Score: 78" or "78/100")
      const scoreMatch = fullText.match(/(\d{1,3})\s*\/\s*100|score[:\s]+(\d{1,3})/i);
      if (scoreMatch) {
        const extracted = parseInt(scoreMatch[1] ?? scoreMatch[2]);
        if (extracted >= 0 && extracted <= 100) {
          setCompatScore(extracted);
        }
      }

      setPhase('results');
    } catch {
      setError('Network error. Please try again.');
      setPhase('input');
    }
  }, [personAData, personBData]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Compatibility Analysis</h1>
          <p className="text-muted-foreground">
            Compare two charts to discover relationship dynamics
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-md bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {phase === 'input' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-center mb-4">Person A</h3>
                <BirthForm
                  onSubmit={(data) => setPersonAData(data)}
                  isLoading={false}
                />
                {personAData && (
                  <div className="mt-2 text-center">
                    <Badge variant="outline" className="text-green-600 border-green-500/30">
                      Data entered
                    </Badge>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-center mb-4">Person B</h3>
                <BirthForm
                  onSubmit={(data) => setPersonBData(data)}
                  isLoading={false}
                />
                {personBData && (
                  <div className="mt-2 text-center">
                    <Badge variant="outline" className="text-green-600 border-green-500/30">
                      Data entered
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={calculateCompatibility}
                disabled={!personAData || !personBData}
              >
                Calculate Compatibility
              </Button>
            </div>
          </div>
        )}

        {phase === 'calculating' && (
          <div className="space-y-6">
            <LoadingOracle message="Analyzing compatibility between the two charts..." />
            {readingText && (
              <Card className="max-w-3xl mx-auto">
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {readingText}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {phase === 'results' && (
          <div className="space-y-8 max-w-3xl mx-auto">
            {/* Score meter */}
            {compatScore !== null && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <h3 className="text-lg font-semibold">Compatibility Score</h3>
                    <div className="text-5xl font-bold text-primary">{compatScore}/100</div>
                    <div className="w-full h-4 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${compatScore}%`,
                          background: compatScore >= 70
                            ? 'linear-gradient(to right, #22c55e, #16a34a)'
                            : compatScore >= 40
                              ? 'linear-gradient(to right, #f59e0b, #d97706)'
                              : 'linear-gradient(to right, #ef4444, #dc2626)',
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {compatScore >= 80 ? 'Excellent harmony'
                        : compatScore >= 60 ? 'Good compatibility with some growth areas'
                          : compatScore >= 40 ? 'Moderate compatibility, requires understanding'
                            : 'Challenging pairing, but awareness helps'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mini charts side by side */}
            {chartA && chartB && (
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Person A</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{chartA.dayMaster.hanja}</div>
                      <p className="text-xs text-muted-foreground">
                        {chartA.dayMaster.korean} - {chartA.dayMaster.element} {chartA.dayMaster.yinYang}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Person B</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{chartB.dayMaster.hanja}</div>
                      <p className="text-xs text-muted-foreground">
                        {chartB.dayMaster.korean} - {chartB.dayMaster.element} {chartB.dayMaster.yinYang}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Reading sections */}
            <div className="space-y-3">
              {readingSections.map((section, idx) => (
                <ReadingSection
                  key={idx}
                  title={section.title}
                  icon={idx === 0 ? '\u2764\uFE0F' : '\uD83D\uDD2E'}
                  content={section.content}
                  defaultExpanded={idx === 0}
                />
              ))}
            </div>

            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setPhase('input');
                  setPersonAData(null);
                  setPersonBData(null);
                }}
              >
                New Comparison
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function parseIntoSections(rawText: string): ReadingSectionType[] {
  const sections: ReadingSectionType[] = [];
  const lines = rawText.split('\n');
  let currentTitle = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    const headerMatch = line.match(/^#{2,3}\s+(?:\d+\.\s*)?(.+)$/);
    if (headerMatch) {
      if (currentTitle || currentContent.length > 0) {
        sections.push({
          title: currentTitle || 'Overview',
          content: currentContent.join('\n').trim(),
          sectionType: 'section',
        });
      }
      currentTitle = headerMatch[1].trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  if (currentTitle || currentContent.length > 0) {
    sections.push({
      title: currentTitle || 'Analysis',
      content: currentContent.join('\n').trim(),
      sectionType: 'section',
    });
  }

  if (sections.length === 0) {
    sections.push({ title: 'Compatibility Analysis', content: rawText.trim(), sectionType: 'section' });
  }

  return sections;
}
