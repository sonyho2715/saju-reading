import { TenGod, TenGodInfo } from '../types';

export const TEN_GOD_INFO: Record<TenGod, TenGodInfo> = {
  [TenGod.Companion]: {
    tenGod: TenGod.Companion, korean: '비견', english: 'Companion', polarity: 'indirect', category: 'companion',
    meaning: 'Same element, same polarity as Day Master, a true peer and rival',
    themes: ['independence', 'self-reliance', 'siblings', 'competition', 'peer relationships'],
  },
  [TenGod.RobWealth]: {
    tenGod: TenGod.RobWealth, korean: '겁재', english: 'Rob Wealth', polarity: 'direct', category: 'companion',
    meaning: 'Same element, opposite polarity, competitive energy that challenges wealth',
    themes: ['competition', 'ambition', 'financial instability', 'drive', 'resourcefulness'],
  },
  [TenGod.EatingGod]: {
    tenGod: TenGod.EatingGod, korean: '식신', english: 'Eating God', polarity: 'indirect', category: 'output',
    meaning: 'Day Master produces, same polarity, creative flow and natural talent',
    themes: ['creativity', 'expression', 'food', 'enjoyment', 'talent', 'longevity'],
  },
  [TenGod.HurtingOfficer]: {
    tenGod: TenGod.HurtingOfficer, korean: '상관', english: 'Hurting Officer', polarity: 'direct', category: 'output',
    meaning: 'Day Master produces, opposite polarity, expressive but rebellious energy',
    themes: ['rebellion', 'artistry', 'innovation', 'authority conflict', 'intelligence'],
  },
  [TenGod.IndirectWealth]: {
    tenGod: TenGod.IndirectWealth, korean: '편재', english: 'Indirect Wealth', polarity: 'indirect', category: 'wealth',
    meaning: 'Day Master controls, same polarity, entrepreneurial, speculative wealth',
    themes: ['business', 'risk-taking', 'father', 'adventure', 'windfall', 'speculation'],
  },
  [TenGod.DirectWealth]: {
    tenGod: TenGod.DirectWealth, korean: '정재', english: 'Direct Wealth', polarity: 'direct', category: 'wealth',
    meaning: 'Day Master controls, opposite polarity, stable, earned wealth',
    themes: ['salary', 'stability', 'diligence', 'spouse (male)', 'practical matters'],
  },
  [TenGod.SevenKillings]: {
    tenGod: TenGod.SevenKillings, korean: '편관', english: 'Seven Killings', polarity: 'indirect', category: 'authority',
    meaning: 'Controls Day Master, same polarity, intense pressure, military authority',
    themes: ['power', 'pressure', 'discipline', 'danger', 'military', 'ambition'],
  },
  [TenGod.DirectOfficer]: {
    tenGod: TenGod.DirectOfficer, korean: '정관', english: 'Direct Officer', polarity: 'direct', category: 'authority',
    meaning: 'Controls Day Master, opposite polarity, structured authority, social order',
    themes: ['career', 'reputation', 'government', 'rules', 'spouse (female)', 'status'],
  },
  [TenGod.IndirectSeal]: {
    tenGod: TenGod.IndirectSeal, korean: '편인', english: 'Indirect Seal', polarity: 'indirect', category: 'seal',
    meaning: 'Produces Day Master, same polarity, unconventional learning, spiritual insight',
    themes: ['spirituality', 'intuition', 'unconventional wisdom', 'isolation', 'stepmother'],
  },
  [TenGod.DirectSeal]: {
    tenGod: TenGod.DirectSeal, korean: '정인', english: 'Direct Seal', polarity: 'direct', category: 'seal',
    meaning: 'Produces Day Master, opposite polarity, nurturing support, academic learning',
    themes: ['education', 'mother', 'mentorship', 'certification', 'protection', 'knowledge'],
  },
};
