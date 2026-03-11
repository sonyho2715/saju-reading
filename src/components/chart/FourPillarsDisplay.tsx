'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type {
  FourPillars,
  HeavenlyStem,
  TenGod,
  LifeStage,
  HiddenStem,
  Element,
  Pillar,
} from '@/engine/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PillarKey = 'year' | 'month' | 'day' | 'hour';
type TenGodMap = Record<string, TenGod>;
type LifeStageMap = Record<PillarKey, LifeStage | null>;

interface FourPillarsDisplayProps {
  fourPillars: FourPillars;
  tenGods: TenGodMap;
  lifeStages: LifeStageMap;
  dayMaster: HeavenlyStem;
  hiddenStems?: Record<PillarKey, HiddenStem[]>;
}

// ---------------------------------------------------------------------------
// Element color mapping
// ---------------------------------------------------------------------------

const ELEMENT_COLORS: Record<Element, { bg: string; text: string; border: string; chip: string }> = {
  Wood: { bg: 'bg-green-500/15', text: 'text-green-700 dark:text-green-400', border: 'border-green-500/30', chip: 'bg-green-500' },
  Fire: { bg: 'bg-red-500/15', text: 'text-red-700 dark:text-red-400', border: 'border-red-500/30', chip: 'bg-red-500' },
  Earth: { bg: 'bg-amber-500/15', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-500/30', chip: 'bg-amber-500' },
  Metal: { bg: 'bg-gray-500/15', text: 'text-gray-700 dark:text-gray-400', border: 'border-gray-500/30', chip: 'bg-gray-500' },
  Water: { bg: 'bg-blue-500/15', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-500/30', chip: 'bg-blue-500' },
};

const ANIMAL_EMOJI: Record<string, string> = {
  Rat: '🐀', Ox: '🐂', Tiger: '🐅', Rabbit: '🐇',
  Dragon: '🐉', Snake: '🐍', Horse: '🐴', Goat: '🐐',
  Monkey: '🐒', Rooster: '🐓', Dog: '🐕', Pig: '🐷',
};

const PILLAR_LABELS: Record<PillarKey, { korean: string; english: string }> = {
  year: { korean: '연주', english: 'Year' },
  month: { korean: '월주', english: 'Month' },
  day: { korean: '일주', english: 'Day' },
  hour: { korean: '시주', english: 'Hour' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FourPillarsDisplay({
  fourPillars,
  tenGods,
  lifeStages,
  dayMaster,
  hiddenStems,
}: FourPillarsDisplayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger mount animation
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Traditional Korean reading order: right to left = Hour, Day, Month, Year
  // But we display left to right visually with labels indicating the order
  const pillarOrder: PillarKey[] = ['hour', 'day', 'month', 'year'];

  return (
    <TooltipProvider delay={200}>
      <div className="w-full">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold">Four Pillars (사주팔자)</h3>
          <p className="text-xs text-muted-foreground">Read right to left in traditional Korean order</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {pillarOrder.map((key, idx) => {
            const pillar = fourPillars[key];
            const isDay = key === 'day';
            const isNull = pillar === null;

            return (
              <div
                key={key}
                className="transition-all duration-500 ease-out"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${idx * 100}ms`,
                }}
              >
                <PillarCard
                  pillarKey={key}
                  pillar={pillar}
                  isDay={isDay}
                  tenGods={tenGods}
                  lifeStage={lifeStages[key]}
                  dayMaster={dayMaster}
                  hiddenStems={hiddenStems?.[key] ?? []}
                />
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}

// ---------------------------------------------------------------------------
// Individual Pillar Card
// ---------------------------------------------------------------------------

interface PillarCardProps {
  pillarKey: PillarKey;
  pillar: Pillar | null;
  isDay: boolean;
  tenGods: TenGodMap;
  lifeStage: LifeStage | null;
  dayMaster: HeavenlyStem;
  hiddenStems: HiddenStem[];
}

function PillarCard({
  pillarKey,
  pillar,
  isDay,
  tenGods,
  lifeStage,
  dayMaster,
  hiddenStems,
}: PillarCardProps) {
  const labels = PILLAR_LABELS[pillarKey];

  if (!pillar) {
    return (
      <Card className="h-full opacity-50">
        <CardHeader className="p-3 pb-1 text-center">
          <div className="text-xs text-muted-foreground">{labels.korean}</div>
          <div className="text-xs text-muted-foreground">{labels.english}</div>
        </CardHeader>
        <CardContent className="p-3 pt-1 text-center">
          <div className="py-8 text-muted-foreground text-sm">Unknown</div>
        </CardContent>
      </Card>
    );
  }

  const stemColors = ELEMENT_COLORS[pillar.stem.element];
  const branchColors = ELEMENT_COLORS[pillar.branch.element];
  const tenGodKey = `${pillarKey}Stem`;
  const tenGod = isDay ? null : tenGods[tenGodKey];
  const emoji = ANIMAL_EMOJI[pillar.branch.animal] ?? '';

  return (
    <Card
      className={`h-full transition-all ${
        isDay ? 'ring-2 ring-primary/50 shadow-lg shadow-primary/10' : ''
      }`}
    >
      <CardHeader className="p-3 pb-1 text-center space-y-0">
        <div className="text-xs font-semibold text-muted-foreground">{labels.korean}</div>
        <div className="text-xs text-muted-foreground">{labels.english}</div>
        {isDay && (
          <Badge variant="outline" className="mx-auto mt-1 text-[10px] py-0 border-primary text-primary">
            Day Master
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-3 pt-2 space-y-2">
        {/* Heavenly Stem */}
        <Tooltip>
          <TooltipTrigger>
            <div className={`rounded-lg p-2 text-center ${stemColors.bg} ${stemColors.border} border`}>
              <div className={`text-2xl font-bold ${stemColors.text}`}>
                {pillar.stem.hanja}
              </div>
              <div className={`text-sm ${stemColors.text}`}>
                {pillar.stem.korean}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {pillar.stem.yinYang === 'Yang' ? '☀️' : '🌙'} {pillar.stem.element}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">
              {pillar.stem.romanized} - {pillar.stem.nature}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Earthly Branch */}
        <Tooltip>
          <TooltipTrigger>
            <div className={`rounded-lg p-2 text-center ${branchColors.bg} ${branchColors.border} border`}>
              <div className={`text-2xl font-bold ${branchColors.text}`}>
                {pillar.branch.hanja}
              </div>
              <div className={`text-sm ${branchColors.text}`}>
                {pillar.branch.korean}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {emoji} {pillar.branch.animal}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">
              {pillar.branch.romanized} - {pillar.branch.element} ({pillar.branch.yinYang})
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Hidden Stems */}
        {hiddenStems.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center">
            {hiddenStems.map((hs, i) => {
              const hColors = ELEMENT_COLORS[hs.stem.element];
              return (
                <Tooltip key={i}>
                  <TooltipTrigger>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${hColors.bg} ${hColors.text} border ${hColors.border}`}
                    >
                      {hs.stem.hanja}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {hs.stem.korean} ({hs.stem.element}) - {hs.type} (weight: {hs.weight})
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        )}

        {/* Ten God */}
        {tenGod && (
          <div className="text-center">
            <Badge variant="secondary" className="text-[10px]">
              {tenGod}
            </Badge>
          </div>
        )}

        {/* Life Stage */}
        {lifeStage && (
          <div className="text-center text-[10px] text-muted-foreground">
            {lifeStage}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
