import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware' // 🚀 1. 核心：请出持久化门神

import type { Record } from '@/types/lottery';

export const useRecordStore = create(
  persist(
    (set, get) => ({
      id: 0,
      records: [],

      create: async (item: Record) => {
        set((state) => ({ records: [...state.records, { id: state.id++, ...item }] }));
      },

      bulkCreate: async (items: Record[]) => {
        set((state) => ({ records: [...state.records, ...items.map(item => ({ id: state.id++, ...item }))] }));
      },

      update: async (item: Record) => {
        set((state) => ({
          records: state.records.map((record: Record) => record.id === item.id ? item : record),
        }));
      },

      delete: async (item: Record) => {
        set((state) => ({
          records: state.records.filter((record: Record) => record.id !== item.id),
        }));
      },

      bulkDelete: async (ids: number[]) => {
        set((state) => ({
          records: state.records.filter((record: Record) => !ids.includes(record.id as number)),
        }));
      },

      clear: async () => {
        set(() => ({ records: [] }));
      },
    }),
    {
      name: 'party-lottery-record',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
