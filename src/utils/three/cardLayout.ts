import { CARD_WIDTH, CARD_HEIGHT, GAP_X, GAP_Y } from '@/config/constants.ts';

/**
 * 👑 智能矩阵布局计算器
 * @param total 卡片总数
 * @param aspect 期望的整体长宽比（默认 1.777，即 16:9）
 */
function cardLayout(total: number, aspect = 1.777) {
  // 相邻两张卡片中心点之间的水平与垂直距离.
  const stepX = CARD_WIDTH + GAP_X;
  const stepY = CARD_HEIGHT + GAP_Y;

  // 1. 🧠 核心数学魔法：利用开根号倒推符合 16:9 的完美列数
  // 公式原理：列数 * 行数 = total，且 (列数 * stepX) / (行数 * stepY) = aspect
  const idealCols = Math.sqrt((total * stepY * aspect) / stepX);

  // 2. 取整，确保列数是整数（向上取整能保证视觉上列稍微多一点，横向更舒展）
  let cols = Math.ceil(idealCols);
  // 规避极端情况：如果总数太少，列数不能为 0
  cols = Math.max(1, Math.min(cols, total));

  // 3. 根据列数，动态算出总行数
  const rows = Math.ceil(total / cols);

  // 4. 计算完美的几何偏移起点（对半平分 + 间隙修正）
  const offsetX = -((cols - 1) * stepX) / 2;
  const offsetY = ((rows - 1) * stepY) / 2;

  return { rows, cols, offsetX, offsetY };
}

export default cardLayout;
