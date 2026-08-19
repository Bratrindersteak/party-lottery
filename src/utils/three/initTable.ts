import * as THREE from 'three';

import type { Object3D } from 'three';

function initTable(index: number, col: number, gapX: number, gapY: number, offsetX: number, offsetY: number, targets: Object3D[]) {
  const object = new THREE.Object3D();
  // 动态居中.
  object.position.x = ((index % col) * gapX) + offsetX;
  object.position.y = -(Math.floor(index / col) * gapY) + offsetY; // 3D里第一行在最上面，所以用负号往下排

  targets.push(object);
}

export default initTable;
