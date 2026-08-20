import { useEffect, useRef } from 'react';
import * as THREE from "three";
import { CSS3DRenderer, TrackballControls, CSS3DObject } from 'three/addons';
import TWEEN from 'three/addons/libs/tween.module.js';

import { useThreeStore } from "@/store/three.ts";
import { useMemberStore } from '@/store/member.ts';
import { render, transform, animate } from '@/utils/three'
import initCard from '@/utils/three/initCard.ts';
import initTable from '@/utils/three/initTable.ts';
import initSphere from '@/utils/three/initSphere.ts';
import cardLayout from '@/utils/three/cardLayout.ts';
import { handleWindowResize } from '@/utils/three/handles.ts';

import styles from './styles.module.css';

import type { Scene, PerspectiveCamera } from 'three';
import type { Targets } from '@/types/3d.ts';

export function useThree() {
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
    controls.noRotate = true; // 禁用旋转（鼠标左键拖拽旋转）.
    controls.noPan = true; // 禁用平移（鼠标右键拖拽平移）.
    controls.addEventListener('change', () => { render(scene, camera, renderer) });
    setControls(controls);

    const objects: CSS3DObject[] = [];
    setObjects(objects);

    const targets: Targets = { table: [], sphere: [] };
    setTargets(targets);

    const vector = new THREE.Vector3();

    const gapX = 140;
    const gapY = 180;
    const { col, offsetX, offsetY } = cardLayout(length, gapX, gapY);

    for (let i = 0; i < length; i += 1) {
      initCard(scene, objects, members[i], styles);
      initTable(i, col, gapX, gapY, offsetX, offsetY, targets.table);
      initSphere(i, length, vector, targets.sphere);
    }

    const windowResizeListener = () => handleWindowResize(scene, camera, renderer);
    window.addEventListener('resize', windowResizeListener);

    transform(scene, camera, renderer, objects, targets.table, 2000);
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
  }, [members, setCamera, setControls, setObjects, setRenderer, setScene, setTargets]);

  return { containerRef };
}
