-- ============================================================================
-- 创建独立 Schema 架构（完全隔离）
-- ============================================================================
-- 目标：每个网站使用独立的 schema，表名保持简洁
-- 示例：visual_clause.entries, site_alpha.entries
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. 创建 schema（如果不存在）
-- ----------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS visual_clause;

-- ----------------------------------------------------------------------------
-- 2. 在 schema 中创建表
-- ----------------------------------------------------------------------------

-- 主表：entries
CREATE TABLE IF NOT EXISTS visual_clause.entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    site_key TEXT NOT NULL DEFAULT 'visual_clause',
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    source VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- 指标表：metrics
CREATE TABLE IF NOT EXISTS visual_clause.metrics (
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

-- ----------------------------------------------------------------------------
-- 3. 创建索引
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_entries_site_date
ON visual_clause.entries (site_key, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_entries_tags
ON visual_clause.entries USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_metrics_site_date
ON visual_clause.metrics (site_key, date DESC);

-- ----------------------------------------------------------------------------
-- 4. 启用 RLS
-- ----------------------------------------------------------------------------
ALTER TABLE visual_clause.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE visual_clause.metrics ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 5. 创建 RLS 策略
-- ----------------------------------------------------------------------------

-- entries 表策略
CREATE POLICY "allow_anon_select" ON visual_clause.entries
FOR SELECT
USING (
    site_key = current_setting('app.current_site_key', true)
);

CREATE POLICY "allow_anon_insert" ON visual_clause.entries
FOR INSERT
WITH CHECK (
    site_key = current_setting('app.current_site_key', true)
);

-- metrics 表策略
CREATE POLICY "allow_anon_select_metrics" ON visual_clause.metrics
FOR SELECT
USING (
    site_key = current_setting('app.current_site_key', true)
);

CREATE POLICY "allow_anon_upsert_metrics" ON visual_clause.metrics
FOR ALL
USING (
    site_key = current_setting('app.current_site_key', true)
)
WITH CHECK (
    site_key = current_setting('app.current_site_key', true)
);

-- ----------------------------------------------------------------------------
-- 6. 设置非空约束
-- ----------------------------------------------------------------------------
ALTER TABLE visual_clause.entries ALTER COLUMN site_key SET NOT NULL;
ALTER TABLE visual_clause.metrics ALTER COLUMN site_key SET NOT NULL;

-- ----------------------------------------------------------------------------
-- 7. 创建触发器函数
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION visual_clause.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 8. 创建触发器
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS update_metrics_updated_at ON visual_clause.metrics;
CREATE TRIGGER update_metrics_updated_at
    BEFORE UPDATE ON visual_clause.metrics
    FOR EACH ROW
    EXECUTE FUNCTION visual_clause.update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 9. 授予匿名访问权限
-- ----------------------------------------------------------------------------
GRANT USAGE ON SCHEMA visual_clause TO anon;
GRANT SELECT ON visual_clause.entries TO anon;
GRANT INSERT ON visual_clause.entries TO anon;
GRANT SELECT ON visual_clause.metrics TO anon;
GRANT INSERT ON visual_clause.metrics TO anon;
GRANT UPDATE ON visual_clause.metrics TO anon;

-- ----------------------------------------------------------------------------
-- 10. 验证结果
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    entries_count INT;
    metrics_count INT;
BEGIN
    SELECT COUNT(*) INTO entries_count FROM visual_clause.entries;
    SELECT COUNT(*) INTO metrics_count FROM visual_clause.metrics;

    RAISE NOTICE '=== Schema 创建完成 ===';
    RAISE NOTICE 'Schema: visual_clause';
    RAISE NOTICE 'Tables: entries, metrics';
    RAISE NOTICE 'entries 记录数: %', entries_count;
    RAISE NOTICE 'metrics 记录数: %', metrics_count;
    RAISE NOTICE 'RLS 已启用';
    RAISE NOTICE '权限已授予';
END $$;

-- 显示所有 schema
SELECT
    schemaname,
    tablename
FROM pg_tables
WHERE schemaname LIKE 'visual%'
ORDER BY schemaname, tablename;
