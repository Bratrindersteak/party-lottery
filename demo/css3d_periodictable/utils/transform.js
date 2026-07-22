import TWEEN from 'three/addons/libs/tween.module.js';

let tweenInstance = null;

export default function transform(objects, targets, duration) {
  // 1. 🚨 核心优化：如果上一次的全局渲染计时器还没跑完，立刻叫停它！
  // 这会直接触发上一个 Tween 的 .onStop()，妥善释放上一个 Promise
  if (tweenInstance) {
    tweenInstance.stop();
    tweenInstance = null;
  }

  // 2. 遍历所有物体，让它们各自飞向新目标（保持不变）
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    const target = targets[i];

    if (object._positionTween) object._positionTween.stop();
    if (object._rotationTween) object._rotationTween.stop();

    object._positionTween = new TWEEN.Tween(object.position)
      .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    object._rotationTween = new TWEEN.Tween(object.rotation)
      .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }

  // 3. 将新创建的计时器赋给全局变量
  return new Promise((resolve) => {
    tweenInstance = new TWEEN.Tween({})
      .to({}, duration * 2)
      .onComplete(() => {
        tweenInstance = null; // 正常播完，释放引用
        resolve();
      })
      .onStop(() => {
        tweenInstance = null; // 被中途切断停下，也释放引用
        resolve();
      });

    tweenInstance.start();
  });
}
