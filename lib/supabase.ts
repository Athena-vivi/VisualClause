import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Clause 数据类型定义
export interface Clause {
  id: string;
  content: string;
  tags: string[];
  source: string;
  created_at: string;
  metadata?: Record<string, any>;
}

// 每日指标数据类型
export interface DailyMetrics {
  date: string;
  steps: number;
  clause_count: number;
  current_music: string;
}

// 获取所有 Clauses
export async function getClauses(): Promise<Clause[]> {
  const { data, error } = await supabase
    .from('clauses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching clauses:', error);
    return [];
  }

  return data || [];
}

// 获取今日指标
export async function getTodayMetrics(): Promise<DailyMetrics | null> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('date', today)
    .single();

  if (error) {
    console.error('Error fetching metrics:', error);
    return null;
  }

  return data;
}

// 创建新 Clause
export async function createClause(clause: Omit<Clause, 'id' | 'created_at'>): Promise<Clause | null> {
  const { data, error } = await supabase
    .from('clauses')
    .insert([{ ...clause }])
    .select()
    .single();

  if (error) {
    console.error('Error creating clause:', error);
    return null;
  }

  return data;
}
