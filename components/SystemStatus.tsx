'use client';

import { useState, useEffect } from 'react';
import { Activity, Zap, Music } from 'lucide-react';
import { getTodayMetrics, DailyMetrics } from '@/lib/supabase';

export default function SystemStatus() {
  const [metrics, setMetrics] = useState<DailyMetrics | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      const data = await getTodayMetrics();
      setMetrics(data);
    }
    loadMetrics();
  }, []);

  return (
    <div className="metal-card p-6 mb-8">
      <h3 className="text-text-primary text-sm font-medium mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4 text-accent-blue" />
        系统状态 // {new Date().toLocaleDateString('zh-CN')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 物理功耗 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-xs flex items-center gap-2">
              <Zap className="w-3 h-3" />
              物理功耗
            </span>
            <span className="text-text-primary text-sm font-mono">
              {metrics?.steps || 0} / 10,000
            </span>
          </div>
          <div className="h-1.5 bg-background border border-border rounded-sm overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-blue/50 to-accent-blue transition-all duration-500"
              style={{ width: `${Math.min(((metrics?.steps || 0) / 10000) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* 脑力熵减 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-xs flex items-center gap-2">
              <Activity className="w-3 h-3" />
              脑力熵减
            </span>
            <span className="text-text-primary text-sm font-mono">
              {metrics?.clause_count || 0} 条 Clause
            </span>
          </div>
          <div className="h-1.5 bg-background border border-border rounded-sm overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-gold/50 to-accent-gold transition-all duration-500"
              style={{ width: `${Math.min(((metrics?.clause_count || 0) / 10) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 审美共振 */}
      {metrics?.current_music && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-text-secondary text-xs">
            <Music className="w-3 h-3 text-accent-blue" />
            <span>当前频率:</span>
            <span className="text-accent-blue">{metrics.current_music}</span>
          </div>
        </div>
      )}
    </div>
  );
}
