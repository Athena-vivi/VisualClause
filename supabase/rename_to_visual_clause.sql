-- ============================================================================
-- 重命名表为 visual_clause（便于多站点管理）
-- ============================================================================
-- 目标：将通用表名改为带前缀的表名，便于在 Supabase 管理界面区分
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. 重命名主表：entries -> visual_clause_entries
-- ----------------------------------------------------------------------------
ALTER TABLE entries RENAME TO visual_clause_entries;

-- ----------------------------------------------------------------------------
-- 2. 重命名指标表：daily_metrics -> visual_clause_metrics
-- ----------------------------------------------------------------------------
ALTER TABLE daily_metrics RENAME TO visual_clause_metrics;

-- ----------------------------------------------------------------------------
-- 3. 更新索引名称（带上前缀）
-- ----------------------------------------------------------------------------
DROP INDEX IF EXISTS idx_entries_site_date;
DROP INDEX IF EXISTS idx_entries_tags;
DROP INDEX IF EXISTS idx_metrics_site_date;

-- 为 visual_clause_entries 创建索引
CREATE INDEX IF NOT EXISTS idx_visual_clause_entries_site_date
ON visual_clause_entries (site_key, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_visual_clause_entries_tags
ON visual_clause_entries USING GIN (tags);

-- 为 visual_clause_metrics 创建索引
CREATE INDEX IF NOT EXISTS idx_visual_clause_metrics_site_date
ON visual_clause_metrics (site_key, date DESC);

-- ----------------------------------------------------------------------------
-- 4. 更新 RLS 策略名称（带上前缀）
-- ----------------------------------------------------------------------------

-- 删除旧策略（自动删除，因为表已重命名）
-- 策略会自动迁移到新表，但名称保持不变

-- 为清晰起见，重新创建策略（带 visual_clause 前缀）
DROP POLICY IF EXISTS "Allow anon select by site_key" ON visual_clause_entries;
CREATE POLICY "vc_allow_anon_select" ON visual_clause_entries
FOR SELECT
USING (
    site_key = current_setting('app.current_site_key', true)
);

DROP POLICY IF EXISTS "Allow anon insert by site_key" ON visual_clause_entries;
CREATE POLICY "vc_allow_anon_insert" ON visual_clause_entries
FOR INSERT
WITH CHECK (
    site_key = current_setting('app.current_site_key', true)
);

DROP POLICY IF EXISTS "Allow anon select metrics by site_key" ON visual_clause_metrics;
CREATE POLICY "vc_allow_anon_select_metrics" ON visual_clause_metrics
FOR SELECT
USING (
    site_key = current_setting('app.current_site_key', true)
);

DROP POLICY IF EXISTS "Allow anon upsert metrics by site_key" ON visual_clause_metrics;
CREATE POLICY "vc_allow_anon_upsert_metrics" ON visual_clause_metrics
FOR ALL
USING (
    site_key = current_setting('app.current_site_key', true)
)
WITH CHECK (
    site_key = current_setting('app.current_site_key', true)
);

-- ----------------------------------------------------------------------------
-- 5. 验证重命名结果
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    entries_count INT;
    metrics_count INT;
BEGIN
    SELECT COUNT(*) INTO entries_count FROM visual_clause_entries;
    SELECT COUNT(*) INTO metrics_count FROM visual_clause_metrics;

    RAISE NOTICE '=== 表重命名完成 ===';
    RAISE NOTICE 'visual_clause_entries 表记录数: %', entries_count;
    RAISE NOTICE 'visual_clause_metrics 表记录数: %', metrics_count;
    RAISE NOTICE '=== 新表名 ===';
    RAISE NOTICE '1. visual_clause_entries (原 entries)';
    RAISE NOTICE '2. visual_clause_metrics (原 daily_metrics)';
    RAISE NOTICE '========================';
END $$;

-- ----------------------------------------------------------------------------
-- 6. 显示当前所有表（便于确认）
-- ----------------------------------------------------------------------------
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
AND tablename LIKE 'visual_clause%'
ORDER BY tablename;
