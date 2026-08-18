import { useEffect, useRef } from 'react';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import TWEEN from 'three/addons/libs/tween.module.js'; // 引入老牌轻量动画引擎

import { useThreeStore } from '@/store/three.ts';
import { useMemberStore } from '@/store/member.ts';
import { animate } from '@/utils/three.ts';

import styles from './styles.module.css';

export function useThree() {
  // 🚀 1. 承载 3D 视窗的 DOM 锚点
  const containerRef = useRef<HTMLDivElement | null>(null);

  const members = useMemberStore((state) => state.members);

  const controls = useThreeStore((state) => state.controls);
  const init = useThreeStore((state) => state.init);
  const resizeListener = useThreeStore((state) => state.resizeListener);
  const setRenderer = useThreeStore((state) => state.setRenderer);
  const setControls = useThreeStore((state) => state.setControls);

  useEffect(() => {
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
