import { create } from 'zustand';
import { message } from 'antd';

import { db } from '@/config/db';
import { consoleError } from '@/utils/console.ts';

import type { Member } from '@/types/lottery';

interface MemberStore {
  members: Member[];
  isMembersLoaded: boolean;
  setIsMembersLoaded: (isMembersLoaded: boolean) => void;
  init: () => Promise<void>;
  get: (id: number) => Promise<Member | null>;
  create: (item: Member) => Promise<void>;
  createInMemory: (item: Member) => void;
  bulkCreate: (items: Member[]) => Promise<void>;
  update: (item: Member) => Promise<void>;
  updateInMemory: (item: Member) => void;
  delete: (item: Member) => Promise<void>;
  deleteInMemory: (item: Member) => void;
  bulkDelete: (ids: number[]) => Promise<void>;
  clear: () => Promise<void>;
}

export const useMemberStore = create<MemberStore>((set, get) => ({
  members: [],
  isMembersLoaded: false,
  setIsMembersLoaded: (isMembersLoaded:boolean) => {
    set({ isMembersLoaded });
  },
  init: async () => {
    try {
      const data = await db.member.toArray();

      set({ members: data });
      get().setIsMembersLoaded(true);
    } catch (error) {
      message.error('初始化成员数据失败!');
      consoleError('store > member > init', '初始化成员数据失败', error);
    }
  },
  get: async (id: number): Promise<Member|null> => {
    try {
      return await db.member.get(id) || null;
    } catch (error) {
      message.error('查询成员信息失败!');
      consoleError('store > member > get', '查询成员信息失败', error);
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
      message.error('添加成员信息失败!');
      consoleError('store > member > create', '添加成员信息失败', error);
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
      message.error('导入成员信息失败!');
      consoleError('store > member > bulkCreate', '导入成员信息失败', error);
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
      message.error('更新成员信息失败!');
      consoleError('store > member > update', '更新成员信息失败', error);
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
      message.error('删除成员信息失败!');
      consoleError('store > member > delete', '删除成员信息失败', error);
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
      message.error('批量删除成员失败!');
      consoleError('store > member > bulkDelete', '批量删除成员失败', error);
    }
  },
  clear: async () => {
    try {
      await db.member.clear();

      set(() => ({ members: [] }));
    } catch (error) {
      message.error('清空成员失败!');
      consoleError('store > member > clear', '清空成员失败', error);
    }
  },
}));
