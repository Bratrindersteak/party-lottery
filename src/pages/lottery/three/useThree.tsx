import { useEffect, useRef } from 'react';
import * as THREE from "three";
import { CSS3DRenderer, TrackballControls, CSS3DObject } from 'three/addons';
import TWEEN from '@tweenjs/tween.js';

import { useThreeStore } from "@/store/three.ts";
import { useMemberStore } from '@/store/member.ts';
import render from '@/utils/three/render.ts';
import initCard from '@/utils/three/initCard.ts';
import initTable from '@/utils/three/initTable.ts';
import initSphere from '@/utils/three/initSphere.ts';
import animate from '@/utils/three/animate.ts';
import cardLayout from '@/utils/three/cardLayout.ts';
import transform from '@/utils/three/transform.ts';
import { handleWindowResize } from '@/utils/three/handles.ts';

import styles from './styles.module.css';

import type { Scene, PerspectiveCamera, Object3D } from 'three';

interface ThreeInstances {
  scene: Scene | null;
  camera: PerspectiveCamera | null;
  renderer: CSS3DRenderer | null;
  controls: TrackballControls | null;
  objects: CSS3DObject[];
  targets: Targets;
}

interface Targets {
  table: Object3D[];
  sphere: Object3D[];
}

export function useThree() {
  const scene = useThreeStore((state) => state.scene);
  const camera = useThreeStore((state) => state.camera);
  const renderer = useThreeStore((state) => state.renderer);
  const controls = useThreeStore((state) => state.controls);
  const objects = useThreeStore((state) => state.objects);
  const targets = useThreeStore((state) => state.targets);
  const setScene = useThreeStore((state) => state.setScene);
  const setCamera = useThreeStore((state) => state.setCamera);
  const setRenderer = useThreeStore((state) => state.setRenderer);
  const setControls = useThreeStore((state) => state.setControls);
  const setObjects = useThreeStore((state) => state.setObjects);
  const setTargets = useThreeStore((state) => state.setTargets);

  const members = useMemberStore((state) => state.members);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const length = members.length;

    if (length <= 0) { return }

    const scene: Scene = new THREE.Scene();
    setScene(scene);

    const camera: PerspectiveCamera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 3000;
    setCamera(camera);

    const renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    setRenderer(renderer);

    containerRef.current.appendChild(renderer.domElement);

    const controls = new TrackballControls(camera, renderer.domElement)
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.addEventListener('change', () => { render(scene, camera, renderer) });
    setControls(controls);

    const objects: CSS3DObject[] = [];
    setObjects(objects);

    const targets: Targets = { table: [], sphere: [] };
    setTargets(targets);

    const vector = new THREE.Vector3();

    const gapX = 140;
    const gapY = 180;
    const { col, row, offsetX, offsetY } = cardLayout(length, gapX, gapY);

    for (let i = 0; i < length; i += 1) {
      initCard(scene, objects, members[i]);
      initTable(i, col, gapX, gapY, offsetX, offsetY, targets.table);
      initSphere(i, length, vector, targets.sphere);
    }

    transform(scene, camera, renderer, objects, targets.table, 2000);

    const windowResizeListener = () => handleWindowResize(scene, camera, renderer);
    window.addEventListener('resize', windowResizeListener);

    animate(controls);

    return () => {
      window.removeEventListener('resize', windowResizeListener);
      TWEEN.removeAll();

      // if (animationFrameIdRef.current) {
      //   cancelAnimationFrame(animationFrameIdRef.current);
      // }
      if (controls) {
        controls.dispose();
      }

      // 🎯 核心修正：绝不通过 containerRef.current 去找节点
      // 而是直接使用刚才被闭包死死咬住的 currentContainer 快照！
      if (containerRef.current) {
        containerRef.current.innerHTML = ''; // 哪怕组件已经卸载，这个真实的 DOM 依然能被完美抹平
      }

      // 可选：将这些 Ref 的指针归零，帮助垃圾回收
      setRenderer(null);
      setControls(null);
    }
  }, [members]);

  return { containerRef };
}
