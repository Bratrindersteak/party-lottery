import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware' // 🚀 1. 核心：请出持久化门神

import { Member } from '@/types/lottery'
import { db } from '@/config/db'

export const useMemberStore = create(
  persist(
    (set, get) => ({
      members: [],

      init: async () => {},

      add: async () => {},

      bulkAdd: async () => {},

      update: async () => {},

      remove: async () => {},

      bulkRemove: async () => {},

      clear: async () => {},
    }),
    {
      name: 'party-lottery-member',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
