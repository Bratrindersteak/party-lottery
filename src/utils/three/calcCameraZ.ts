import { CARD_HEIGHT, GAP_Y } from '@/config/constants.ts';

/**
 * 计算卡片区域占屏幕高度 85% 时的 camera.position.z
 *
 * @param rows - 行数.
 * @param fov - 垂直视角，默认 40.
 * @param ratio - 占屏幕高度比例，默认 0.85.
 * @returns .
 */
function calcCameraZ(rows: number, fov = 40, ratio = 0.75): number {
  // 1. 计算整个卡片平铺区域的总高度
  const totalCardsHeight = rows * CARD_HEIGHT + (rows - 1) * GAP_Y;

  // 2. 角度转弧度
  const fovRad = (fov * Math.PI) / 180;

  // 3. 计算所需的 z 距离
  const cameraZ = Math.ceil(totalCardsHeight / (2 * ratio * Math.tan(fovRad / 2)));

  return Math.max(1500, cameraZ);
}

export default calcCameraZ;
