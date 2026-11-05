import React, { useState } from 'react';
import { Code2, Copy, Check, Download, FileCode, FileText } from 'lucide-react';
import { AppIdea, CodeSnippet } from '../types';
import { downloadSnippet, exportAsMarkdown, downloadAsJson } from '../utils/exportUtils';

interface CodeSnippetsViewProps {
  idea: AppIdea;
}

export const CodeSnippetsView: React.FC<CodeSnippetsViewProps> = ({ idea }) => {
  const snippets = idea.codeSnippets;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(snippets.map(s => s.category)))];

  const filteredSnippets = selectedCategory === 'All'
    ? snippets
    : snippets.filter(s => s.category === selectedCategory);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadAllSnippetsAsMarkdown = () => {
    exportAsMarkdown(idea);
  };

  const handleDownloadAllAsJson = () => {
    downloadAsJson(idea);
  };

  return (
    <div className="space-y-6">
      {/* Category Pills & Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <span>Production Kotlin Codebase Snippets</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ready-to-use Clean Architecture boilerplate for {idea.title}
          </p>
        </div>

        {/* Global Export Options for Codebase */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadAllSnippetsAsMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all shadow-sm"
            title="Download full architectural documentation with all code snippets in Markdown format"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Code &amp; Blueprint (.MD)</span>
          </button>

          <button
            onClick={handleDownloadAllAsJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 transition-all shadow-sm"
            title="Download complete project JSON file"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Download JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800/80">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Snippet Cards */}
      <div className="space-y-6">
        {filteredSnippets.map(snippet => {
          const isCopied = copiedId === snippet.id;
          return (
            <div
              key={snippet.id}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl"
            >
              {/* Card Header */}
              <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <FileCode className="w-4 h-4 text-indigo-400" />
                  <span className="font-mono text-sm font-semibold text-slate-200">
                    {snippet.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {snippet.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadSnippet(snippet)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
                    title={`Download ${snippet.title} directly`}
                  >
                    <Download className="w-3.5 h-3.5 text-sky-400" />
                    <span>Download File</span>
                  </button>
                  <button
                    onClick={() => handleCopy(snippet.code, snippet.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="px-5 py-2.5 bg-slate-900/40 border-b border-slate-800/40 text-xs text-slate-400">
                {snippet.description}
              </div>

              {/* Code Display Area */}
              <div className="p-4 bg-slate-950/90 overflow-x-auto">
                <pre className="font-mono text-xs text-slate-200 leading-relaxed tab-size-4">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
