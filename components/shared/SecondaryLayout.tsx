'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import AstraLogo from '@/components/AstraLogo';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface SecondaryLayoutProps {
  children: ReactNode;
  title: string;
  bgClass?: string;
}

export default function SecondaryLayout({ children, title, bgClass = 'starsea-bg' }: SecondaryLayoutProps) {
  return (
    <main className={`min-h-screen w-full ${bgClass} relative overflow-hidden`} style={{ margin: 0, padding: 0 }}>
      {/* 左上角返回首页的 Logo */}
      <Link href="/" className="fixed top-6 left-6 z-50 group">
        <div style={{ filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.2))' }}>
          <AstraLogo size={48} />
        </div>
      </Link>

      {/* 右上角语言切换按钮 */}
      <LanguageSwitcher />

      {/* 页面标题 */}
      <div className="pt-24 pb-12 px-6">
        <h1 className="text-tertiary text-2xl md:text-3xl font-serif font-light tracking-[0.4em] text-center">
          {title.toUpperCase()}
        </h1>
      </div>

      {/* 内容区域 */}
      <div className="px-6 pb-24">
        {children}
      </div>
    </main>
  );
}
