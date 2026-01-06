-- ============================================================================
-- VisualClause 多租户系统数据库迁移脚本
-- ============================================================================
-- 目标：从单表逻辑升级为基于 site_key 的多租户隔离架构
-- 哲学：壬水流动·辛金精密·数据绝对隔离
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. 统一表结构：将 clauses 重命名为 entries（通用化）
-- ----------------------------------------------------------------------------
DO $$
BEGIN
    -- 检查 clauses 表是否存在，如果存在则重命名
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'clauses') THEN
        ALTER TABLE clauses RENAME TO entries;

        -- 如果 entries 表还没有 site_key 列，添加它
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'entries' AND column_name = 'site_key'
        ) THEN
            ALTER TABLE entries ADD COLUMN site_key TEXT DEFAULT 'visual_clause';
        END IF;

        -- 迁移现有数据：将所有现有记录标记为 visual_clause
        UPDATE entries SET site_key = 'visual_clause' WHERE site_key IS NULL;
    ELSE
        -- 如果 clauses 表不存在，创建 entries 表
        CREATE TABLE IF NOT EXISTS entries (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            site_key TEXT NOT NULL DEFAULT 'visual_clause',
            content TEXT NOT NULL,
            tags TEXT[] DEFAULT '{}',
            source VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            metadata JSONB DEFAULT '{}'
        );
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 2. 更新 daily_metrics 表，增加 site_key 支持
-- ----------------------------------------------------------------------------
DO $$
BEGIN
    -- 如果 daily_metrics 表存在但没有 site_key 列
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'daily_metrics'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'daily_metrics' AND column_name = 'site_key'
    ) THEN
        ALTER TABLE daily_metrics ADD COLUMN site_key TEXT DEFAULT 'visual_clause';
        UPDATE daily_metrics SET site_key = 'visual_clause' WHERE site_key IS NULL;
    ELSE
        -- 如果 daily_metrics 表不存在，创建它
        CREATE TABLE IF NOT EXISTS daily_metrics (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            site_key TEXT NOT NULL DEFAULT 'visual_clause',
            date DATE NOT NULL,
            steps INTEGER DEFAULT 0,
            entry_count INTEGER DEFAULT 0,
            current_music VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(site_key, date)
        );
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 3. 创建联合索引：优化多租户查询性能（辛金的精密性）
-- ----------------------------------------------------------------------------
-- entries 表索引：按站点 + 时间降序
CREATE INDEX IF NOT EXISTS idx_entries_site_date
ON entries (site_key, created_at DESC);

-- entries 表索引：按标签（未来支持标签筛选）
CREATE INDEX IF NOT EXISTS idx_entries_tags
ON entries USING GIN (tags);

-- daily_metrics 表索引：按站点 + 日期唯一查询
CREATE INDEX IF NOT EXISTS idx_metrics_site_date
ON daily_metrics (site_key, date DESC);

-- ----------------------------------------------------------------------------
-- 4. 启用 RLS（Row Level Security）：确保数据绝对隔离
-- ----------------------------------------------------------------------------
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 5. 创建 RLS 策略：基于 app.current_site_key 变量的动态过滤
-- ----------------------------------------------------------------------------

-- entries 表策略：允许匿名用户读取当前站点的数据
DROP POLICY IF EXISTS "Allow anon select by site_key" ON entries;
CREATE POLICY "Allow anon select by site_key" ON entries
FOR SELECT
USING (
    site_key = current_setting('app.current_site_key', true)
);

-- entries 表策略：允许匿名用户插入当前站点的数据（带安全检查）
DROP POLICY IF EXISTS "Allow anon insert by site_key" ON entries;
CREATE POLICY "Allow anon insert by site_key" ON entries
FOR INSERT
WITH CHECK (
    site_key = current_setting('app.current_site_key', true)
);

-- daily_metrics 表策略：读取
DROP POLICY IF EXISTS "Allow anon select metrics by site_key" ON daily_metrics;
CREATE POLICY "Allow anon select metrics by site_key" ON daily_metrics
FOR SELECT
USING (
    site_key = current_setting('app.current_site_key', true)
);

-- daily_metrics 表策略：插入/更新
DROP POLICY IF EXISTS "Allow anon upsert metrics by site_key" ON daily_metrics;
CREATE POLICY "Allow anon upsert metrics by site_key" ON daily_metrics
FOR ALL
USING (
    site_key = current_setting('app.current_site_key', true)
)
WITH CHECK (
    site_key = current_setting('app.current_site_key', true)
);

-- ----------------------------------------------------------------------------
-- 6. 创建辅助函数：简化 site_key 设置
-- ----------------------------------------------------------------------------

-- 函数：设置当前站点的 site_key（用于会话级别）
CREATE OR REPLACE FUNCTION set_site_key(site TEXT)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_site_key', site, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 函数：获取当前站点的 site_key
CREATE OR REPLACE FUNCTION get_current_site_key()
RETURNS TEXT AS $$
BEGIN
    RETURN current_setting('app.current_site_key', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 7. 数据完整性约束：防止 site_key 为空
-- ----------------------------------------------------------------------------
ALTER TABLE entries ALTER COLUMN site_key SET NOT NULL;
ALTER TABLE daily_metrics ALTER COLUMN site_key SET NOT NULL;

-- ----------------------------------------------------------------------------
-- 8. 创建触发器：自动更新 updated_at 字段
-- ----------------------------------------------------------------------------
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_daily_metrics_updated_at
    BEFORE UPDATE ON daily_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 9. 验证迁移：输出关键信息
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    entries_count INT;
    metrics_count INT;
BEGIN
    SELECT COUNT(*) INTO entries_count FROM entries;
    SELECT COUNT(*) INTO metrics_count FROM daily_metrics;

    RAISE NOTICE '=== 迁移完成 ===';
    RAISE NOTICE 'entries 表记录数: %', entries_count;
    RAISE NOTICE 'daily_metrics 表记录数: %', metrics_count;
    RAISE NOTICE 'RLS 已启用';
    RAISE NOTICE '索引已创建';
    RAISE NOTICE '多租户系统就绪';
END $$;
