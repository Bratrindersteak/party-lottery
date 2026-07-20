import TWEEN from 'three/addons/libs/tween.module.js';

// 👑 在函数外部定义一个模块级的变量，用来死死盯住当前的旋转动画
let currentRenderTween = null;

export function transform(objects, targets, duration, renderer, scene, camera) {
  // 1. 🚨 核心优化：如果上一次的全局渲染计时器还没跑完，立刻叫停它！
  // 这会直接触发上一个 Tween 的 .onStop()，妥善释放上一个 Promise
  if (currentRenderTween) {
    currentRenderTween.stop();
    currentRenderTween = null;
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
    currentRenderTween = new TWEEN.Tween({})
      .to({}, duration * 2)
      .onUpdate(() => {
        render(renderer, scene, camera);
      })
      .onComplete(() => {
        currentRenderTween = null; // 正常播完，释放引用
        resolve();
      })
      .onStop(() => {
        currentRenderTween = null; // 被中途切断停下，也释放引用
        resolve();
      });

    currentRenderTween.start();
  });
}

/**
 * 丝滑的场景旋转控制器
 * @param scene THREE.Scene 场景实例
 * @param turns 旋转的圈数（比如 2 代表转 2 圈）
 * @param duration 动画持续时间（单位：秒）
 * @param render 渲染回调函数
 */
export function rotating(scene, turns, duration, render) {
  // 🚨 关键一步：在启动新动画前，精准定点清除上一次的旋转，不伤及无辜
  if (currentRenderTween) {
    currentRenderTween.stop(); // 别用 removeAll，只让上一个旋转动画停下
    currentRenderTween = null;
  }

  // 💡 优化 1：不要直接 removeAll()，只管理当前这一个 tween 变量
  return new Promise((resolve, reject) => {
    // 计算出真正合理的弧度目标（1圈 = 2 * Math.PI）
    const targetY = scene.rotation.y + (Math.PI * 2 * turns);

    currentRenderTween = new TWEEN.Tween(scene.rotation)
      .to({ x: 0, y: targetY, z: 0 }, duration * 1000) // 毫秒单位
      .easing(TWEEN.Easing.Linear.None) // 持续旋转通常用匀速
      .onUpdate(render)
      .onComplete(() => {
        currentRenderTween = null; // 播完主动释放
        resolve();
      })
      .onStop(() => {
        currentRenderTween = null; // 被动停下也释放
        resolve(); // 💡 优化 2：被叫停时，也要妥善释放 Promise，避免外部 await 死锁
      });

    currentRenderTween.start();
  });
}

// export function transform(objects, targets, duration, renderer, scene, camera) {
//   TWEEN.removeAll();
//
//   for (let i = 0; i < objects.length; i++) {
//     const object = objects[i];
//     const target = targets[i];
//
//     new TWEEN.Tween(object.position)
//       .to({x: target.position.x, y: target.position.y, z: target.position.z}, Math.random() * duration + duration)
//       .easing(TWEEN.Easing.Exponential.InOut)
//       .start();
//
//     new TWEEN.Tween(object.rotation)
//       .to({x: target.rotation.x, y: target.rotation.y, z: target.rotation.z}, Math.random() * duration + duration)
//       .easing(TWEEN.Easing.Exponential.InOut)
//       .start();
//   }
//
//   new TWEEN.Tween(this)
//     .to({}, duration * 2)
//     .onUpdate(() => render(renderer, scene, camera))
//     .start();
// }

export function onWindowResize(renderer, scene, camera) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render(renderer, scene, camera);
}

export function animate(controls, isAutoSpinning, renderer, scene, camera) {
  requestAnimationFrame(() => animate(controls, isAutoSpinning, renderer, scene, camera));

  TWEEN.update();

  controls.update();

  // 👑 真正的无限旋转：只要开关开着，每帧都白嫖 0.002 弧度，永不停歇
  if (isAutoSpinning.value) {
    scene.rotation.y += 0.002;
    render(renderer, scene, camera); // 强制刷新画面
  }
}

export function render(renderer, scene, camera) {
  renderer.render(scene, camera);
}
