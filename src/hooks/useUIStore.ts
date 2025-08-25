import { create } from 'zustand';

export interface AnalysisItem {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  score?: number;
  type: 'image' | 'video';
  createdAt: number;
  metrics?: Record<string, number>; // detailed sub-scores
  issues?: { id: string; label: string; severity: number; description: string; suggestion?: string }[];
}

interface UIState {
  authOpen: boolean;
  setAuthOpen: (v: boolean) => void;
  analysisItem?: AnalysisItem | null;
  setAnalysisItem: (i: AnalysisItem | null) => void;
  history: AnalysisItem[];
  addHistory: (i: AnalysisItem) => void;
  dailyRemaining: number;
  decrementQuota: () => void;
  referralCredits: number;
  addReferralCredit: () => void;
  user?: { id: string; email: string } | null;
  setUser: (u: UIState['user']) => void;
  secureMode: boolean;
  toggleSecureMode: () => void;
}

const DAILY_FREE = 15;

export const useUIStore = create<UIState>((set) => ({
  authOpen: false,
  setAuthOpen: (v) => set({ authOpen: v }),
  analysisItem: null,
  setAnalysisItem: (i) => set({ analysisItem: i }),
  history: [],
  addHistory: (i) => set((s) => ({ history: [i, ...s.history].slice(0, 200) })),
  dailyRemaining: DAILY_FREE,
  decrementQuota: () => set((s) => ({ dailyRemaining: Math.max(0, s.dailyRemaining - 1) })),
  referralCredits: 0,
  addReferralCredit: () => set((s) => ({ referralCredits: s.referralCredits + 1, dailyRemaining: s.dailyRemaining + 1 })),
  user: null,
  setUser: (u) => set({ user: u }),
  secureMode: false,
  toggleSecureMode: () => set(s => ({ secureMode: !s.secureMode })),
}));
