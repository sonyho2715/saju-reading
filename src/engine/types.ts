// Five Elements
export enum Element {
  Wood = 'Wood',
  Fire = 'Fire',
  Earth = 'Earth',
  Metal = 'Metal',
  Water = 'Water',
}

export enum YinYang {
  Yang = 'Yang',
  Yin = 'Yin',
}

export interface HeavenlyStem {
  index: number;           // 0-9
  hanja: string;           // e.g. "甲"
  korean: string;          // e.g. "갑"
  romanized: string;       // e.g. "Gap"
  element: Element;
  yinYang: YinYang;
  nature: string;          // brief description of this stem's energy
}

export interface EarthlyBranch {
  index: number;           // 0-11
  hanja: string;           // e.g. "子"
  korean: string;          // e.g. "자"
  romanized: string;       // e.g. "Ja"
  animal: string;          // e.g. "Rat"
  element: Element;
  yinYang: YinYang;
  hours: { start: number; end: number }; // 子時 = 23:00-01:00
  month: number;           // 0-indexed month in saju calendar (子=11th month)
}

export interface Pillar {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
}

export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
}

export interface HiddenStem {
  stem: HeavenlyStem;
  weight: number;          // main=1.0, middle=0.6, residual=0.3
  type: 'main' | 'middle' | 'residual';
}

export enum TenGod {
  Companion = '비견',        // 比肩
  RobWealth = '겁재',        // 劫財
  EatingGod = '식신',        // 食神
  HurtingOfficer = '상관',   // 傷官
  IndirectWealth = '편재',   // 偏財
  DirectWealth = '정재',     // 正財
  SevenKillings = '편관',    // 七殺
  DirectOfficer = '정관',    // 正官
  IndirectSeal = '편인',     // 偏印
  DirectSeal = '정인',       // 正印
}

export interface TenGodInfo {
  tenGod: TenGod;
  korean: string;
  english: string;
  meaning: string;
  themes: string[];
  polarity: 'direct' | 'indirect';
  category: 'companion' | 'output' | 'wealth' | 'authority' | 'seal';
}

export enum LifeStage {
  Birth = '장생',
  Bath = '목욕',
  CapAndBelt = '관대',
  Prosperity = '건록',
  Crowned = '제왕',
  Decline = '쇠',
  Illness = '병',
  Death = '사',
  Tomb = '묘',
  Extinction = '절',
  Embryo = '태',
  Nurture = '양',
}

export enum DayMasterStrength {
  ExtremelyStrong = 'extremely_strong',
  Strong = 'strong',
  Neutral = 'neutral',
  Weak = 'weak',
  ExtremelyWeak = 'extremely_weak',
}

export interface ElementBalance {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface LuckCycle {
  index: number;
  ageStart: number;
  ageEnd: number;
  pillar: Pillar;
  stemTenGod: TenGod;
  branchMainTenGod: TenGod;
  themes: string[];
}

export interface SpecialStar {
  name: string;
  korean: string;
  pillar: 'year' | 'month' | 'day' | 'hour';
  meaning: string;
  strength: 'strong' | 'moderate' | 'subtle';
}

export interface Combination {
  type: 'stemCombination' | 'sixHarmony' | 'threeHarmony' | 'seasonalCombo';
  elements: string[];
  result: Element | null;
  transforms: boolean;
  description: string;
}

export interface Clash {
  type: 'stemClash' | 'branchClash' | 'punishment' | 'harm' | 'break';
  elements: string[];
  positions: string[];
  severity: number;    // 1-10
  nature: string;
  description: string;
}

export interface ChartAnalysis {
  fourPillars: FourPillars;
  dayMaster: HeavenlyStem;
  hiddenStems: Record<'year' | 'month' | 'day' | 'hour', HiddenStem[]>;
  tenGods: Record<string, TenGod>;
  elementBalance: ElementBalance;
  dayMasterStrength: DayMasterStrength;
  supportScore: number;
  drainScore: number;
  usefulGod: Element;
  jealousyGod: Element;
  chartPattern: string;
  chartPatternKorean: string;
  combinations: Combination[];
  clashes: Clash[];
  specialStars: SpecialStar[];
  lifeStages: Record<'year' | 'month' | 'day' | 'hour', LifeStage | null>;
  luckCycles: LuckCycle[];
  luckDirection: 'forward' | 'backward';
  luckStartAge: number;
  originalLunarDate?: { year: number; month: number; day: number; isLeapMonth: boolean };
  engineVersion: string;
}
