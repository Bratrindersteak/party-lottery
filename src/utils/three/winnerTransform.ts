import TWEEN from 'three/addons/libs/tween.module.js';

import render from './render.js';
import threeStyles from '@/pages/lottery/three/styles.module.css';
import { WINNER_SCALE } from '@/config/constants.ts';

import type { Scene, PerspectiveCamera } from 'three';
import type { CSS3DRenderer, CSS3DObject } from 'three/addons';
import type { Tween } from 'three/addons/libs/tween.module.js';
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
    if (object._scaleTween) {
      object._scaleTween.stop();
      object._scaleTween = null;
    }

    const position = positions[index];

    new TWEEN.Tween(object.position)
      .to({ x: position.x, y: position.y, z: 1000 }, duration)
      .easing(TWEEN.Easing.Exponential.Out)
      .onComplete(() => { object._positionTween = null })
      .onStop(() => { object._positionTween = null })
      .start();

    new TWEEN.Tween(object.rotation)
      .to({ x: 0, y: 0, z: 0 }, duration)
      .easing(TWEEN.Easing.Exponential.Out)
      .onComplete(() => { object._rotationTween = null })
      .onStop(() => { object._rotationTween = null })
      .start();

    new TWEEN.Tween(object.scale)
      .to({ x: WINNER_SCALE, y: WINNER_SCALE, z: WINNER_SCALE }, duration)
      .easing(TWEEN.Easing.Exponential.Out)
      .onStart(() => {
        object.element.classList.add(threeStyles['element-winner']);
      })
      .onComplete(() => { object._scaleTween = null })
      .onStop(() => { object._positionTween = null })
      .start();
  });

  return new Promise((resolve) => {
    winnersInstance = new TWEEN.Tween({})
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
        resolve();
      });
    winnersInstance.start();
  });
}

export default winnerTransform;
