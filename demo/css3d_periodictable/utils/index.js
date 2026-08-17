export { default as init } from './init.js';
export { default as transform } from './transform.js';
export { default as rotating } from './rotating.js';
export { default as animate } from './animate.js';
export { default as render } from './render.js';
export { default as cleanup } from './cleanup.js';

export default function shuffle(members, count) {
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

/**
 * 计算每一个 CSS3DObject 在 3D 空间中的目标位置 (x, y, z).
 *
 * @param {number} total - 中奖总人数
 * @param {object} config - 卡片与间距配置
 */
export function calcWinnerPositions(total, config = {}) {
  const {
    cardWidth = 160,   // 卡片宽度
    cardHeight = 220,  // 卡片高度
    gapX = 30,         // 横向间距
    gapY = 30,         // 纵向间距
    maxCols = 6        // 单行最大列数
  } = config;

  // 1. 根据总人数动态决定列数
  let cols = Math.min(total, maxCols);
  if (total === 4) cols = 2; // 4人时 2x2 布局比 4x1 更美观
  if (total === 9) cols = 3; // 9人时 3x3 布局

  const rows = Math.ceil(total / cols);
  const stepX = cardWidth + gapX;
  const stepY = cardHeight + gapY;

  // 2. 整体阵列的居中偏移量 (基于完整网格)
  const totalWidth = (cols - 1) * stepX;
  const totalHeight = (rows - 1) * stepY;
  const offsetX = totalWidth / 2;
  const offsetY = totalHeight / 2;

  // 3. 计算最后一行的卡片数量及尾行居中偏移
  const lastRowItems = total % cols || cols;
  const lastRowOffsetX = ((lastRowItems - 1) * stepX) / 2;

  const positions = [];

  for (let i = 0; i < total; i++) {
    const row = Math.floor(i / cols); // 当前行 (0 开始)
    const col = i % cols;             // 当前列 (0 开始)
    const isLastRow = (row === rows - 1);

    let x = 0;
    // 如果是最后一行且没填满，用尾行专属居中偏移；否则用整体偏移
    if (isLastRow && lastRowItems < cols) {
      x = col * stepX - lastRowOffsetX;
    } else {
      x = col * stepX - offsetX;
    }

    // Y 轴：上方为正，下方为负
    const y = -(row * stepY - offsetY);
    const z = 0; // 展开到前排平面，Z 统一为 0（也可以加微小深度层级）

    positions.push({ x, y, z });
  }

  return positions;
}





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
