import { cardRule } from '@/config/constants.ts'
import * as THREE from 'three'
import TWEEN from 'three/addons/libs/tween.module.js';

import  { type Object3D } from 'three';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

import type { Render } from '@/types/3d.ts';

export function tween(source: any, target: any, duration: number, easingFn: TWEEN.EasingFunction = TWEEN.Easing.Exponential.InOut) {
  return new TWEEN.Tween(source)
    .to({ x: target.x, y: target.y, z: target.z }, duration)
    .easing(easingFn)
    .start();
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

export function rotating(scene: THREE.Scene, rotateY: number, duration: number, render: Render): Promise<void> {
  TWEEN.removeAll();

  return new Promise<void>((resolve, reject) => {
    new TWEEN.Tween(scene.rotation)
      .to({ x: 0, y: Math.PI * rotateY * 1000, z: 0 }, duration * 1000)
      .onUpdate(render)
      .onComplete(() => { resolve() })
      .onStop(() => { console.log('rotating is stop') })
      .start();
  });
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
