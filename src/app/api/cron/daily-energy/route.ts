import { NextRequest, NextResponse } from 'next/server';
import { calculateDailyEnergy } from '@/engine/features/daily-energy';
import { saveDailyEnergy } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Vercel Cron job: runs daily at midnight KST (15:00 UTC previous day).
 * Pre-calculates daily energy for the next 7 days and saves to daily_energies table.
 */
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret (Vercel sets this header automatically)
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    const saved: string[] = [];

    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      targetDate.setUTCHours(12, 0, 0, 0);

      const dateStr = targetDate.toISOString().slice(0, 10);
      const energy = calculateDailyEnergy(targetDate);

      await saveDailyEnergy(
        dateStr,
        energy.pillar.stem.index,
        energy.pillar.branch.index,
        {
          dominantElement: energy.dominantElement,
          energyLevel: energy.energyLevel,
          stemHanja: energy.pillar.stem.hanja,
          branchHanja: energy.pillar.branch.hanja,
          stemKorean: energy.pillar.stem.korean,
          branchKorean: energy.pillar.branch.korean,
          animal: energy.pillar.branch.animal,
        }
      );

      saved.push(dateStr);
    }

    return NextResponse.json({
      success: true,
      message: `Saved daily energy for ${saved.length} days`,
      dates: saved,
    });
  } catch (error) {
    console.error('[cron/daily-energy] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate daily energy' },
      { status: 500 }
    );
  }
}
