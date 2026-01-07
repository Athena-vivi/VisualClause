'use client';

import { useState } from 'react';
import { Entry } from '@/lib/supabase';
import ProtocolRenderer from './shared/ProtocolRenderer';
import ProtocolMatrix, { FilterType } from './ProtocolMatrix';
import StatisticsPanel from './StatisticsPanel';

interface ProtocolsContentProps {
  protocols: Entry[];
}

export default function ProtocolsContent({ protocols }: ProtocolsContentProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  return (
    <>
      {/* 左侧：节点区域 (Nodes Area) - 占据 75% 宽度 */}
      <div className="flex-1 lg:w-3/4 flex items-center justify-center">
        {protocols.length === 0 ? (
          <ProtocolMatrix activeFilter={activeFilter} />
        ) : (
          <div className="grid grid-cols-1 gap-32 w-full">
            {protocols.map((protocol, index) => {
              // 当有实际协议时，暂时不过滤（保持全部显示）
              // 未来可以根据协议的实际类型属性进行过滤
              const isDimmed = false;

              return (
                <div
                  key={protocol.id}
                  style={{
                    opacity: isDimmed ? 0.1 : 1,
                    transition: 'opacity 0.5s ease-in-out',
                  }}
                >
                  <ProtocolRenderer protocol={protocol} index={index} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 右侧：控制区域 (Control Area) - 占据 25% 宽度 */}
      <div className="lg:w-1/4 flex items-center justify-center lg:justify-start">
        <StatisticsPanel
          protocols={protocols}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>
    </>
  );
}
