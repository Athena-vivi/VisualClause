'use client';

import LatticeGrid from '@/components/LatticeGrid';
import AIChat from '@/components/AIChat';
import SystemStatus from '@/components/SystemStatus';
import { Sparkles } from 'lucide-react';
import { useEffect } from 'react';

export default function Home() {
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

    return () => {
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

      {/* 顶部导航 */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-30 relative">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent-glow border border-accent-blue/30 rounded-sm flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent-blue" />
            </div>
            <div>
              <h1 className="text-text-primary text-lg font-light tracking-[0.2em]">VisualClause</h1>
              <p className="text-text-tertiary text-xs tracking-wider">数字分身 v1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-text-tertiary text-xs tracking-wider">
            <span>INTJ</span>
            <span>·</span>
            <span>辛酉</span>
            <span>·</span>
            <span>金之墓库</span>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* 系统状态面板 */}
        <SystemStatus />

        {/* 章节标题 */}
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <h2 className="text-text-primary text-sm tracking-[0.3em] uppercase">晶格流 // The Lattice Feed</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>
          <p className="text-center text-text-tertiary text-xs mt-4 tracking-widest">碎片化思考的聚合 // 逻辑严密的网格</p>
        </section>

        {/* Lattice 网格 */}
        <LatticeGrid />
      </div>

      {/* 底部信息 */}
      <footer className="border-t border-white/10 mt-20 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-text-tertiary text-xs tracking-wider">
            Visual & Clause · 感性与理性的交汇点 · 2026
          </p>
          <p className="text-text-tertiary text-xs mt-2 tracking-widest">
            拒绝平庸 · 崇尚逻辑 · 审美共振
          </p>
        </div>
      </footer>

      {/* AI 聊天悬浮窗 */}
      <AIChat />
    </main>
  );
}
