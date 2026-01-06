import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ============================================================================
// VisualClause 多租户 Supabase 客户端
// ============================================================================
// 哲学：壬水流动（平滑的数据流）+ 辛金精密（绝对的数据隔离）
// ============================================================================

// ----------------------------------------------------------------------------
// 环境变量验证与初始化
// ----------------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY || '';

/**
 * 站点标识校验
 * 多租户系统的核心锚点，必须存在
 */
export function validateSiteKey(): string {
  if (!SITE_KEY) {
    throw new Error(
      '[CRITICAL] NEXT_PUBLIC_SITE_KEY is not defined. ' +
      'This is required for multi-tenant data isolation.'
    );
  }

  // site_key 格式校验：只允许字母、数字、下划线
  const isValidKey = /^[a-zA-Z0-9_]+$/.test(SITE_KEY);
  if (!isValidKey) {
    throw new Error(
      `[CRITICAL] Invalid SITE_KEY format: "${SITE_KEY}". ` +
      `Only alphanumeric characters and underscores are allowed.`
    );
  }

  return SITE_KEY;
}

// ----------------------------------------------------------------------------
// 基础客户端创建（指定 schema）
// ----------------------------------------------------------------------------

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'visual_clause' }
});

// ----------------------------------------------------------------------------
// 数据类型定义（重命名为通用化 Entry）
// ----------------------------------------------------------------------------

export interface Entry {
  id: string;
  site_key: string;
  content: string;
  tags: string[];
  source: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface DailyMetrics {
  id?: string;
  site_key: string;
  date: string;
  steps: number;
  entry_count: number;
  current_music: string;
  created_at?: string;
  updated_at?: string;
}

// ----------------------------------------------------------------------------
// 多租户数据操作封装（壬水流动：平滑、简洁）
// ----------------------------------------------------------------------------

/**
 * 获取当前站点的所有 Entries
 * 自动注入 site_key 过滤，确保数据隔离
 */
export async function getEntries(limit?: number): Promise<Entry[]> {
  const siteKey = validateSiteKey();

  let query = supabase
    .from('entries')
    .select('*')
    .eq('site_key', siteKey)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`[Supabase] Failed to fetch entries for site "${siteKey}":`, error);
    return [];
  }

  return data || [];
}

/**
 * 获取今日指标
 * 返回当前站点的今日数据
 */
export async function getTodayMetrics(): Promise<DailyMetrics | null> {
  const siteKey = validateSiteKey();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('metrics')
    .select('*')
    .eq('site_key', siteKey)
    .eq('date', today)
    .maybeSingle();

  if (error) {
    console.error(`[Supabase] Failed to fetch metrics for site "${siteKey}":`, error);
    return null;
  }

  return data;
}

/**
 * 创建新 Entry
 * 强制注入当前站点的 site_key，防止数据污染
 */
export async function createEntry(entry: Omit<Entry, 'id' | 'created_at' | 'site_key'>): Promise<Entry | null> {
  const siteKey = validateSiteKey();

  const { data, error } = await supabase
    .from('entries')
    .insert([{
      ...entry,
      site_key: siteKey // 强制注入，无法覆盖
    }])
    .select()
    .single();

  if (error) {
    console.error(`[Supabase] Failed to create entry for site "${siteKey}":`, error);
    return null;
  }

  return data;
}

/**
 * 更新或插入每日指标
 * 使用 PostgreSQL 的 ON CONFLICT 语法实现 upsert
 */
export async function upsertMetrics(metrics: Omit<DailyMetrics, 'id' | 'site_key' | 'created_at' | 'updated_at'>): Promise<DailyMetrics | null> {
  const siteKey = validateSiteKey();

  const { data, error } = await supabase
    .from('metrics')
    .upsert([{
      ...metrics,
      site_key: siteKey
    }], {
      onConflict: 'site_key,date'
    })
    .select()
    .single();

  if (error) {
    console.error(`[Supabase] Failed to upsert metrics for site "${siteKey}":`, error);
    return null;
  }

  return data;
}

/**
 * 删除 Entry
 * 只能删除当前站点的数据，额外的安全层
 */
export async function deleteEntry(entryId: string): Promise<boolean> {
  const siteKey = validateSiteKey();

  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', entryId)
    .eq('site_key', siteKey); // 双重验证：ID + site_key

  if (error) {
    console.error(`[Supabase] Failed to delete entry "${entryId}" for site "${siteKey}":`, error);
    return false;
  }

  return true;
}

// ----------------------------------------------------------------------------
// 向后兼容的类型别名与函数（保持现有组件兼容性）
// ----------------------------------------------------------------------------

export type Clause = Entry;
export const getClauses = getEntries;
export const createClause = createEntry;
export const deleteClause = deleteEntry;
