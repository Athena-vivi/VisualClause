'use client';

import { useEffect, useState } from 'react';

export default function SystemParameters() {
  const [params, setParams] = useState({
    cpu: '0',
    memory: '0',
    network: '0',
    freq: '0'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setParams({
        cpu: (Math.random() * 100).toFixed(1),
        memory: (Math.random() * 100).toFixed(1),
        network: (Math.random() * 1000).toFixed(0),
        freq: (Math.random() * 10).toFixed(2)
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Top-Right: CPU & Memory */}
      <div className="fixed top-8 right-8 z-0 opacity-20 font-mono">
        <div className="text-[8px] text-accent-gold/60 tracking-[0.2em] space-y-1 text-right">
          <div>CPU: {params.cpu}%</div>
          <div>MEM: {params.memory}%</div>
          <div>NET: {params.network} MB/s</div>
        </div>
      </div>

      {/* Bottom-Left: Freq & Temperature */}
      <div className="fixed bottom-20 left-8 z-0 opacity-20 font-mono">
        <div className="text-[8px] text-accent-gold/60 tracking-[0.2em] space-y-1">
          <div>FREQ: {params.freq} GHz</div>
          <div>TEMP: {params.freq}°C</div>
          <div>LAT: {Math.floor(Math.random() * 50 + 10)}ms</div>
        </div>
      </div>

      {/* Top-Left: System Status */}
      <div className="fixed top-8 left-8 z-0 opacity-20 font-mono">
        <div className="text-[8px] text-accent-gold/60 tracking-[0.2em] space-y-1">
          <div>SYS: ONLINE</div>
          <div>VER: 2.4.1</div>
          <div>UPT: {Math.floor(Math.random() * 100 + 50)}h</div>
        </div>
      </div>

      {/* Bottom-Right: Coordinates */}
      <div className="fixed bottom-20 right-8 z-0 opacity-20 font-mono text-right">
        <div className="text-[8px] text-accent-gold/60 tracking-[0.2em] space-y-1">
          <div>LAT: {Math.random().toFixed(4)}°N</div>
          <div>LON: {Math.random().toFixed(4)}°E</div>
          <div>ALT: {Math.floor(Math.random() * 1000)}m</div>
        </div>
      </div>
    </>
  );
}
