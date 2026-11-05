import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Copy, Check, Lightbulb, Users, Target, Shield, HelpCircle, Flame } from 'lucide-react';
import { AppIdea } from '../types';
import { INSPIRATION_HINTS } from '../data/ideaPresets';
import { ExportCard } from './ExportCard';

interface IdeaLabViewProps {
  currentIdea: AppIdea | null;
  onGenerate: (query: string, category: string, budgetFocus: 'frugal' | 'balanced' | 'scale') => void;
  onSurprise: () => void;
  onOpenAdvancedExport: () => void;
  isLoading: boolean;
}

export const IdeaLabView: React.FC<IdeaLabViewProps> = ({
  currentIdea,
  onGenerate,
  onSurprise,
  onOpenAdvancedExport,
  isLoading,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [budgetFocus, setBudgetFocus] = useState<'frugal' | 'balanced' | 'scale'>('frugal');
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

  const categories = [
    'General',
    'EdTech & Learning',
    'Fintech & Micro-SaaS',
    'Hyperlocal & Community',
    'Health & Longevity',
    'AI Tools & Voice',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !isLoading) {
      onSurprise();
    } else {
      onGenerate(query, selectedCategory, budgetFocus);
    }
  };

  const handleCopyPrompt = (promptText: string, index: number) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPromptIndex(index);
    setTimeout(() => setCopiedPromptIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Input / Brainstorming Box */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 lg:p-8 shadow-2xl space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Guess &amp; Prompt Architect</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
            What mobile app do you want to forge?
          </h2>
          <p className="text-sm text-slate-400">
            Type any raw phrase, problem, or target audience. AppForge reverse-engineers the idea, cuts 90%+ off cloud costs, and formulates master prompts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Local food sharing without Uber fees, or fitness tracker for seniors..."
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm shadow-inner"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all whitespace-nowrap disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <span>Generate Blueprint</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Quick Inspiration Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-slate-500 flex items-center gap-1 mr-1">
              <Lightbulb className="w-3 h-3 text-amber-400" />
              <span>Try inspiration:</span>
            </span>
            {INSPIRATION_HINTS.slice(0, 4).map((hint, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuery(hint);
                  onGenerate(hint, selectedCategory, budgetFocus);
                }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              >
                {hint}
              </button>
            ))}
          </div>

          {/* Controls: Category & Frugal Budget Mode */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
            {/* Category Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Focus Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Cost Optimization:</span>
              <div className="inline-flex rounded-lg p-0.5 bg-slate-950 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setBudgetFocus('frugal')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    budgetFocus === 'frugal'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Zero-to-Low Cost ($0-$5)
                </button>
                <button
                  type="button"
                  onClick={() => setBudgetFocus('balanced')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    budgetFocus === 'balanced'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Balanced MVP
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Generated App Concept Card */}
      {currentIdea && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 lg:p-8 shadow-xl space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {currentIdea.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {currentIdea.costOptimization.savingsPercentage}
                  </span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
                  {currentIdea.title}
                </h3>
                <p className="text-sm text-slate-300 font-medium">
                  {currentIdea.tagline}
                </p>
              </div>

              <div className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-right">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">
                  Estimated Run Cost
                </div>
                <div className="text-lg font-bold text-emerald-400">
                  {currentIdea.costOptimization.frugalMonthlyCostEstimate}
                </div>
              </div>
            </div>

            {/* Strategic Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
                  <Users className="w-3.5 h-3.5" />
                  <span>Target Audience</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentIdea.targetAudience}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400">
                  <Target className="w-3.5 h-3.5" />
                  <span>Problem Solved</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentIdea.problemStatement}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Competitive Moat</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentIdea.competitiveEdge}
                </p>
              </div>
            </div>

            {/* Core Features & User Flow */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* Features */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>5 Core MVP Features</span>
                </h4>
                <div className="space-y-2">
                  {currentIdea.coreFeatures.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/70"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Flow */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  <span>Primary User Journey</span>
                </h4>
                <div className="space-y-2">
                  {currentIdea.userFlowSteps.map((step, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/70"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {step.replace(/^\d+\.\s*/, '')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Master AI Prompts Studio */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Master AI Studio &amp; IDE Prompts</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Copy-paste directly into AI Studio, Cursor, Claude Code, or Grok to build this mobile app
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentIdea.masterPrompts.map((p, idx) => {
                const isCopied = copiedPromptIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-600 text-white">
                          {p.targetTool}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {p.badge}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyPrompt(p.fullPrompt, idx)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {p.fullPrompt}
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span className="font-semibold text-indigo-400">Pro-Tip:</span>
                      <span>{p.tips}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Export to Local Environment Card */}
          <ExportCard
            idea={currentIdea}
            onOpenAdvancedExport={onOpenAdvancedExport}
          />
        </div>
      )}
    </div>
  );
};
