import React, { useState } from 'react';
import { Layers, Database, Globe, Lock, RefreshCw, Copy, Check, Terminal, FileText, Download } from 'lucide-react';
import { AppIdea } from '../types';
import { exportAsMarkdown, downloadAsJson } from '../utils/exportUtils';

interface ArchitectureViewProps {
  idea: AppIdea;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ idea }) => {
  const blueprint = idea.architecturalBlueprint;
  const [activeTab, setActiveTab] = useState<'schemas' | 'api' | 'security'>('schemas');
  const [copied, setCopied] = useState<boolean>(false);

  const copySpec = () => {
    const text = JSON.stringify(blueprint, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-500/20">
              <Layers className="w-3.5 h-3.5" />
              <span>System Blueprint</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Architectural Specification: {idea.title}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Pattern: <strong className="text-slate-200">{blueprint.pattern}</strong>
            </p>
          </div>

          {/* Quick Action Export Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => exportAsMarkdown(idea)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all shadow-sm"
              title="Export complete architectural documentation and all code snippets as Markdown"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export .MD</span>
            </button>

            <button
              onClick={() => downloadAsJson(idea)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 transition-all shadow-sm"
              title="Download architectural blueprint and code snippets as JSON file"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Download JSON</span>
            </button>

            <button
              onClick={copySpec}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Copy raw JSON schema to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
        </div>

        {/* 3-Tier Layer Topology Diagram Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Presentation */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Presentation Layer</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5">
              {blueprint.frontendLayers.map((layer, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-indigo-500">•</span>
                  <span>{layer}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Domain & Sync */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Offline-First Sync</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {blueprint.offlineSyncStrategy}
            </p>
          </div>

          {/* Backend & Data */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>Data &amp; Persistence</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5">
              {blueprint.backendLayers.map((layer, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-500">•</span>
                  <span>{layer}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs for Detailed Schemas / Endpoints / Security */}
      <div className="space-y-4">
        <div className="flex border-b border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab('schemas')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'schemas'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>SQLite &amp; Room Schemas ({blueprint.dataSchemas.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'api'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>API &amp; Sync Contracts ({blueprint.apiEndpoints.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'security'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security &amp; Auth Flow</span>
          </button>
        </div>

        {/* Schemas View */}
        {activeTab === 'schemas' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {blueprint.dataSchemas.map((schema, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    <span className="font-mono font-bold text-sm text-white">
                      {schema.tableName}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Room Entity
                  </span>
                </div>
                <p className="text-xs text-slate-400">{schema.description}</p>

                {/* Table Field List */}
                <div className="overflow-x-auto rounded-lg border border-slate-800/80 bg-slate-950">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3">Field</th>
                        <th className="py-2 px-3">Type</th>
                        <th className="py-2 px-3">Attributes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {schema.fields.map((f, fi) => (
                        <tr key={fi} className="hover:bg-slate-900/40">
                          <td className="py-2 px-3 font-semibold text-slate-200 flex items-center gap-1.5">
                            {f.name}
                            {f.isPrimary && (
                              <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                PK
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-indigo-300">{f.type}</td>
                          <td className="py-2 px-3 text-slate-400 text-[11px] font-sans">
                            {f.notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* API Contracts */}
        {activeTab === 'api' && (
          <div className="space-y-3">
            {blueprint.apiEndpoints.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
                100% Client-Side Engine! No external backend endpoints required.
              </div>
            ) : (
              blueprint.apiEndpoints.map((ep, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                        ep.method === 'GET' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                        ep.method === 'POST' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {ep.method}
                      </span>
                      <span className="font-mono text-sm text-slate-200">{ep.endpoint}</span>
                    </div>
                    <p className="text-xs text-slate-400">{ep.description}</p>
                  </div>

                  <div className="text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300 font-medium">
                    {ep.freeTierImpact}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Security Flow */}
        {activeTab === 'security' && (
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Security, Privacy &amp; Credential Hygiene</span>
            </h4>
            <div className="space-y-2">
              {blueprint.securityConsiderations.map((sec, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-emerald-400 text-sm font-bold">✓</span>
                  <span className="text-xs sm:text-sm text-slate-300">{sec}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
