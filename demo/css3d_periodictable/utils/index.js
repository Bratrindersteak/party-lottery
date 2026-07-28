export { default as init } from './init.js';
export { default as transform } from './transform.js';
export { default as rotating } from './rotating.js';
export { default as animate } from './animate.js';
export { default as render } from './render.js';
export { default as cleanup } from './cleanup.js';

export function calcWinnerCoord(totalCount, cardSize, windowSize, cardIndex) {
  let xTable = 0
  let yTable = 0
  const centerPosition = {
    x: 0,
    y: windowSize.height / 2,
  }
  const ruleObj = {
    maxLine: 5,
    scale: 2,
    rule: [1],
    length: 1,
  };
  const { scale, rule, length } = ruleObj
  // 计算缩放后的卡片尺寸
  const scaledCardWidth = cardSize.width * scale
  const scaledCardHeight = cardSize.height * scale
  // 计算当前卡片在第几行（从0开始）
  let currentRow = 0
  let cardIndexInRow = cardIndex // 当前卡片在其所在行中的索引

  // 根据规则确定卡片在哪一行及行内索引
  let cumulativeCount = 0
  for (let i = 0; i < rule.length; i++) {
    if (cardIndex < cumulativeCount + rule[i]) {
      currentRow = i
      cardIndexInRow = cardIndex - cumulativeCount
      break
    }
    cumulativeCount += rule[i]
  }

  // 计算当前行的卡片数量
  const cardsInCurrentRow = rule[currentRow]

  // 计算每行的垂直中心位置
  const verticalSpacing = scaledCardHeight * 1.1 // 垂直间距基于缩放后的高度
  // 计算整体高度并调整居中
  const totalHeight = (length - 1) * verticalSpacing + scaledCardHeight // 包含卡片本身的高度
  const centerYOffset = -totalHeight / 2

  // 修改此处逻辑，确保当length=2时，两行围绕中心点对称分布
  centerPosition.y = windowSize.height / 2 - totalHeight / 2

  yTable = centerPosition.y + currentRow * verticalSpacing + centerYOffset // 添加卡片高度的一半作为修正
  // 计算当前行的水平居中偏移
  const horizontalSpacing = scaledCardWidth * 1.2 // 水平间距基于缩放后的宽度
  const rowWidth = (cardsInCurrentRow - 1) * horizontalSpacing
  const offsetX = -rowWidth / 2 // 行内水平居中

  xTable = centerPosition.x + offsetX + cardIndexInRow * horizontalSpacing

  return { xTable, yTable, scale }
}

/**
 * 👑 智能矩阵布局计算器
 * @param total 卡片总数
 * @param gapX 水平间距（默认 140）
 * @param gapY 垂直间距（默认 180）
 * @param aspect 期望的整体长宽比（默认 1.777，即 16:9）
 */
export function calcLayout(total, gapX = 140, gapY = 180, aspect = 1.777) {
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
