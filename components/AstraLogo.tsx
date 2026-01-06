'use client';

import { motion } from 'framer-motion';

export default function AstraLogo({ size = 48, className = '' }) {
  return (
    <div
      className={`relative inline-block ${className}`}
      style={{
        width: size,
        height: size,
        // 整体氛围：深海蓝 + 琥珀金温度
        filter: 'drop-shadow(0 0 20px rgba(37, 99, 235, 0.3)) drop-shadow(0 0 15px rgba(212, 175, 55, 0.2))'
      }}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* 晶体切面渐变 - 保持蓝银 */}
          <linearGradient id="facet-tl" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          <linearGradient id="facet-bl" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          {/* 壬水波纹渐变 */}
          <linearGradient id="wave-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.8" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* 琥珀金菱形渐变 - 金水相逢 */}
          <radialGradient id="astra-gold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F4D03F" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#B8960E" />
          </radialGradient>

          {/* 琥珀金光晕 */}
          <radialGradient id="gold-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(212, 175, 55, 0.6)" />
            <stop offset="50%" stopColor="rgba(212, 175, 55, 0.2)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* --- 远景波纹 (最深处的水) --- */}
        <motion.path
          d="M 4 28 Q 24 20 44 28"
          stroke="url(#wave-gradient)"
          strokeWidth="1"
          opacity="0.2"
          animate={{
            d: ["M 4 28 Q 24 20 44 28", "M 4 24 Q 24 36 44 24", "M 4 28 Q 24 20 44 28"],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* --- 晶体主体 (钰) - 悬浮感 --- */}
        <motion.g
          animate={{
            y: [0, -1.5, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: 'center' }}
        >
          {/* 左侧切面 */}
          <path d="M 24 6 L 24 24 L 10 24 Z" fill="url(#facet-tl)" />
          <path d="M 10 24 L 24 24 L 24 42 Z" fill="url(#facet-bl)" />

          {/* 右侧切面 */}
          <path d="M 24 6 L 38 24 L 24 24 Z" fill="#CBD5E1" />
          <path d="M 24 24 L 38 24 L 24 42 Z" fill="#1D4ED8" />

          {/* 棱角高光线 */}
          <line x1="24" y1="6" x2="24" y2="42" stroke="white" strokeWidth="0.5" opacity="0.4" />
        </motion.g>

        {/* --- Astra 菱形 - 金黄色 + 4秒呼吸光晕 --- */}
        <g style={{ transformOrigin: '24px 26px' }}>
          {/* 金色光晕背景 - 4秒呼吸 */}
          <motion.circle
            cx="24" cy="26" r="8"
            fill="url(#gold-glow)"
            animate={{
              opacity: [0.2, 0.7, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* 金黄色菱形主体 - 4秒呼吸同步 */}
          <motion.rect
            x="21" y="23"
            width="6" height="6"
            fill="url(#astra-gold)"
            transform="rotate(45 24 26)"
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.8)) drop-shadow(0 0 16px rgba(212, 175, 55, 0.4))'
            }}
          />
        </g>

        {/* --- 近景光斑 (水面的折射点) --- */}
        <motion.circle
          cx="30" cy="30" r="0.5" fill="white"
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
        <motion.circle
          cx="15" cy="20" r="0.5" fill="white"
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        />
      </svg>
    </div>
  );
}
