import React, { useState, useMemo } from 'react';
import { X, Download, Copy, Check, FileText, Code2, Sliders, CheckSquare, Square, Eye, Sparkles } from 'lucide-react';
import { AppIdea } from '../types';
import { generateMarkdownExport, generateJsonExport, exportAsMarkdown, downloadAsJson, ExportOptions } from '../utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: AppIdea | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, idea }) => {
  const [format, setFormat] = useState<'markdown' | 'json'>('markdown');
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    includeOverview: true,
    includeCostMatrix: true,
    includeArchitecture: true,
    includeSchemas: true,
    includeWireframes: true,
    includeSnippets: true,
    includePrompts: true,
  });

  const toggleOption = (key: keyof ExportOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const previewContent = useMemo(() => {
    if (!idea) return '';
    return format === 'markdown'
      ? generateMarkdownExport(idea, options)
      : generateJsonExport(idea, options);
  }, [idea, format, options]);

  const stats = useMemo(() => {
    const lines = previewContent.split('\n').length;
    const chars = previewContent.length;
    const kb = (chars / 1024).toFixed(1);
    return { lines, chars, kb };
  }, [previewContent]);

  if (!isOpen || !idea) return null;

  const handleDownload = () => {
    if (format === 'markdown') {
      exportAsMarkdown(idea, options);
    } else {
      downloadAsJson(idea, options);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(previewContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filename = `${idea.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-blueprint.${format === 'markdown' ? 'md' : 'json'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-750 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Export Project Data
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {idea.title}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Save the architectural blueprint, frugal cost matrix, and codebase snippets to your local environment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Format Selector Tabs */}
          <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setFormat('markdown')}
              className={`flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all ${
                format === 'markdown'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Markdown Document (.md)</span>
            </button>

            <button
              onClick={() => setFormat('json')}
              className={`flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all ${
                format === 'json'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>JSON Object (.json)</span>
            </button>
          </div>

          {/* Section Inclusion Toggles */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>Customize Included Project Sections</span>
              </span>
              <span>All selected by default</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { key: 'includeSnippets' as const, label: 'Codebase Snippets', count: `${idea.codeSnippets.length} files` },
                { key: 'includeWireframes' as const, label: 'UI Wireframes & Flows', count: `${idea.wireframeBlueprint?.screens.length || 3} screens` },
                { key: 'includeCostMatrix' as const, label: 'Frugal Cost Matrix', count: 'कम खर्च' },
                { key: 'includeSchemas' as const, label: 'SQLite & Room Schemas', count: `${idea.architecturalBlueprint.dataSchemas.length} tables` },
                { key: 'includeArchitecture' as const, label: 'Architecture & Sync', count: '3-tier' },
                { key: 'includeOverview' as const, label: 'Overview & Features', count: '5 features' },
                { key: 'includePrompts' as const, label: 'Master AI Prompts', count: `${idea.masterPrompts.length} prompts` },
              ].map((item) => {
                const checked = !!options[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleOption(item.key)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all ${
                      checked
                        ? 'bg-indigo-600/10 border-indigo-500/40 text-slate-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {checked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                      )}
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview Header & Stats */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live File Preview: </span>
                <span className="font-mono text-indigo-300">{filename}</span>
              </span>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span>{stats.lines} lines</span>
                <span>•</span>
                <span>~{stats.kb} KB</span>
              </div>
            </div>

            {/* Preview Box */}
            <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 max-h-64 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
              {previewContent}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ready for your local IDE, Cursor, Claude Code, or Git repository.</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Content</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all ${
                format === 'markdown'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25'
                  : 'bg-sky-600 hover:bg-sky-500 shadow-sky-600/25'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Download {format === 'markdown' ? '.MD File' : '.JSON File'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
