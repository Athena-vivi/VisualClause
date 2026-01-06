import { getEntryById, getClausesByBookId } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import SecondaryLayout from '@/components/shared/SecondaryLayout';
import Link from 'next/link';

export const revalidate = 60;

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;
  const book = await getEntryById(id);

  if (!book) {
    notFound();
  }

  // 获取这本书的所有 clauses（通过 metadata.book_id 或 tags 关联）
  const bookClauses = await getClausesByBookId(id);

  return (
    <SecondaryLayout title="Archive" bgClass="bookish-bg">
      {/* 返回链接 */}
      <div className="max-w-3xl mx-auto mb-12">
        <Link
          href="/archive"
          className="inline-flex items-center gap-3 text-tertiary/60 text-xs tracking-[0.2em] hover:text-accent-gold/80 transition-colors duration-300"
        >
          <span>←</span>
          <span>BACK TO THE SHELVES</span>
        </Link>
      </div>

      {/* 书籍标题区 */}
      <div className="max-w-3xl mx-auto mb-20">
        <div className="text-tertiary/30 text-xs tracking-[0.2em] mb-4">
          BOOK
        </div>
        <h1 className="text-secondary text-3xl md:text-4xl lg:text-5xl font-serif font-light leading-relaxed tracking-wide mb-8">
          {book.content}
        </h1>

        {/* 书籍元数据 */}
        <div className="flex items-center gap-8 text-xs font-mono tracking-[0.15em] pt-6 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-tertiary/50">[</span>
            <span className="text-accent-gold/70">
              {book.metadata?.word_count?.toLocaleString() || '---'}
            </span>
            <span className="text-tertiary/50">WORDS</span>
            <span className="text-tertiary/50">]</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-tertiary/50">[</span>
            <span className={
              book.metadata?.status === 'completed'
                ? 'text-accent-gold/60'
                : 'text-accent-blue/60'
            }>
              {book.metadata?.status === 'completed' ? 'COMPLETED' : 'IN PROGRESS'}
            </span>
            <span className="text-tertiary/50">]</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-tertiary/50">[</span>
            <span className="text-tertiary/70">
              {bookClauses.length} CLAUSES
            </span>
            <span className="text-tertiary/50">]</span>
          </div>
        </div>
      </div>

      {/* Clause 顺次排列区 - 随笔集 */}
      <div className="max-w-3xl mx-auto">
        {bookClauses.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-tertiary text-sm tracking-[0.3em]">
              NO CLAUSES YET
            </p>
            <p className="text-tertiary/30 text-xs tracking-[0.2em] mt-4">
              THE FIRST FRAGMENT AWAITS
            </p>
          </div>
        ) : (
          <div className="space-y-20">
            {bookClauses.map((clause, index) => (
              <div
                key={clause.id}
                className="relative pl-8 border-l border-white/10 hover:border-accent-gold/30 transition-all duration-500"
              >
                {/* 日期戳 */}
                <div className="mb-4">
                  <time className="text-tertiary/50 text-xs font-mono tracking-[0.2em]">
                    {new Date(clause.created_at).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }).toUpperCase()}
                  </time>
                </div>

                {/* Clause 内容 */}
                <div className="prose prose-invert max-w-none">
                  <p className="text-secondary text-lg md:text-xl font-serif font-light leading-relaxed tracking-wide whitespace-pre-wrap">
                    {clause.content}
                  </p>
                </div>

                {/* 序号标记 */}
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-accent-gold/20 group-hover:bg-accent-gold/40 transition-colors duration-500" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部留白 */}
      <div className="h-32" />
    </SecondaryLayout>
  );
}
