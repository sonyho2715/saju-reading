'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { SpecialStar } from '@/engine/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SpecialStarsBadgesProps {
  specialStars: SpecialStar[];
}

// ---------------------------------------------------------------------------
// Auspicious vs Challenging classification
// ---------------------------------------------------------------------------

const AUSPICIOUS_STARS = new Set([
  '천을귀인', '문창귀인', '학당귀인', '천덕귀인', '월덕귀인',
  '화개살', '천의성', '금여록', '복성귀인', '삼기귀인',
  'Heavenly Noble', 'Literary Star', 'Academic Star',
  'Heavenly Virtue', 'Monthly Virtue', 'Flower Canopy',
]);

function isAuspicious(star: SpecialStar): boolean {
  return AUSPICIOUS_STARS.has(star.korean) || AUSPICIOUS_STARS.has(star.name);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SpecialStarsBadges({ specialStars }: SpecialStarsBadgesProps) {
  if (specialStars.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Special Stars (신살)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No special stars detected.</p>
        </CardContent>
      </Card>
    );
  }

  const auspicious = specialStars.filter(isAuspicious);
  const challenging = specialStars.filter((s) => !isAuspicious(s));

  return (
    <TooltipProvider delay={200}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Special Stars (신살)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auspicious Stars */}
          {auspicious.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-1">
                <span>&#10024;</span> Auspicious Stars
              </h4>
              <div className="flex flex-wrap gap-2">
                {auspicious.map((star, idx) => (
                  <StarBadge key={idx} star={star} variant="auspicious" />
                ))}
              </div>
            </div>
          )}

          {/* Challenging Stars */}
          {challenging.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-400 flex items-center gap-1">
                <span>&#9888;&#65039;</span> Challenging Stars
              </h4>
              <div className="flex flex-wrap gap-2">
                {challenging.map((star, idx) => (
                  <StarBadge key={idx} star={star} variant="challenging" />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

// ---------------------------------------------------------------------------
// Star Badge with Tooltip
// ---------------------------------------------------------------------------

interface StarBadgeProps {
  star: SpecialStar;
  variant: 'auspicious' | 'challenging';
}

function StarBadge({ star, variant }: StarBadgeProps) {
  const strengthColors: Record<string, string> = {
    strong: variant === 'auspicious' ? 'bg-green-500/20 text-green-800 dark:text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-800 dark:text-red-300 border-red-500/30',
    moderate: variant === 'auspicious' ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20' : 'bg-orange-500/15 text-orange-800 dark:text-orange-300 border-orange-500/25',
    subtle: variant === 'auspicious' ? 'bg-green-500/5 text-green-600 dark:text-green-500 border-green-500/10' : 'bg-yellow-500/10 text-yellow-800 dark:text-yellow-400 border-yellow-500/20',
  };

  const colorClass = strengthColors[star.strength] ?? strengthColors.moderate;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge
          variant="outline"
          className={`cursor-default px-2.5 py-1 text-xs ${colorClass}`}
        >
          {variant === 'auspicious' ? '&#10024; ' : ''}
          {star.korean}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="space-y-1">
          <p className="font-semibold text-sm">
            {star.korean} ({star.name})
          </p>
          <p className="text-xs text-muted-foreground">
            Pillar: {star.pillar} | Strength: {star.strength}
          </p>
          <p className="text-xs">{star.meaning}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
