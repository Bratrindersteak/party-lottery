import * as THREE from 'three';

import { CARD_WIDTH, CARD_HEIGHT, GAP_X, GAP_Y } from '@/config/constants.ts';

import type { Object3D } from 'three';

function initTable(index: number, cols: number, offsetX: number, offsetY: number, targets: Object3D[]) {
  // 相邻两张卡片中心点之间的水平与垂直距离.
  const stepX = CARD_WIDTH + GAP_X;
  const stepY = CARD_HEIGHT + GAP_Y;

  const object = new THREE.Object3D();
  // 动态居中.
  object.position.x = ((index % cols) * stepX) + offsetX;
  object.position.y = -(Math.floor(index / cols) * stepY) + offsetY; // 3D里第一行在最上面，所以用负号往下排

  targets.push(object);
}

export default initTable;
