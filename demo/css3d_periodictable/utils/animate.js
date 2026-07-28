import TWEEN from 'three/addons/libs/tween.module.js';

let animationFrameId = null;

export default function animate(instances) {
  const { controls } = instances;

  animationFrameId = requestAnimationFrame(() => animate(instances));

  TWEEN.update();

  controls.update();
}

// 卸载的时候调用这个清除 requestAnimationFrame.
// cancelAnimationFrame(animationFrameId);
