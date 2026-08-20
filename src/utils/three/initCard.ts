import { CSS3DObject } from 'three/addons';

import type { Scene } from 'three';
import type { Member } from '@/types/lottery.ts';

function initCard(scene: Scene, objects: CSS3DObject[], member: Member, styles: Record<string, string>) {
  const element = document.createElement('div');
  element.className = styles.element;
  element.style.setProperty('--rand-alpha', `${Math.random() * 0.5 + 0.25}`);

  // .
  const number = document.createElement('div');
  number.className = styles.number;
  number.textContent = member.employeeId;
  element.appendChild(number);

  // .
  const symbol = document.createElement('div');
  symbol.className = styles.name;
  symbol.textContent = member.name;
  element.appendChild(symbol);

  // .
  const details = document.createElement('div');
  details.className = styles.department;
  details.innerHTML = member.department;
  element.appendChild(details);

  const objectCSS = new CSS3DObject(element);
  // 这三个 position 应该就是一开始卡片散落布局的随机定位.
  objectCSS.position.x = Math.random() * 4000 - 2000;
  objectCSS.position.y = Math.random() * 4000 - 2000;
  objectCSS.position.z = Math.random() * 4000 - 2000;

  objectCSS.userData.memberId = member.id;

  scene.add(objectCSS);
  objects.push(objectCSS);
}

export default initCard;
