import TWEEN from 'three/addons/libs/tween.module.js';

import render from './render.js';

export default function animate(controls, renderer, scene, camera) {
  requestAnimationFrame(() => animate(controls, renderer, scene, camera));

  TWEEN.update();

  controls.update();

  render(renderer, scene, camera); // 强制刷新画面
}
