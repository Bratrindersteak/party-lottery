import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { Music } from '@/types/lottery';

interface MusicStore {
  id: number;
  musics: Music[];
  openingId: number | null;
  lotteryId: number | null;
  winningId: number | null;

  create: (item: Omit<Music, 'id'>) => Promise<void>; // 💡 新建音乐时，入参通常是不带 id 的
  bulkCreate: (items: Omit<Music, 'id'>[]) => Promise<void>;
  update: (item: Music) => Promise<void>;
  delete: (item: Music) => Promise<void>;
  bulkDelete: (ids: number[]) => Promise<void>;
  clear: () => Promise<void>;

  // 🎵 顺手帮你把控制 BGM 切换的设置项留个位置（比如设置当前播放哪首）
  // setPlayingIds: (type: 'opening' | 'lottery' | 'winning', id: number | null) => void;
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      id: 0,
      musics: [],
      openingId: null,
      lotteryId: null,
      winningId: null,

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
    }
  )
);
