import { db } from '@/config/db';

import type { Member } from '@/types/lottery';
import { create } from 'zustand';

export const useMemberStore = create((set, get) => ({
  members: [],
  init: async () => {
    try {
      const data = await db.member.toArray();
      set({ members: data });
    } catch (error) {
      console.error('初始化人员数据失败: ', error);
    }
  },
  get: async (id: number): Promise<Member|null> => {
    try {
      return await db.member.get(id) || null;
    } catch (error) {
      console.error('查询人员信息失败: ', error);
      return null;
    }
  },
  create: async (item: Member) => {
    const { _isEdit, _backup, _type, id, ...rest } = item;

    try {
      const realId: number = await db.member.add(rest);
      // 🚀 3. 内存渲染层：我们用带真ID的新对象去替换内存，顺手把 _isEdit 摘掉（设为 false）
      set((state) => ({
        members: state.members.map((member: Member) => member.id === id ? { id: realId, ...rest } : member),
      }));
    } catch (error) {
      console.error('添加人员信息失败: ', error);
    }
  },
  createInMemory: async (item: Member) => {
    set((state) => ({ members: [...state.members, item] }));
  },
  bulkCreate: async (items: Member[]) => {
    try {
      const realIds: number[] = await db.member.bulkAdd(items, undefined, { allKeys: true });
      const newMembers = items.map((item, index) => ({ id: realIds[index], ...item }));

      set((state) => ({ members: [...state.members, ...newMembers] }));
    } catch (error) {
      console.error('导入人员信息失败: ', error);
    }
  },
  update: async (item: Member) => {
    const { _isEdit, _backup, _type, id, ...rest } = item;

    try {
      await db.member.update(id, rest);

      set((state) => ({
        members: state.members.map((member: Member) => member.id === id ? { id, ...rest } : member),
      }));
    } catch (error) {
      console.error('更新人员信息失败: ', error);
    }
  },
  updateInMemory: (item: Member) => {
    set((state) => ({
      members: state.members.map((member: Member) => member.id === item.id ? item : member),
    }));
  },
  delete: async (item: Member) => {
    try {
      await db.member.delete(item.id);

      set((state) => ({
        members: state.members.filter((member: Member) => member.id !== item.id),
      }));
    } catch (error) {
      console.error('删除人员信息失败: ', error);
    }
  },
  deleteInMemory: (item: Member) => {
    set((state) => ({
      members: state.members.filter((member: Member) => member.id !== item.id),
    }));
  },
  bulkDelete: async (ids: number[]) => {
    try {
      await db.member.bulkDelete(ids);

      set((state) => ({
        members: state.members.filter((member: Member) => !ids.includes(member.id as number)),
      }));
    } catch (error) {
      console.error('批量删除人员信息失败: ', error);
    }
  },
  clear: async () => {
    try {
      await db.member.clear();

      set(() => ({ members: [] }));
    } catch (error) {
      console.error('清空人员信息失败: ', error);
    }
  },
}));
