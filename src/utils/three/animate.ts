import TWEEN from '@tweenjs/tween.js';

import type { TrackballControls } from 'three/addons';

// .
let animationFrameId: number | null = null;

/**
 * .
 *
 * @param controls - .
 */
function animate(controls: TrackballControls) {
  TWEEN.update();

  controls.update();

  animationFrameId = requestAnimationFrame(() => { animate(controls) });
}

// 卸载的时候调用这个清除 requestAnimationFrame.
// cancelAnimationFrame(animationFrameId);

export default animate;
