import type { Object3D, PerspectiveCamera, Scene } from 'three';
import type { CSS3DRenderer, CSS3DObject, TrackballControls } from 'three/addons';

export interface ThreeInstances {
  scene: Scene | null;
  camera: PerspectiveCamera | null;
  renderer: CSS3DRenderer | null;
  controls: TrackballControls | null;
  objects: CSS3DObject[];
  targets: Targets;
}

export interface Targets {
  table: Object3D[];
  sphere: Object3D[];
}

export interface ObjectPosition {
  x: number;
  y: number;
  z: number;
}
