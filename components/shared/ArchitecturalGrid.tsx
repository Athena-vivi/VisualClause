'use client';

import { useMemo } from 'react';

interface ArchitecturalGridProps {
  className?: string;
}

/**
 * 3D Architectural Grid Background
 * 极细银色线条构成透视矩阵，代表逻辑架构
 * 用于 Archive 页面，营造书房与书架的空间感
 */
export default function ArchitecturalGrid({ className = '' }: ArchitecturalGridProps) {
  // 生成垂直线（建筑立柱）
  const verticalLines = useMemo(() => {
    const lines: { x: number; opacity: number }[] = [];
    const columnCount = 8; // 8根立柱

    for (let i = 0; i <= columnCount; i++) {
      const position = (i / columnCount) * 100;
      // 中间的线更亮，两边的线更暗
      const distanceFromCenter = Math.abs(i - columnCount / 2) / (columnCount / 2);
      const opacity = 0.15 - distanceFromCenter * 0.1;

      lines.push({ x: position, opacity });
    }

    return lines;
  }, []);

  // 生成水平线（层高）
  const horizontalLines = useMemo(() => {
    const lines: { y: number; opacity: number }[] = [];
    const rowCount = 15;

    for (let i = 0; i <= rowCount; i++) {
      const position = (i / rowCount) * 100;
      // 底部的线更亮，顶部的线更暗
      const opacity = 0.08 + (i / rowCount) * 0.1;

      lines.push({ y: position, opacity });
    }

    return lines;
  }, []);

  // 生成交汇点
  const junctionPoints = useMemo(() => {
    const points: { x: number; y: number }[] = [];
    const columnCount = 8;
    const rowCount = 15;

    for (let x = 0; x <= columnCount; x++) {
      for (let y = 0; y <= rowCount; y++) {
        points.push({
          x: (x / columnCount) * 100,
          y: (y / rowCount) * 100
        });
      }
    }

    return points;
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          {/* 银色线条渐变 */}
          <linearGradient id="arch-silver" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(180, 180, 185, 0.02)" />
            <stop offset="50%" stopColor="rgba(180, 180, 185, 0.06)" />
            <stop offset="100%" stopColor="rgba(180, 180, 185, 0.08)" />
          </linearGradient>

          {/* 发光点渐变 - 金黄色 */}
          <radialGradient id="junction-glow-gold">
            <stop offset="0%" stopColor="rgba(212, 175, 55, 0.4)" />
            <stop offset="50%" stopColor="rgba(212, 175, 55, 0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* 银色发光点 */}
          <radialGradient id="junction-glow-silver">
            <stop offset="0%" stopColor="rgba(180, 180, 185, 0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* 水平线 */}
        {horizontalLines.map((line, idx) => (
          <line
            key={`h-${idx}`}
            x1="0"
            y1={`${line.y}%`}
            x2="100%"
            y2={`${line.y}%`}
            stroke="url(#arch-silver)"
            strokeWidth="0.5"
            opacity={line.opacity}
          />
        ))}

        {/* 垂直线 */}
        {verticalLines.map((line, idx) => (
          <line
            key={`v-${idx}`}
            x1={`${line.x}%`}
            y1="0"
            x2={`${line.x}%`}
            y2="100%"
            stroke="url(#arch-silver)"
            strokeWidth="0.5"
            opacity={line.opacity}
          />
        ))}

        {/* 交汇点发光 - 黄金比例位置使用金黄色 */}
        {junctionPoints.map((point, idx) => {
          // 黄金比例位置：约 38.2% 处
          const isGoldenPoint = Math.abs(point.x - 38.2) < 6;
          const glowId = isGoldenPoint ? 'junction-glow-gold' : 'junction-glow-silver';
          const radius = isGoldenPoint ? 1.5 : 1;
          const opacity = isGoldenPoint ? 0.8 : 0.4;

          return (
            <circle
              key={`junction-${idx}`}
              cx={`${point.x}%`}
              cy={`${point.y}%`}
              r={radius}
              fill={`url(#${glowId})`}
              opacity={opacity}
            />
          );
        })}
      </svg>

      {/* 深度暗角 - 增强空间感 */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/70" />
    </div>
  );
}
