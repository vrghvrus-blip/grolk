import React, { useState } from 'react';
import { X, Key, Check, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';
import { GeminiService } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onKeySaved,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState<string>(GeminiService.getActiveKey());
  const [isSaved, setIsSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSave = () => {
    GeminiService.setCustomKey(apiKeyInput);
    setIsSaved(true);
    onKeySaved();
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleTest = async () => {
    if (!apiKeyInput.trim()) return;
    setIsTesting(true);
    setTestStatus('idle');
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKeyInput.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Hello Gemini, confirm readiness in 3 words.' }] }],
          }),
        }
      );
      if (response.ok) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }
    } catch (e) {
      setTestStatus('error');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Key className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Engine Configuration</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <p>
            AppForge includes a built-in offline Frugal Architect engine with 100+ proven architecture models and cost formulas. For bespoke live AI brainstorming and code synthesis, provide your Google Gemini API key.
          </p>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200 block">Gemini API Key</label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
            />
            <span className="text-[11px] text-slate-500 block">
              Stored securely in your browser localStorage. Never sent to third parties.
            </span>
          </div>

          {testStatus === 'success' && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-2 text-xs">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Gemini 3.5 Flash connection confirmed and operational!</span>
            </div>
          )}

          {testStatus === 'error' && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>API key verification failed. Please check the key.</span>
            </div>
          )}

          {/* Engine Info */}
          <div className="rounded-xl bg-slate-950/70 p-3.5 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">Active LLM Model</span>
              <span className="text-indigo-400 font-mono font-bold">gemini-3.5-flash</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Gemini 3.5 Flash provides 1,000,000 token context, sub-500ms latency, and costs 90% less than GPT-4o, perfectly embodying our Frugal Architecture philosophy.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
          >
            <span>Get Gemini API Key</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTest}
              disabled={isTesting || !apiKeyInput.trim()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors disabled:opacity-40"
            >
              {isTesting ? 'Testing...' : 'Test Key'}
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all"
            >
              {isSaved ? 'Saved!' : 'Save & Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
