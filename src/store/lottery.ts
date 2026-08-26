import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { LOTTERY, SETTING, DEFAULT_TITLE, INIT } from '@/config/constants.ts';

import type { LotteryStatus } from '@/types/lottery.ts';

type ScreenType = typeof LOTTERY | typeof SETTING;

interface LotteryStore {
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;

  title: string; // 抽奖标题.
  setTitle: (title: string) => void;

  currAwardId: number | null;
  setCurrAwardId: (id: number) => void;

  isAwardListExpanded: boolean;
  setIsAwardListExpanded: (expanded: boolean) => void;

  lotteryStatus: LotteryStatus;
  setLotteryStatus: (lotteryStatus: LotteryStatus) => void;
}

export const useLotteryStore = create<LotteryStore>()(
  persist(
    (set) => ({
      currentScreen: LOTTERY, // 默认显示抽奖大屏
      setScreen: (screen) => set({ currentScreen: screen }),

      title: DEFAULT_TITLE,
      setTitle: (title: string) => set({ title }),

      currAwardId: null,
      setCurrAwardId: (id: number) => set({ currAwardId: id }),

      isAwardListExpanded: false,
      setIsAwardListExpanded: (expanded: boolean) => set({ isAwardListExpanded: expanded }),

      lotteryStatus: INIT,
      setLotteryStatus: (lotteryStatus: LotteryStatus) => set({ lotteryStatus }),
    }),
    {
      name: 'party-lottery',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentScreen: state.currentScreen,
        title: state.title,
        currAwardId: state.currAwardId,
        isAwardListExpanded: state.isAwardListExpanded,
      }),
    }
  )
);
