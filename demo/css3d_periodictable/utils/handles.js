import TWEEN from 'three/addons/libs/tween.module.js';

import render from './render.js';
import transform from './transform.js';
import rotating from './rotating.js';
import { calcWinnerCoord } from './index.js';

export function handleWindowResize(instances) {
  const { renderer, scene, camera } = instances;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render(renderer, scene, camera);
}

export function handlePagehide(event) {
  if (event.persisted) {
    // 说明页面没有被真正销毁，而是被浏览器“冻结”存进缓存里了
    // 用户等会儿如果点“后退”回来，页面会直接复活，JS 状态都还在
    console.log('页面被缓存了');
  } else {
    // 页面正在被彻底销毁（比如用户关掉了标签页）
    console.log('页面真的死掉了');
  }
}

export async function handleTable(instances, objects, targets) {
  await Promise.all([
    transform(instances, objects, targets.table, 2000),
    rotating(instances, 0, 0.5),
  ]);
}

export async function handleSphere(instances, objects, targets) {
  // await Promise.all([
  //   transform(instances, objects, targets.sphere, 1000),
  //   rotating(instances, 0, 500),
  // ]);

  await transform(instances, objects, targets.sphere, 2000);

  rotating(instances, 100, 2 * 60 * 60);
}

export async function handleHelix(instances, objects, targets) {
  await Promise.all([
    transform(instances, objects, targets.helix, 2000),
    rotating(instances, 0, 0.5),
  ]);
}

export async function handleGrid(instances, objects, targets) {
  await Promise.all([
    transform(instances, objects, targets.grid, 2000),
    rotating(instances, 0, 0.5),
  ]);
}

export async function handleLottery(instances) {
  // 1. ⚡ 【第一阶段：狂暴冲刺】
  // 2秒钟疯狂空转 40 圈，用 Linear（匀速）或者 Exponential.In（指数加速）
  const startY = instances.scene.rotation.y;
  const fastTargetY = startY + 1000;
  await rotating(instances, fastTargetY, 500, TWEEN.Easing.Linear.None);
}

export async function handleFinish(instances, objects) {
  const { renderer, scene, camera } = instances;

  // 2. 获取当前停下的弧度值
  const currentY = scene.rotation.y


  console.log('currentYcurrentYcurrentY', currentY);


  // 3. 计算下一个正面的目标弧度（保证顺时针继续滑动到正面）
  const TWO_PI = Math.PI * 2
  // Math.ceil 确保总是往前找最近的正面；+ 1 可以在当前位置基础上再多转 1 圈作为缓冲减速
  const currentRounds = Math.floor(currentY / TWO_PI)
  const targetY = (currentRounds + 3)

  console.log("🔔 触动刹车！正在缓缓减速定格...");
  await rotating(instances, targetY, 2.5, TWEEN.Easing.Cubic.Out);



  const { xTable, yTable, scale } = calcWinnerCoord(
    1,
    { width: 120, height: 160 },
    { width: window.innerWidth, height: window.innerHeight },
    0
  );

  const winner = objects[0];

  new TWEEN.Tween(winner.position)
    .to({ x: xTable, y: yTable, z: 1000 }, 1200)
    .easing(TWEEN.Easing.Exponential.InOut)
    .onUpdate(() => {
      render(renderer, scene, camera);
    })
    .onStart(() => {
      // const ele = winner.element;
      // ele.style.width = '240px';
      // ele.style.width = '320px';
      //
      // winner.element = ele;
    })
    .start()
    .onComplete(() => {});

  new TWEEN.Tween(winner.rotation)
    .to({ x: 0, y: 0, z: 0 }, 900)
    .onUpdate(() => {
      render(renderer, scene, camera);
    })
    .easing(TWEEN.Easing.Exponential.InOut)
    .start()
    .onComplete(() => {});
}
