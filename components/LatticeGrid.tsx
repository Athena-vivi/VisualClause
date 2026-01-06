'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clause, getClauses } from '@/lib/supabase';
import { Calendar, Tag, Sidebar } from 'lucide-react';

interface LatticeCardProps {
  clause: Clause;
  index: number;
  total: number;
  onClick: () => void;
}

// Bento Grid 布局配置 - 模拟非线性思维
function getCardSpan(index: number, contentLength: number) {
  // 基于内容长度和索引生成错落有致的布局
  const patterns = [
    { colSpan: 'col-span-2', rowSpan: 'row-span-2' }, // 大卡片
    { colSpan: 'col-span-1', rowSpan: 'row-span-1' }, // 普通卡片
    { colSpan: 'col-span-1', rowSpan: 'row-span-2' }, // 竖长卡片
    { colSpan: 'col-span-2', rowSpan: 'row-span-1' }, // 横宽卡片
    { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
  ];

  // 根据内容长度调整卡片大小
  let patternIndex = index % patterns.length;
  if (contentLength > 100) {
    // 长内容使用大卡片或横宽卡片
    patternIndex = index % 2 === 0 ? 0 : 3;
  }

  const pattern = patterns[patternIndex];

  return {
    desktop: pattern,
    mobile: 'col-span-1'
  };
}

function LatticeCard({ clause, index, total, onClick }: LatticeCardProps) {
  const spans = getCardSpan(index, clause.content.length);

  // 计算从中心向四周扩散的延迟
  const centerX = (total - 1) / 2;
  const centerY = 2; // 3行网格的中心
  const currentRow = Math.floor(index / 3);
  const currentCol = index % 3;
  const distanceFromCenter = Math.sqrt(
    Math.pow(currentCol - centerX, 2) + Math.pow(currentRow - centerY, 2)
  );

  return (
    <motion.div
      className={`
        metal-card p-6 cursor-pointer
        ${spans.desktop.colSpan} ${spans.desktop.rowSpan}
        md:${spans.desktop.colSpan} md:${spans.desktop.rowSpan}
      `}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: distanceFromCenter * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 8px 32px -2px rgba(74, 144, 226, 0.15), 0 0 60px -15px rgba(74, 144, 226, 0.3)',
        borderColor: 'rgba(74, 144, 226, 0.4)'
      }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-text-tertiary text-xs tracking-wider">
          <Calendar className="w-3 h-3" />
          {new Date(clause.created_at).toLocaleDateString('zh-CN')}
        </div>
        <div className="text-text-tertiary text-xs tracking-wider">{clause.source}</div>
      </div>

      <p className="text-text-primary text-sm leading-relaxed mb-4 font-light tracking-wide">
        {clause.content}
      </p>

      {clause.tags && clause.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="w-3 h-3 text-text-tertiary" />
          {clause.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs text-accent-blue bg-accent-glow border border-accent-blue/20 rounded-sm tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

interface ClauseDetailProps {
  clause: Clause | null;
  onClose: () => void;
}

function ClauseDetail({ clause, onClose }: ClauseDetailProps) {
  if (!clause) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white/5 backdrop-blur-md border border-white/10 max-w-2xl w-full p-8 rounded-sm"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-text-tertiary text-sm mb-2 tracking-wide">
              <Calendar className="w-4 h-4" />
              {new Date(clause.created_at).toLocaleString('zh-CN')}
            </div>
            <div className="text-text-tertiary text-sm tracking-wide">{clause.source}</div>
          </div>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary transition-colors"
          >
            <Sidebar className="w-6 h-6 rotate-90" />
          </button>
        </div>

        <p className="text-text-primary text-lg leading-relaxed mb-6 font-light tracking-wide">
          {clause.content}
        </p>

        {clause.tags && clause.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-text-secondary" />
            {clause.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1.5 text-sm text-accent-blue bg-accent-glow border border-accent-blue/30 rounded-sm tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {clause.metadata && Object.keys(clause.metadata).length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="text-text-tertiary text-xs uppercase tracking-widest mb-3">
              元数据
            </h4>
            <pre className="text-text-secondary text-xs bg-white/5 backdrop-blur-md border border-white/10 p-4 overflow-x-auto font-mono">
              {JSON.stringify(clause.metadata, null, 2)}
            </pre>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function LatticeGrid() {
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClauses() {
      setLoading(true);
      const data = await getClauses();
      setClauses(data);
      setLoading(false);
    }
    loadClauses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-tertiary text-sm">晶格构建中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Bento Grid 便当盒布局 */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 auto-rows-auto gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {clauses.map((clause, index) => (
          <LatticeCard
            key={clause.id}
            clause={clause}
            index={index}
            total={clauses.length}
            onClick={() => setSelectedClause(clause)}
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedClause && (
          <ClauseDetail
            clause={selectedClause}
            onClose={() => setSelectedClause(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
