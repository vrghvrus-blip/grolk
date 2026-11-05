import React, { useState } from 'react';
import { Hammer, Sparkles, Key, Download, Bookmark, BookmarkCheck, FileText, Code2, ChevronDown, Sliders } from 'lucide-react';
import { AppIdea } from '../types';
import { exportAsMarkdown, downloadAsJson } from '../utils/exportUtils';

interface HeaderProps {
  currentIdea: AppIdea | null;
  onOpenSettings: () => void;
  onOpenExport: () => void;
  onRandomIdea: () => void;
  onToggleBookmark: () => void;
  isBookmarked: boolean;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentIdea,
  onOpenSettings,
  onOpenExport,
  onRandomIdea,
  onToggleBookmark,
  isBookmarked,
  hasApiKey,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportMarkdown = () => {
    if (!currentIdea) return;
    exportAsMarkdown(currentIdea);
    setShowExportMenu(false);
  };

  const handleDownloadJson = () => {
    if (!currentIdea) return;
    downloadAsJson(currentIdea);
    setShowExportMenu(false);
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Hammer className="w-5 h-5 text-indigo-400 transform -rotate-12" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                AppForge
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Frugal AI Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Mobile App Idea, Prompt &amp; Low-Cost Architecture Studio
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRandomIdea}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 transition-all hover:border-indigo-500/40"
            title="Surprise me with a disruptive idea"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Guess Idea</span>
          </button>

          {currentIdea && (
            <>
              <button
                onClick={onToggleBookmark}
                className={`p-2 rounded-lg text-xs font-medium border transition-all ${
                  isBookmarked
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white'
                }`}
                title={isBookmarked ? 'Bookmarked in Vault' : 'Save to Vault'}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4 text-amber-400" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>

              {/* Comprehensive Export Modal Opener */}
              <button
                onClick={onOpenExport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 transition-all border border-emerald-500/30"
                title="Open Export Studio to download Markdown or JSON with custom options"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Project</span>
              </button>

              {/* Quick direct buttons for desktop */}
              <div className="hidden xl:flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/60">
                <button
                  onClick={handleExportMarkdown}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-750 transition-all"
                  title="Quick export as Markdown (.md)"
                >
                  <FileText className="w-3 h-3 text-emerald-400" />
                  <span>.MD</span>
                </button>
                <button
                  onClick={handleDownloadJson}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-750 transition-all"
                  title="Quick download as JSON (.json)"
                >
                  <Code2 className="w-3 h-3 text-sky-400" />
                  <span>.JSON</span>
                </button>
              </div>
            </>
          )}

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 transition-all"
            title="Configure Gemini API Key"
          >
            <Key className={`w-3.5 h-3.5 ${hasApiKey ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">
              {hasApiKey ? 'Gemini 3.5' : 'Settings'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
