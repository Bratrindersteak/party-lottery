import TWEEN from 'three/addons/libs/tween.module.js';

import render from './render.js';

let transformInstance = null;

export default function transform(instances, objects, targets, duration) {
  const { renderer, scene, camera } = instances;

  // 1. 🚨 核心优化：如果上一次的全局渲染计时器还没跑完，立刻叫停它！
  // 这会直接触发上一个 Tween 的 .onStop()，妥善释放上一个 Promise
  if (transformInstance) {
    transformInstance.stop();
    transformInstance = null;
  }

  // 2. 遍历所有物体，让它们各自飞向新目标（保持不变）
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    const target = targets[i];

    if (object._positionTween) object._positionTween.stop();
    if (object._rotationTween) object._rotationTween.stop();

    object._positionTween = new TWEEN.Tween(object.position)
      .to({ x: target.position.x, y: target.position.y, z: target.position.z }, (0.5 + Math.random() * 0.5) * duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    object._rotationTween = new TWEEN.Tween(object.rotation)
      .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, (0.5 + Math.random() * 0.5) * duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }

  // 3. 将新创建的计时器赋给全局变量
  return new Promise((resolve) => {
    transformInstance = new TWEEN.Tween({})
      .to({}, duration)
      .onUpdate(() => {
        render(renderer, scene, camera);
      })
      .onComplete(() => {
        transformInstance = null; // 正常播完，释放引用
        resolve();
      })
      .onStop(() => {
        transformInstance = null; // 被中途切断停下，也释放引用
        resolve();
      });

    transformInstance.start();
  });
}
