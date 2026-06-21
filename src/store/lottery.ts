import { create } from 'zustand';

import { LOTTERT, SETTING, DEFAULT_TITLE } from '@/config/constants.ts';

type ScreenType = typeof LOTTERT | typeof SETTING;

interface LotteryStore {
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;

  title: string; // 抽奖标题.
  // ... 其他员工数据和奖项配置
}

export const useLotteryStore = create<LotteryStore>((set) => ({
  currentScreen: LOTTERT, // 默认显示抽奖大屏
  setScreen: (screen) => set({ currentScreen: screen }),

  title: DEFAULT_TITLE,
  setTitle: (newTitle: string) => set({ title: newTitle }),
}));
