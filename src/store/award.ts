import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware' // 🚀 1. 核心：请出持久化门神

import { Award } from '@/types/lottery'

export const useAwardStore = create(
  persist(
    (set, get) => ({
      awards: [],

      init: async () => {},

      add: async () => {},

      bulkAdd: async () => {},

      update: async () => {},

      remove: async () => {},

      bulkRemove: async () => {},

      clear: async () => {},
    }),
    {
      name: 'party-lottery-award',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
