import { useEffect, useRef } from 'react';
import TWEEN from '@tweenjs/tween.js';

import { useMemberStore } from '@/store/member.ts';
import { animate } from '@/utils/three.ts';

import styles from './styles.module.css';

import type { Scene, PerspectiveCamera, Object3D } from 'three';
import type { CSS3DRenderer, TrackballControls } from 'three/addons';

interface ThreeInstances {
  scene: Scene | null;
  camera: PerspectiveCamera | null;
  renderer: CSS3DRenderer | null;
  controls: TrackballControls | null;
}

interface Targets {
  table: Object3D[];
  sphere: Object3D[];
  helix: Object3D[];
  grid: Object3D[];
}

export function useThree() {
  // 🚀 1. 承载 3D 视窗的 DOM 锚点
  const containerRef = useRef<HTMLDivElement | null>(null);

  const members = useMemberStore((state) => state.members);

  const threeRef = useRef<ThreeInstances>(null);

  const scene =  useRef<Scene>(null);
  const camera =  useRef<PerspectiveCamera>(null);
  const renderer =  useRef<CSS3DRenderer>(null);
  const controls =  useRef<TrackballControls>(null);

  const objects = [];
  const targets: Targets = { table: [], sphere: [], helix: [], grid: [] };

  const length = members.length;



  useEffect(() => {


    if (length <= 0) { return }




    init(instances, objects, targets);
    animate(instances);





    if (members.length > 0) {

      console.log('new init: ');

      init(containerRef.current as HTMLDivElement, styles, members);
      animate(controls as TrackballControls);
    }

    return () => {
      window.removeEventListener('resize', resizeListener);
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
