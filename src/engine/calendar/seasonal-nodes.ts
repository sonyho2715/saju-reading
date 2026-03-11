// Seasonal nodes will be loaded from pre-generated data
// For now, use approximate dates with a TODO to replace with generated JSON
// The 12 saju month-boundary 절기 (approximate dates, replace with generated data)

export const SEASONAL_NODE_NAMES = [
  '소한', '입춘', '경칩', '청명', '입하', '망종',
  '소서', '입추', '백로', '한로', '입동', '대설',
] as const;

// Branch index for each seasonal node (month start)
export const SEASONAL_NODE_BRANCH: Record<string, number> = {
  '입춘': 2,  // 寅 Month 1
  '경칩': 3,  // 卯 Month 2
  '청명': 4,  // 辰 Month 3
  '입하': 5,  // 巳 Month 4
  '망종': 6,  // 午 Month 5
  '소서': 7,  // 未 Month 6
  '입추': 8,  // 申 Month 7
  '백로': 9,  // 酉 Month 8
  '한로': 10, // 戌 Month 9
  '입동': 11, // 亥 Month 10
  '대설': 0,  // 子 Month 11
  '소한': 1,  // 丑 Month 12
};

// Approximate seasonal node dates for each year
// Format: [month(1-12), day]. These are approximate and should be replaced with exact timestamps
// from the generated seasonal-nodes.json once the scripts/generate-seasonal-nodes.ts script is run
const APPROX_NODES: Record<string, [number, number]> = {
  '입춘': [2, 4],
  '경칩': [3, 6],
  '청명': [4, 5],
  '입하': [5, 6],
  '망종': [6, 6],
  '소서': [7, 7],
  '입추': [8, 7],
  '백로': [9, 8],
  '한로': [10, 8],
  '입동': [11, 7],
  '대설': [12, 7],
  '소한': [1, 6],
};

export function getSeasonalNodeApprox(nodeType: string, year: number): Date {
  const approx = APPROX_NODES[nodeType];
  if (!approx) throw new Error(`Unknown seasonal node: ${nodeType}`);
  const [month, day] = approx;
  return new Date(year, month - 1, day, 0, 0, 0);
}

// TODO: Replace with exact timestamps from scripts/generate-seasonal-nodes.ts output
// import nodesData from '@/data/seasonal-nodes.json';
// export function getSeasonalNode(nodeType: string, year: number): Date {
//   const iso = (nodesData as Record<string, string>)[`${year}-${nodeType}`];
//   if (!iso) throw new Error(`Seasonal node not found: ${year}-${nodeType}`);
//   return new Date(iso);
// }
export const getSeasonalNode = getSeasonalNodeApprox;
