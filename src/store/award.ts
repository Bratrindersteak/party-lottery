import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware' // 🚀 1. 核心：请出持久化门神

import type { Award } from '@/types/lottery';

interface AwardStore {
  id: number;
  awards: Award[];

  create: (item: Omit<Award, 'id'>) => Promise<void>; // 💡 新建音乐时，入参通常是不带 id 的
  update: (item: Award) => Promise<void>;
  delete: (item: Award) => Promise<void>;
  bulkDelete: (ids: number[]) => Promise<void>;
  clear: () => Promise<void>;
}

export const useAwardStore = create<AwardStore>()(
  persist(
    (set) => ({
      id: 0,
      awards: [],

      create: async (item: Award) => {
        set((state) => ({ awards: [...state.awards, { id: state.id++, ...item }] }));
      },

      update: async (item: Award) => {
        set((state) => ({
          awards: state.awards.map((award: Award) => award.id === item.id ? item : award),
        }));
      },

      delete: async (item: Award) => {
        set((state) => ({
          awards: state.awards.filter((award: Award) => award.id !== item.id),
        }));
      },

      bulkDelete: async (ids: number[]) => {
        set((state) => ({
          awards: state.awards.filter((award: Award) => !ids.includes(award.id as number)),
        }));
      },

      clear: async () => {
        set(() => ({ awards: [] }));
      },
    }),
    {
      name: 'party-lottery-award',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
