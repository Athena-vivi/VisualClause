'use client';

export default function BlueprintGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" style={{ perspective: '1500px' }}>
      <div className="absolute inset-0" style={{ transform: 'rotateX(75deg) translateZ(-300px)' }}>
        <svg className="w-full h-[300%]" style={{ marginTop: '-100%' }} xmlns="http://www.w3.org/2000/svg">
          {/* 垂直网格线 */}
          {Array.from({ length: 20 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={`${(i / 20) * 100}%`}
              y1="0"
              x2={`${(i / 20) * 100}%`}
              y2="100%"
              stroke="rgba(212, 175, 55, 0.03)"
              strokeWidth="0.3"
            />
          ))}

          {/* 水平网格线 */}
          {Array.from({ length: 40 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={`${(i / 40) * 100}%`}
              x2="100%"
              y2={`${(i / 40) * 100}%`}
              stroke="rgba(212, 175, 55, 0.03)"
              strokeWidth="0.3"
            />
          ))}

          {/* 中心发光区域 */}
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="20%">
              <stop offset="0%" stopColor="rgba(212, 175, 55, 0.08)" />
              <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
            </radialGradient>
          </defs>
          <rect
            x="35%"
            y="35%"
            width="30%"
            height="30%"
            fill="url(#centerGlow)"
          />
        </svg>
      </div>
    </div>
  );
}
