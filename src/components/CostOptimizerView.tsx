import React, { useState } from 'react';
import { DollarSign, Zap, TrendingDown, ShieldCheck, ChevronRight, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { CostOptimizationSpec } from '../types';

interface CostOptimizerViewProps {
  costSpec: CostOptimizationSpec;
  appTitle: string;
}

export const CostOptimizerView: React.FC<CostOptimizerViewProps> = ({ costSpec, appTitle }) => {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(0);
  const [copiedTip, setCopiedTip] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTip(id);
    setTimeout(() => setCopiedTip(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Big Savings & Philosophy */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30 p-6 lg:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>कम खर्च में पूरा काम (Same Work, 90%+ Less Money)</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Frugal Architecture for <span className="text-emerald-400">{appTitle}</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Most startup founders overpay $400 - $1,200/month for AWS RDS, heavy Kubernetes clusters, Auth0 seats, and unoptimized OpenAI tokens before reaching their first 100 users.
              Here is how to achieve identical throughput, security, and user experience for under <span className="text-emerald-300 font-semibold">$5/month</span>.
            </p>
          </div>

          {/* Savings Metric Card */}
          <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 lg:p-5 shadow-inner">
            <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400">
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Estimated Monthly Cost</div>
              <div className="text-2xl font-black text-emerald-400">
                {costSpec.frugalMonthlyCostEstimate}
              </div>
              <div className="text-xs text-slate-500 line-through">
                vs {costSpec.enterpriseMonthlyCostEstimate}
              </div>
              <div className="mt-1 text-[11px] font-semibold text-emerald-300">
                {costSpec.savingsPercentage} (Saves {costSpec.totalWorkloadHoursSaved})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layer-by-Layer Interactive Comparison */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-400" />
          <span>Frugal vs. Enterprise Stack Comparison Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {costSpec.frugalStackRecommendation.map((item, index) => {
            const isSelected = selectedLayerIndex === index;
            return (
              <div
                key={index}
                onClick={() => setSelectedLayerIndex(index)}
                className={`cursor-pointer rounded-xl p-5 border transition-all duration-200 ${
                  isSelected
                    ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {item.layer}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.savingsRatio} Saved
                  </span>
                </div>

                {/* Frugal Choice */}
                <div className="space-y-1 mb-3">
                  <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Frugal Stack ({item.frugalCostEstimate})</span>
                  </div>
                  <div className="text-sm font-medium text-slate-200">
                    {item.frugalSolution}
                  </div>
                </div>

                {/* High Cost Comparison */}
                <div className="space-y-1 pt-2.5 border-t border-slate-800">
                  <div className="text-xs text-rose-400 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Avoid Expensive Alternative:</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {item.highCostSolution}
                  </div>
                </div>

                {/* Why it works note */}
                <div className="mt-3 pt-2 text-[11px] text-slate-300 bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/80">
                  <span className="font-semibold text-indigo-300">How it does same work: </span>
                  {item.howItDoesSameWork}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Layer Deep Dive */}
      {costSpec.frugalStackRecommendation[selectedLayerIndex] && (
        <div className="bg-slate-900/90 rounded-xl p-5 border border-indigo-500/30 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Architecture Deep Dive: {costSpec.frugalStackRecommendation[selectedLayerIndex].layer}</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            By choosing <strong className="text-white">{costSpec.frugalStackRecommendation[selectedLayerIndex].frugalSolution}</strong> instead of {costSpec.frugalStackRecommendation[selectedLayerIndex].highCostSolution}, you eliminate recurring fixed infrastructure invoices while retaining full security, low latency, and zero vendor lock-in.
          </p>
          <div className="flex items-center justify-between text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400">Monthly Run-rate Difference:</span>
            <span className="font-mono font-bold text-emerald-400">
              Save {costSpec.frugalStackRecommendation[selectedLayerIndex].highCostEstimate} &rarr; Spend {costSpec.frugalStackRecommendation[selectedLayerIndex].frugalCostEstimate}
            </span>
          </div>
        </div>
      )}

      {/* Actionable Hacks (कम खर्च Hacks) */}
      <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <span>Actionable Frugal Engineering Hacks</span>
          </h4>
          <span className="text-xs text-slate-500">Real production tactics</span>
        </div>

        <div className="space-y-2.5">
          {costSpec.actionableHacks.map((hack, index) => {
            const isCopied = copiedTip === `hack-${index}`;
            return (
              <div
                key={index}
                className="flex items-start justify-between gap-3 p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center border border-indigo-500/20">
                    {index + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {hack}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(hack, `hack-${index}`)}
                  className="flex-shrink-0 p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  title="Copy tip"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
