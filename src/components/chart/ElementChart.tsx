'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ElementBalance, Element } from '@/engine/types';

// ---------------------------------------------------------------------------
// Dynamic imports for recharts (disable SSR)
// ---------------------------------------------------------------------------

const ResponsiveContainer = dynamic(
  () => import('recharts').then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const RadarChart = dynamic(
  () => import('recharts').then((m) => m.RadarChart),
  { ssr: false }
);
const PolarGrid = dynamic(
  () => import('recharts').then((m) => m.PolarGrid),
  { ssr: false }
);
const PolarAngleAxis = dynamic(
  () => import('recharts').then((m) => m.PolarAngleAxis),
  { ssr: false }
);
const Radar = dynamic(
  () => import('recharts').then((m) => m.Radar),
  { ssr: false }
);
const BarChart = dynamic(
  () => import('recharts').then((m) => m.BarChart),
  { ssr: false }
);
const Bar = dynamic(
  () => import('recharts').then((m) => m.Bar),
  { ssr: false }
);
const XAxis = dynamic(
  () => import('recharts').then((m) => m.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import('recharts').then((m) => m.YAxis),
  { ssr: false }
);
const RechartsTooltip = dynamic(
  () => import('recharts').then((m) => m.Tooltip),
  { ssr: false }
);
const Cell = dynamic(
  () => import('recharts').then((m) => m.Cell),
  { ssr: false }
);

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------

interface ElementChartProps {
  elementBalance: ElementBalance;
  usefulGod: Element | null;
}

interface ElementData {
  element: string;
  korean: string;
  value: number;
  color: string;
}

const ELEMENT_CONFIG: Record<string, { korean: string; color: string }> = {
  wood: { korean: '목 (木)', color: '#22c55e' },
  fire: { korean: '화 (火)', color: '#ef4444' },
  earth: { korean: '토 (土)', color: '#f59e0b' },
  metal: { korean: '금 (金)', color: '#6b7280' },
  water: { korean: '수 (水)', color: '#3b82f6' },
};

const ELEMENT_DISPLAY: Record<Element, string> = {
  Wood: '목 (木) Wood',
  Fire: '화 (火) Fire',
  Earth: '토 (土) Earth',
  Metal: '금 (金) Metal',
  Water: '수 (水) Water',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatTooltipValue(value: any): [string, string] {
  return [typeof value === 'number' ? value.toFixed(1) : String(value ?? ''), 'Score'];
}

export default function ElementChart({ elementBalance, usefulGod }: ElementChartProps) {
  const [view, setView] = useState<'radar' | 'bar'>('radar');

  const data: ElementData[] = [
    { element: 'Wood', korean: ELEMENT_CONFIG.wood.korean, value: elementBalance.wood, color: ELEMENT_CONFIG.wood.color },
    { element: 'Fire', korean: ELEMENT_CONFIG.fire.korean, value: elementBalance.fire, color: ELEMENT_CONFIG.fire.color },
    { element: 'Earth', korean: ELEMENT_CONFIG.earth.korean, value: elementBalance.earth, color: ELEMENT_CONFIG.earth.color },
    { element: 'Metal', korean: ELEMENT_CONFIG.metal.korean, value: elementBalance.metal, color: ELEMENT_CONFIG.metal.color },
    { element: 'Water', korean: ELEMENT_CONFIG.water.korean, value: elementBalance.water, color: ELEMENT_CONFIG.water.color },
  ];

  // Find missing (< 0.5) and excess (> 2.5) elements
  const missing = data.filter((d) => d.value < 0.5);
  const excess = data.filter((d) => d.value > 2.5);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Element Balance (오행 균형)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={view} onValueChange={(v) => setView(v as 'radar' | 'bar')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="radar">Radar</TabsTrigger>
            <TabsTrigger value="bar">Bar</TabsTrigger>
          </TabsList>

          <TabsContent value="radar" className="mt-4">
            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="korean"
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Radar
                    name="Balance"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={formatTooltipValue}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="bar" className="mt-4">
            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ left: 60, right: 20 }}>
                  <XAxis type="number" domain={[0, 'auto']} tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="korean"
                    tick={{ fontSize: 12 }}
                    width={55}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={formatTooltipValue}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                    {data.map((entry, index) => (
                      <Cell key={index} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        {/* Warning badges */}
        <div className="space-y-2">
          {missing.map((m) => (
            <div
              key={m.element}
              className="flex items-center gap-2 p-2 rounded-md bg-red-500/10 border border-red-500/20"
            >
              <span className="text-sm">&#9888;&#65039;</span>
              <span className="text-sm font-medium text-red-700 dark:text-red-400">
                Missing: {m.element} ({m.korean}) - Score: {m.value.toFixed(1)}
              </span>
            </div>
          ))}
          {excess.map((e) => (
            <div
              key={e.element}
              className="flex items-center gap-2 p-2 rounded-md bg-amber-500/10 border border-amber-500/20"
            >
              <span className="text-sm">&#8593;</span>
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Strong: {e.element} ({e.korean}) - Score: {e.value.toFixed(1)}
              </span>
            </div>
          ))}
        </div>

        {/* Useful God callout */}
        {usefulGod && (
          <div className="p-3 rounded-lg border-2 border-primary/30 bg-primary/5 text-center">
            <div className="text-xs text-muted-foreground mb-1">Your Useful God (용신)</div>
            <div className="text-lg font-bold" style={{ color: ELEMENT_CONFIG[usefulGod.toLowerCase()]?.color }}>
              {ELEMENT_DISPLAY[usefulGod]}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
