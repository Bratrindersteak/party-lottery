import type { Object3D } from 'three';

export interface Targets {
  table: Object3D[];
  sphere: Object3D[];
  helix: Object3D[];
  grid: Object3D[];
}

// 约束：动画完成的回调
export type Render = () => void;
