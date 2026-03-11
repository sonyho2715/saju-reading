import { FourPillars, LifeStage } from '../types';
import { getLifeStage } from '../constants/life-stages';

export function mapLifeStages(fourPillars: FourPillars): Record<'year' | 'month' | 'day' | 'hour', LifeStage | null> {
  const dm = fourPillars.day.stem;
  return {
    year:  getLifeStage(dm.index, fourPillars.year.branch.index),
    month: getLifeStage(dm.index, fourPillars.month.branch.index),
    day:   getLifeStage(dm.index, fourPillars.day.branch.index),
    hour:  fourPillars.hour ? getLifeStage(dm.index, fourPillars.hour.branch.index) : null,
  };
}
