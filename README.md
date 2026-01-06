# VisualClause Multi-Tenant System - 一库多站架构

> "Visual" 代表感性审美与视觉呈现, "Clause" 代表理性逻辑与思想契约。
> **一库多站** · 壬水流动 · 辛金精密

## 项目概述

VisualClause 是一个**多租户个人数字分身系统**, 单个 Supabase 项目可支撑多个独立站点,通过 `site_key` 实现数据绝对隔离。

### 核心特性

- **一库多站**: 一套代码库,一个 Supabase 项目,支撑 N 个独立网站
- **数据隔离**: 基于 `site_key` 的逻辑分区,确保各站点数据互不干扰
- **零配置切换**: 通过环境变量 `NEXT_PUBLIC_SITE_KEY` 即可部署新站点
- **向后兼容**: 保留 `Clause` 类型别名,现有组件无需修改

### 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS + 辛金质感配色
- **后端**: Supabase (PostgreSQL + RLS)
- **AI**: OpenRouter API (Claude 3.5 Sonnet)
- **部署**: Vercel

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制 `.env.local.example` 为 `.env.local`:

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`:

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# 站点唯一标识（多租户核心锚点）
# 每个网站部署时修改此值
NEXT_PUBLIC_SITE_KEY=visual_clause

# OpenRouter API
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_key
```

### 3. 数据库迁移

在 Supabase SQL Editor 中执行 [`supabase/migration.sql`](supabase/migration.sql):

```bash
# 复制 migration.sql 内容到 Supabase SQL Editor 执行
```

迁移脚本会自动:
- 将 `clauses` 表重命名为 `entries` (通用化)
- 添加 `site_key` 列并建立索引
- 配置 RLS 策略确保数据隔离
- 创建辅助函数简化开发

### 4. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 多租户部署指南

### 部署新站点

假设你要部署第二个站点 `site_alpha`:

1. **创建新的 Vercel 项目**, 关联同一 GitHub 仓库
2. **配置环境变量**:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co  # 同一个 Supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key                # 同一个 Key
   NEXT_PUBLIC_SITE_KEY=site_alpha                            # 唯一标识（修改此处）
   NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_key
   ```
3. **部署**: 数据自动隔离,无需修改代码

### 站点标识规范

- 只允许字母、数字、下划线
- 建议使用 snake_case 命名
- 示例: `visual_clause`, `site_alpha`, `my_portfolio`

## 架构设计

### 数据库 Schema

#### entries 表 (通用化思考记录)
```sql
CREATE TABLE entries (
  id UUID PRIMARY KEY,
  site_key TEXT NOT NULL,        -- 站点标识
  content TEXT NOT NULL,
  tags TEXT[],
  source VARCHAR(255),
  created_at TIMESTAMPTZ,
  metadata JSONB
);

-- 联合索引优化查询
CREATE INDEX idx_entries_site_date ON entries (site_key, created_at DESC);
```

#### daily_metrics 表 (每日指标)
```sql
CREATE TABLE daily_metrics (
  id UUID PRIMARY KEY,
  site_key TEXT NOT NULL,        -- 站点标识
  date DATE NOT NULL,
  steps INTEGER,
  entry_count INTEGER,           -- 重命名字段
  current_music VARCHAR(255),
  UNIQUE(site_key, date)         -- 确保每个站点每天只有一条记录
);
```

### 数据隔离机制

1. **应用层**: 所有查询强制带上 `.eq('site_key', SITE_KEY)`
2. **数据库层**: RLS 策略基于 `app.current_site_key` 过滤
3. **校验层**: `site_key` 格式验证,防止 SQL 注入

### 代码示例

```typescript
// 自动注入 site_key 过滤
import { getEntries, createEntry } from '@/lib/supabase';

// 获取当前站点的所有 entries
const entries = await getEntries();

// 创建新 entry (自动注入 site_key)
await createEntry({
  content: '思考内容',
  tags: ['逻辑'],
  source: '笔记'
});
```

## 项目结构

```
visualclause/
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页
│   └── globals.css             # 全局样式
├── components/
│   ├── LatticeGrid.tsx         # 晶格网格组件
│   ├── AIChat.tsx              # AI 聊天窗口
│   └── SystemStatus.tsx        # 系统状态面板
├── lib/
│   ├── supabase.ts             # 多租户 Supabase 客户端
│   └── openrouter.ts           # OpenRouter API
├── supabase/
│   └── migration.sql           # 数据库迁移脚本
├── tailwind.config.ts          # Tailwind 配置
└── package.json
```

## 核心功能

### 1. 晶格流 (Lattice Feed)
- 展示当前站点的 Entry 卡片
- 不规则网格布局,金属质感设计
- 点击卡片查看详细信息

### 2. AI 数字分身
- 右下角悬浮聊天窗口
- 基于 Claude 3.5 Sonnet
- INTJ 性格设定,冷峻简洁的回答风格

### 3. 系统状态
- 物理功耗: 每日步数追踪
- 脑力熵减: 今日 Entry 产出数量
- 审美共振: 当前播放的音乐

## 设计系统

### 配色方案
- **Background**: `#0A0A0B` (深邃黑)
- **Surface**: `#161618` (金属钛灰)
- **Text Primary**: `#EDEDED` (高光银白)
- **Accent Blue**: `#4A90E2` (冰川蓝)
- **Accent Gold**: `#D4AF37` (冷流沙金)

### 交互细节
- Hover 态: 金属光泽位移效果
- 加载动画: 晶格自下而上生长
- 极细边框: 0.5px 模拟金属切割感

## 部署

### Vercel 多站点部署

每个站点都需要独立的 Vercel 项目:

1. 推送代码到 GitHub
2. 在 Vercel 创建项目,选择相同仓库
3. 配置环境变量 (仅修改 `NEXT_PUBLIC_SITE_KEY`)
4. 部署完成

**示例**: 同一套代码部署 5 个站点
- Site 1: `NEXT_PUBLIC_SITE_KEY=visual_clause` → https://visualclause.com
- Site 2: `NEXT_PUBLIC_SITE_KEY=site_alpha` → https://alpha.example.com
- Site 3: `NEXT_PUBLIC_SITE_KEY=site_beta` → https://beta.example.com
- Site 4: `NEXT_PUBLIC_SITE_KEY=site_gamma` → https://gamma.example.com
- Site 5: `NEXT_PUBLIC_SITE_KEY=site_delta` → https://delta.example.com

## 扩展性

系统设计支持无限扩展:
- 单个 Supabase 项目可支撑 20+ 站点
- 联合索引确保查询性能
- RLS 策略自动生效,无需手动维护

## MVP 后续规划

- [ ] 接入 fal.ai 实现自动配图生成
- [ ] 开发 Telegram Bot 快速录入
- [ ] 实现 Supabase Vector 检索 (RAG)
- [ ] 集成 Apple Health API
- [ ] 开发站点管理后台

## 许可证

MIT
