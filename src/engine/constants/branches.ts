import { EarthlyBranch, Element, YinYang } from '../types';

export const BRANCHES: EarthlyBranch[] = [
  { index: 0,  hanja: '子', korean: '자', romanized: 'Ja',   animal: 'Rat',     element: Element.Water, yinYang: YinYang.Yang, hours: { start: 23, end: 1  }, month: 11 },
  { index: 1,  hanja: '丑', korean: '축', romanized: 'Chuk', animal: 'Ox',      element: Element.Earth, yinYang: YinYang.Yin,  hours: { start: 1,  end: 3  }, month: 12 },
  { index: 2,  hanja: '寅', korean: '인', romanized: 'In',   animal: 'Tiger',   element: Element.Wood,  yinYang: YinYang.Yang, hours: { start: 3,  end: 5  }, month: 1  },
  { index: 3,  hanja: '卯', korean: '묘', romanized: 'Myo',  animal: 'Rabbit',  element: Element.Wood,  yinYang: YinYang.Yin,  hours: { start: 5,  end: 7  }, month: 2  },
  { index: 4,  hanja: '辰', korean: '진', romanized: 'Jin',  animal: 'Dragon',  element: Element.Earth, yinYang: YinYang.Yang, hours: { start: 7,  end: 9  }, month: 3  },
  { index: 5,  hanja: '巳', korean: '사', romanized: 'Sa',   animal: 'Snake',   element: Element.Fire,  yinYang: YinYang.Yin,  hours: { start: 9,  end: 11 }, month: 4  },
  { index: 6,  hanja: '午', korean: '오', romanized: 'O',    animal: 'Horse',   element: Element.Fire,  yinYang: YinYang.Yang, hours: { start: 11, end: 13 }, month: 5  },
  { index: 7,  hanja: '未', korean: '미', romanized: 'Mi',   animal: 'Goat',    element: Element.Earth, yinYang: YinYang.Yin,  hours: { start: 13, end: 15 }, month: 6  },
  { index: 8,  hanja: '申', korean: '신', romanized: 'Sin',  animal: 'Monkey',  element: Element.Metal, yinYang: YinYang.Yang, hours: { start: 15, end: 17 }, month: 7  },
  { index: 9,  hanja: '酉', korean: '유', romanized: 'Yu',   animal: 'Rooster', element: Element.Metal, yinYang: YinYang.Yin,  hours: { start: 17, end: 19 }, month: 8  },
  { index: 10, hanja: '戌', korean: '술', romanized: 'Sul',  animal: 'Dog',     element: Element.Earth, yinYang: YinYang.Yang, hours: { start: 19, end: 21 }, month: 9  },
  { index: 11, hanja: '亥', korean: '해', romanized: 'Hae',  animal: 'Pig',     element: Element.Water, yinYang: YinYang.Yin,  hours: { start: 21, end: 23 }, month: 10 },
];
