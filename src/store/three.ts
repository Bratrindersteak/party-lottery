import { create } from 'zustand';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

import { render, genMemberCard, transform, resize } from '@/utils/three.ts';

import type { Targets } from '@/types/3d.ts';
import type { Member } from '@/types/lottery.ts';

interface ThreeStore {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: CSS3DRenderer | null;
  controls: TrackballControls | null;
  objects: CSS3DObject[];
  targets: Targets;

  init: (container: HTMLDivElement, styles: Record<string, string>, members: Member[]) => Promise<void>;
  resizeListener: () => void;

  setScene: (scene: THREE.Scene | null) => Promise<void>;
  setCamera: (camera: THREE.PerspectiveCamera | null) => Promise<void>;
  setRenderer: (renderer: CSS3DRenderer | null) => Promise<void>;
  setControls: (controls: TrackballControls | null) => Promise<void>;
  setObjects: (objects: CSS3DObject[]) => Promise<void>;
  setTargets: (targets: Targets) => Promise<void>;
}

export const useThreeStore = create<ThreeStore>()((set, get) => ({
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  objects: [],
  targets: { table: [], sphere: [], helix: [], grid: [] },

  resizeListener() {
    const scene = get().scene;
    const camera = get().camera;
    const renderer = get().renderer;

    resize(scene, camera, renderer);
  },

  init: async (container: HTMLDivElement, styles: Record<string, string>, members: Member[]) => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 3000;

    const renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    const controls = new TrackballControls(camera, renderer.domElement)
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.addEventListener('change', () => { render(renderer, scene, camera) });

    const objects: CSS3DObject[] = [];
    const targets: Targets = { table: [], sphere: [], helix: [], grid: [] };
    const len = members.length;
    const vector = new THREE.Vector3();

    for (let i = 0; i < len; i += 1) {
      const { objectCSS, objectTable, objectSphere } = genMemberCard(styles, members[i], i, len);

      scene.add(objectCSS);

      objects.push(objectCSS);

      targets.table.push(objectTable);

      vector.copy(objectSphere.position).multiplyScalar(2);

      objectSphere.lookAt(vector);

      targets.sphere.push(objectSphere);
    }

    set(() => ({
      scene: scene,
      camera: camera,
      renderer: renderer,
      controls: controls,
      objects: objects,
      targets: targets,
    }));

    window.addEventListener('resize', get().resizeListener, false);

    await transform(objects, targets.table, 1500, () => { render(renderer, scene, camera) });

    render(renderer, scene, camera);
  },

  setScene: async (scene: THREE.Scene | null) => {
    set(() => ({ scene }));
  },

  setCamera: async (camera: THREE.PerspectiveCamera | null) => {
    set(() => ({ camera }));
  },

  setRenderer: async (renderer: CSS3DRenderer | null) => {
    set(() => ({ renderer }));
  },

  setControls: async (controls: TrackballControls | null) => {
    set(() => ({ controls }));
  },

  setObjects: async (objects: CSS3DObject[]) => {
    set(() => ({ objects }));
  },

  setTargets: async (targets: Targets) => {
    set(() => ({ targets }));
  },
}));
