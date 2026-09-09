import * as THREE from 'three';

import type { Vector3, Object3D } from 'three';

/**
 * .
 *
 * @param index - .
 * @param total - .
 * @param radius - .
 * @param vector - .
 * @param targets - .
 */
function initSphere(index: number, total: number, radius: number, vector: Vector3, targets: Object3D[]) {
  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;

  const object = new THREE.Object3D();

  object.position.setFromSphericalCoords(radius, phi, theta);

  vector.copy(object.position).multiplyScalar(2);

  object.lookAt(vector);

  targets.push(object);
}

export default initSphere;
