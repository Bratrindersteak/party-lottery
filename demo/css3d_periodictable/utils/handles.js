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
    transform(instances, objects, targets.table, 1000),
    rotating(instances, 0, 500),
  ]);
}

export async function handleSphere(instances, objects, targets) {
  await Promise.all([
    transform(instances, objects, targets.sphere, 1000),
    rotating(instances, 0, 500),
  ]);

  // 落地瞬间，无缝衔接：让它开启“伪无限”的慢速自转
  // 转 1000 圈，耗时 50000 秒（大概 833.33 分钟，足够年会背景用了）
  rotating(instances, Math.PI * 2 * 1000, 50000000);
}

export async function handleHelix(instances, objects, targets) {
  await Promise.all([
    transform(instances, objects, targets.helix, 1000),
    rotating(instances, 0, 500),
  ]);
}

export async function handleGrid(instances, objects, targets) {
  await Promise.all([
    transform(instances, objects, targets.grid, 1000),
    rotating(instances, 0, 500),
  ]);
}

export async function handleLottery(instances) {
  // 1. ⚡ 【第一阶段：狂暴冲刺】
  // 2秒钟疯狂空转 40 圈，用 Linear（匀速）或者 Exponential.In（指数加速）
  const startY = instances.scene.rotation.y;
  const fastTargetY = startY + (Math.PI * 2 * 1000);
  await rotating(instances, fastTargetY, 500000, TWEEN.Easing.Linear.None);
}

export async function handleFinish(instances, objects) {
  // 2. 🛑 【第二阶段：灵魂减速刹车】（这就是你要的渐渐停止效果）
  // 重点：我们再往前加 5 圈（给足刹车缓冲距离），但是耗时拉长到 3.5 秒！
  // 并且使用顶级的 Cubic.Out（由快到慢的优雅减速曲线）
  const currentY = instances.scene.rotation.y;
  const stopTargetY = currentY + (Math.PI * 2 * 5);

  console.log("🔔 触动刹车！正在缓缓减速定格...");
  await rotating(instances, stopTargetY, 3500, TWEEN.Easing.Cubic.Out);

  const { xTable, yTable, scale } = calcWinnerCoord(
    1,
    { width: 120, height: 160 },
    { width: window.innerWidth, height: window.innerHeight },
    0
  );

  const winner = objects[0];

  new TWEEN.Tween(winner.position)
    .to({ x: xTable, y: yTable, z: 1000 }, 2200)
    .easing(TWEEN.Easing.Exponential.InOut)
    .onStart(() => {
      const ele = winner.element;
      ele.style.transform = `scale(5)`;

      winner.element = ele;
    })
    .start()
    .onComplete(() => {});

  new TWEEN.Tween(winner.rotation)
    .to({ x: 0, y: 0, z: 0 }, 900)
    .easing(TWEEN.Easing.Exponential.InOut)
    .start()
    .onComplete(() => {});
}
