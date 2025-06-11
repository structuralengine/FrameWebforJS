export interface LLLoad {
  m1: string;
  m2: string;
  direction: string;
  mark: string;
  L1: string;
  L2: string;
  P1: string;
  P2: string;
  n: string;
}

export interface LLLoadConfiguration {
  isActive: boolean;
  pitch: number;
  caseId: string;
  symbol: string;
}

export interface LLPositionResult {
  startPosition: number;
  totalLength: number;
}

export interface LLAnimationState {
  isActive: boolean;
  currentCaseIndex: number;
  totalCases: number;
  speed: number;
}

export interface LoadNameWithLL {
  id: string;
  rate: string;
  symbol: string;
  name: string;
  fix_node: string;
  fix_member: string;
  element: string;
  joint: string;
  LL_pitch: number;
}

export interface LLAnimationFrame {
  caseId: string;
  index: number;
  progress: number;
}

export interface LLCacheKey {
  loads: string;
  memberData: string;
}
