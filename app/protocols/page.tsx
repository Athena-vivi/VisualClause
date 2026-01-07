import { getProtocols } from '@/lib/supabase';
import SecondaryLayout from '@/components/shared/SecondaryLayout';
import DataRainEffect from '@/components/DataRainEffect';
import HoloGrid from '@/components/HoloGrid';
import BlueprintGrid from '@/components/BlueprintGrid';
import SystemParameters from '@/components/SystemParameters';
import FrequencyScanner from '@/components/FrequencyScanner';
import ProtocolsContent from '@/components/ProtocolsContent';

export const revalidate = 60; // 每 60 秒重新生成

export default async function ProtocolsPage() {
  const protocols = await getProtocols();

  return (
    <SecondaryLayout title="Protocols" bgClass="bookish-bg">
      {/* 蓝图背景层 - 3D 透视网格 */}
      <BlueprintGrid />

      {/* 全息坐标层 - 极淡的十字准星和经纬度 */}
      <HoloGrid />

      {/* 数据降雨效果 - 壬水在数字文明中的表现 */}
      <DataRainEffect />

      {/* 四周环境数据流 */}
      <SystemParameters />

      {/* 底部频率接收器 */}
      <FrequencyScanner />

      {/* 广袤深邃的主容器 - 左右分区 */}
      <div className="relative z-10 flex flex-col lg:flex-row gap-[10vw]" style={{ padding: '10vh 8vw' }}>
        <ProtocolsContent protocols={protocols} />
      </div>
    </SecondaryLayout>
  );
}
