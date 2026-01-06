import { getBooks, getEntries } from '@/lib/supabase';
import SecondaryLayout from '@/components/shared/SecondaryLayout';
import ArchitecturalGrid from '@/components/shared/ArchitecturalGrid';
import Link from 'next/link';

export const revalidate = 60; // 每 60 秒重新生成

// 预设的书架主题分类
const PREDEFINED_CATEGORIES = [
  '自由',
  '爱',
  '死亡',
  '商业'
] as const;

export default async function ArchivePage() {
  const books = await getBooks();
  const latestClauses = await getEntries(2); // 获取最新 2 条 Clause

  return (
    <SecondaryLayout title="Archive" bgClass="bookish-bg">
      {/* 建筑网格背景 */}
      <ArchitecturalGrid className="fixed inset-0 z-0" />

      {/* 页面副标题 - One Concept, One Book */}
      <div className="text-center mb-16 relative z-10">
        <p className="text-tertiary text-xs tracking-[0.4em] opacity-60">
          ONE CONCEPT, ONE BOOK
        </p>
        <p className="text-tertiary/40 text-[10px] tracking-[0.3em] mt-2">
          THE CRYSTALLIZATION OF FRAGMENTS
        </p>
      </div>

      {/* 主内容区：书架分类（左）+ 书桌（右） */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* 左侧：书架分类（纵向单列排列，占2列） */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-8 max-w-2xl">
              {PREDEFINED_CATEGORIES.map((category, categoryIndex) => {
                // 查找该分类下的书籍
                const categoryBooks = books.filter(book =>
                  book.tags?.includes(category) || book.content === category
                );

                // 如果有书，显示第一本；如果没有书，显示占位符
                const primaryBook = categoryBooks[0];

                return (
                  <div
                    key={category}
                    className="relative"
                    style={{
                      // 黄金比例位置高亮
                      opacity: categoryIndex === 1 ? 1 : 0.85
                    }}
                  >
                    {/* 分类标题 */}
                    <div className="mb-6 pb-4 border-b border-white/10">
                      <h3 className="text-tertiary text-sm tracking-[0.3em] opacity-60 mb-2">
                        {String(categoryIndex + 1).padStart(2, '0')}
                      </h3>
                      <h3 className="text-secondary text-lg font-serif font-light tracking-wide">
                        {category}
                      </h3>
                    </div>

                    {/* 书籍内容或占位符 */}
                    {primaryBook ? (
                      <Link
                        href={`/archive/${primaryBook.id}`}
                        className="block group"
                      >
                        <div className="relative p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm hover:border-accent-gold/30 transition-all duration-500">
                          {/* 书名 */}
                          <h4 className="text-secondary text-xl font-serif font-light leading-relaxed tracking-wide group-hover:text-accent-gold/90 transition-colors duration-500 mb-4">
                            {primaryBook.content}
                          </h4>

                          {/* 状态标识 */}
                          <div className="flex items-center gap-4 text-xs font-mono tracking-[0.15em]">
                            <div className="flex items-center gap-2">
                              <span className="text-tertiary/50">[</span>
                              <span className="text-accent-gold/70">
                                {primaryBook.metadata?.word_count
                                  ? primaryBook.metadata.word_count.toLocaleString()
                                  : '---'}
                              </span>
                              <span className="text-tertiary/50">WORDS</span>
                              <span className="text-tertiary/50">]</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-tertiary/50">[</span>
                              <span className={
                                primaryBook.metadata?.status === 'completed'
                                  ? 'text-accent-gold/60'
                                  : 'text-accent-blue/60'
                              }>
                                {primaryBook.metadata?.status === 'completed' ? 'COMPLETED' : 'IN PROGRESS'}
                              </span>
                              <span className="text-tertiary/50">]</span>
                            </div>
                          </div>

                          {/* 悬停时的微光效果 */}
                          <div className="absolute inset-0 bg-accent-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm pointer-events-none" />
                        </div>
                      </Link>
                    ) : (
                      /* 占位符 - 草稿状态 */
                      <div className="relative p-6 border border-dashed border-white/10 rounded-sm opacity-20">
                        <h4 className="text-secondary text-xl font-serif font-light leading-relaxed tracking-wide mb-4">
                          {category}
                        </h4>

                        {/* 草稿标识 */}
                        <div className="flex items-center gap-2 text-xs font-mono tracking-[0.15em]">
                          <span className="text-tertiary/50">[</span>
                          <span className="text-accent-blue/40">
                            DRAFTING...
                          </span>
                          <span className="text-tertiary/50">]</span>
                        </div>
                      </div>
                    )}

                    {/* 更多书籍指示器 */}
                    {categoryBooks.length > 1 && (
                      <div className="mt-4 text-center">
                        <p className="text-tertiary/50 text-xs tracking-[0.2em]">
                          +{categoryBooks.length - 1} MORE
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 空状态提示 - 拉丁语 */}
            {books.length === 0 && (
              <div className="text-center py-32">
                <p className="text-tertiary text-sm tracking-[0.3em] opacity-40">
                  SCIENTIA IN STATU NASCENDI
                </p>
                <p className="text-tertiary/30 text-xs tracking-[0.2em] mt-4 opacity-30">
                  KNOWLEDGE IN THE STATE OF BEING BORN
                </p>
              </div>
            )}
          </div>

          {/* 右侧：书桌模块 - THE ACTIVE DESK（占1列） */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm p-8">
                {/* 桌面标题 */}
                <div className="mb-6 pb-4 border-b border-white/10">
                  <h3 className="text-accent-gold text-sm tracking-[0.3em] mb-2">
                    THE ACTIVE DESK
                  </h3>
                  <p className="text-tertiary/50 text-xs tracking-[0.15em]">
                    LATEST FRAGMENTS & THOUGHTS
                  </p>
                </div>

                {/* 最新 Clauses */}
                {latestClauses.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-tertiary/30 text-xs tracking-[0.2em]">
                      THE DESK IS CLEAR
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {latestClauses.map((clause) => (
                      <div
                        key={clause.id}
                        className="relative p-6 bg-white/5 border border-white/5 rounded-sm hover:border-accent-gold/20 transition-all duration-500"
                      >
                        {/* 日期戳 */}
                        <div className="mb-3">
                          <time className="text-tertiary/50 text-xs font-mono tracking-[0.2em]">
                            {new Date(clause.created_at).toLocaleDateString('zh-CN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }).toUpperCase()}
                          </time>
                        </div>

                        {/* Clause 内容 */}
                        <p className="text-secondary text-base font-serif font-light leading-relaxed tracking-wide whitespace-pre-wrap">
                          {clause.content}
                        </p>

                        {/* 标签 */}
                        {clause.tags && clause.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {clause.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-accent-gold/10 border border-accent-gold/30 rounded text-accent-gold/70 text-xs tracking-[0.15em]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* 金黄色高亮边框 */}
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-gold/60 via-accent-gold to-accent-gold/60" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部留白 */}
      <div className="h-32" />
    </SecondaryLayout>
  );
}
