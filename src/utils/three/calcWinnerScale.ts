import * as THREE from 'three';

import { CAMERA_FOV, CARD_HEIGHT, CARDS_HEIGHT_RATIO, GAP_Y, WINNER_COLS } from '@/config/constants.ts';

/**
 * 计算中奖卡片的缩放值.
 *
 * @param cameraZ - 初始 camera.position.z 值.
 * @param sphereRadius - 卡片球半径.
 * @param total - 获奖总数.
 * @returns 中奖卡片的缩放值.
 */
function calcWinnerScale(cameraZ: number, sphereRadius: number, total: number): number {
  // 1. 将卡片送到相机前方一个【固定比例视距】的位置
  // 放在相机与球体最前沿(R)中间偏前的位置 (比如距离相机 1.5 * R)
  // 这样既能绝对摆脱球体包围 (Z_target > R)，又距离相机安全
  const targetDistanceToCamera = Math.min(1200, cameraZ - sphereRadius * 1.3);

  // 2. 根据视角 (FOV=40) 算出在这个 Z 轴位置上，屏幕视锥体的真实物理高度.
  const visibleHeight = 2 * targetDistanceToCamera * Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2));

  const winnerRows = Math.ceil(total / WINNER_COLS);

  // 3. 整个中奖矩阵在屏幕上的高度占比.
  let targetAreaRatio: number;
  if (winnerRows === 1) {
    targetAreaRatio = 0.3;
  } else if (winnerRows === 2) {
    targetAreaRatio = 0.6;
  } else {
    targetAreaRatio = CARDS_HEIGHT_RATIO;
  }

  // 4. 算出整个中奖区域的目标屏显总高度.
  const targetTotalAreaHeight = visibleHeight * targetAreaRatio;

  // 5. 扣除行间距占用的物理高度.
  const totalGapHeight = (winnerRows - 1) * GAP_Y;
  const targetAllCardsHeight = targetTotalAreaHeight - totalGapHeight;

  // 6. 算出单张卡片的目标物理高度. 防御性处理：防止行数过多时计算出负数或极小值.
  const singleCardTargetHeight = Math.max(10, targetAllCardsHeight / winnerRows);

  return singleCardTargetHeight / CARD_HEIGHT;
}

export default calcWinnerScale;
