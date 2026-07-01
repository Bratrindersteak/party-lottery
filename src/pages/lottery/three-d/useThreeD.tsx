import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js'; // 🚨 注意：CSS3DRenderer 需要从 standard addons 里单独引入
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import TWEEN from 'three/addons/libs/tween.module.js'; // 引入老牌轻量动画引擎

import { useMemberStore } from '@/store/member.ts';
import { transform } from '@/utils/3d.ts';

import styles from './styles.module.css';

import type { Member } from '@/types/lottery';
import type { Targets } from '@/types/3d.ts';

export function useThreeD() {
  const getMembers = useMemberStore((state) => state.getMembers);

  // 🚀 1. 承载 3D 视窗的 DOM 锚点
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 🚀 2. 使用 useRef 焊死 Three.js 四大核心组件的类型声明（开机默认为 null）
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<CSS3DRenderer | null>(null); // 咱们千人照片墙用 CSS3DRenderer，普通项目用 WebGLRenderer
  // const controlsRef = useRef<OrbitControls | null>(null);
  const controlsRef = useRef<TrackballControls | null>(null);

  // 额外防御：用一个 Ref 记录动画帧 ID，方便随时掐断销毁
  const animationFrameIdRef = useRef<number | null>(null);

  const objectsRef = useRef<CSS3DObject[]>([]);
  const targetsRef = useRef<Targets>({ table: [], sphere: [], helix: [], grid: [] });

  const render = useCallback(() => {
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, []);

  const onWindowResize = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
    }

    if (rendererRef.current) {
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    }

    render();
  }, [render]);

  const init = useCallback(async () => {
    cameraRef.current = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    cameraRef.current.position.z = 3000;
    sceneRef.current = new THREE.Scene();
    rendererRef.current = new CSS3DRenderer();
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    (containerRef.current as HTMLDivElement).appendChild(rendererRef.current.domElement);
    controlsRef.current = new TrackballControls(cameraRef.current, rendererRef.current.domElement);
    controlsRef.current.minDistance = 500;
    controlsRef.current.maxDistance = 6000;
    controlsRef.current.addEventListener('change', render);

    const members = await getMembers();

    (function animate() {
      TWEEN.update();

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      requestAnimationFrame(animate);
    })();

    const length = members.length;

    const vector = new THREE.Vector3();

    for (let index = 0; index < length; index += 1) {
      const member = members[index] as Member;

      const element: HTMLDivElement = document.createElement( 'div' );
      element.className = styles.element;
      element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

      const number: HTMLDivElement = document.createElement( 'div' );
      number.className = styles.number;
      number.textContent = index + '';
      element.appendChild(number);

      const name: HTMLDivElement = document.createElement( 'div' );
      name.className = styles.name;
      name.textContent = member.name;
      element.appendChild(name);

      const department: HTMLDivElement = document.createElement( 'div' );
      department.className = styles.department;
      department.textContent = member.department;
      element.appendChild(department);

      const objectCSS = new CSS3DObject( element );
      objectCSS.userData.id = member.id; // 存放员工 ID.
      objectCSS.userData.employeeId = member.employeeId; // 存放员工工号.
      objectCSS.userData.name = member.name; // 存放员工姓名.
      objectCSS.position.x = Math.random() * 4000 - 2000;
      objectCSS.position.y = Math.random() * 4000 - 2000;
      objectCSS.position.z = Math.random() * 4000 - 2000;
      (sceneRef.current as THREE.Scene).add( objectCSS );

      objectsRef.current.push( objectCSS );

      const objectTable = new THREE.Object3D();
      objectTable.position.x = ( (index % 18) * 140 ) - 1330;
      objectTable.position.y = - ( Math.ceil((index + 1) / 18) * 180 ) + 990;

      targetsRef.current.table.push(objectTable);

      const phi = Math.acos( - 1 + ( 2 * index ) / length );
      const theta = Math.sqrt( length * Math.PI ) * phi;

      const objectSphere = new THREE.Object3D();

      objectSphere.position.setFromSphericalCoords( 800, phi, theta );

      vector.copy( objectSphere.position ).multiplyScalar( 2 );

      objectSphere.lookAt( vector );

      targetsRef.current.sphere.push(objectSphere);
    }

    window.addEventListener('resize', onWindowResize, false);

    await transform(objectsRef.current, targetsRef.current.table, 1500, render);

    render();
  }, [onWindowResize, render, getMembers]);

  const animate = () => {
    TWEEN.update();

    if (controlsRef.current) {
      controlsRef.current.update();
    }

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    // 🚀 绝杀：在 Effect 刚开机时，立刻用一个局部变量把真实的 DOM 节点抓进闭包里！
    const currentContainer = containerRef.current;

    init();
    // animate();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      TWEEN.removeAll();

      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }

      // 🎯 核心修正：绝不通过 containerRef.current 去找节点
      // 而是直接使用刚才被闭包死死咬住的 currentContainer 快照！
      if (currentContainer) {
        currentContainer.innerHTML = ''; // 哪怕组件已经卸载，这个真实的 DOM 依然能被完美抹平
      }

      // 可选：将这些 Ref 的指针归零，帮助垃圾回收
      rendererRef.current = null;
      controlsRef.current = null;
    }
  }, [init, onWindowResize]);

  return { containerRef };
}
