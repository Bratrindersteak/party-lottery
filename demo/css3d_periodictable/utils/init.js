import * as THREE from 'three';
import TWEEN from 'three/addons/libs/tween.module.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

import data from '../data.js';

import transform from './transform.js';
import rotating from './rotating.js';
import render from './render.js';
import { calcWinnerCoord, calcLayout } from './index.js';
import {
  handleWindowResize,
  handlePagehide,
  handleTable,
  handleSphere,
  handleHelix,
  handleGrid,
  handleLottery,
  handleFinish,
} from './handles.js';

console.log(`共有 ${data.length} 个元素.`);

export default function init(instances, objects, targets) {
  instances.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
  instances.camera.position.z = 3000;

  instances.scene = new THREE.Scene();

  const vector = new THREE.Vector3();

  const length = data.length;

  // 一键获取智能计算的结果.
  const gapX = 140;
  const gapY = 180;
  const { col, offsetX, offsetY } = calcLayout(length, gapX, gapY);

  for (let i = 0; i < length; i += 1) {
    initCard(instances.scene, data[i], objects);
    initTable(i, col, gapX, gapY, offsetX, offsetY, targets);
    initSphere(i, length, vector, targets);
    initHelix(i, vector, targets);
    initGrid(i, targets);
  }

  instances.renderer = new CSS3DRenderer();
  instances.renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container').appendChild(instances.renderer.domElement);

  instances.controls = new TrackballControls(instances.camera, instances.renderer.domElement);
  instances.controls.minDistance = 500;
  instances.controls.maxDistance = 6000;
  instances.controls.addEventListener('change', () => render(instances.renderer, instances.scene, instances.camera));

  const buttonTable = document.getElementById('table');
  buttonTable.addEventListener('click', () => {
    handleTable(instances, objects, targets);
  });

  const buttonSphere = document.getElementById('sphere');
  buttonSphere.addEventListener('click', () => {
    handleSphere(instances, objects, targets);
  });

  const buttonHelix = document.getElementById('helix');
  buttonHelix.addEventListener('click', () => {
    handleHelix(instances, objects, targets);
  });

  const buttonGrid = document.getElementById('grid');
  buttonGrid.addEventListener('click', () => {
    handleGrid(instances, objects, targets);
  });

  const buttonLottery = document.getElementById('lottery');
  buttonLottery.addEventListener('click', () => {
    handleLottery(instances);
  });

  const buttonFinish = document.getElementById('finish');
  buttonFinish.addEventListener('click', () => {
    handleFinish(instances, objects);
  });

  transform(instances, objects, targets.table, 2000);

  window.addEventListener('resize', () => handleWindowResize(instances));
  window.addEventListener('pagehide', (event) => handlePagehide(event));
}

function initCard(scene, member, objects) {
  const element = document.createElement('div');
  element.className = 'element';
  element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

  // .
  const number = document.createElement('div');
  number.className = 'number';
  number.textContent = member.employeeId;
  element.appendChild(number);

  // .
  const symbol = document.createElement('div');
  symbol.className = 'symbol';
  symbol.textContent = member.name;
  element.appendChild(symbol);

  // .
  const details = document.createElement('div');
  details.className = 'details';
  details.innerHTML = member.department;
  element.appendChild(details);

  const objectCSS = new CSS3DObject(element);
  // 这三个 position 应该就是一开始卡片散落布局的随机定位.
  objectCSS.position.x = Math.random() * 4000 - 2000;
  objectCSS.position.y = Math.random() * 4000 - 2000;
  objectCSS.position.z = Math.random() * 4000 - 2000;

  scene.add(objectCSS);
  objects.push(objectCSS);
}

function initTable(index, col, gapX, gapY, offsetX, offsetY, targets) {
  const object = new THREE.Object3D();
  // 动态居中.
  object.position.x = ((index % col) * gapX) + offsetX;
  object.position.y = -(Math.floor(index / col) * gapY) + offsetY; // 3D里第一行在最上面，所以用负号往下排

  targets.table.push(object);
}

function initSphere(index, total, vector, targets) {
  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;

  const object = new THREE.Object3D();

  object.position.setFromSphericalCoords(800, phi, theta);

  vector.copy(object.position).multiplyScalar(2);

  object.lookAt(vector);

  targets.sphere.push(object);
}

function initHelix(index, vector, targets) {
  const theta = index * 0.175 + Math.PI;
  const y = -(index * 8) + 450;

  const object = new THREE.Object3D();

  object.position.setFromCylindricalCoords(900, theta, y);

  vector.x = object.position.x * 2;
  vector.y = object.position.y;
  vector.z = object.position.z * 2;

  object.lookAt(vector);

  targets.helix.push(object);
}

function initGrid(index, targets) {
  const object = new THREE.Object3D();

  object.position.x = ((index % 5) * 400) - 800;
  object.position.y = (-(Math.floor(index / 5) % 5) * 400) + 800;
  object.position.z = (Math.floor(index / 25)) * 1000 - 2000;

  targets.grid.push(object);
}
