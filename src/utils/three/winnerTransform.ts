import * as TWEEN from '@tweenjs/tween.js';

import render from './render.js';
import { mainGroup } from './tweenManager.ts';
import threeStyles from '@/pages/lottery/three/styles.module.css';

import type { Tween } from '@tweenjs/tween.js';
import type { Scene, PerspectiveCamera } from 'three';
import type { CSS3DRenderer, CSS3DObject } from 'three/addons';
import type { Member } from '@/types/lottery.ts';
import type { ObjectPosition } from '@/types/3d.ts';

type ObjectItem = CSS3DObject & {
  _positionTween?: Tween | null;
  _rotationTween?: Tween | null;
  _scaleTween?: Tween | null;
};

let winnersInstance = null;

function winnerTransform(scene: Scene, camera: PerspectiveCamera, renderer: CSS3DRenderer, objects: CSS3DObject[], duration: number, positions: ObjectPosition[], winners: Member[] = []): Promise<void> {
  if (winnersInstance) {
    winnersInstance.stop();
    winnersInstance = null;
  }

  const now = performance.now();

  winners.forEach((winner, index) => {
    const object: ObjectItem = objects.find(object => object.userData.memberId === winner.id);

    if (object._positionTween) {
      object._positionTween.stop();
      object._positionTween = null;
    }
    if (object._rotationTween) {
      object._rotationTween.stop();
      object._rotationTween = null;
    }

    const position = positions[index];

    new TWEEN.Tween(object.position, mainGroup)
      .to({ x: position.x, y: position.y, z: 1000 }, duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onComplete(() => { object._positionTween = null })
      .onStop(() => { object._positionTween = null })
      .start(now);

    new TWEEN.Tween(object.rotation, mainGroup)
      .to({ x: 0, y: 0, z: 0 }, duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onStart(() => {
        object.element.classList.add(threeStyles['element-winner']);
      })
      .onComplete(() => { object._rotationTween = null })
      .onStop(() => { object._rotationTween = null })
      .start(now);
  });

  return new Promise((resolve) => {
    winnersInstance = new TWEEN.Tween({}, mainGroup)
      .to({}, duration)
      .onUpdate(() => {
        render(scene, camera, renderer);
      })
      .onComplete(() => {
        winnersInstance = null;
        resolve();
      })
      .onStop(() => {
        winnersInstance = null;
      });
    winnersInstance.start(now);
  });
}

export default winnerTransform;
