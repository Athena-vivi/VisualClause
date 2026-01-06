import { getProtocols } from '@/lib/supabase';
import SecondaryLayout from '@/components/shared/SecondaryLayout';
import ProtocolRenderer from '@/components/shared/ProtocolRenderer';

export const revalidate = 60; // 每 60 秒重新生成

export default async function ProtocolsPage() {
  const protocols = await getProtocols();

  return (
    <SecondaryLayout title="Protocols" bgClass="bookish-bg">
      <div className="max-w-4xl mx-auto">
        {/* 非对称两栏布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：协议列表（占 2 列） */}
          <div className="lg:col-span-2 space-y-8">
            {protocols.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-tertiary text-sm tracking-[0.3em]">
                  NO PROTOCOLS YET
                </p>
              </div>
            ) : (
              protocols.map((protocol) => (
                <ProtocolRenderer key={protocol.id} protocol={protocol} />
              ))
            )}
          </div>

          {/* 右侧：统计信息（占 1 列） */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* 协议统计 */}
              <div className="metal-card p-6">
                <h3 className="text-secondary text-sm tracking-[0.2em] mb-4 pb-3 border-b border-white/10">
                  STATISTICS
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-tertiary text-xs tracking-wide">Total</span>
                    <span className="text-accent-gold text-sm font-mono tracking-wider">
                      {protocols.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-tertiary text-xs tracking-wide">Audio</span>
                    <span className="text-accent-gold text-sm font-mono tracking-wider">
                      {protocols.filter(p => p.metadata?.format === 'audio').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-tertiary text-xs tracking-wide">Text</span>
                    <span className="text-accent-gold text-sm font-mono tracking-wider">
                      {protocols.filter(p => p.metadata?.format === 'text').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-tertiary text-xs tracking-wide">Files</span>
                    <span className="text-accent-gold text-sm font-mono tracking-wider">
                      {protocols.filter(p => p.metadata?.format === 'file').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* 快速链接 */}
              {protocols.length > 0 && (
                <div className="metal-card p-6">
                  <h3 className="text-secondary text-sm tracking-[0.2em] mb-4 pb-3 border-b border-white/10">
                    QUICK ACCESS
                  </h3>
                  <div className="space-y-2">
                    {protocols.slice(0, 5).map((protocol) => (
                      <a
                        key={protocol.id}
                        href={`#protocol-${protocol.id}`}
                        className="block text-tertiary text-xs tracking-[0.15em] hover:text-accent-gold transition-colors duration-300 py-1"
                      >
                        {protocol.content.slice(0, 30)}...
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SecondaryLayout>
  );
}
