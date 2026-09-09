import * as THREE from 'three';

import { CAMERA_FOV, CARD_HEIGHT } from '@/config/constants.ts';

/**
 * 计算中奖卡片的缩放值.
 *
 * @param cameraZ - 初始 camera.position.z 值.
 * @param sphereRadius - 卡片球半径.
 * @param targetScreenRatio - 中奖卡片占屏幕高度的比例（默认 0.4，即 40%）.
 * @returns 中奖卡片的缩放值.
 */
function calcWinnerScale(cameraZ: number, sphereRadius: number, targetScreenRatio: number = 0.4): number {
  // 1. 将卡片送到相机前方一个【固定比例视距】的位置
  // 放在相机与球体最前沿(R)中间偏前的位置 (比如距离相机 1.5 * R)
  // 这样既能绝对摆脱球体包围 (Z_target > R)，又距离相机安全
  const targetDistanceToCamera = Math.min(1200, cameraZ - sphereRadius * 1.3);

  // 2. 根据视角 (FOV=40) 算出在这个 Z 轴位置上，屏幕视锥体的真实物理高度
// VisibleHeight = 2 * distance * tan(fov / 2)
  const visibleHeight = 2 * targetDistanceToCamera * Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2));

// 3. 计算卡片达到目标屏幕占比 (targetScreenRatio) 所需的实际 Scale
// 目标高度 = visibleHeight * targetScreenRatio
  const targetCardHeight = visibleHeight * targetScreenRatio;

  return targetCardHeight / CARD_HEIGHT;
}

export default calcWinnerScale;
