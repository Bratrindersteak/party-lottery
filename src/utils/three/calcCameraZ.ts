import { CARD_HEIGHT, GAP_Y, CAMERA_FOV, MIN_CAMERA_Z, CARDS_HEIGHT_RATIO } from '@/config/constants.ts';

/**
 * 根据卡片区域的屏幕高度占比计算对应的 camera.position.z 值.
 *
 * @param rows - 行数.
 * @returns camera.position.z 的初始值.
 */
function calcCameraZ(rows: number): number {
  // 1. 计算整个卡片平铺区域的总高度.
  const totalHeight = rows * CARD_HEIGHT + (rows - 1) * GAP_Y;

  // 2. 角度转弧度.
  const fovRad = (CAMERA_FOV * Math.PI) / 180;

  // 3. 计算所需的 z 距离.
  const cameraZ = Math.ceil(totalHeight / (2 * CARDS_HEIGHT_RATIO * Math.tan(fovRad / 2)));

  // 4. 设置最小值，防御卡片过少时被放得过大.
  return Math.max(MIN_CAMERA_Z, cameraZ);
}

export default calcCameraZ;
