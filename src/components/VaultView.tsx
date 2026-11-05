import React, { useState } from 'react';
import { Bookmark, Search, Trash2, ArrowUpRight, Calendar, Download, Sparkles, FileText, Code2 } from 'lucide-react';
import { AppIdea } from '../types';
import { exportAsMarkdown, downloadAsJson } from '../utils/exportUtils';

interface VaultViewProps {
  savedIdeas: AppIdea[];
  onSelectIdea: (idea: AppIdea) => void;
  onDeleteIdea: (id: string) => void;
  onNewIdeaClick: () => void;
}

export const VaultView: React.FC<VaultViewProps> = ({
  savedIdeas,
  onSelectIdea,
  onDeleteIdea,
  onNewIdeaClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = savedIdeas.filter(
    (i) =>
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <span>Saved Architecture Vault</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Persisted app blueprints, cost analyses, and ready prompts
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vault..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">No blueprints saved yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Generate an app idea or architecture and tap the bookmark icon in the header to save it permanently to your local vault.
            </p>
          </div>
          <button
            onClick={onNewIdeaClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate New Blueprint</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((idea) => (
            <div
              key={idea.id}
              className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {idea.category}
                  </span>
                  <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                    {idea.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{idea.tagline}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[11px] font-bold text-emerald-400 block">
                    {idea.costOptimization.frugalMonthlyCostEstimate}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {idea.costOptimization.savingsPercentage}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(idea.timestamp).toLocaleDateString()}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => exportAsMarkdown(idea)}
                    className="p-1.5 rounded hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition-colors"
                    title="Export as Markdown (.md)"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => downloadAsJson(idea)}
                    className="p-1.5 rounded hover:bg-sky-500/10 text-slate-400 hover:text-sky-400 transition-colors"
                    title="Download JSON (.json)"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteIdea(idea.id)}
                    className="p-1.5 rounded hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove from vault"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onSelectIdea(idea)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/30 transition-colors"
                  >
                    <span>Open</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
