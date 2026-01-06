'use client';

import { useState, useEffect } from 'react';
import { Activity, Zap, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTodayMetrics, DailyMetrics } from '@/lib/supabase';

export default function SystemEquilibrium() {
  const [metrics, setMetrics] = useState<DailyMetrics | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      const data = await getTodayMetrics();
      setMetrics(data);
    }
    loadMetrics();
  }, []);

  const stepsPercentage = Math.min(((metrics?.steps || 0) / 10000) * 100, 100);
  const entryPercentage = Math.min(((metrics?.entry_count || 0) / 10) * 100, 100);

  return (
    <div className="metal-card p-8">
      <h3 className="text-text-primary text-base font-medium mb-6 flex items-center gap-3 tracking-wide font-serif">
        <Activity className="w-5 h-5 text-accent-blue" />
        System Equilibrium · {new Date().toLocaleDateString('zh-CN')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 物理功耗 - 金黄色高亮 */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-secondary text-sm flex items-center gap-2 tracking-wide">
              <Zap className="w-3.5 h-3.5 text-accent-gold" />
              Physical Load
            </span>
            <span className="text-accent-gold text-base font-mono font-medium tracking-wider">
              {String(metrics?.steps || 0).padStart(5, '0')}
            </span>
          </div>

          {/* 进度条背景 */}
          <div className="h-2 bg-white/5 border border-white/10 rounded-sm overflow-hidden relative">
            {/* 金黄色渐变进度 */}
            <motion.div
              className="h-full bg-gradient-to-r from-accent-gold via-accent-gold to-yellow-400 relative"
              initial={{ width: 0 }}
              animate={{ width: `${stepsPercentage}%` }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              style={{
                boxShadow: '0 0 12px rgba(212, 175, 55, 0.4)'
              }}
            >
              {/* 金色光晕扫过效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </motion.div>
          </div>

          {/* 目标标记 */}
          <div className="flex justify-between mt-2 text-xs text-text-tertiary font-mono">
            <span>0</span>
            <span className="text-accent-gold/60">10,000</span>
          </div>
        </div>

        {/* 脑力熵减 - 蓝色系 */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-secondary text-sm flex items-center gap-2 tracking-wide">
              <Activity className="w-3.5 h-3.5 text-accent-blue" />
              Mental Entropy
            </span>
            <span className="text-text-primary text-base font-mono font-medium tracking-wider">
              {String(metrics?.entry_count || 0).padStart(2, '0')} / 10
            </span>
          </div>

          <div className="h-2 bg-white/5 border border-white/10 rounded-sm overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-blue to-blue-400"
              initial={{ width: 0 }}
              animate={{ width: `${entryPercentage}%` }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              style={{
                boxShadow: '0 0 12px rgba(74, 144, 226, 0.3)'
              }}
            />
          </div>

          <div className="flex justify-between mt-2 text-xs text-text-tertiary font-mono">
            <span>0</span>
            <span>10</span>
          </div>
        </div>
      </div>

      {/* 审美共振 - 当前频率 */}
      {metrics?.current_music && (
        <motion.div
          className="mt-8 pt-6 border-t border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center">
              <Music className="w-4 h-4 text-accent-gold" />
            </div>
            <div className="flex-1">
              <div className="text-text-tertiary text-xs tracking-wider mb-1">CURRENT RESONANCE</div>
              <div className="text-accent-gold text-sm font-medium tracking-wide font-mono">
                {metrics.current_music}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
