'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import AstraLogo from '@/components/AstraLogo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  angle: number;
}

export default function Home() {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [oceanPulse, setOceanPulse] = useState(false);
  const rippleIdRef = useRef(0);
  const shootingStarIdRef = useRef(0);

  // 动态生成星空 - 极致精致
  useEffect(() => {
    const starfield = document.createElement('div');
    starfield.className = 'starfield';
    document.body.appendChild(starfield);

    // 生成 30 个极精致星辰
    for (let i = 0; i < 30; i++) {
      const star = document.createElement('div');
      star.className = 'star';

      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 1 + 0.5; // 0.5-1.5px
      const delay = Math.random() * 5;
      const duration = Math.random() * 4 + 4; // 4-8s

      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDelay = `${delay}s`;
      star.style.animationDuration = `${duration}s`;

      starfield.appendChild(star);
    }

    return () => {
      document.body.removeChild(starfield);
    };
  }, []);

  // 琥珀流影 - 鼠标移动涟漪（保留涟漪，移除视差）
  useEffect(() => {
    let lastRippleTime = 0;
    const rippleDelay = 150;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastRippleTime > rippleDelay) {
        lastRippleTime = now;
        const id = rippleIdRef.current++;
        setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);

        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== id));
        }, 2000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Astra 流星动效 - 每 5-15 秒随机出现
  useEffect(() => {
    const spawnShootingStar = () => {
      const id = shootingStarIdRef.current++;
      const startX = Math.random() * window.innerWidth * 0.6;
      const startY = Math.random() * window.innerHeight * 0.5;
      const angle = 45;

      setShootingStars(prev => [...prev, { id, startX, startY, angle }]);

      setOceanPulse(true);
      setTimeout(() => setOceanPulse(false), 200);

      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== id));
      }, 1200);
    };

    const firstDelay = 2000;
    const scheduleNext = () => {
      const delay = 5000 + Math.random() * 10000;
      setTimeout(() => {
        spawnShootingStar();
        scheduleNext();
      }, delay);
    };

    const firstTimer = setTimeout(() => {
      spawnShootingStar();
      scheduleNext();
    }, firstDelay);

    return () => clearTimeout(firstTimer);
  }, []);

  return (
    <main className="h-screen w-full bookish-bg relative overflow-hidden" style={{ margin: 0, padding: 0 }}>
      {/* 右上角语言切换按钮 */}
      <LanguageSwitcher />

      {/* 深海蓝色光晕 */}
      <motion.div
        className="ocean-flow"
        animate={{
          opacity: oceanPulse ? [0.5, 0.7, 0.5] : 0.5,
        }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="ocean-blob ocean-blob-1"></div>
        <div className="ocean-blob ocean-blob-2"></div>
        <div className="ocean-blob ocean-blob-3"></div>
      </motion.div>

      {/* Astra 流星 */}
      {shootingStars.map(star => (
        <motion.div
          key={star.id}
          className="fixed pointer-events-none z-15"
          style={{
            left: star.startX,
            top: star.startY,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative"
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{ x: 500, y: 500, opacity: 0 }}
            transition={{ duration: 3, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* 流星尾迹 */}
            <div
              className="absolute origin-top-left"
              style={{
                width: '120px',
                height: '1px',
                background: 'linear-gradient(to right, rgba(212, 175, 55, 0.9) 0%, rgba(248, 250, 252, 0.6) 50%, transparent 100%)',
                transform: 'rotate(45deg)',
                transformOrigin: 'left center',
              }}
            />
            {/* 流星头部 */}
            <div
              className="absolute left-0 top-0 w-4 h-4 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.8) 0%, transparent 70%)',
                filter: 'blur(2px)',
              }}
            />
          </motion.div>
        </motion.div>
      ))}

      {/* 琥珀流影 - 鼠标涟漪 */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="fixed pointer-events-none z-20"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
          initial={{ scale: 0, opacity: 0.15 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
        >
          <div
            className="w-8 h-8 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)',
              filter: 'blur(2px)',
            }}
          />
        </motion.div>
      ))}

      {/* Logo - 能量核 */}
      <div className="fixed top-1/2 right-1/4 -translate-y-1/2 z-50">
        <motion.div
          animate={{
            rotate: [0, 2, -2, 0],
            scale: [1, 1.02, 0.98, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{
            filter: 'drop-shadow(0 0 60px rgba(212, 175, 55, 0.3)) drop-shadow(0 0 120px rgba(37, 99, 235, 0.2))',
          }}
        >
          <AstraLogo size={180} />
        </motion.div>

        {/* Logo 照亮背景水域 */}
        <motion.div
          className="absolute inset-0 -translate-y-1/2 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.03) 0%, transparent 50%)',
            filter: 'blur(40px)',
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </div>


      {/* 黄金分割布局容器 - 标题和入口链接 */}
      <div
        className="fixed z-50 flex flex-col"
        style={{
          top: '50%',
          left: '38.2%',
          transform: 'translate(-50%, -50%)',
          margin: 0,
          padding: 0
        }}
      >
        {/* 碑文式标题 */}
        <motion.div
          initial={{ opacity: 0, filter: 'blur(20px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <h1 style={{ letterSpacing: '0.6em', margin: 0, padding: 0 }}>
            <div style={{ margin: 0, padding: 0 }} className="text-tertiary text-2xl md:text-4xl lg:text-5xl font-serif font-light leading-[2.5]">
              <span className="inline-block opacity-100">This is a</span>
            </div>
            <div style={{ margin: 0, padding: 0 }} className="text-tertiary text-2xl md:text-4xl lg:text-5xl font-serif font-light leading-[2.5]">
              <span className="inline-block opacity-90">generating</span>
            </div>
            <div style={{ margin: 0, padding: 0 }} className="text-tertiary text-2xl md:text-4xl lg:text-5xl font-serif font-light leading-[2.5]">
              <span className="inline-block opacity-80">mechanism.</span>
            </div>
          </h1>
        </motion.div>

        {/* 极简入口 - 竖线 + 文字（天然与标题左对齐） */}
        <div className="flex flex-col gap-8 mt-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <Link href="/archive" className="group flex items-center gap-6">
              <div className="relative w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-accent-gold/60 via-accent-gold to-accent-gold/60"
                  initial={{ scaleY: 0 }}
                  whileHover={{ scaleY: 1 }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  style={{ transformOrigin: 'center' }}
                />
              </div>
              <span className="relative text-secondary text-xs tracking-[0.3em] opacity-70 group-hover:opacity-100 group-hover:text-accent-gold/90 transition-all duration-500">
                ARCHIVE
                {/* 悬停时的微光效果 - 仅在文字上 */}
                <span className="absolute inset-0 bg-accent-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm pointer-events-none -mx-1 -my-0.5 px-1 py-0.5" />
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <Link href="/protocols" className="group flex items-center gap-6">
              <div className="relative w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-accent-gold/60 via-accent-gold to-accent-gold/60"
                  initial={{ scaleY: 0 }}
                  whileHover={{ scaleY: 1 }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  style={{ transformOrigin: 'center' }}
                />
              </div>
              <span className="relative text-secondary text-xs tracking-[0.3em] opacity-70 group-hover:opacity-100 group-hover:text-accent-gold/90 transition-all duration-500">
                PROTOCOLS
                {/* 悬停时的微光效果 - 仅在文字上 */}
                <span className="absolute inset-0 bg-accent-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm pointer-events-none -mx-1 -my-0.5 px-1 py-0.5" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* 底部版权 */}
      <footer className="fixed bottom-6 right-12 z-20">
        <p className="text-secondary text-[10px] tracking-[0.2em] opacity-30">
          © 2025 Zhang YuLing
        </p>
      </footer>
    </main>
  );
}
