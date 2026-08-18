interface Config {
  width?: number;   // 卡片宽度.
  height?: number;  // 卡片高度.
  gapX?: number;    // 横向间距.
  gapY?: number;    // 纵向间距.
  maxCols?: number; // 单行最大列数.
}

interface Position {
  x: number;
  y: number;
  z: number;
}

/**
 * 计算每一个 CSS3DObject 在 3D 空间中的目标位置 (x, y, z).
 *
 * @param {number} total - 中奖总人数
 * @param {object} config - 卡片与间距配置
 */
function winnerPosition(total: number, config: Config = {}): Position[] {
  const { width = 120, height = 160, gapX = 50, gapY = 50, maxCols = 6 } = config;

  // 1. 根据总人数动态决定列数
  let cols = Math.min(total, maxCols);
  if (total === 4) cols = 2; // 4人时 2x2 布局比 4x1 更美观
  if (total === 9) cols = 3; // 9人时 3x3 布局

  const rows = Math.ceil(total / cols);
  const stepX = width + gapX;
  const stepY = height + gapY;

  // 2. 整体阵列的居中偏移量 (基于完整网格)
  const totalWidth = (cols - 1) * stepX;
  const totalHeight = (rows - 1) * stepY;
  const offsetX = totalWidth / 2;
  const offsetY = totalHeight / 2;

  // 3. 计算最后一行的卡片数量及尾行居中偏移
  const lastRowItems = total % cols || cols;
  const lastRowOffsetX = ((lastRowItems - 1) * stepX) / 2;

  const positions: Position[] = [];

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
    const z = 0; // 展开到前排平面，Z 统一为 0（也可以加微小深度层级）.

    positions.push({ x, y, z });
  }

  return positions;
}

export default winnerPosition;
