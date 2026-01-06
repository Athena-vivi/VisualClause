'use client';

import LatticeGrid from '@/components/LatticeGrid';
import AIChat from '@/components/AIChat';
import SystemEquilibrium from '@/components/SystemEquilibrium';
import AstraLogo from '@/components/AstraLogo';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [activeSection, setActiveSection] = useState<'feed' | 'archive' | 'pulse' | 'resonance'>('feed');

  // 动态生成星空
  useEffect(() => {
    const starfield = document.createElement('div');
    starfield.className = 'starfield';
    document.body.appendChild(starfield);

    // 生成 70 个星辰
    for (let i = 0; i < 70; i++) {
      const star = document.createElement('div');
      star.className = 'star';

      // 随机位置
      const x = Math.random() * 100;
      const y = Math.random() * 100;

      // 随机大小 (1px - 2px)
      const size = Math.random() * 1 + 1;

      // 随机动画延迟，使闪烁更自然
      const delay = Math.random() * 3;
      const duration = Math.random() * 2 + 2; // 2-4s

      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDelay = `${delay}s`;
      star.style.animationDuration = `${duration}s`;

      starfield.appendChild(star);
    }

    // 视差滚动效果 - 鼠标移动产生深渊空间感
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

      // 星空移动缓慢（深处）- 最大位移 20px
      if (starfield) {
        starfield.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
      }

      // 壬水光晕移动较快（浅层）- 最大位移 40px
      const oceanFlow = document.querySelector('.ocean-flow') as HTMLElement;
      if (oceanFlow) {
        oceanFlow.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeChild(starfield);
    };
  }, []);

  return (
    <main className="min-h-screen starsea-bg relative">
      {/* 壬水流动效果 - 光晕海浪 */}
      <div className="ocean-flow">
        <div className="ocean-blob ocean-blob-1"></div>
        <div className="ocean-blob ocean-blob-2"></div>
        <div className="ocean-blob ocean-blob-3"></div>
      </div>

      {/* 琥珀色光斑 - 阳光射入深海 */}
      <div className="amber-glow">
        <div className="amber-spot amber-spot-1"></div>
        <div className="amber-spot amber-spot-2"></div>
      </div>

      {/* 顶部导航 */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-30 relative">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AstraLogo size={40} />
            <div>
              <h1 className="text-text-primary text-xl font-light tracking-[0.25em]">VisualClause</h1>
            </div>
          </div>

          {/* 导航入口 */}
          <nav className="flex items-center gap-8">
            {[
              { id: 'archive', label: 'Archive' },
              { id: 'pulse', label: 'Pulse' },
              { id: 'resonance', label: 'Resonance' }
            ].map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`text-sm tracking-wider font-serif transition-colors relative ${
                  activeSection === item.id
                    ? 'text-accent-gold'
                    : 'text-text-tertiary hover:text-text-secondary'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-px bg-accent-gold"
                    layoutId="activeNav"
                    style={{
                      boxShadow: '0 0 8px rgba(212, 175, 55, 0.6)'
                    }}
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-8 py-16 relative z-10">
        {/* 系统状态面板 */}
        <div className="mb-16">
          <SystemEquilibrium />
        </div>

        {/* 内容区域切换 */}
        <AnimatePresence mode="wait">
          {activeSection === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <section className="mb-12">
                <h2 className="text-text-primary text-2xl tracking-[0.2em] font-serif text-center">The Lattice Feed</h2>
              </section>
              <LatticeGrid />
            </motion.div>
          )}

          {activeSection === 'archive' && (
            <motion.div
              key="archive"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <section className="mb-12">
                <h2 className="text-text-primary text-2xl tracking-[0.2em] font-serif text-center">Archive</h2>
                <p className="text-text-tertiary text-sm text-center mt-4 font-mono">历史记忆的存储库</p>
              </section>
              <div className="metal-card p-12 text-center">
                <p className="text-text-tertiary font-serif">档案内容正在整理中...</p>
              </div>
            </motion.div>
          )}

          {activeSection === 'pulse' && (
            <motion.div
              key="pulse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <section className="mb-12">
                <h2 className="text-text-primary text-2xl tracking-[0.2em] font-serif text-center">Pulse</h2>
                <p className="text-text-tertiary text-sm text-center mt-4 font-mono">思维的脉搏跳动</p>
              </section>
              <div className="metal-card p-12 text-center">
                <p className="text-text-tertiary font-serif">脉搏数据收集中...</p>
              </div>
            </motion.div>
          )}

          {activeSection === 'resonance' && (
            <motion.div
              key="resonance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <section className="mb-12">
                <h2 className="text-text-primary text-2xl tracking-[0.2em] font-serif text-center">Resonance</h2>
                <p className="text-text-tertiary text-sm text-center mt-4 font-mono">与世界的共鸣频率</p>
              </section>
              <div className="metal-card p-12 text-center">
                <p className="text-text-tertiary font-serif">共鸣记录正在建立...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部信息 */}
      <footer className="border-t border-white/10 mt-32 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-text-tertiary text-sm tracking-wide font-serif">
            Visual & Clause
          </p>
          <p className="text-text-tertiary text-xs mt-6 tracking-wider">
            © 2025 Zhang YuLing
          </p>
        </div>
      </footer>

      {/* AI 聊天悬浮窗 */}
      <AIChat />
    </main>
  );
}
