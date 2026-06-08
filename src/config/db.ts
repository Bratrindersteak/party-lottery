import Dexie, { type Table } from 'dexie';

import type { Member, Music, Image } from '@/types/lottery.ts';

export const db = new Dexie('PartyLottery') as Dexie & {
  member: Table<Member>;
  music: Table<Music>;
  image: Table<Image>;
};

// 定义表结构
// 注意：只需定义主键和需要索引的字段。++ 表示自增主键。
db.version(1).stores({
  member: '++id, employeeId, name, department', // 只有列出的字段可以被 .where() 查询.
  music: '++id, name, data, size',
  image: '++id, url, file',
});
