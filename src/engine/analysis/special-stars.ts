import { FourPillars, SpecialStar } from '../types';
import {
  CHEONIL_GUIIN, MUNCHANG_GUIIN, HAKDANG_GUIIN, HONGYEOM_SAL,
  YANGIN_SAL, BRANCH_FRAME, YEOKMA_SAL, HWAGAE_SAL, DOHWA_SAL,
  CHEONDUK_GUIIN, WEOLDUK_GUIIN, BAEKHO_DASAL, WONJIN_SAL,
  GWIMUN_PAIRS, GOEGANG_SAL, GONGMANG_TABLE,
} from '../constants/special-stars';
import { BRANCHES } from '../constants/branches';

type PillarKey = 'year' | 'month' | 'day' | 'hour';

interface BranchInfo { key: PillarKey; branch: typeof BRANCHES[number] }

export function calculateSpecialStars(fourPillars: FourPillars): SpecialStar[] {
  const stars: SpecialStar[] = [];
  const dayMaster = fourPillars.day.stem;
  const dayBranch = fourPillars.day.branch;
  const monthBranch = fourPillars.month.branch;
  const yearBranch = fourPillars.year.branch;

  const pillarList: BranchInfo[] = [
    { key: 'year', branch: yearBranch },
    { key: 'month', branch: monthBranch },
    { key: 'day', branch: dayBranch },
  ];
  if (fourPillars.hour) {
    pillarList.push({ key: 'hour', branch: fourPillars.hour.branch });
  }

  const allBranchIndices = pillarList.map(p => p.branch.index);

  const addStar = (name: string, korean: string, pillar: PillarKey, meaning: string, strong = false) => {
    stars.push({ name, korean, pillar, meaning, strength: strong ? 'strong' : 'moderate' });
  };

  // 1. Heavenly Nobleman (Day Stem)
  const guiinBranches = CHEONIL_GUIIN[dayMaster.index] ?? [];
  for (const branchIdx of guiinBranches) {
    const hit = pillarList.find(p => p.branch.index === branchIdx);
    if (hit) addStar('cheonil_guiin', '천을귀인', hit.key, 'Heavenly Nobleman, protection from authority figures and sudden help in crisis', hit.key === 'day');
  }

  // 2. Heavenly Virtue (Month Branch)
  const cheonduk = CHEONDUK_GUIIN[monthBranch.index];
  if (cheonduk) {
    if (cheonduk.type === 'stem') {
      const allPillars = [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour].filter(Boolean);
      const match = allPillars.find(pl => pl !== null && pl.stem.index === cheonduk.index);
      if (match) {
        addStar('cheonduk_guiin', '천덕귀인', 'month', 'Heavenly Virtue, divine protection, avoid disasters');
      }
    } else {
      const match = pillarList.find(pl => pl.branch.index === cheonduk.index);
      if (match) {
        addStar('cheonduk_guiin', '천덕귀인', 'month', 'Heavenly Virtue, divine protection, avoid disasters');
      }
    }
  }

  // 3. Monthly Virtue (Month Branch frame)
  const frame = BRANCH_FRAME[monthBranch.index];
  if (frame) {
    const weoldukStemIdx = WEOLDUK_GUIIN[frame];
    if (weoldukStemIdx !== undefined) {
      const allPillars = [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour].filter(Boolean);
      const hit = allPillars.find(p => p !== null && p.stem.index === weoldukStemIdx);
      if (hit) addStar('weolduk_guiin', '월덕귀인', 'month', 'Monthly Virtue, good karma from past life, smooth resolution of conflicts');
    }
  }

  // 4. Literary Star (Day Stem)
  const munchang = MUNCHANG_GUIIN[dayMaster.index];
  if (munchang !== undefined) {
    const munchangHit = pillarList.find(p => p.branch.index === munchang);
    if (munchangHit) addStar('munchang_guiin', '문창귀인', munchangHit.key, 'Literary Star, academic excellence, writing talent, articulate expression');
  }

  // 5. Academic Hall Star (Day Stem)
  const hakdang = HAKDANG_GUIIN[dayMaster.index];
  if (hakdang !== undefined) {
    const hakdangHit = pillarList.find(p => p.branch.index === hakdang);
    if (hakdangHit) addStar('hakdang_guiin', '학당귀인', hakdangHit.key, 'Academic Hall, natural scholar, lifelong learner, teaching ability');
  }

  // 6-8. Frame-based stars from Year and Day branch
  const refBranches = [yearBranch, dayBranch];
  for (const refBranch of refBranches) {
    const refFrame = BRANCH_FRAME[refBranch.index];
    if (!refFrame) continue;

    // Traveling Horse
    const yeokmaIdx = YEOKMA_SAL[refFrame];
    if (yeokmaIdx !== undefined) {
      const yeokmaHit = pillarList.find(p => p.branch.index === yeokmaIdx);
      if (yeokmaHit) addStar('yeokma_sal', '역마살', yeokmaHit.key, 'Traveling Horse, restlessness, international opportunities, frequent movement');
    }

    // Flower Canopy
    const hwagaeIdx = HWAGAE_SAL[refFrame];
    if (hwagaeIdx !== undefined) {
      const hwagaeHit = pillarList.find(p => p.branch.index === hwagaeIdx);
      if (hwagaeHit) addStar('hwagae_sal', '화개살', hwagaeHit.key, 'Flower Canopy, artistic/spiritual calling, solitary refinement, creative depth');
    }

    // Peach Blossom
    const dohwaIdx = DOHWA_SAL[refFrame];
    if (dohwaIdx !== undefined) {
      const dohwaHit = pillarList.find(p => p.branch.index === dohwaIdx);
      if (dohwaHit) addStar('dohwa_sal', '도화살', dohwaHit.key, 'Peach Blossom, magnetic charm, romantic energy, public appeal');
    }
  }

  // 9. Red Flame (Day Stem)
  const hongyeomIdx = HONGYEOM_SAL[dayMaster.index];
  if (hongyeomIdx !== undefined) {
    const hongyeomHit = pillarList.find(p => p.branch.index === hongyeomIdx);
    if (hongyeomHit) addStar('hongyeom_sal', '홍염살', hongyeomHit.key, 'Red Flame, passionate but potentially destructive romance, sensual charisma');
  }

  // 10. Blade of Yang (Yang stems only)
  if (dayMaster.index in YANGIN_SAL) {
    const yanginIdx = YANGIN_SAL[dayMaster.index];
    if (yanginIdx !== undefined) {
      const yanginHit = pillarList.find(p => p.branch.index === yanginIdx);
      if (yanginHit) addStar('yangin_sal', '양인살', yanginHit.key, 'Blade of Yang, fierce power, competitive drive, career in high-stakes fields');
    }
  }

  // 11. Void/Emptiness (Day Pillar 60-cycle position)
  let cycleIdx = 0;
  for (let i = 0; i < 60; i++) {
    if (i % 10 === dayMaster.index && i % 12 === dayBranch.index) {
      cycleIdx = i + 1;
      break;
    }
  }
  const voidPair = GONGMANG_TABLE[cycleIdx];
  if (voidPair) {
    for (const voidBranchIdx of voidPair) {
      const hit = pillarList.find(p => p.branch.index === voidBranchIdx);
      if (hit) addStar('gongmang', '공망', hit.key,
        `Void/Emptiness, the ${BRANCHES[voidBranchIdx].hanja} life area feels hollow or spiritually significant`);
    }
  }

  // 12. White Tiger (Day Pillar)
  const dayPillarKey = dayMaster.index * 12 + dayBranch.index;
  if (BAEKHO_DASAL.has(dayPillarKey)) {
    addStar('baekho_dasal', '백호대살', 'day', 'White Tiger, intensity in unexpected events, medical/accident energy, powerful transformations', true);
  }

  // 13. Far Distance (Year Branch pair)
  const wonjinOf = WONJIN_SAL[yearBranch.index];
  if (wonjinOf !== undefined) {
    const hit = pillarList.find(p => p.branch.index === wonjinOf && p.key !== 'year');
    if (hit) addStar('wonjin_sal', '원진살', hit.key, 'Far Distance, fated separation and longing, relationships with unresolvable distance');
  }

  // 14. Ghost Gate (branch pairs)
  for (const [b1, b2] of GWIMUN_PAIRS) {
    if (allBranchIndices.includes(b1) && allBranchIndices.includes(b2)) {
      const hit = pillarList.find(p => p.branch.index === b1 || p.branch.index === b2);
      if (hit) addStar('gwimun_sal', '귀문관살', hit.key, 'Ghost Gate, psychic sensitivity, nervous system, spiritual or psychological intensity');
    }
  }

  // 15. Mighty Star (specific Day Pillars)
  if (GOEGANG_SAL.has(dayPillarKey)) {
    addStar('goegang_sal', '괴강살', 'day', 'Mighty Star, commanding authority, fierce willpower, all-or-nothing nature', true);
  }

  // Deduplicate (same star from year and day branch checks)
  const seen = new Set<string>();
  return stars.filter(s => {
    const key = `${s.name}-${s.pillar}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
