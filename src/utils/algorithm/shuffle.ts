import type { Member } from '@/types/lottery.ts';

/**
 * 基础公平算法：Fisher-Yates 洗牌 (Shuffle).
 * 这是最推荐的“阳光抽奖”算法，适用于全员等概率中奖。它的逻辑是将参与者名单随机打乱，然后按顺序取前 count 名.
 *
 * @param members - 人员列表.
 * @param count - 指标人数.
 */
export default function shuffle(members: Member[], count: number): Member[] {
  // 1. 拷贝原始数据，避免修改原数组.
  const pool = [...members];

  // 2. 随机洗牌.
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]; // 交换位置.
  }

  // 3. 确保抽取人数不大于池子总人数.
  const actualCount = Math.min(count, pool.length);

  // 4. 取前 count 名作为中奖者.
  return pool.slice(0, actualCount);
}
