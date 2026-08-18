import type { Scene, PerspectiveCamera } from 'three';
import type { CSS3DRenderer } from 'three/addons';

/**
 * .
 *
 * @param renderer - .
 * @param scene - .
 * @param camera - .
 */
function render(renderer: CSS3DRenderer, scene: Scene, camera: PerspectiveCamera) {
  renderer.render(scene, camera);
}

export default  render;
