import type { Member } from '@/types/lottery.ts';

/**
 * 基础公平算法：Fisher-Yates 洗牌 (Shuffle).
 * 这是最推荐的“阳光抽奖”算法，适用于全员等概率中奖。它的逻辑是将参与者名单随机打乱，然后按顺序取前 count 名.
 *
 * @param members - 奖池人员.
 * @param count - 抽取人数.
 * @param excludedIds - 应被排除的人员 ID.
 * @returns 中奖人员.
 */
export default function shuffle(members: Member[], count: number, excludedIds: number[]): Member[] {
  // 1. 拷贝原始数据，避免修改原数组.
  const pool: Member[] = [...members];
  const total: number = pool.length;
  const winners: Member[] = [];

  // 2. 边洗牌边筛选，凑齐 count 人即停止.
  for (let i = 0; i < total && winners.length < count; i++) {
    // 从 [i, n - 1] 中随机选一个位置与当前 i 交换
    const j = i + Math.floor(Math.random() * (total - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];

    // 如果当前选出的元素合法，加入中奖名单
    if (!excludedIds.includes(pool[i].id as number)) {
      winners.push(pool[i]);
    }
  }

  return winners;
}
