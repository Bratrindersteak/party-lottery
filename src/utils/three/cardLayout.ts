/**
 * 👑 智能矩阵布局计算器
 * @param total 卡片总数
 * @param gapX 水平间距（默认 140）
 * @param gapY 垂直间距（默认 180）
 * @param aspect 期望的整体长宽比（默认 1.777，即 16:9）
 */
function cardLayout(total: number, gapX = 140, gapY = 180, aspect = 1.777) {
  // 1. 🧠 核心数学魔法：利用开根号倒推符合 16:9 的完美列数
  // 公式原理：列数 * 行数 = total，且 (列数 * gapX) / (行数 * gapY) = aspect
  const idealCol = Math.sqrt((total * gapY * aspect) / gapX);

  // 2. 取整，确保列数是整数（向上取整能保证视觉上列稍微多一点，横向更舒展）
  let col = Math.ceil(idealCol);

  // 规避极端情况：如果总数太少，列数不能为 0
  if (col < 1) col = 1;
  if (col > total) col = total;

  // 3. 根据列数，动态算出总行数
  const row = Math.ceil(total / col);

  // 4. 计算完美的几何偏移起点（对半平分 + 间隙修正）
  const offsetX = -((col - 1) * gapX) / 2;
  const offsetY = ((row - 1) * gapY) / 2;

  return { col, row, offsetX, offsetY };
}

export default cardLayout;
