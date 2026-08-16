import TWEEN from 'three/addons/libs/tween.module.js';

import render from './render.js';

let rotatingInstance = null;

/**
 * 万能旋转/回正控制器.
 *
 * @param instances - .
 * @param rotations - 自转圈数.
 * @param duration - 动画耗时（秒）.
 * @param easing - 运动速率函数.
 */
export default function rotating(instances, rotations, duration, easing = TWEEN.Easing.Cubic.Out) {
  const { renderer, scene, camera } = instances;

  // 1. 🚨 进来先定点清除前任旋转动画，绝对不打架
  if (rotatingInstance) {
    rotatingInstance.stop();
    rotatingInstance = null;
  }

  // 3. 返回 Promise
  return new Promise((resolve) => {
    rotatingInstance = new TWEEN.Tween(scene.rotation)
      .to({ x: 0, y: Math.PI * 2 * rotations, z: 0 }, duration * 1000)
      .easing(easing)
      .onUpdate(() => {
        render(renderer, scene, camera);
      })
      .onComplete(() => {
        rotatingInstance = null;
        resolve();
      })
      .onStop(() => {
        rotatingInstance = null;
        resolve();
      });

    rotatingInstance.start();
  });
}
