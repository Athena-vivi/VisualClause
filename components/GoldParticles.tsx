'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

interface GoldParticlesProps {
  trigger: boolean;
  x?: number;
  y?: number;
}

export default function GoldParticles({ trigger, x = 0, y = 0 }: GoldParticlesProps) {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trigger || !particlesRef.current) return;

    // 生成琥珀色粒子
    const particleCount = 20;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 2 + Math.random() * 3;

      particles.push({
        id: i,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 2, // 向上倾向
        size: 2 + Math.random() * 3,
        opacity: 0.6 + Math.random() * 0.4
      });
    }

    // 创建粒子元素
    const container = particlesRef.current;
    particles.forEach((particle) => {
      const el = document.createElement('div');
      el.className = 'absolute pointer-events-none';
      el.style.width = `${particle.size}px`;
      el.style.height = `${particle.size}px`;
      el.style.backgroundColor = '#D4AF37';
      el.style.borderRadius = '50%';
      el.style.boxShadow = '0 0 6px rgba(212, 175, 55, 0.8), 0 0 12px rgba(212, 175, 55, 0.4)';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.opacity = '1';

      container.appendChild(el);

      // 动画
      let posX = 0;
      let posY = 0;
      let opacity = 1;
      let frame = 0;

      const animate = () => {
        frame++;
        posX += particle.vx;
        posY += particle.vy;
        particle.vy += 0.1; // 重力
        opacity = Math.max(0, 1 - frame / 60);

        el.style.transform = `translate(${posX}px, ${posY}px)`;
        el.style.opacity = opacity.toString();

        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          el.remove();
        }
      };

      requestAnimationFrame(animate);
    });
  }, [trigger, x, y]);

  return <div ref={particlesRef} className="fixed inset-0 pointer-events-none z-50" />;
}
