import * as THREE from 'three';

import type { Vector3, Object3D } from 'three';

function initSphere(index: number, total: number, vector: Vector3, targets: Object3D[]  ) {
  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;

  const object = new THREE.Object3D();

  object.position.setFromSphericalCoords(800, phi, theta);

  vector.copy(object.position).multiplyScalar(2);

  object.lookAt(vector);

  targets.push(object);
}

export default initSphere;
