import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware' // 🚀 1. 核心：请出持久化门神

import type { Award, Member } from '@/types/lottery';

export const useAwardStore = create(
  persist(
    (set, get) => ({
      id: 0,
      awards: [],
      currAward: null,

      create: async (item: Award) => {
        set((state) => ({ awards: [...state.awards, { id: state.id++, ...item }] }));
      },

      update: async (item: Award) => {
        set((state) => ({
          awards: state.awards.map((member: Member) => member.id === item.id ? item : member),
        }));
      },

      delete: async (item: Award) => {
        set((state) => ({
          awards: state.awards.filter((member: Member) => member.id !== item.id),
        }));
      },

      bulkDelete: async (ids: number[]) => {
        set((state) => ({
          awards: state.awards.filter((member: Member) => !ids.includes(member.id as number)),
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
