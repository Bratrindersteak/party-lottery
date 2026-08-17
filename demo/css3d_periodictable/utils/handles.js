import TWEEN from 'three/addons/libs/tween.module.js';

import render from './render.js';
import transform from './transform.js';
import rotating from './rotating.js';
import shuffle, {calcWinnerCoord, calcWinnerPositions} from './index.js';

let winners = [];

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

  await transform(instances, objects, targets.sphere, 2000, winners);

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

export async function handleLottery(instances, objects) {
  winners = shuffle(objects, 13);

  // 1. ⚡ 【第一阶段：狂暴冲刺】
  // 2秒钟疯狂空转 40 圈，用 Linear（匀速）或者 Exponential.In（指数加速）
  const startY = instances.scene.rotation.y;
  const fastTargetY = startY + 1000;
  await rotating(instances, fastTargetY, 500, TWEEN.Easing.Linear.None);
}

let winnersInstance = null;

export async function handleFinish(instances, objects) {
  const { renderer, scene, camera } = instances;

  // 2. 获取当前停下的弧度值
  const currentY = scene.rotation.y
  // 3. 计算下一个正面的目标弧度（保证顺时针继续滑动到正面）
  const TWO_PI = Math.PI * 2
  // Math.ceil 确保总是往前找最近的正面；+ 1 可以在当前位置基础上再多转 1 圈作为缓冲减速
  const currentRounds = Math.floor(currentY / TWO_PI)
  const targetY = (currentRounds + 3)

  console.log("🔔 触动刹车！正在缓缓减速定格...");
  await rotating(instances, targetY, 2, TWEEN.Easing.Cubic.Out);


  const positions = calcWinnerPositions(winners.length, { width: 240, height: 320 });
  console.log('handleFinish positions: ', positions);

  if (winnersInstance) {
    winnersInstance.stop();
    winnersInstance = null;
  }

  winners.forEach((winner, index) => {
    if (winner._positionTween) {
      winner._positionTween.stop();
      winner._positionTween = null;
    }
    if (winner._rotationTween) {
      winner._rotationTween.stop();
      winner._rotationTween = null;
    }
    if (winner._scaleTween) {
      winner._scaleTween.stop();
      winner._scaleTween = null;
    }

    const position = positions[index];

    new TWEEN.Tween(winner.position)
      .to({ x: position.x, y: position.y, z: 1000 }, 1500)
      .easing(TWEEN.Easing.Exponential.Out)
      .onComplete(() => { winner._positionTween = null })
      .onStop(() => { winner._positionTween = null })
      .start();

    new TWEEN.Tween(winner.rotation)
      .to({ x: 0, y: 0, z: 0 }, 1500)
      .easing(TWEEN.Easing.Exponential.Out)
      .onComplete(() => { winner._rotationTween = null })
      .onStop(() => { winner._rotationTween = null })
      .start();

    new TWEEN.Tween(winner.scale)
      .to({ x: 2, y: 2, z: 2 }, 1500)
      .easing(TWEEN.Easing.Exponential.Out)
      .onStart(() => {
        winner.element.classList.add('element-winner');
      })
      .onComplete(() => { winner._scaleTween = null })
      .onStop(() => { winner._positionTween = null })
      .start();
  });

  winnersInstance = new TWEEN.Tween({})
    .to({}, 1500)
    .onUpdate(() => {
      render(renderer, scene, camera);
    })
    .onComplete(() => {
      winnersInstance = null;
    })
    .onStop(() => {
      winnersInstance = null;
    });

  winnersInstance.start();
}

export async function handleRelottery(instances, objects, targets) {
  handleSphere(instances, objects, targets);
}
