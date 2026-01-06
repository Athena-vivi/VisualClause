# VisualClause.com - 数字分身

> "Visual" 代表感性审美与视觉呈现,"Clause" 代表理性逻辑与思想契约。

## 项目概述

VisualClause 是一个个人数字分身网站,融合了以下核心理念:
- **数字分身 (Digital Twin)**: 通过 AI 展现个人思维模式
- **人生博物馆 (Personal Museum)**: 记录碎片化思考与成长轨迹
- **逻辑名片 (Logical Card)**: 极简、高信噪比的个人展示

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS + 自定义辛金质感配色
- **后端**: Supabase (PostgreSQL)
- **AI**: OpenRouter API (Claude 3.5 Sonnet)
- **部署**: Vercel

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制 `.env.local.example` 为 `.env.local` 并填入配置:

```bash
cp .env.local.example .env.local
```

### 3. Supabase 数据库设置

在 Supabase SQL Editor 中执行以下 SQL:

```sql
-- Clauses 表 (思考碎片)
CREATE TABLE clauses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  source VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Daily Metrics 表 (每日指标)
CREATE TABLE daily_metrics (
  date DATE PRIMARY KEY,
  steps INTEGER DEFAULT 0,
  clause_count INTEGER DEFAULT 0,
  current_music VARCHAR(255)
);

-- 启用 RLS (Row Level Security)
ALTER TABLE clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;

-- MVP 阶段允许公开读取
CREATE POLICY "Allow public read access" ON clauses FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON daily_metrics FOR SELECT USING (true);
```

### 4. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
visualclause/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   └── globals.css         # 全局样式
├── components/
│   ├── LatticeGrid.tsx     # 晶格网格组件
│   ├── AIChat.tsx          # AI 聊天窗口
│   └── SystemStatus.tsx    # 系统状态面板
├── lib/
│   ├── supabase.ts         # Supabase 客户端
│   └── openrouter.ts       # OpenRouter API
├── tailwind.config.ts      # Tailwind 配置
└── package.json
```

## 核心功能

### 1. 晶格流 (Lattice Feed)
- 展示来自 Supabase 的 Clause 卡片
- 不规则网格布局,金属质感设计
- 点击卡片查看详细信息

### 2. AI 数字分身
- 右下角悬浮聊天窗口
- 基于 Claude 3.5 Sonnet
- INTJ 性格设定,冷峻简洁的回答风格

### 3. 系统状态
- 物理功耗: 每日步数追踪
- 脑力熵减: 今日 Clause 产出数量
- 审美共振: 当前播放的俄罗斯音乐

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

### Vercel 部署

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署完成

## MVP 后续规划

- [ ] 接入 fal.ai 实现自动配图生成
- [ ] 开发 Telegram Bot 快速录入
- [ ] 实现 Supabase Vector 检索
- [ ] 集成 Apple Health API

## 许可证

MIT
# VisualClause-
