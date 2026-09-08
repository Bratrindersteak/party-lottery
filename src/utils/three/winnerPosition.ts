import { WINNER_SCALE, CARD_WIDTH, CARD_HEIGHT, GAP_X, GAP_Y } from '@/config/constants.ts';

import type { ObjectPosition } from '@/types/3d.ts';

/**
 * 计算每一个 CSS3DObject 在 3D 空间中的目标位置 (x, y, z).
 *
 * @param total - 中奖总人数.
 * @param memberLength - 卡片总数.
 * @returns 获奖卡片们的 position 坐标数组.
 */
function winnerPosition(total: number, memberLength: number): ObjectPosition[] {
  const maxCols = 6;

  // 1. 根据总人数动态决定列数.
  let cols = Math.min(total, maxCols);
  if (total === 4) cols = 2; // 4人时 2x2 布局比 4x1 更美观
  if (total === 9) cols = 3; // 9人时 3x3 布局

  const rows = Math.ceil(total / cols);
  const stepX = (CARD_WIDTH + GAP_X) * WINNER_SCALE;
  const stepY = (CARD_HEIGHT + GAP_Y) * WINNER_SCALE;

  // 2. 整体阵列的居中偏移量 (基于完整网格).
  const totalWidth = (cols - 1) * stepX;
  const totalHeight = (rows - 1) * stepY;
  const offsetX = totalWidth / 2;
  const offsetY = totalHeight / 2;

  // 3. 计算最后一行的卡片数量及尾行居中偏移.
  const lastRowItems = total % cols || cols;
  const lastRowOffsetX = ((lastRowItems - 1) * stepX) / 2;

  const positions: ObjectPosition[] = [];

  const baseSpacing =  Math.ceil(Math.sqrt((CARD_WIDTH ** 2) + (CARD_HEIGHT ** 2)) * 1.05 / Math.sqrt(4 * Math.PI));
  const radius = Math.sqrt(memberLength) * baseSpacing;
  // TODO 这里 safeMargin 的值需要根据当前 camera.position.z 的值去计算.
  const safeMargin = 2000;
  const z = radius + safeMargin;

  for (let i = 0; i < total; i++) {
    const row = Math.floor(i / cols); // 当前行 (0 开始)
    const col = i % cols;             // 当前列 (0 开始)
    const isLastRow = (row === rows - 1);

    let x; // 如果是最后一行且没填满，用尾行专属居中偏移；否则用整体偏移.
    if (isLastRow && lastRowItems < cols) {
      x = col * stepX - lastRowOffsetX;
    } else {
      x = col * stepX - offsetX;
    }

    const y = -(row * stepY - offsetY); // Y 轴：上方为正，下方为负.

    positions.push({ x, y, z });
  }

  return positions;
}

export default winnerPosition;
