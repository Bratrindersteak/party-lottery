import { CSS3DObject } from 'three/addons';

import defaultAvatar from '@/assets/images/zhu_hou_cong.webp';

import type { Scene } from 'three';
import type { Member } from '@/types/lottery.ts';

function initCard(scene: Scene, objects: CSS3DObject[], member: Member, styles: Record<string, string>) {
  const element = document.createElement('div');
  element.className = styles.element;

  const img = new Image();
  img.referrerPolicy = 'no-referrer';
  img.src = member.avatar as string;
  // 加载成功：设置真实头像
  img.onload = () => {
    element.style.setProperty('background-image', `url('${member.avatar}')`);
  };
  // 如果链接加载失败，自动换成默认头像.
  img.onerror = () => {
    element.style.setProperty('background-image', `url('${defaultAvatar}')`);
  };

  const name = document.createElement('div');
  name.className = styles.name;
  name.textContent = member.name;
  element.appendChild(name);

  const employeeId = document.createElement('div');
  employeeId.className = styles['employee-id'];
  employeeId.textContent = member.employeeId;
  element.appendChild(employeeId);

  const department = document.createElement('div');
  department.className = styles.department;
  department.innerHTML = member.department;
  element.appendChild(department);

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
