import { create } from 'zustand'

type ScreenType = 'LOTTERY' | 'CONFIG'

interface LotteryStore {
  currentScreen: ScreenType
  setScreen: (screen: ScreenType) => void
  // ... 其他员工数据和奖项配置
}

export const useLotteryStore = create<LotteryStore>((set) => ({
  currentScreen: 'CONFIG', // 默认显示抽奖大屏
  setScreen: (screen) => set({ currentScreen: screen }),
}))
