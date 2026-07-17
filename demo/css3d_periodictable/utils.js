import TWEEN from 'three/addons/libs/tween.module.js';

export function transform(objects, targets, duration, renderer, scene, camera) {
  TWEEN.removeAll();

  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    const target = targets[i];

    new TWEEN.Tween(object.position)
      .to({x: target.position.x, y: target.position.y, z: target.position.z}, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    new TWEEN.Tween(object.rotation)
      .to({x: target.rotation.x, y: target.rotation.y, z: target.rotation.z}, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }

  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(() => render(renderer, scene, camera))
    .start();
}

export function onWindowResize(renderer, scene, camera) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render(renderer, scene, camera);
}

export function animate(controls) {
  requestAnimationFrame(() => animate(controls));

  TWEEN.update();

  controls.update();
}

export function render(renderer, scene, camera) {
  renderer.render(scene, camera);
}
