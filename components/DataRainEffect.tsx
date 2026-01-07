'use client';

import { useEffect, useState } from 'react';

export default function DataRainEffect() {
  const [drops, setDrops] = useState<Array<{ id: number; x: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // 生成 30 个数据雨滴
    const newDrops = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20
    }));
    setDrops(newDrops);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute w-px h-3 bg-gradient-to-b from-accent-gold/60 to-transparent"
          style={{
            left: `${drop.x}%`,
            top: '-10px',
            animation: `fall ${drop.duration}s linear ${drop.delay}s infinite`
          }}
        />
      ))}

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
