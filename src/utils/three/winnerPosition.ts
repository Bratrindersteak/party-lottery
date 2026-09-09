import { CARD_WIDTH, CARD_HEIGHT, GAP_X, GAP_Y, WINNER_COLS } from '@/config/constants.ts';

import type { ObjectPosition } from '@/types/3d.ts';

/**
 * 计算每一个 CSS3DObject 在 3D 空间中的目标位置 (x, y, z).
 *
 * @param total - 中奖总人数.
 * @param sphereRadius - 球体卡片半径.
 * @param cameraZ - 初始化时的 camera.position.z 值.
 * @param scale - 缩放比例.
 * @returns 获奖卡片们的 position 坐标数组.
 */
function winnerPosition(total: number, sphereRadius: number, cameraZ: number, scale: number): ObjectPosition[] {
  // 1. 根据总人数动态决定列数.
  const cols = Math.min(total, WINNER_COLS);

  const rows = Math.ceil(total / cols);
  const stepX = (CARD_WIDTH + GAP_X) * scale;
  const stepY = (CARD_HEIGHT + GAP_Y) * scale;

  // 2. 整体阵列的居中偏移量 (基于完整网格).
  const totalWidth = (cols - 1) * stepX;
  const totalHeight = (rows - 1) * stepY;
  const offsetX = totalWidth / 2;
  const offsetY = totalHeight / 2;

  // 3. 计算最后一行的卡片数量及尾行居中偏移.
  const lastRowItems = total % cols || cols;
  const lastRowOffsetX = ((lastRowItems - 1) * stepX) / 2;

  const positions: ObjectPosition[] = [];

  // 1. 将卡片送到相机前方一个【固定比例视距】的位置
  // 放在相机与球体最前沿(R)中间偏前的位置 (比如距离相机 1.5 * R)
  // 这样既能绝对摆脱球体包围 (Z_target > R)，又距离相机安全
  const targetDistanceToCamera = Math.min(1200, cameraZ - sphereRadius * 1.3);
  const z = cameraZ - targetDistanceToCamera;

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

    // Y 轴：上方为正，下方为负.
    const y = -(row * stepY - offsetY);

    positions.push({ x, y, z });
  }

  return positions;
}

export default winnerPosition;
