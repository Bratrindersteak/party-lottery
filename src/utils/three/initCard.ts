import { CSS3DObject } from 'three/addons';

import defaultAvatar from '@/assets/images/zhu_hou_cong.webp';

import type { Scene } from 'three';
import type { Member } from '@/types/lottery.ts';

function initCard(scene: Scene, objects: CSS3DObject[], member: Member, styles: Record<string, string>) {
  const element = document.createElement('div');
  element.className = styles.element;
  element.style.setProperty('--rand-alpha', `${Math.random() * 0.3 + 0.15}`);

  const avatarWrapper = document.createElement('div');
  avatarWrapper.className = styles['avatar-wrapper'];
  const avatarImg = document.createElement('img');
  avatarImg.className = styles['avatar-img'];
  avatarImg.src = member.avatar || defaultAvatar;
  avatarImg.alt = member.name;
  // 如果链接加载失败，自动换成默认头像.
  avatarImg.onerror = () => {
    avatarImg.src = defaultAvatar;
    avatarImg.onerror = null; // 防止默认图也加载失败造成死循环.
  };
  avatarWrapper.appendChild(avatarImg);
  element.appendChild(avatarWrapper);

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
