'use client';

export type FilterType = 'all' | 'res' | 'log' | 'act' | 'ast';

interface ProtocolMatrixProps {
  activeFilter: FilterType;
}

// 定义每个槽位的类型映射
const SLOT_TYPES = ['RES', 'LOG', 'ACT', 'AST'] as const;
type SlotType = typeof SLOT_TYPES[number];

export default function ProtocolMatrix({ activeFilter }: ProtocolMatrixProps) {
  // 生成 6 个占位符卡片 (3x2)，每个卡片分配一个类型
  const placeholders = Array.from({ length: 6 }, (_, i) => ({
    index: i,
    type: SLOT_TYPES[i % 4],
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
      {placeholders.map(({ index, type }) => {
        // 检查当前槽位是否匹配过滤条件
        const typeToFilter: Record<SlotType, FilterType> = {
          'RES': 'res',
          'LOG': 'log',
          'ACT': 'act',
          'AST': 'ast',
        };

        const isMatched = activeFilter === 'all' || activeFilter === typeToFilter[type];
        const isDimmed = activeFilter !== 'all' && !isMatched;

        return (
          <div
            key={index}
            className="relative group"
            style={{
              padding: '4rem 2rem',
              opacity: isDimmed ? 0.1 : 1,
              transition: 'opacity 0.5s ease-in-out',
            }}
          >
            {/* 四角准星 - 默认状态 */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-accent-gold/20 transition-all duration-700" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-accent-gold/20 transition-all duration-700" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-accent-gold/20 transition-all duration-700" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-accent-gold/20 transition-all duration-700" />

            {/* 悬停时的扫描线闭合效果 */}
            <div className="absolute inset-0 border border-transparent rounded-sm transition-all duration-700 group-hover:border-accent-gold/10" />

            {/* 匹配时的琥珀色脉冲边框 */}
            {isMatched && activeFilter !== 'all' && (
              <div
                className="absolute inset-0 border border-accent-gold/30 rounded-sm"
                style={{
                  animation: 'border-pulse 2s ease-in-out infinite',
                }}
              />
            )}

            {/* 运行中动画 - 绕着边框转动的光点 */}
            {isMatched && activeFilter !== 'all' && (
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute w-1 h-1 bg-accent-gold rounded-full"
                  style={{
                    boxShadow: '0 0 8px 2px rgba(212, 175, 55, 0.6)',
                    animation: 'orbit-perimeter 3s linear infinite',
                  }}
                />
              </div>
            )}

            {/* 中心 N/A 标识 - 更细、更小 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-accent-gold/20 text-base font-extralight font-mono tracking-[0.5em] animate-pulse"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animationDuration: `${2 + Math.random()}s`
                }}
              >
                N/A
              </span>
            </div>

            {/* 类型标识 - 右上角 */}
            <div className="absolute top-2 right-2 opacity-20">
              <span className="text-accent-gold text-[6px] font-mono tracking-[0.2em]">
                TYPE: {type}
              </span>
            </div>

            {/* 卡片编号 - 左上角 */}
            <div className="absolute top-2 left-2">
              <span className="text-tertiary/10 text-[8px] font-mono tracking-[0.3em]">
                SLOT-{(index + 1).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
