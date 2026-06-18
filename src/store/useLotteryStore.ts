import { create } from 'zustand';

import { LOTTERT, SETTING } from '@/config/constants.ts';

type ScreenType = typeof LOTTERT | typeof SETTING;

interface LotteryStore {
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  // ... 其他员工数据和奖项配置
}

export const useLotteryStore = create<LotteryStore>((set) => ({
  currentScreen: LOTTERT, // 默认显示抽奖大屏
  setScreen: (screen) => set({ currentScreen: screen }),
}));
