import type { Member } from '@/types/lottery.ts';

/**
 * 带权重的抽奖 (Weighted Random).
 * 有时公司会有特殊需求，比如“入职 5 年以上老员工中奖概率更高”或“特定职级中奖率翻倍”.
 * 算法思路（权重区间法）：给每个人分配权重（如：新员工 1，老员工 3）.计算总权重 W。生成一个 [0, W) 之间的随机数.判断随机数落在了哪个员工的权重区间内.
 *
 * @param members - 人员列表.
 * @param count - 指标人数.
 */
export default function weightedRandom(members: Member[], count: number): Member[] {
  // 1. 拷贝原始数据，避免修改原数组.
  const pool: Member[] = [...members];
  const winners: Member[] = [];

  // 2. 确保抽取人数不大于池子总人数.
  const actualCount = Math.min(count, pool.length);

  for (let i = 0; i < actualCount; i++) {
    // 3. 计算当前池子的总权重.
    const totalWeight = pool.reduce((sum, item) => sum + (item.weight || 0), 0);

    // 4. 生成随机数.
    let random = Math.random() * totalWeight;

    // 5. 确定中奖者.
    for (let j = 0; j < pool.length; j++) {
      const item = pool[j];
      const weight = item.weight || 0;

      if (random < weight) {
        // 记录中奖者
        winners.push(item);
        // 关键：从中奖池中移除该成员，防止重复中奖
        pool.splice(j, 1);
        break;
      }
      random -= weight;
    }
  }

  return winners;
}
