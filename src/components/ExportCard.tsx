import React, { useState } from 'react';
import { Download, FileText, Code2, Check, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { AppIdea } from '../types';
import { exportAsMarkdown, downloadAsJson } from '../utils/exportUtils';

interface ExportCardProps {
  idea: AppIdea;
  onOpenAdvancedExport: () => void;
}

export const ExportCard: React.FC<ExportCardProps> = ({ idea, onOpenAdvancedExport }) => {
  const [copiedFormat, setCopiedFormat] = useState<'md' | 'json' | null>(null);

  const handleCopyMd = () => {
    import('../utils/exportUtils').then(({ generateMarkdownExport }) => {
      const text = generateMarkdownExport(idea);
      navigator.clipboard.writeText(text);
      setCopiedFormat('md');
      setTimeout(() => setCopiedFormat(null), 2000);
    });
  };

  const handleCopyJson = () => {
    import('../utils/exportUtils').then(({ generateJsonExport }) => {
      const text = generateJsonExport(idea);
      navigator.clipboard.writeText(text);
      setCopiedFormat('json');
      setTimeout(() => setCopiedFormat(null), 2000);
    });
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-750 p-6 lg:p-7 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider border border-emerald-500/20">
            <Download className="w-3.5 h-3.5" />
            <span>Local Environment Export</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Save {idea.title} to Your Computer
          </h3>
          <p className="text-xs text-slate-400">
            Export the complete architectural blueprint, frugal cost matrix, and production Kotlin code snippets.
          </p>
        </div>

        <button
          onClick={onOpenAdvancedExport}
          className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Advanced Custom Export</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </button>
      </div>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Markdown Document Option */}
        <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-5 space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Markdown Document</h4>
                  <span className="text-[11px] font-mono text-emerald-400">.md file</span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Documentation + Code
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Contains the complete executive summary, frugal cost matrix, SQLite data models, API endpoints, and all Kotlin Jetpack Compose &amp; Room snippets ready to view in Obsidian, GitHub, or VS Code.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => exportAsMarkdown(idea)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .MD</span>
            </button>
            <button
              onClick={handleCopyMd}
              className="p-2 rounded-lg text-xs font-medium bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
              title="Copy Markdown text"
            >
              {copiedFormat === 'md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* JSON Object Option */}
        <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-5 space-y-4 hover:border-sky-500/40 transition-all flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">JSON Project Data</h4>
                  <span className="text-[11px] font-mono text-sky-400">.json file</span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Machine-Readable
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clean structured JSON payload containing the entire schema version, metadata, full architecture specifications, and code snippets for automated scripting, CI/CD, or AI agent consumption.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => downloadAsJson(idea)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .JSON</span>
            </button>
            <button
              onClick={handleCopyJson}
              className="p-2 rounded-lg text-xs font-medium bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
              title="Copy JSON text"
            >
              {copiedFormat === 'json' ? <Check className="w-3.5 h-3.5 text-sky-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
