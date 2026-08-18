import * as THREE from 'three'
import TWEEN from 'three/addons/libs/tween.module.js';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

import { cardRule } from '@/config/constants.ts'

import type { Object3D } from 'three';
import type { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import type { TrackballControls } from 'three/addons/controls/TrackballControls.js';

import type { Render } from '@/types/3d.ts';
import type { Member } from '@/types/lottery.ts';

export function tween(source: any, target: any, duration: number, easingFn: TWEEN.EasingFunction = TWEEN.Easing.Exponential.InOut) {
  return new TWEEN.Tween(source)
    .to({ x: target.x, y: target.y, z: target.z }, duration)
    .easing(easingFn)
    .start();
}

/**
 * .
 *
 * @param renderer - .
 * @param scene - .
 * @param camera - .
 */
export function render(renderer: CSS3DRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  renderer.render(scene, camera);
}

/**
 * .
 *
 * @param controls - .
 */
export function animate(controls: TrackballControls) {
  TWEEN.update();

  if (controls) {
    controls.update();
  }

  requestAnimationFrame(() => { animate(controls) });
}

/**
 * .
 *
 * @param scene - .
 * @param camera - .
 * @param renderer - .
 */
export function resize(scene: THREE.Scene | null, camera: THREE.PerspectiveCamera | null, renderer: CSS3DRenderer | null) {
  if (camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  if (renderer) {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render(renderer, scene, camera);
}

export function transform(objects: CSS3DObject[], targets: Object3D[], duration: number, render: Render): Promise<void> {
  TWEEN.removeAll();

  return new Promise<void>((resolve, reject) => {
    for (let i = 0; i < objects.length; i += 1) {
      const object = objects[i] as CSS3DObject;
      const target = targets[i] as Object3D;

      tween(object.position, target.position, Math.random() * duration + duration, TWEEN.Easing.Exponential.InOut);

      tween(object.rotation, target.rotation, Math.random() * duration + duration, TWEEN.Easing.Exponential.InOut);
    }

    tween({}, {}, duration * 2)
      .onUpdate(render)
      .onComplete(() => { resolve() });
  });
}

// export function rotating(scene: THREE.Scene, rotateY: number, duration: number, render: Render): Promise<void> {
//   TWEEN.removeAll();
//
//   return new Promise<void>((resolve, reject) => {
//     new TWEEN.Tween(scene.rotation)
//       .to({ x: 0, y: Math.PI * rotateY * 1000, z: 0 }, duration * 1000)
//       .onUpdate(render)
//       .onComplete(() => { resolve() })
//       .onStop(() => { console.log('rotating is stop') })
//       .start();
//   });
// }


// 👑 在函数外部定义一个模块级的变量，用来死死盯住当前的旋转动画
let currentRotatingTween: TWEEN.Tween<THREE.Euler> | null = null;

/**
 * 丝滑的场景旋转控制器
 * @param scene THREE.Scene 场景实例
 * @param turns 旋转的圈数（比如 2 代表转 2 圈）
 * @param duration 动画持续时间（单位：秒）
 * @param render 渲染回调函数
 */
export function rotating(scene: THREE.Scene, turns: number, duration: number, render: Render): Promise<void> {
  // 🚨 关键一步：在启动新动画前，精准定点清除上一次的旋转，不伤及无辜
  if (currentRotatingTween) {
    currentRotatingTween.stop(); // 别用 removeAll，只让上一个旋转动画停下
    currentRotatingTween = null;
  }

  // 💡 优化 1：不要直接 removeAll()，只管理当前这一个 tween 变量
  return new Promise<void>((resolve, reject) => {
    // 计算出真正合理的弧度目标（1圈 = 2 * Math.PI）
    const targetY = scene.rotation.y + (Math.PI * 2 * turns);

    currentRotatingTween = new TWEEN.Tween(scene.rotation)
      .to({ x: 0, y: targetY, z: 0 }, duration * 1000) // 毫秒单位
      .easing(TWEEN.Easing.Linear.None) // 持续旋转通常用匀速
      .onUpdate(render)
      .onComplete(() => {
        currentRotatingTween = null; // 播完主动释放
        resolve();
      })
      .onStop(() => {
        currentRotatingTween = null; // 被动停下也释放
        resolve(); // 💡 优化 2：被叫停时，也要妥善释放 Promise，避免外部 await 死锁
      });

    currentRotatingTween.start();
  });
}

export function genMemberCard(styles: Record<string, string>, member: Member, index: number, length: number) {
  const element: HTMLDivElement = document.createElement('div');
  element.className = styles.element;
  element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

  const number: HTMLDivElement = document.createElement('div');
  number.className = styles.number;
  number.textContent = index + '';
  element.appendChild(number);

  const name: HTMLDivElement = document.createElement('div');
  name.className = styles.name;
  name.textContent = member.name;
  element.appendChild(name);

  const department: HTMLDivElement = document.createElement('div');
  department.className = styles.department;
  department.textContent = member.department;
  element.appendChild(department);

  const objectCSS = new CSS3DObject(element);
  objectCSS.userData.id = member.id; // 存放员工 ID.
  objectCSS.userData.employeeId = member.employeeId; // 存放员工工号.
  objectCSS.userData.name = member.name; // 存放员工姓名.
  objectCSS.position.x = Math.random() * 4000 - 2000;
  objectCSS.position.y = Math.random() * 4000 - 2000;
  objectCSS.position.z = Math.random() * 4000 - 2000;

  const objectTable = new THREE.Object3D();
  objectTable.position.x = ((index % 18) * 140) - 1330;
  objectTable.position.y = - (Math.ceil((index + 1) / 18) * 180) + 990;

  const objectSphere = new THREE.Object3D();
  const phi = Math.acos(-1 + (2 * index) / length);
  const theta = Math.sqrt(length * Math.PI) * phi;
  objectSphere.position.setFromSphericalCoords(800, phi, theta);

  return { element, objectCSS, objectTable, objectSphere };
}

export function calcWinnerDisplayCoord(
  totalCount: number,
  cardSize: { width: number, height: number },
  windowSize: { width: number, height: number },
  cardIndex: number,
) {
  let xTable = 0
  let yTable = 0
  const centerPosition = {
    x: 0,
    y: windowSize.height / 2,
  }
  const ruleObj = cardRule[totalCount];
  const { scale, rule, length } = ruleObj
  // 计算缩放后的卡片尺寸
  const scaledCardWidth = cardSize.width * scale
  const scaledCardHeight = cardSize.height * scale
  // 计算当前卡片在第几行（从0开始）
  let currentRow = 0
  let cardIndexInRow = cardIndex // 当前卡片在其所在行中的索引

  // 根据规则确定卡片在哪一行及行内索引
  let cumulativeCount = 0
  for (let i = 0; i < rule.length; i++) {
    if (cardIndex < cumulativeCount + rule[i]) {
      currentRow = i
      cardIndexInRow = cardIndex - cumulativeCount
      break
    }
    cumulativeCount += rule[i]
  }

  // 计算当前行的卡片数量
  const cardsInCurrentRow = rule[currentRow]

  // 计算每行的垂直中心位置
  const verticalSpacing = scaledCardHeight * 1.1 // 垂直间距基于缩放后的高度
  // 计算整体高度并调整居中
  const totalHeight = (length - 1) * verticalSpacing + scaledCardHeight // 包含卡片本身的高度
  const centerYOffset = -totalHeight / 2

  // 修改此处逻辑，确保当length=2时，两行围绕中心点对称分布
  centerPosition.y = windowSize.height / 2 - totalHeight / 2

  yTable = centerPosition.y + currentRow * verticalSpacing + centerYOffset // 添加卡片高度的一半作为修正
  // 计算当前行的水平居中偏移
  const horizontalSpacing = scaledCardWidth * 1.2 // 水平间距基于缩放后的宽度
  const rowWidth = (cardsInCurrentRow - 1) * horizontalSpacing
  const offsetX = -rowWidth / 2 // 行内水平居中

  xTable = centerPosition.x + offsetX + cardIndexInRow * horizontalSpacing

  return { xTable, yTable, scale }
}
