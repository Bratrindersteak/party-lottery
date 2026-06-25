import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { db } from '@/config/db';
import { OPENING_MUSIC, LOTTERY_MUSIC, WINNING_MUSIC } from '@/config/constants.ts';

import type { Music } from '@/types/lottery';

interface MusicStore {
  id: number;
  musics: Music[];
  openingId: number | null;
  lotteryId: number | null;
  winningId: number | null;
  setMusic: (type: string, id: number) => Promise<void>;
  create: (item: Omit<Music, 'id'>) => Promise<void>; // 💡 新建音乐时，入参通常是不带 id 的
  bulkCreate: (items: Omit<Music, 'id'>[]) => Promise<void>;
  update: (item: Music) => Promise<void>;
  delete: (item: Music) => Promise<void>;
  bulkDelete: (ids: number[]) => Promise<void>;
  clear: () => Promise<void>;
}

// TODO 将音乐存储由 localStorage 改为 IndexedDB.

export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      id: 0,
      musics: [],
      openingId: null,
      lotteryId: null,
      winningId: null,

      setMusic: async (type: string, id: number) => {
        switch (type) {
          case OPENING_MUSIC:
            set(() => ({ openingId: id }));
            break;
          case LOTTERY_MUSIC:
            set(() => ({ lotteryId: id }));
            break;
          case WINNING_MUSIC:
            set(() => ({ winningId: id }));
            break;
          default:
        }
      },

      create: async (item: Music) => {
        set((state) => ({ musics: [...state.musics, { id: state.id++, ...item }] }));
      },

      bulkCreate: async (items: Music[]) => {
        set((state) => ({ musics: [...state.musics, ...items.map(item => ({ id: state.id++, ...item }))] }));
      },

      update: async (item: Music) => {
        set((state) => ({
          musics: state.musics.map((music: Music) => music.id === item.id ? item : music),
        }));
      },

      delete: async (item: Music) => {
        set((state) => ({
          musics: state.musics.filter((music: Music) => music.id !== item.id),
        }));
      },

      bulkDelete: async (ids: number[]) => {
        set((state) => ({
          musics: state.musics.filter((music: Music) => !ids.includes(music.id as number)),
        }));
      },

      clear: async () => {
        set(() => ({ musics: [] }));
      },
    }),
    {
      name: 'party-lottery-music',
      storage: createJSONStorage(() => localStorage),
      // 👑 终极绝杀：精细化数据流隔离网
      // state 包含了上面所有的字段，但我们用下方的解构，只返回需要进 LocalStorage 的“轻量工种”！
      partialize: (state) => ({
        musics: state.musics,
        openingId: state.openingId,
        lotteryId: state.lotteryId,
        winningId: state.winningId,
        // 🛡️ 看这里！members 和 loading 根本没有写进这个返回对象里！
        // 这样 LocalStorage 永远不会被几千人的大数组撑爆，安全级拉满！
      }),
    }
  )
);
