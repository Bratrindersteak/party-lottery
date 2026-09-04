import * as TWEEN from '@tweenjs/tween.js';

import render from './render.js';
import threeStyles from '@/pages/lottery/three/styles.module.css';
import { mainGroup } from './tweenManager.ts';

import type { Tween } from '@tweenjs/tween.js';
import type { Scene, PerspectiveCamera, Object3D } from 'three';
import type { CSS3DRenderer, CSS3DObject } from 'three/addons';
import type { Member } from '@/types/lottery';

type ObjectItem = CSS3DObject & {
  _positionTween?: Tween | null;
  _rotationTween?: Tween | null;
};

let transformInstance: Tween | null = null;

function transform(scene: Scene, camera: PerspectiveCamera, renderer: CSS3DRenderer, objects: CSS3DObject[], targets: Object3D[], duration: number, winners: Member[] = []): Promise<void> {
  // 1. 🚨 核心优化：如果上一次的全局渲染计时器还没跑完，立刻叫停它！
  // 这会直接触发上一个 Tween 的 .onStop()，妥善释放上一个 Promise
  if (transformInstance) {
    transformInstance.stop();
  }

  const now = performance.now();

  // 2. 遍历所有物体，让它们各自飞向新目标（保持不变）
  for (let i = 0; i < objects.length; i++) {
    const object: ObjectItem = objects[i];
    const target = targets[i];

    if (object._positionTween) {
      object._positionTween.stop();
    }
    if (object._rotationTween) {
      object._rotationTween.stop();
    }

    const winnerIndex = winners.findIndex(winner => winner.id === object.userData.memberId);

    object._positionTween = new TWEEN.Tween(object.position, mainGroup)
      .to({ x: target.position.x, y: target.position.y, z: target.position.z }, (0.5 + Math.random() * 0.5) * duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onComplete(() => {
        object._positionTween = null;
        if (winnerIndex !== -1) {
          object.element.classList.remove(threeStyles['element-winner']);
        }
      })
      .onStop(() => {
        object._positionTween = null;
        if (winnerIndex !== -1) {
          object.element.classList.remove(threeStyles['element-winner']);
        }
      });
    object._positionTween.start(now);

    object._rotationTween = new TWEEN.Tween(object.rotation, mainGroup)
      .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, (0.5 + Math.random() * 0.5) * duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onComplete(() => { object._rotationTween = null })
      .onStop(() => { object._rotationTween = null });
    object._rotationTween.start(now);
  }

  // 3. 将新创建的计时器赋给全局变量
  return new Promise((resolve) => {
    transformInstance = new TWEEN.Tween({}, mainGroup)
      .to({}, duration)
      .onUpdate(() => {
        render(scene, camera, renderer);
      })
      .onComplete(() => {
        transformInstance = null; // 正常播完，释放引用
        resolve();
      })
      .onStop(() => {
        transformInstance = null; // 被中途切断停下，也释放引用
      });

    transformInstance.start(now);
  });
}

export default transform;
