import * as THREE from 'three';

function initSphere(index, total, vector, targets) {
  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;

  const object = new THREE.Object3D();

  object.position.setFromSphericalCoords(800, phi, theta);

  vector.copy(object.position).multiplyScalar(2);

  object.lookAt(vector);

  targets.sphere.push(object);
}
