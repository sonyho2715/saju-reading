import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getReading, getChart } from '@/lib/db';
import ReadingSection from '@/components/reading/ReadingSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ReadingPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ReadingPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Saju Reading #${id.slice(0, 8)} - Four Pillars of Destiny`,
    description: 'Your personalized Korean Saju reading powered by AI.',
  };
}

const READING_TYPE_LABELS: Record<string, string> = {
  quick: 'Quick Reading',
  personality: 'Personality Analysis',
  career: 'Career & Wealth',
  love: 'Love & Relationships',
  health: 'Health Reading',
  annual: 'Annual Forecast',
  monthly: 'Monthly Forecast',
  compatibility: 'Compatibility',
  full: 'Full Reading',
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
  health: '\uD83C\uDF3F',
  forecast: '\uD83D\uDCC5',
  advice: '\uD83D\uDCA1',
  reading: '\uD83D\uDD2E',
  conclusion: '\u2728',
};

export default async function SavedReadingPage({ params }: ReadingPageProps) {
  const { id } = await params;

  let reading;
  try {
    reading = await getReading(id);
  } catch {
    notFound();
  }

  if (!reading) notFound();

  // Parse content
  const content = reading.content as {
    sections?: { title: string; content: string; sectionType: string }[];
    rawText?: string;
  } | null;

  const sections = content?.sections ?? [];
  const readingTypeLabel = READING_TYPE_LABELS[reading.reading_type] ?? reading.reading_type;

  // Try to get chart info
  let chartInfo: { pattern: string | null; strength: string } | null = null;
  if (reading.chart_id) {
    try {
      const chart = await getChart(reading.chart_id);
      if (chart) {
        chartInfo = {
          pattern: chart.chart_pattern,
          strength: chart.day_master_strength,
        };
      }
    } catch {
      // Chart lookup is non-critical
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-2">
            {readingTypeLabel}
          </Badge>
          <h1 className="text-3xl font-bold mb-2">Your Saju Reading</h1>
          <p className="text-muted-foreground text-sm">
            Generated on {new Date(reading.created_at).toLocaleDateString()}
            {reading.language !== 'en' && ` | Language: ${reading.language.toUpperCase()}`}
          </p>
          {chartInfo && (
            <p className="text-xs text-muted-foreground mt-1">
              Pattern: {chartInfo.pattern ?? 'N/A'} | Strength: {chartInfo.strength}
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 space-y-3">
            {sections.length > 0 ? (
              sections.map((section, idx) => (
                <ReadingSection
                  key={idx}
                  title={section.title}
                  icon={SECTION_ICONS[section.sectionType] ?? '\uD83D\uDD2E'}
                  content={section.content}
                  defaultExpanded={idx === 0}
                />
              ))
            ) : content?.rawText ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {content.rawText}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">No reading content available.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar (desktop only) */}
          <aside className="hidden lg:block w-64 space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-semibold text-sm">Contents</h3>
                <nav className="space-y-1">
                  {sections.map((section, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-default py-1"
                    >
                      {SECTION_ICONS[section.sectionType] ?? '\uD83D\uDD2E'} {section.title}
                    </div>
                  ))}
                </nav>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-semibold text-sm">Go Deeper</h3>
                <p className="text-xs text-muted-foreground">
                  Want more detailed insights? Upgrade to unlock full personality, career, and relationship readings.
                </p>
                <Link href="/pricing">
                  <Button size="sm" className="w-full">
                    Upgrade Plan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 pt-8 border-t">
          <Link href="/reading">
            <Button variant="outline">New Reading</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <Link href="/pricing">
            <Button>Get Deeper Reading</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
