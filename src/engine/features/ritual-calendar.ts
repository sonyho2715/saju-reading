import type { ChartAnalysis, Element } from '../types';
import { getDayPillar } from '../calendar/day-pillar';
import { STEMS } from '../constants/stems';
import { BRANCHES } from '../constants/branches';
import { CONTROLS } from '../constants/elements';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RitualCalendar {
  powerDays: { date: string; reason: string; element: string; action: string }[];
  cautionDays: { date: string; reason: string; element: string; avoidAction: string }[];
  monthlyThemes: { month: number; theme: string; element: string; focus: string }[];
  seasonalTransitions: { date: string; season: string; advice: string }[];
}

// ---------------------------------------------------------------------------
// Monthly element themes (based on the 12 months / branches)
// ---------------------------------------------------------------------------

const MONTH_ELEMENTS: { month: number; element: string; season: string }[] = [
  { month: 1, element: 'Earth', season: 'Late Winter' },
  { month: 2, element: 'Wood', season: 'Early Spring' },
  { month: 3, element: 'Wood', season: 'Spring' },
  { month: 4, element: 'Earth', season: 'Late Spring' },
  { month: 5, element: 'Fire', season: 'Early Summer' },
  { month: 6, element: 'Fire', season: 'Summer' },
  { month: 7, element: 'Earth', season: 'Late Summer' },
  { month: 8, element: 'Metal', season: 'Early Autumn' },
  { month: 9, element: 'Metal', season: 'Autumn' },
  { month: 10, element: 'Earth', season: 'Late Autumn' },
  { month: 11, element: 'Water', season: 'Early Winter' },
  { month: 12, element: 'Water', season: 'Winter' },
];

const ELEMENT_THEMES: Record<string, Record<string, string>> = {
  Wood: {
    supportive: 'Growth and expansion. Start new projects, plant seeds for the future.',
    challenging: 'Caution against overextension. Consolidate before expanding.',
  },
  Fire: {
    supportive: 'Visibility and passion. Share your work, build relationships, celebrate.',
    challenging: 'Guard against burnout. Balance activity with rest.',
  },
  Earth: {
    supportive: 'Stability and nurturing. Focus on home, health, and solid foundations.',
    challenging: 'Avoid stagnation. Keep moving even when comfort calls.',
  },
  Metal: {
    supportive: 'Discipline and refinement. Complete projects, refine skills, cut what does not serve you.',
    challenging: 'Watch for rigidity. Stay open to change and softness.',
  },
  Water: {
    supportive: 'Reflection and strategy. Study, plan, deepen your understanding.',
    challenging: 'Beware of overthinking or emotional flooding. Stay grounded.',
  },
};

// Element actions for power/caution days
const ELEMENT_ACTIONS: Record<string, { power: string; caution: string }> = {
  Wood: { power: 'Launch initiatives, sign contracts for growth, network', caution: 'Avoid major decisions, rest and recharge instead' },
  Fire: { power: 'Present, perform, socialize, attend events', caution: 'Avoid confrontation, do not make impulsive promises' },
  Earth: { power: 'Invest, build foundations, strengthen home and family', caution: 'Avoid big moves or relocations, stay grounded' },
  Metal: { power: 'Finalize deals, complete tasks, organize finances', caution: 'Avoid cutting ties or harsh criticism, be gentle' },
  Water: { power: 'Plan strategy, study, meditate, connect spiritually', caution: 'Avoid overcommitting, watch for indecision or fear' },
};

// Seasonal transition dates (approximate) and advice
const SEASONAL_TRANSITIONS: { month: number; day: number; season: string }[] = [
  { month: 2, day: 4, season: 'Spring (Ipchun)' },
  { month: 5, day: 6, season: 'Summer (Ipha)' },
  { month: 8, day: 7, season: 'Autumn (Ipchu)' },
  { month: 11, day: 7, season: 'Winter (Ipdong)' },
];

const SEASON_ELEMENT: Record<string, string> = {
  'Spring (Ipchun)': 'Wood',
  'Summer (Ipha)': 'Fire',
  'Autumn (Ipchu)': 'Metal',
  'Winter (Ipdong)': 'Water',
};

