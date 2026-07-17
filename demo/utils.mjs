import * as THREE from 'three';
import TWEEN from 'three/addons/libs/tween.module.js';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

export function genMemberCard(member, index, length) {
  const element = document.createElement('div');
  element.className = 'element';
  element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

  const number = document.createElement('div');
  number.className = 'number';
  number.textContent = index + '';
  element.appendChild(number);

  const name = document.createElement('div');
  name.className = 'name';
  name.textContent = member.name;
  element.appendChild(name);

  const department = document.createElement('div');
  department.className = 'department';
  department.textContent = member.department;
  element.appendChild(department);

  const objectCSS = new CSS3DObject(element);
  objectCSS.userData.id = member.id; // 存放员工 ID.
  objectCSS.userData.employeeId = member.employeeId; // 存放员工工号.
  objectCSS.userData.name = member.name; // 存放员工姓名.
  objectCSS.position.x = Math.random() * 4000 - 2000;
  objectCSS.position.y = Math.random() * 4000 - 2000;
  objectCSS.position.z = Math.random() * 4000 - 2000;

  const objectTable = new THREE.Object3D();
  objectTable.position.x = ((index % 18) * 140) - 1330;
  objectTable.position.y = - (Math.ceil((index + 1) / 18) * 180) + 990;

  const objectSphere = new THREE.Object3D();
  const phi = Math.acos(-1 + (2 * index) / length);
  const theta = Math.sqrt(length * Math.PI) * phi;
  objectSphere.position.setFromSphericalCoords(800, phi, theta);

  return { element, objectCSS, objectTable, objectSphere };
}

export function tween(source, target, duration, easingFn = TWEEN.Easing.Exponential.InOut) {
  return new TWEEN.Tween(source)
    .to({ x: target.x, y: target.y, z: target.z }, duration)
    .easing(easingFn)
    .start();
}

export function transform(objects, targets, duration, render) {
  TWEEN.removeAll();

  return new Promise((resolve, reject) => {
    for (let i = 0; i < objects.length; i += 1) {
      const object = objects[i];
      const target = targets[i];

      tween(object.position, target.position, Math.random() * duration + duration, TWEEN.Easing.Exponential.InOut);
      tween(object.rotation, target.rotation, Math.random() * duration + duration, TWEEN.Easing.Exponential.InOut);
    }

    tween({}, {}, duration * 2)
      .onUpdate(render)
      .onComplete(() => { resolve() });
  });
}

export function rotating(scene, rotateY, duration, render) {
  TWEEN.removeAll();

  return new Promise((resolve, reject) => {
    new TWEEN.Tween(scene.rotation)
      .to({ x: 0, y: Math.PI * rotateY * 1000, z: 0 }, duration * 1000)
      .onUpdate(render)
      .onComplete(() => { resolve() })
      .onStop(() => { console.log('rotating is stop') })
      .start();
  });
}
