'use client';

import { Entry } from '@/lib/supabase';
import { FilterType } from './ProtocolMatrix';

interface StatisticsPanelProps {
  protocols: Entry[];
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function StatisticsPanel({ protocols, activeFilter, onFilterChange }: StatisticsPanelProps) {
  // 计算每种类型的数量 - 基于槽位索引循环分配
  const slotCount = 6; // ProtocolMatrix 有 6 个槽位
  const stats = {
    total: protocols.length,
    res: Math.floor(slotCount / 4) + (slotCount % 4 > 0 ? 1 : 0), // RES 在索引 0, 4
    log: Math.floor(slotCount / 4) + (slotCount % 4 > 1 ? 1 : 0), // LOG 在索引 1, 5
    act: Math.floor(slotCount / 4) + (slotCount % 4 > 2 ? 1 : 0), // ACT 在索引 2
    ast: Math.floor(slotCount / 4),                                // AST 在索引 3
  };

  const filterItems = [
    { key: 'res' as FilterType, label: 'RES', count: stats.res, type: 'RESOURCE' },
    { key: 'log' as FilterType, label: 'LOG', count: stats.log, type: 'LOGIC' },
    { key: 'act' as FilterType, label: 'ACT', count: stats.act, type: 'ACTION' },
    { key: 'ast' as FilterType, label: 'AST', count: stats.ast, type: 'ASSET' },
  ];

  return (
    <div
      className="relative bg-transparent border border-accent-gold/20 rounded-sm p-6 w-full max-w-xs"
      style={{
        borderWidth: '0.5px'
      }}
    >
      {/* 四角准星 */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-accent-gold/30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-accent-gold/30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-accent-gold/30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent-gold/30" />

      <h3 className="text-accent-gold text-xs tracking-[0.3em] mb-4 pb-2 border-b border-accent-gold/10 text-center">
        STATISTICS
      </h3>

      <div className="space-y-2">
        {/* TOTAL - 不可点击 */}
        <div className="flex justify-between items-center opacity-60">
          <span className="text-tertiary/40 text-[10px] tracking-wider font-mono">TOTAL</span>
          <span className="text-accent-gold text-xs font-mono tracking-wider">
            {stats.total.toString().padStart(3, '0')}
          </span>
        </div>

        {/* 可交互的过滤项 */}
        {filterItems.map((item) => (
          <div
            key={item.key}
            className="flex justify-between items-center cursor-pointer group transition-all duration-300 hover:bg-accent-gold/5 rounded-sm px-2 py-1 -mx-2"
            onMouseEnter={() => onFilterChange(item.key)}
            onMouseLeave={() => onFilterChange('all')}
          >
            <div className="flex items-center gap-2">
              <span className="text-tertiary/40 text-[10px] tracking-wider font-mono group-hover:text-accent-gold/60 transition-colors">
                {item.label}
              </span>
              <span className="text-tertiary/20 text-[6px] font-mono tracking-[0.2em]">
                TYPE: {item.type}
              </span>
            </div>
            <span className="text-accent-gold text-xs font-mono tracking-wider">
              {item.count.toString().padStart(3, '0')}
            </span>
          </div>
        ))}
      </div>

      {/* 系统心跳线 - 极简 */}
      <div className="mt-4 pt-3 border-t border-accent-gold/5">
        <svg
          className="w-full h-4"
          viewBox="0 0 200 16"
          preserveAspectRatio="none"
        >
          <path
            d="M0,8 L20,8 L25,4 L30,12 L35,8 L60,8 L65,2 L70,14 L75,8 L100,8 L105,5 L110,11 L115,8 L140,8 L145,3 L150,13 L155,8 L200,8"
            fill="none"
            stroke="rgba(212, 175, 55, 0.4)"
            strokeWidth="0.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <animate
              attributeName="stroke-dasharray"
              from="0, 400"
              to="400, 0"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    </div>
  );
}
