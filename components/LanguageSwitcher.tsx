'use client';

import { useState, useTransition } from 'react';

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const [currentLang, setCurrentLang] = useState<'zh' | 'en'>('zh');

  const toggleLanguage = () => {
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    setCurrentLang(newLang);

    // 这里可以根据需要实现实际的本地化逻辑
    // 目前仅作为视觉演示
    startTransition(() => {
      // 实际实现中，这里会切换路由或更新本地化状态
      console.log('Switching to:', newLang);
    });
  };

  return (
    <div className="fixed top-8 right-12 z-[5]">
      <button
        onClick={toggleLanguage}
        disabled={isPending}
        className="group relative"
      >
        <div className="relative px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/20 rounded-sm hover:border-accent-gold/40 transition-all duration-500 group-hover:bg-accent-gold/10" style={{ filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.2))' }}>
          <div className="flex items-center gap-3">
            {/* 语言标识 */}
            <span className="text-accent-gold text-sm font-mono tracking-wider font-light">
              {currentLang === 'zh' ? '中' : 'EN'}
            </span>

            {/* 分隔线 */}
            <div className="w-px h-4 bg-white/20" />

            {/* 切换指示器 */}
            <span className="text-tertiary/60 text-xs tracking-wider group-hover:text-accent-gold/80 transition-colors duration-500">
              {currentLang === 'zh' ? 'EN' : '中'}
            </span>
          </div>

          {/* 悬停时的微光效果 */}
          <div className="absolute inset-0 bg-accent-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm pointer-events-none" />
        </div>

        {/* 底部琥珀金细线 */}
        <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent-gold/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </button>
    </div>
  );
}
