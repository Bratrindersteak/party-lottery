import render from './render.ts';

export function handleWindowResize(scene, camera, renderer) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render(scene, camera, renderer);
}
