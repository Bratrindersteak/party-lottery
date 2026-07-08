import React, { useEffect, useRef } from 'react';

import styles from './styles.module.css';

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
}

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    const numStars = 150; // 🌌 宇宙中的星星数量，150颗最优雅，高了影响3D照片墙帧率

    // 1. 初始化画布尺寸（紧紧贴合屏幕宽高度）
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    // 2. 随机生成星星矩阵
    const initStars = () => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.8 + 0.2,          // 大小错落有致（0.2px ~ 2px）
          alpha: Math.random(),                      // 初始透明度随机
          speed: (Math.random() * 0.02 + 0.005),     // 呼吸闪烁的速度
        });
      }
    };

    // 3. 核心量子动画渲染循环
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        // 🚀 宇宙级灵魂：让星星的透明度像呼吸一样上下波动（正弦曲线）
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) {
          star.speed = -star.speed; // 撞墙反弹，形成完美循环
        }

        // 绘制发光的量子粒子
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, star.alpha)})`; // 保证不完全熄灭
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    // 开机启动
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    render();

    // 🧼 组件销毁时，老老实实把定时器和监听洗干净，防内存泄漏
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={styles.universeContainer}>
      {/* 🔮 星空粒子层 */}
      <canvas ref={canvasRef} className={styles.starCanvas} />

      {/* 🦄 额外福利层：叠加一层星云毛玻璃动效，用 CSS 伪元素或者独立 div 营造迷离星云 */}
      <div className={styles.nebulaCloud} />
    </div>
  );
}
