import TWEEN from 'three/addons/libs/tween.module.js';

let tweenInstance = null;

/**
 * 万能旋转/回正控制器
 * @param scene THREE.Scene
 * @param targetY 目标弧度（如果是归零，直接传 0）
 * @param duration 动画耗时（毫秒）
 * @param easing
 */
export default function rotating(scene, targetY, duration, easing = TWEEN.Easing.Cubic.Out) {
  // 1. 🚨 进来先定点清除前任旋转动画，绝对不打架
  if (tweenInstance) {
    tweenInstance.stop();
    tweenInstance = null;
  }

  // 3. 返回 Promise
  return new Promise((resolve) => {
    tweenInstance = new TWEEN.Tween(scene.rotation)
      .to({ x: 0, y: targetY, z: 0 }, duration)
      .easing(easing)
      .onComplete(() => {
        tweenInstance = null;
        resolve();
      })
      .onStop(() => {
        tweenInstance = null;
        resolve();
      });

    tweenInstance.start();
  });
}