// Six Clash pairs
const SIX_CLASH: Record<number, number> = {
  0: 6, 1: 7, 2: 8, 3: 9, 4: 10, 5: 11,
  6: 0, 7: 1, 8: 2, 9: 3, 10: 4, 11: 5,
};

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

export function generateRitualCalendar(chart: ChartAnalysis, year: number): RitualCalendar {
  const usefulGod = chart.usefulGod as string;
  const jealousyGod = chart.jealousyGod as string;
  const dayBranchIdx = chart.fourPillars.day.branch.index;

  const powerDays: RitualCalendar['powerDays'] = [];
  const cautionDays: RitualCalendar['cautionDays'] = [];

  // Scan every day of the year for power/caution days
  const startDate = new Date(`${year}-01-01T12:00:00Z`);
  const endDate = new Date(`${year}-12-31T12:00:00Z`);
  const current = new Date(startDate);

  while (current <= endDate) {
    const dateStr = current.toISOString().slice(0, 10);
    const pillar = getDayPillar(current, 'UTC');
    const stemElement = STEMS[pillar.stem.index].element as string;
    const branchElement = BRANCHES[pillar.branch.index].element as string;
    const branchIdx = pillar.branch.index;

    const isUsefulGodDay = stemElement === usefulGod;
    const isJealousyGodDay = stemElement === jealousyGod;
    const isSixClash = SIX_CLASH[branchIdx] === dayBranchIdx;
    const isControlDay = CONTROLS[STEMS[pillar.stem.index].element] === chart.dayMaster.element;

    if (isUsefulGodDay && !isSixClash) {
      const actions = ELEMENT_ACTIONS[stemElement] ?? ELEMENT_ACTIONS['Earth'];
      powerDays.push({
        date: dateStr,
        reason: `${stemElement} day aligns with your Useful God`,
        element: stemElement,
        action: actions.power,
      });
    }

    if (isJealousyGodDay && isSixClash) {
      const actions = ELEMENT_ACTIONS[stemElement] ?? ELEMENT_ACTIONS['Earth'];
      cautionDays.push({
        date: dateStr,
        reason: `${stemElement} Jealousy God + Six Clash with Day Branch`,
        element: stemElement,
        avoidAction: actions.caution,
      });
    } else if (isControlDay && isSixClash) {
      cautionDays.push({
        date: dateStr,
        reason: `Day element controls your Day Master + Branch clash`,
        element: stemElement,
        avoidAction: 'Avoid major decisions and confrontations',
      });
    }

    current.setDate(current.getDate() + 1);
  }

  // Limit to most significant days
  const topPowerDays = powerDays.slice(0, 36);   // ~3 per month
  const topCautionDays = cautionDays.slice(0, 24); // ~2 per month

  // Monthly themes
  const monthlyThemes: RitualCalendar['monthlyThemes'] = MONTH_ELEMENTS.map(me => {
    const isSupport = me.element === usefulGod || me.element === (
      { Wood: 'Water', Fire: 'Wood', Earth: 'Fire', Metal: 'Earth', Water: 'Metal' }[usefulGod]
    );
    const themes = ELEMENT_THEMES[me.element] ?? ELEMENT_THEMES['Earth'];
    return {
      month: me.month,
      theme: `${me.season}: ${me.element} Month`,
      element: me.element,
      focus: isSupport ? themes.supportive : themes.challenging,
    };
  });

  // Seasonal transitions
  const seasonalTransitions: RitualCalendar['seasonalTransitions'] = SEASONAL_TRANSITIONS.map(st => {
    const seasonElement = SEASON_ELEMENT[st.season] ?? 'Earth';
    const isGood = seasonElement === usefulGod;
    return {
      date: `${year}-${String(st.month).padStart(2, '0')}-${String(st.day).padStart(2, '0')}`,
      season: st.season,
      advice: isGood
        ? `${st.season} begins. This season's ${seasonElement} energy aligns with your Useful God. Channel this period for maximum growth.`
        : `${st.season} begins. ${seasonElement} energy may challenge your chart. Focus on balance and self-care during this transition.`,
    };
  });

  return {
    powerDays: topPowerDays,
    cautionDays: topCautionDays,
    monthlyThemes,
    seasonalTransitions,
  };
}
