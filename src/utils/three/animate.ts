import { mainGroup } from './tweenManager.ts';

import type { TrackballControls } from 'three/addons';

// .
let animationFrameId: number | null = null;

/**
 * 动画渲染循环
 *
 * @param controls - TrackballControls 实例
 */
function animate(controls: TrackballControls) {
  mainGroup.update(); // 暂不传 time，让它内部自己去获取 performance.now()

  controls.update();

  animationFrameId = requestAnimationFrame(() => { animate(controls) });
}

// 卸载的时候调用这个清除 requestAnimationFrame.
// cancelAnimationFrame(animationFrameId);

export default animate;
