import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { GENERAL, MEMBER, AWARD, RECORD, MUSIC, INSTRUCTION } from '@/config/constants.ts';

type SettingModule = typeof GENERAL | typeof MEMBER | typeof AWARD | typeof RECORD | typeof MUSIC | typeof INSTRUCTION;

interface SettingStore {
  currentModule: SettingModule;
  setModule: (module: SettingModule) => void;

  language: string;
  setLanguage: (language: string) => void;

  mute: boolean;
  setMute: (mute: boolean) => void;

  init: () => void;
}

export const useSettingStore = create<SettingStore>()(persist(
  (set) => ({
    currentModule: GENERAL,
    setModule: (module: SettingModule) => {
      set({ currentModule: module });
    },

    language: 'zhCN',
    setLanguage: async (language: string) => {
      set({ language });
    },

    mute: false,
    setMute: (mute: boolean) => set({ mute }),

    init: () => {},
  }), {
    name: 'party-lottery-setting',
    storage: createJSONStorage(() => localStorage),
  },
));
