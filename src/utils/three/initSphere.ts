import * as THREE from 'three';

import { CARD_WIDTH, CARD_HEIGHT } from '@/config/constants.ts';

import type { Vector3, Object3D } from 'three';

function initSphere(index: number, total: number, vector: Vector3, targets: Object3D[]) {
  // 1. 设置基础基础卡片间距系数（可根据卡片的真实宽高适当微调，比如 100~150）
  const baseSpacing =  Math.ceil(Math.sqrt((CARD_WIDTH ** 2) + (CARD_HEIGHT ** 2)) * 1.25 / Math.sqrt(4 * Math.PI));
  // 2. 动态计算球体半径：基础半径 + 根据总数开平方动态扩展
  // 也可以用 Math.max 设个最小值，防止卡片极少时球体缩得太小
  const radius = Math.max(300, Math.sqrt(total) * baseSpacing);

  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;

  const object = new THREE.Object3D();

  object.position.setFromSphericalCoords(radius, phi, theta);

  vector.copy(object.position).multiplyScalar(2);

  object.lookAt(vector);

  targets.push(object);
}

export default initSphere;
