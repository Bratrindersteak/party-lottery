import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { db } from '@/config/db';
import { OPENING_MUSIC, LOTTERY_MUSIC, WINNING_MUSIC } from '@/config/constants.ts';

import type { Music } from '@/types/lottery';

interface MusicStore {
  musics: Music[];
  openingId: number | null;
  lotteryId: number | null;
  winningId: number | null;
  setMusic: (type: string, id: number) => Promise<void>;
  getMusics: () => Promise<void>;
  create: (item: Omit<Music, 'id'>) => Promise<void>; // 💡 新建音乐时，入参通常是不带 id 的
  bulkCreate: (items: Omit<Music, 'id'>[]) => Promise<void>;
  update: (item: Music) => Promise<void>;
  delete: (item: Music) => Promise<void>;
  bulkDelete: (ids: number[]) => Promise<void>;
  clear: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set) => ({
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

      getMusics: async () => {
        try {
          const data = await db.music.toArray();
          set({ musics: data });
        } catch (error) {
          console.error('获取音乐数据失败: ', error);
        }
      },

      create: async (item: Music) => {
        try {
          const id: number = await db.music.add(item);
          set((state) => ({ musics: [...state.musics, { id, ...item }] }));
        } catch (error) {
          console.error('添加音乐失败: ', error);
        }
      },

      bulkCreate: async (items: Music[]) => {
        try {
          const realIds: number[] = await db.music.bulkAdd(items, undefined, { allKeys: true });
          const newMusics = items.map((item, index) => ({ id: realIds[index], ...item }));

          set((state) => ({ musics: [...state.musics, ...newMusics] }));
        } catch (error) {
          console.error('批量添加音乐失败: ', error);
        }
      },

      update: async (item: Music) => {
        const { id, ...rest } = item;

        try {
          await db.member.update(id, rest);

          set((state) => ({
            musics: state.musics.map((music: Music) => music.id === item.id ? { id, ...rest } : music),
          }));
        } catch (error) {
          console.error('更新音乐失败: ', error);
        }
      },

      delete: async (item: Music) => {
        try {
          await db.music.delete(item.id);

          set((state) => ({
            musics: state.musics.filter((music: Music) => music.id !== item.id),
          }));
        } catch (error) {
          console.error('删除音乐失败: ', error);
        }
      },

      bulkDelete: async (ids: number[]) => {
        try {
          await db.music.bulkDelete(ids);

          set((state) => ({
            musics: state.musics.filter((music: Music) => !ids.includes(music.id as number)),
          }));
        } catch (error) {
          console.error('批量删除音乐失败: ', error);
        }
      },

      clear: async () => {
        try {
          await db.music.clear();

          set(() => ({ musics: [] }));
        } catch (error) {
          console.error('清空音乐列表失败: ', error);
        }
      },
    }),
    {
      name: 'party-lottery-music',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        openingId: state.openingId,
        lotteryId: state.lotteryId,
        winningId: state.winningId,
      }),
    }
  )
);
