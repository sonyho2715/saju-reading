import { HeavenlyStem, Element, YinYang } from '../types';

export const STEMS: HeavenlyStem[] = [
  { index: 0, hanja: '甲', korean: '갑', romanized: 'Gap',    element: Element.Wood,  yinYang: YinYang.Yang, nature: 'Pioneering growth, expansive ambition' },
  { index: 1, hanja: '乙', korean: '을', romanized: 'Eul',    element: Element.Wood,  yinYang: YinYang.Yin,  nature: 'Flexible resilience, adaptive persistence' },
  { index: 2, hanja: '丙', korean: '병', romanized: 'Byeong', element: Element.Fire,  yinYang: YinYang.Yang, nature: 'Radiant warmth, broad visibility' },
  { index: 3, hanja: '丁', korean: '정', romanized: 'Jeong',  element: Element.Fire,  yinYang: YinYang.Yin,  nature: 'Focused intensity, refined artistry' },
  { index: 4, hanja: '戊', korean: '무', romanized: 'Mu',     element: Element.Earth, yinYang: YinYang.Yang, nature: 'Steadfast authority, immovable stability' },
  { index: 5, hanja: '己', korean: '기', romanized: 'Gi',     element: Element.Earth, yinYang: YinYang.Yin,  nature: 'Nurturing receptivity, fertile depth' },
  { index: 6, hanja: '庚', korean: '경', romanized: 'Gyeong', element: Element.Metal, yinYang: YinYang.Yang, nature: 'Sharp decisiveness, forceful execution' },
  { index: 7, hanja: '辛', korean: '신', romanized: 'Sin',    element: Element.Metal, yinYang: YinYang.Yin,  nature: 'Refined elegance, perfectionist precision' },
  { index: 8, hanja: '壬', korean: '임', romanized: 'Im',     element: Element.Water, yinYang: YinYang.Yang, nature: 'Strategic depth, flowing intelligence' },
  { index: 9, hanja: '癸', korean: '계', romanized: 'Gye',    element: Element.Water, yinYang: YinYang.Yin,  nature: 'Intuitive wisdom, hidden perception' },
];
