'use client';

import { Entry } from '@/lib/supabase';

interface ProtocolRendererProps {
  protocol: Entry;
}

export default function ProtocolRenderer({ protocol }: ProtocolRendererProps) {
  const format = protocol.metadata?.format || 'text';

  return (
    <div className="group relative">
      {/* 协议标题 */}
      <h3 className="text-secondary text-lg md:text-xl font-serif font-light mb-4 tracking-wide">
        {protocol.content}
      </h3>

      {/* 根据格式渲染不同内容 */}
      {format === 'audio' && <AudioProtocol protocol={protocol} />}
      {format === 'text' && <TextProtocol protocol={protocol} />}
      {format === 'file' && <FileProtocol protocol={protocol} />}
      {!format && <TextProtocol protocol={protocol} />}

      {/* 点击时的琥珀金微光反馈 */}
      <div className="absolute inset-0 bg-accent-gold/5 opacity-0 group-active:opacity-100 transition-opacity duration-150 pointer-events-none rounded-sm -z-10" />
    </div>
  );
}

// 音频协议 - 深蓝背景 + 琥珀金波形
function AudioProtocol({ protocol }: { protocol: Entry }) {
  return (
    <div className="bg-primary/50 border border-white/10 rounded-sm p-4">
      <div className="flex items-center gap-4 mb-3">
        {/* 播放按钮 */}
        <button className="w-10 h-10 rounded-full bg-accent-gold/10 hover:bg-accent-gold/20 flex items-center justify-center transition-colors duration-300 border border-accent-gold/30">
          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-accent-gold border-b-[6px] border-b-transparent ml-1" />
        </button>

        {/* 波形可视化 */}
        <div className="flex-1 flex items-center gap-1 h-12">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="w-1 bg-accent-gold/40 rounded-full transition-all duration-300"
              style={{
                height: `${20 + Math.random() * 60}%`,
                opacity: 0.3 + Math.random() * 0.7,
              }}
            />
          ))}
        </div>

        {/* 时长 */}
        <span className="text-tertiary text-xs font-mono tracking-wider">
          {protocol.metadata?.duration
            ? `${Math.floor(protocol.metadata.duration / 60)}:${(protocol.metadata.duration % 60).toString().padStart(2, '0')}`
            : 'AUDIO'}
        </span>
      </div>
    </div>
  );
}

// 文本协议 - 结构化文字
function TextProtocol({ protocol }: { protocol: Entry }) {
  return (
    <div className="space-y-3">
      {/* 协议编号 */}
      {protocol.metadata?.protocol_number && (
        <div className="text-accent-gold/60 text-xs font-mono tracking-[0.2em]">
          PROTOCOL-{protocol.metadata.protocol_number.toString().padStart(4, '0')}
        </div>
      )}

      {/* 协议内容 */}
      <div className="text-secondary/80 text-sm leading-relaxed tracking-wide whitespace-pre-wrap">
        {protocol.metadata?.description || protocol.content}
      </div>

      {/* 协议标签 */}
      {protocol.tags && protocol.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {protocol.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded text-tertiary text-xs tracking-[0.15em]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// 文件协议 - 银色金属质感下载组件
function FileProtocol({ protocol }: { protocol: Entry }) {
  return (
    <div className="metal-card p-4">
      <div className="flex items-center justify-between gap-4">
        {/* 文件信息 */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {/* 文件图标 */}
            <div className="w-10 h-10 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-sm flex items-center justify-center">
              <svg className="w-5 h-5 text-accent-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>

            {/* 文件名和大小 */}
            <div className="flex-1">
              <div className="text-secondary text-sm font-medium tracking-wide mb-1">
                {protocol.metadata?.file_name || 'protocol_file'}
              </div>
              <div className="text-tertiary text-xs font-mono tracking-wider">
                {protocol.metadata?.file_size
                  ? `${(protocol.metadata.file_size / 1024).toFixed(1)} KB`
                  : 'SIZE UNKNOWN'}
              </div>
            </div>
          </div>
        </div>

        {/* 下载按钮 */}
        <a
          href={protocol.metadata?.file_url || '#'}
          download
          className="px-4 py-2 bg-accent-gold/10 hover:bg-accent-gold/20 border border-accent-gold/30 text-accent-gold text-sm tracking-[0.15em] rounded-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
        >
          DOWNLOAD
        </a>
      </div>
    </div>
  );
}
