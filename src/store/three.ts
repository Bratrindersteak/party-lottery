import { create } from 'zustand';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

import type { Scene, PerspectiveCamera } from 'three';
import type { Targets } from '@/types/3d.ts';

interface ThreeStore {
  scene: Scene | null;
  camera: PerspectiveCamera | null;
  renderer: CSS3DRenderer | null;
  controls: TrackballControls | null;
  objects: CSS3DObject[];
  targets: Targets;

  setScene: (scene: Scene | null) => void;
  setCamera: (camera: PerspectiveCamera | null) => void;
  setRenderer: (renderer: CSS3DRenderer | null) => void;
  setControls: (controls: TrackballControls | null) => void;
  setObjects: (objects: CSS3DObject[]) => void;
  setTargets: (targets: Targets) => void;
}

export const useThreeStore = create<ThreeStore>()((set) => ({
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  objects: [],
  targets: { table: [], sphere: [], helix: [], grid: [] },

  setScene: (scene: THREE.Scene | null) => {
    set(() => ({ scene }));
  },

  setCamera: (camera: THREE.PerspectiveCamera | null) => {
    set(() => ({ camera }));
  },

  setRenderer: (renderer: CSS3DRenderer | null) => {
    set(() => ({ renderer }));
  },

  setControls: (controls: TrackballControls | null) => {
    set(() => ({ controls }));
  },

  setObjects: (objects: CSS3DObject[]) => {
    set(() => ({ objects }));
  },

  setTargets: (targets: Targets) => {
    set(() => ({ targets }));
  },
}));
