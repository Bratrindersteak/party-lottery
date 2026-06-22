import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { LOTTERY, SETTING, DEFAULT_TITLE } from '@/config/constants.ts';

type ScreenType = typeof LOTTERY | typeof SETTING;

interface LotteryStore {
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;

  title: string; // 抽奖标题.
  setTitle: (title: string) => void;
}

export const useLotteryStore = create<LotteryStore>()(
  persist(
    (set) => ({
      currentScreen: LOTTERY, // 默认显示抽奖大屏
      setScreen: (screen) => set({ currentScreen: screen }),

      title: DEFAULT_TITLE,
      setTitle: (newTitle: string) => set({ title: newTitle }),
    }),
    {
      name: 'party-lottery',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
