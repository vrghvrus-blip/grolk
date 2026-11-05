import React, { useState, useEffect } from 'react';
import { Sparkles, DollarSign, Layers, Code2, Bookmark, Flame, Zap, Smartphone } from 'lucide-react';
import { Header } from './components/Header';
import { IdeaLabView } from './components/IdeaLabView';
import { WireframeStudioView } from './components/WireframeStudioView';
import { CostOptimizerView } from './components/CostOptimizerView';
import { ArchitectureView } from './components/ArchitectureView';
import { CodeSnippetsView } from './components/CodeSnippetsView';
import { VaultView } from './components/VaultView';
import { SettingsModal } from './components/SettingsModal';
import { ExportModal } from './components/ExportModal';
import { AppIdea } from './types';
import { INITIAL_PRESET_IDEAS } from './data/ideaPresets';
import { GeminiService } from './services/geminiService';

export const App: React.FC = () => {
  const [currentIdea, setCurrentIdea] = useState<AppIdea>(INITIAL_PRESET_IDEAS[0]);
  const [activeTab, setActiveTab] = useState<'ideas' | 'wireframes' | 'cost' | 'arch' | 'snippets' | 'vault'>('ideas');
  const [savedIdeas, setSavedIdeas] = useState<AppIdea[]>(() => {
    try {
      const stored = localStorage.getItem('appforge_saved_ideas');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
    return INITIAL_PRESET_IDEAS;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(!!GeminiService.getActiveKey());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('appforge_saved_ideas', JSON.stringify(savedIdeas));
    } catch (e) {
      // ignore
    }
  }, [savedIdeas]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGenerate = async (
    query: string,
    category: string,
    budgetFocus: 'frugal' | 'balanced' | 'scale'
  ) => {
    setIsLoading(true);
    try {
      const newIdea = await GeminiService.generateIdeaBlueprint(query, category, budgetFocus);
      setCurrentIdea(newIdea);
      showToast(`Blueprint generated for "${newIdea.title}"!`);
    } catch (err: any) {
      console.error(err);
      showToast('Error generating blueprint: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSurprise = () => {
    const randomPreset = INITIAL_PRESET_IDEAS[Math.floor(Math.random() * INITIAL_PRESET_IDEAS.length)];
    setCurrentIdea(randomPreset);
    showToast(`Loaded disruptive blueprint: "${randomPreset.title}"`);
  };

  const handleToggleBookmark = () => {
    if (!currentIdea) return;
    const exists = savedIdeas.some((i) => i.id === currentIdea.id);
    if (exists) {
      setSavedIdeas((prev) => prev.filter((i) => i.id !== currentIdea.id));
      showToast('Removed from Vault');
    } else {
      setSavedIdeas((prev) => [{ ...currentIdea, isBookmarked: true }, ...prev]);
      showToast('Saved to Vault!');
    }
  };

  const isBookmarked = savedIdeas.some((i) => i.id === currentIdea?.id);

  const handleDeleteFromVault = (id: string) => {
    setSavedIdeas((prev) => prev.filter((i) => i.id !== id));
    showToast('Deleted from Vault');
  };

  const handleSelectFromVault = (idea: AppIdea) => {
    setCurrentIdea(idea);
    setActiveTab('ideas');
    showToast(`Loaded "${idea.title}" into workspace`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        currentIdea={currentIdea}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onRandomIdea={handleSurprise}
        onToggleBookmark={handleToggleBookmark}
        isBookmarked={isBookmarked}
        hasApiKey={hasApiKey}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur overflow-x-auto">
          <button
            onClick={() => setActiveTab('ideas')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'ideas'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Idea Lab &amp; Prompts</span>
          </button>

          <button
            onClick={() => setActiveTab('wireframes')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'wireframes'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-300" />
            <span>UI Wireframes</span>
          </button>

          <button
            onClick={() => setActiveTab('cost')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'cost'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-300" />
            <span>Frugal Stack (कम खर्च)</span>
            <span className="hidden sm:inline-block text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
              {currentIdea?.costOptimization.savingsPercentage || '99%'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('arch')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'arch'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture &amp; Schemas</span>
          </button>

          <button
            onClick={() => setActiveTab('snippets')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'snippets'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Codebase Snippets</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ml-auto ${
              activeTab === 'vault'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-300" />
            <span>Vault ({savedIdeas.length})</span>
          </button>
        </div>

        {/* Tab View Contents */}
        {activeTab === 'ideas' && (
          <IdeaLabView
            currentIdea={currentIdea}
            onGenerate={handleGenerate}
            onSurprise={handleSurprise}
            onOpenAdvancedExport={() => setIsExportOpen(true)}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'wireframes' && (
          <WireframeStudioView
            currentIdea={currentIdea}
            onUpdateWireframe={(wf) => {
              if (currentIdea) {
                setCurrentIdea({ ...currentIdea, wireframeBlueprint: wf });
              }
            }}
          />
        )}

        {activeTab === 'cost' && currentIdea && (
          <CostOptimizerView
            costSpec={currentIdea.costOptimization}
            appTitle={currentIdea.title}
          />
        )}

        {activeTab === 'arch' && currentIdea && (
          <ArchitectureView
            idea={currentIdea}
          />
        )}

        {activeTab === 'snippets' && currentIdea && (
          <CodeSnippetsView
            idea={currentIdea}
          />
        )}

        {activeTab === 'vault' && (
          <VaultView
            savedIdeas={savedIdeas}
            onSelectIdea={handleSelectFromVault}
            onDeleteIdea={handleDeleteFromVault}
            onNewIdeaClick={() => setActiveTab('ideas')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-5 text-center text-xs text-slate-500 mt-auto">
        <p>
          AppForge Engine • Empowering lean founders &amp; mobile architects to build world-class mobile applications with zero wasted budget.
        </p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onKeySaved={() => setHasApiKey(!!GeminiService.getActiveKey())}
      />

      {/* Export Studio Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        idea={currentIdea}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-indigo-500/40 text-slate-200 text-xs font-semibold shadow-2xl animate-bounce flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
