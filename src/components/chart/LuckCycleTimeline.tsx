'use client';

import { useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LuckCycle, Element } from '@/engine/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LuckCycleTimelineProps {
  luckCycles: LuckCycle[];
  birthYear: number;
}

// ---------------------------------------------------------------------------
// Element color mapping
// ---------------------------------------------------------------------------

const ELEMENT_BG: Record<Element, string> = {
  Wood: 'bg-green-500/15 border-green-500/30',
  Fire: 'bg-red-500/15 border-red-500/30',
  Earth: 'bg-amber-500/15 border-amber-500/30',
  Metal: 'bg-gray-500/15 border-gray-500/30',
  Water: 'bg-blue-500/15 border-blue-500/30',
};

const ELEMENT_TEXT: Record<Element, string> = {
  Wood: 'text-green-700 dark:text-green-400',
  Fire: 'text-red-700 dark:text-red-400',
  Earth: 'text-amber-700 dark:text-amber-400',
  Metal: 'text-gray-700 dark:text-gray-400',
  Water: 'text-blue-700 dark:text-blue-400',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LuckCycleTimeline({ luckCycles, birthYear }: LuckCycleTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Determine current age and which cycle is active
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear;

  const currentCycleIndex = useMemo(() => {
    return luckCycles.findIndex(
      (lc) => currentAge >= lc.ageStart && currentAge <= lc.ageEnd
    );
  }, [luckCycles, currentAge]);

  if (luckCycles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Luck Cycles (대운)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No luck cycles available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Luck Cycles (대운)</CardTitle>
        <p className="text-xs text-muted-foreground">
          Each cycle spans 10 years. Current age: {currentAge}
        </p>
      </CardHeader>
      <CardContent className="p-3">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {luckCycles.map((cycle, idx) => {
            const isCurrent = idx === currentCycleIndex;
            const isPast = currentAge > cycle.ageEnd;
            const stemElement = cycle.pillar.stem.element;
            const bgClass = ELEMENT_BG[stemElement];
            const textClass = ELEMENT_TEXT[stemElement];

            return (
              <div
                key={idx}
                className={`
                  snap-start flex-shrink-0 w-[140px] sm:w-[160px]
                  rounded-lg border p-3 transition-all
                  ${bgClass}
                  ${isPast ? 'opacity-50' : ''}
                  ${isCurrent ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : ''}
                `}
              >
                {/* Age range */}
                <div className="text-center mb-2">
                  <div className="text-sm font-bold text-foreground">
                    {cycle.ageStart}-{cycle.ageEnd}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {birthYear + cycle.ageStart}-{birthYear + cycle.ageEnd}
                  </div>
                </div>

                {/* NOW badge */}
                {isCurrent && (
                  <div className="flex justify-center mb-2">
                    <Badge className="animate-pulse text-[10px] py-0 px-2">NOW</Badge>
                  </div>
                )}

                {/* Stem + Branch characters */}
                <div className="text-center mb-2">
                  <span className={`text-2xl font-bold ${textClass}`}>
                    {cycle.pillar.stem.hanja}{cycle.pillar.branch.hanja}
                  </span>
                  <div className={`text-xs ${textClass}`}>
                    {cycle.pillar.stem.korean}{cycle.pillar.branch.korean}
                  </div>
                </div>

                {/* Ten Gods */}
                <div className="flex flex-col items-center gap-1 text-[10px]">
                  <Badge variant="secondary" className="text-[10px] py-0">
                    {cycle.stemTenGod}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] py-0">
                    {cycle.branchMainTenGod}
                  </Badge>
                </div>

                {/* Themes */}
                {cycle.themes.length > 0 && (
                  <div className="mt-2 text-[10px] text-muted-foreground text-center leading-tight">
                    {cycle.themes.slice(0, 2).join(', ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
