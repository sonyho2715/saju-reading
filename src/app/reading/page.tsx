import type { Metadata } from 'next';
import { Suspense } from 'react';
import ReadingFlow from './ReadingFlow';

export const metadata: Metadata = {
  title: 'Saju Reading - Calculate Your Four Pillars',
  description: 'Enter your birth data to calculate your Korean Four Pillars of Destiny (Saju) chart and receive an AI-powered reading.',
};

export default function ReadingPage() {
  return (
    <Suspense fallback={<ReadingPageSkeleton />}>
      <ReadingFlow />
    </Suspense>
  );
}

function ReadingPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-2/3 mx-auto" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
