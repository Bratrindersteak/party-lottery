import type { Scene, PerspectiveCamera } from 'three';
import type { CSS3DRenderer } from 'three/addons';

/**
 * .
 *
 * @param scene - .
 * @param camera - .
 * @param renderer - .
 */
function render(scene: Scene, camera: PerspectiveCamera, renderer: CSS3DRenderer) {
  renderer.render(scene, camera);
}

export default  render;
