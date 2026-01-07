'use client';

export default function HoloGrid() {
  // 生成经纬度数值
  const generateGridLines = () => {
    const lines = [];
    // 垂直线（经度）
    for (let i = 0; i <= 10; i++) {
      lines.push({
        type: 'vertical',
        position: (i / 10) * 100,
        label: (i * 36).toString().padStart(3, '0')
      });
    }
    // 水平线（纬度）
    for (let i = 0; i <= 6; i++) {
      lines.push({
        type: 'horizontal',
        position: (i / 6) * 100,
        label: (i * 30).toString().padStart(3, '0')
      });
    }
    return lines;
  };

  const gridLines = generateGridLines();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* 垂直线 */}
        {gridLines.filter(l => l.type === 'vertical').map((line, i) => (
          <g key={`v-${i}`}>
            <line
              x1={`${line.position}%`}
              y1="0"
              x2={`${line.position}%`}
              y2="100%"
              stroke="rgba(212, 175, 55, 0.15)"
              strokeWidth="0.5"
              strokeDasharray="4 4"
            />
            {/* 十字准星 */}
            <line
              x1={`${line.position - 0.5}%`}
              y1="50%"
              x2={`${line.position + 0.5}%`}
              y2="50%"
              stroke="rgba(212, 175, 55, 0.3)"
              strokeWidth="0.5"
            />
            <line
              x1={`${line.position}%`}
              y1="49.5%"
              x2={`${line.position}%`}
              y2="50.5%"
              stroke="rgba(212, 175, 55, 0.3)"
              strokeWidth="0.5"
            />
            {/* 经度标签 */}
            <text
              x={`${line.position + 0.2}%`}
              y="2%"
              fill="rgba(212, 175, 55, 0.3)"
              fontSize="8"
              fontFamily="monospace"
              letterSpacing="0.2em"
            >
              {line.label}°E
            </text>
          </g>
        ))}

        {/* 水平线 */}
        {gridLines.filter(l => l.type === 'horizontal').map((line, i) => (
          <g key={`h-${i}`}>
            <line
              x1="0"
              y1={`${line.position}%`}
              x2="100%"
              y2={`${line.position}%`}
              stroke="rgba(212, 175, 55, 0.15)"
              strokeWidth="0.5"
              strokeDasharray="4 4"
            />
            {/* 十字准星 */}
            <line
              x1="38.2%"
              y1={`${line.position - 0.5}%`}
              x2="38.2%"
              y2={`${line.position + 0.5}%`}
              stroke="rgba(212, 175, 55, 0.3)"
              strokeWidth="0.5"
            />
            <line
              x1="38.15%"
              y1={`${line.position}%`}
              x2="38.25%"
              y2={`${line.position}%`}
              stroke="rgba(212, 175, 55, 0.3)"
              strokeWidth="0.5"
            />
            {/* 纬度标签 */}
            <text
              x="2%"
              y={`${line.position + 0.3}%`}
              fill="rgba(212, 175, 55, 0.3)"
              fontSize="8"
              fontFamily="monospace"
              letterSpacing="0.2em"
            >
              {line.label}°N
            </text>
          </g>
        ))}

        {/* 中心十字准星 - 黄金分割点 */}
        <g>
          <line
            x1="37.7%"
            y1="50%"
            x2="38.7%"
            y2="50%"
            stroke="rgba(212, 175, 55, 0.5)"
            strokeWidth="0.5"
          />
          <line
            x1="38.2%"
            y1="49.5%"
            x2="38.2%"
            y2="50.5%"
            stroke="rgba(212, 175, 55, 0.5)"
            strokeWidth="0.5"
          />
          <circle
            cx="38.2%"
            cy="50%"
            r="3"
            fill="none"
            stroke="rgba(212, 175, 55, 0.3)"
            strokeWidth="0.5"
          />
        </g>
      </svg>

      {/* 角落标记 */}
      <div className="absolute top-4 left-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 border border-accent-gold/40 rotate-45" />
          <span className="text-accent-gold/30 text-[8px] font-mono tracking-[0.2em]">
            HOLOGRAPHIC COORDINATES
          </span>
        </div>
      </div>
    </div>
  );
}
