import { create } from 'zustand';

import { db } from '@/config/db';
import { generateTempId } from '@/utils/uuid.ts';

import type { Member } from '@/types/lottery';

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

  add: async (item: Member) => {
    const { _isEdit, _backup, _type, id, ...rest } = item;

    if (_isEdit === true) {
      // 若 item 没有 ID，则直接分配临时 ID.
      const tempItem = { ...item, id: id || generateTempId() };

      set((state) => ({ members: [...state.members, tempItem] }));
    } else {
      try {
        const realId: number = await db.member.add(rest);
        // 🚀 3. 内存渲染层：我们用带真ID的新对象去替换内存，顺手把 _isEdit 摘掉（设为 false）
        set((state) => ({
          members: state.members.map((member: Member) => member.id === id ? { id: realId, ...rest } : member),
        }));
      } catch (error) {
        console.error('添加人员失败: ', error);
      }
    }
  },

  save: async (item: Member) => {
  },

  cancel: (item: Member) => {
    const { _backup, _type, id } = item;

    if (_type === 'add') {
      set((state) => ({
        members: state.members.filter((member: Member) => member.id !== id),
      }));
    } else if (_type === 'edit') {
      set((state) => ({
        members: state.members.map((member: Member) => member.id === id ? _backup : member),
      }));
    }
  },
  edit: (item: Member) => {
    const deepCloneItem = JSON.parse(JSON.stringify(item));

    const tempItem = { ...item, _backup: deepCloneItem, _isEdit: true, _type: 'edit' };

    set((state) => ({
      members: state.members.map((member: Member) => member.id === item.id ? tempItem : member),
    }));
  },

  create: async (item: Member) => {
    const { _isEdit, _backup, _type, id, ...rest } = item;

    if (_isEdit === true) {
      set((state) => ({ members: [...state.members, item] }));
    } else {
      try {
        const realId: number = await db.member.add(rest);
        // 🚀 3. 内存渲染层：我们用带真ID的新对象去替换内存，顺手把 _isEdit 摘掉（设为 false）
        set((state) => ({
          members: state.members.map((member: Member) => member.id === id ? { id: realId, ...rest } : member),
        }));
      } catch (error) {
        console.error('添加人员失败: ', error);
      }
    }
  },

  bulkCreate: async (items: Member[]) => {
  },

  update: async (item: Member) => {
    set((state) => ({
      members: state.members.map((member: Member) => member.id === item.id ? item : member),
    }));
  },

  delete: async (item: Member) => {
    set((state) => ({
      members: state.members.filter((member: Member) => member.id !== item.id),
    }));
  },

  bulkDelete: async (items: Member[]) => {
  },

  clear: async () => {
  },
}));
