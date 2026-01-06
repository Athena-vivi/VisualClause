-- ============================================================================
-- 直接创建 visual_clause 表（全新部署）
-- ============================================================================
-- 适用于：Supabase 项目中还没有任何表的情况
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. 创建主表：visual_clause_entries
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS visual_clause_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    site_key TEXT NOT NULL DEFAULT 'visual_clause',
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    source VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- ----------------------------------------------------------------------------
-- 2. 创建指标表：visual_clause_metrics
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS visual_clause_metrics (
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
CREATE INDEX IF NOT EXISTS idx_visual_clause_entries_site_date
ON visual_clause_entries (site_key, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_visual_clause_entries_tags
ON visual_clause_entries USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_visual_clause_metrics_site_date
ON visual_clause_metrics (site_key, date DESC);

-- ----------------------------------------------------------------------------
-- 4. 启用 RLS
-- ----------------------------------------------------------------------------
ALTER TABLE visual_clause_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE visual_clause_metrics ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 5. 创建 RLS 策略
-- ----------------------------------------------------------------------------

-- visual_clause_entries 策略
CREATE POLICY "vc_allow_anon_select" ON visual_clause_entries
FOR SELECT
USING (
    site_key = current_setting('app.current_site_key', true)
);

CREATE POLICY "vc_allow_anon_insert" ON visual_clause_entries
FOR INSERT
WITH CHECK (
    site_key = current_setting('app.current_site_key', true)
);

-- visual_clause_metrics 策略
CREATE POLICY "vc_allow_anon_select_metrics" ON visual_clause_metrics
FOR SELECT
USING (
    site_key = current_setting('app.current_site_key', true)
);

CREATE POLICY "vc_allow_anon_upsert_metrics" ON visual_clause_metrics
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
ALTER TABLE visual_clause_entries ALTER COLUMN site_key SET NOT NULL;
ALTER TABLE visual_clause_metrics ALTER COLUMN site_key SET NOT NULL;

-- ----------------------------------------------------------------------------
-- 7. 创建触发器函数
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 8. 创建触发器
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS update_visual_clause_metrics_updated_at ON visual_clause_metrics;
CREATE TRIGGER update_visual_clause_metrics_updated_at
    BEFORE UPDATE ON visual_clause_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 9. 创建辅助函数
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_site_key(site TEXT)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_site_key', site, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_current_site_key()
RETURNS TEXT AS $$
BEGIN
    RETURN current_setting('app.current_site_key', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 10. 验证并显示结果
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    entries_count INT;
    metrics_count INT;
BEGIN
    SELECT COUNT(*) INTO entries_count FROM visual_clause_entries;
    SELECT COUNT(*) INTO metrics_count FROM visual_clause_metrics;

    RAISE NOTICE '=== 创建完成 ===';
    RAISE NOTICE 'visual_clause_entries 表记录数: %', entries_count;
    RAISE NOTICE 'visual_clause_metrics 表记录数: %', metrics_count;
    RAISE NOTICE 'RLS 已启用';
    RAISE NOTICE '索引已创建';
    RAISE NOTICE '多租户系统就绪';
END $$;

-- 显示所有 visual_clause 相关的表
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
AND tablename LIKE 'visual_clause%'
ORDER BY tablename;
