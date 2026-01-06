'use client';

import { useState, useEffect } from 'react';
import { Clause, getClauses } from '@/lib/supabase';
import { Calendar, Tag, Sidebar } from 'lucide-react';

interface LatticeCardProps {
  clause: Clause;
  index: number;
  onClick: () => void;
}

function LatticeCard({ clause, index, onClick }: LatticeCardProps) {
  return (
    <div
      className="metal-card p-6 cursor-pointer animate-lattice-grow"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-text-tertiary text-xs">
          <Calendar className="w-3 h-3" />
          {new Date(clause.created_at).toLocaleDateString('zh-CN')}
        </div>
        <div className="text-text-tertiary text-xs">{clause.source}</div>
      </div>

      <p className="text-text-primary text-sm leading-relaxed mb-4 font-light">
        {clause.content}
      </p>

      {clause.tags && clause.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="w-3 h-3 text-text-tertiary" />
          {clause.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs text-accent-blue bg-accent-glow border border-accent-blue/20 rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

interface ClauseDetailProps {
  clause: Clause | null;
  onClose: () => void;
}

function ClauseDetail({ clause, onClose }: ClauseDetailProps) {
  if (!clause) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border max-w-2xl w-full p-8 animate-lattice-grow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-text-tertiary text-sm mb-2">
              <Calendar className="w-4 h-4" />
              {new Date(clause.created_at).toLocaleString('zh-CN')}
            </div>
            <div className="text-text-tertiary text-sm">{clause.source}</div>
          </div>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary transition-colors"
          >
            <Sidebar className="w-6 h-6 rotate-90" />
          </button>
        </div>

        <p className="text-text-primary text-lg leading-relaxed mb-6 font-light">
          {clause.content}
        </p>

        {clause.tags && clause.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-text-secondary" />
            {clause.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1.5 text-sm text-accent-blue bg-accent-glow border border-accent-blue/30 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {clause.metadata && Object.keys(clause.metadata).length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-text-tertiary text-xs uppercase tracking-wider mb-3">
              元数据
            </h4>
            <pre className="text-text-secondary text-xs bg-background p-4 overflow-x-auto">
              {JSON.stringify(clause.metadata, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LatticeGrid() {
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClauses() {
      setLoading(true);
      const data = await getClauses();
      setClauses(data);
      setLoading(false);
    }
    loadClauses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-tertiary text-sm">晶格构建中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clauses.map((clause, index) => (
          <LatticeCard
            key={clause.id}
            clause={clause}
            index={index}
            onClick={() => setSelectedClause(clause)}
          />
        ))}
      </div>

      {selectedClause && (
        <ClauseDetail
          clause={selectedClause}
          onClose={() => setSelectedClause(null)}
        />
      )}
    </>
  );
}
