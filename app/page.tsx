import LatticeGrid from '@/components/LatticeGrid';
import AIChat from '@/components/AIChat';
import SystemStatus from '@/components/SystemStatus';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: 'VisualClause | 数字分身',
  description: '数字分身、人生博物馆、逻辑名片',
};

export default function Home() {
  return (
    <main className="min-h-screen lattice-bg">
      {/* 顶部导航 */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent-glow border border-accent-blue/30 rounded-sm flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent-blue" />
            </div>
            <div>
              <h1 className="text-text-primary text-lg font-light tracking-wide">VisualClause</h1>
              <p className="text-text-tertiary text-xs">数字分身 v1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-text-tertiary text-xs">
            <span>INTJ</span>
            <span>·</span>
            <span>辛酉</span>
            <span>·</span>
            <span>金之墓库</span>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* 系统状态面板 */}
        <SystemStatus />

        {/* 章节标题 */}
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"></div>
            <h2 className="text-text-primary text-sm tracking-widest uppercase">晶格流 // The Lattice Feed</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"></div>
          </div>
          <p className="text-center text-text-tertiary text-xs mt-4">碎片化思考的聚合 // 逻辑严密的网格</p>
        </section>

        {/* Lattice 网格 */}
        <LatticeGrid />
      </div>

      {/* 底部信息 */}
      <footer className="border-t border-border mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-text-tertiary text-xs">
            Visual & Clause · 感性与理性的交汇点 · 2026
          </p>
          <p className="text-text-tertiary text-xs mt-2">
            拒绝平庸 · 崇尚逻辑 · 审美共振
          </p>
        </div>
      </footer>

      {/* AI 聊天悬浮窗 */}
      <AIChat />
    </main>
  );
}
