import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // 🚀 1. 核心：请出持久化门神

import { GENERAL, MEMBER, AWARD, RECORD, MUSIC, INSTRUCTION } from '@/config/constants.ts';

type SettingModule = typeof GENERAL | typeof MEMBER | typeof AWARD | typeof RECORD | typeof MUSIC | typeof INSTRUCTION;

export const useSettingStore = create(persist(
  (set, get) => ({
    currentModule: GENERAL,

    language: 'zhCN',
    setLanguage: async (language: string) => {
      set({ language });
    },

    mute: false,
    setMute: (mute: boolean) => set({ mute }),

    init: async () => {

    },

    setModule: async (module: SettingModule) => {
      set({ currentModule: module });
    },
  }), {
    name: 'party-lottery-setting',
    storage: createJSONStorage(() => localStorage),
  },
));
