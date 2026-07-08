import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware' // 🚀 1. 核心：请出持久化门神

import type { Record } from '@/types/lottery';

interface RecordStore {
  id: number;
  records: Record[];
  create: (item: Omit<Record, 'id'>) => Promise<void>; // 💡 新建音乐时，入参通常是不带 id 的
  bulkCreate: (items: Omit<Record, 'id'>[]) => Promise<void>;
  update: (item: Record) => Promise<void>;
  delete: (item: Record) => Promise<void>;
  bulkDelete: (ids: number[]) => Promise<void>;
  clear: () => Promise<void>;
}

export const useRecordStore = create<RecordStore>()(
  persist(
    (set) => ({
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
