'use client';

export default function FrequencyScanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-0 pointer-events-none">
      {/* 扫描线 */}
      <div className="relative h-px overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent"
          style={{
            animation: 'scan 4s linear infinite'
          }}
        />
      </div>

      {/* 波动效果 */}
      <svg className="w-full h-12" viewBox="0 0 1000 48" preserveAspectRatio="none">
        <path
          d="M0,24 Q50,20 100,24 T200,24 T300,24 T400,24 T500,24 T600,24 T700,24 T800,24 T900,24 T1000,24"
          fill="none"
          stroke="rgba(212, 175, 55, 0.1)"
          strokeWidth="0.5"
        >
          <animate
            attributeName="d"
            values="
              M0,24 Q50,20 100,24 T200,24 T300,24 T400,24 T500,24 T600,24 T700,24 T800,24 T900,24 T1000,24;
              M0,24 Q50,28 100,24 T200,24 T300,24 T400,24 T500,24 T600,24 T700,24 T800,24 T900,24 T1000,24;
              M0,24 Q50,20 100,24 T200,24 T300,24 T400,24 T500,24 T600,24 T700,24 T800,24 T900,24 T1000,24
            "
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
      </svg>

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
