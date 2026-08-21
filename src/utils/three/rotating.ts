import TWEEN from 'three/addons/libs/tween.module.js';

import type { Scene, PerspectiveCamera } from 'three';
import type { CSS3DRenderer } from 'three/addons';
import type { Tween } from 'three/addons/libs/tween.module.js';

import render from './render.js';

let rotatingInstance: Tween | null = null;

/**
 * 万能旋转/回正控制器.
 *
 * @param scene - .
 * @param camera - .
 * @param renderer - .
 * @param rotations - 自转圈数.
 * @param duration - 动画耗时（秒）.
 * @param easing - 运动速率函数.
 */
export default function rotating(scene: Scene, camera: PerspectiveCamera, renderer: CSS3DRenderer, rotations: number, duration: number, easing = TWEEN.Easing.Cubic.Out): Promise<void> {

  // 1. 🚨 进来先定点清除前任旋转动画，绝对不打架
  if (rotatingInstance) {
    rotatingInstance.stop();
  }

  // 3. 返回 Promise
  return new Promise((resolve) => {
    rotatingInstance = new TWEEN.Tween(scene.rotation)
      .to({ x: 0, y: Math.PI * 2 * rotations, z: 0 }, duration * 1000)
      .easing(easing)
      .onUpdate(() => {
        render(scene, camera, renderer);
      })
      .onComplete(() => {
        console.log('rotating was completed');
        rotatingInstance = null;
        resolve();
      })
      .onStop(() => {
        console.log('rotating was stopped');
        rotatingInstance = null;
        resolve();
      });

    rotatingInstance.start();
  });
}
