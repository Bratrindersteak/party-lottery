import { CARD_HEIGHT, CARD_WIDTH, MIN_SPHERE_RADIUS } from '@/config/constants.ts';

/**
 * 计算卡片球体的半径.
 *
 * @param total - 卡片总数.
 * @returns 卡片球体半径.
 */
function calcSphereRadius(total: number): number {
  // 1. 设置卡片在球体的间距（可根据卡片的真实宽高适当微调，比如 100~150）.
  const cardSpacing =  Math.ceil(Math.sqrt((CARD_WIDTH ** 2) + (CARD_HEIGHT ** 2)) / Math.sqrt(4 * Math.PI));

  // 2. 计算球体半径：基础半径 + 根据总数开平方动态扩展.
  const basicRadius = Math.sqrt(total) * cardSpacing;

  // 3. 设置最小值，防御卡片过少时球体过小.
  return Math.max(MIN_SPHERE_RADIUS, basicRadius);
}

export default calcSphereRadius;
