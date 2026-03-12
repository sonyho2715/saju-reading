import { ImageResponse } from 'next/og';
import { NextRequest, NextResponse } from 'next/server';
import { getChart } from '@/lib/db';
import { STEMS } from '@/engine/constants/stems';
import { BRANCHES } from '@/engine/constants/branches';

export const runtime = 'nodejs';

const ELEMENT_COLORS: Record<string, string> = {
  Wood: '#22c55e',
  Fire: '#ef4444',
  Earth: '#eab308',
  Metal: '#94a3b8',
  Water: '#3b82f6',
};

const ELEMENT_BG: Record<string, string> = {
  Wood: 'rgba(34,197,94,0.15)',
  Fire: 'rgba(239,68,68,0.15)',
  Earth: 'rgba(234,179,8,0.15)',
  Metal: 'rgba(148,163,184,0.15)',
  Water: 'rgba(59,130,246,0.15)',
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let chartRow: Awaited<ReturnType<typeof getChart>>;
    try {
      chartRow = await getChart(id);
    } catch {
      return new Response('Chart not found', { status: 404 });
    }

    if (!chartRow) {
      return new Response('Chart not found', { status: 404 });
    }

    const yearStem = STEMS[chartRow.yearStem];
    const yearBranch = BRANCHES[chartRow.yearBranch];
    const monthStem = STEMS[chartRow.monthStem];
    const monthBranch = BRANCHES[chartRow.monthBranch];
    const dayStem = STEMS[chartRow.dayStem];
    const dayBranch = BRANCHES[chartRow.dayBranch];
    const hourStem = chartRow.hourStem !== null ? STEMS[chartRow.hourStem] : null;
    const hourBranch = chartRow.hourBranch !== null ? BRANCHES[chartRow.hourBranch] : null;

    const pillars = [
      { label: 'Hour', stem: hourStem, branch: hourBranch },
      { label: 'Day', stem: dayStem, branch: dayBranch },
      { label: 'Month', stem: monthStem, branch: monthBranch },
      { label: 'Year', stem: yearStem, branch: yearBranch },
    ];

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
            width: '1200px',
            height: '630px',
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 50px',
            color: 'white',
            fontFamily: 'serif',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '28px', opacity: 0.8, display: 'flex' }}>
              四柱推命 Saju Reading
            </div>
            <div style={{ fontSize: '16px', opacity: 0.5, display: 'flex' }}>
              Four Pillars of Destiny
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.2)', marginBottom: '30px', display: 'flex' }} />

          {/* Pillar labels */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '12px' }}>
            {pillars.map((p) => (
              <div
                key={p.label}
                style={{
                  width: '240px',
                  textAlign: 'center',
                  fontSize: '18px',
                  opacity: 0.6,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {p.label} Pillar
              </div>
            ))}
          </div>

          {/* Four pillars grid */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flex: 1 }}>
            {pillars.map((p) => {
              const stemEl = p.stem?.element ?? 'Earth';
              const branchEl = p.branch?.element ?? 'Earth';
              return (
                <div
                  key={p.label}
                  style={{
                    width: '240px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '16px',
                    padding: '20px 16px',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {/* Stem */}
                  <div
                    style={{
                      fontSize: '64px',
                      lineHeight: '1.1',
                      color: ELEMENT_COLORS[stemEl as string] ?? '#fff',
                      display: 'flex',
                    }}
                  >
                    {p.stem?.hanja ?? '?'}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      opacity: 0.7,
                      background: ELEMENT_BG[stemEl as string] ?? 'rgba(255,255,255,0.1)',
                      padding: '2px 12px',
                      borderRadius: '8px',
                      display: 'flex',
                    }}
                  >
                    {p.stem ? `${stemEl} ${p.stem.yinYang}` : ''}
                  </div>

                  {/* Divider */}
                  <div style={{ width: '60%', height: '1px', background: 'rgba(255,255,255,0.2)', margin: '4px 0', display: 'flex' }} />

                  {/* Branch */}
                  <div
                    style={{
                      fontSize: '64px',
                      lineHeight: '1.1',
                      color: ELEMENT_COLORS[branchEl as string] ?? '#fff',
                      display: 'flex',
                    }}
                  >
                    {p.branch?.hanja ?? '?'}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      opacity: 0.7,
                      display: 'flex',
                    }}
                  >
                    {p.branch?.animal ?? ''}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <div style={{ fontSize: '16px', opacity: 0.4, display: 'flex' }}>
              SajuReading.com
            </div>
            <div style={{ fontSize: '14px', opacity: 0.3, display: 'flex' }}>
              Day Master: {dayStem?.hanja ?? '?'} ({dayStem?.element ?? ''})
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('[chart/image] Error:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
