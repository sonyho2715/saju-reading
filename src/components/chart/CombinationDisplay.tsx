'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Combination, Clash } from '@/engine/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CombinationDisplayProps {
  combinations: Combination[];
  clashes: Clash[];
}

// ---------------------------------------------------------------------------
// Type labels
// ---------------------------------------------------------------------------

const COMBO_LABELS: Record<string, { label: string; korean: string }> = {
  stemCombination: { label: 'Stem Combination', korean: '천간합' },
  sixHarmony: { label: 'Six Harmony', korean: '육합' },
  threeHarmony: { label: 'Three Harmony', korean: '삼합' },
  seasonalCombo: { label: 'Seasonal Combo', korean: '방합' },
};

const CLASH_LABELS: Record<string, { label: string; korean: string }> = {
  stemClash: { label: 'Stem Clash', korean: '천간충' },
  branchClash: { label: 'Six Clash', korean: '육충' },
  punishment: { label: 'Punishment', korean: '형' },
  harm: { label: 'Harm', korean: '해' },
  break: { label: 'Break', korean: '파' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CombinationDisplay({ combinations, clashes }: CombinationDisplayProps) {
  const hasContent = combinations.length > 0 || clashes.length > 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Interactions (합충형해파)</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasContent ? (
          <p className="text-sm text-muted-foreground">No significant interactions detected.</p>
        ) : (
          <div className="space-y-4">
            {/* Combinations (Harmonies) */}
            {combinations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-green-700 dark:text-green-400">
                  Harmonies (합)
                </h4>
                {combinations.map((combo, idx) => (
                  <CombinationCard key={idx} combo={combo} />
                ))}
              </div>
            )}

            {/* Clashes */}
            {clashes.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-red-700 dark:text-red-400">
                  Clashes and Tensions (충/형/해/파)
                </h4>
                {clashes.map((clash, idx) => (
                  <ClashCard key={idx} clash={clash} />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Combination Card
// ---------------------------------------------------------------------------

function CombinationCard({ combo }: { combo: Combination }) {
  const typeInfo = COMBO_LABELS[combo.type] ?? { label: combo.type, korean: '' };

  return (
    <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3 space-y-1.5">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="bg-green-500/15 text-green-800 dark:text-green-300 border-green-500/30 text-xs">
          {typeInfo.korean} ({typeInfo.label})
        </Badge>
        <Badge
          variant="secondary"
          className="text-[10px]"
        >
          {combo.transforms ? 'Favorable' : 'Neutral'}
        </Badge>
      </div>
      <div className="text-sm">
        <span className="font-medium">{combo.elements.join(' + ')}</span>
        {combo.transforms && combo.result && (
          <span className="text-green-700 dark:text-green-400">
            {' '}&rarr; transforms to {combo.result}
          </span>
        )}
      </div>
      {combo.description && (
        <p className="text-xs text-muted-foreground">{combo.description}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Clash Card
// ---------------------------------------------------------------------------

function ClashCard({ clash }: { clash: Clash }) {
  const typeInfo = CLASH_LABELS[clash.type] ?? { label: clash.type, korean: '' };

  // Severity color
  let severityColor = 'bg-yellow-500/15 text-yellow-800 dark:text-yellow-300 border-yellow-500/30';
  let borderColor = 'border-yellow-500/20 bg-yellow-500/5';
  if (clash.severity >= 7) {
    severityColor = 'bg-red-500/15 text-red-800 dark:text-red-300 border-red-500/30';
    borderColor = 'border-red-500/20 bg-red-500/5';
  } else if (clash.severity <= 3) {
    severityColor = 'bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-500/30';
    borderColor = 'border-gray-500/20 bg-gray-500/5';
  }

  const severityLabel = clash.severity >= 7 ? 'Challenging' : clash.severity >= 4 ? 'Moderate' : 'Mild';

  return (
    <div className={`rounded-lg border p-3 space-y-1.5 ${borderColor}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className={`text-xs ${severityColor}`}>
          {typeInfo.korean} ({typeInfo.label})
        </Badge>
        <Badge variant="secondary" className="text-[10px]">
          {severityLabel} ({clash.severity}/10)
        </Badge>
      </div>
      <div className="text-sm">
        <span className="font-medium">{clash.elements.join(' vs ')}</span>
        {clash.positions.length > 0 && (
          <span className="text-muted-foreground"> ({clash.positions.join('-')})</span>
        )}
      </div>
      {clash.description && (
        <p className="text-xs text-muted-foreground">{clash.description}</p>
      )}
    </div>
  );
}
