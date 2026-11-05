import React, { useState } from 'react';
import { 
  Smartphone, Layers, Compass, BookOpen, Sparkles, ArrowRight, 
  CheckCircle2, Code2, Copy, Check, Eye, ChevronRight, Sliders,
  HelpCircle, RefreshCw, SmartphoneCharging, MousePointer, ShieldCheck
} from 'lucide-react';
import { AppIdea, WireframeBlueprint, WireframeScreen, WireframeElement } from '../types';
import { GeminiService } from '../services/geminiService';

interface WireframeStudioViewProps {
  currentIdea: AppIdea | null;
  onUpdateWireframe?: (wireframe: WireframeBlueprint) => void;
}

export const WireframeStudioView: React.FC<WireframeStudioViewProps> = ({
  currentIdea,
  onUpdateWireframe,
}) => {
  const [purposeInput, setPurposeInput] = useState<string>(
    currentIdea?.problemStatement 
      ? `${currentIdea.title}: ${currentIdea.tagline}` 
      : 'FocusForge: Audio & Mindmap Study Engine'
  );
  const [audienceInput, setAudienceInput] = useState<string>(
    currentIdea?.targetAudience || 'University students, self-taught developers, and exam candidates on tight budgets'
  );
  const [archetype, setArchetype] = useState<string>('Card-Centric Micro-Learning');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedScreenIndex, setSelectedScreenIndex] = useState<number>(0);
  const [showThumbZoneOverlay, setShowThumbZoneOverlay] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'wireframe' | 'navigation' | 'ux_principles' | 'compose_code'>('wireframe');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Active wireframe state
  const [blueprint, setBlueprint] = useState<WireframeBlueprint>(() => {
    if (currentIdea?.wireframeBlueprint) {
      return currentIdea.wireframeBlueprint;
    }
    return GeminiService.synthesizeWireframeBlueprint(
      purposeInput,
      audienceInput,
      archetype
    );
  });

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const generated = await GeminiService.generateWireframesForPurpose(
        purposeInput,
        audienceInput,
        archetype
      );
      setBlueprint(generated);
      setSelectedScreenIndex(0);
      if (onUpdateWireframe) onUpdateWireframe(generated);
    } catch (err) {
      console.error('Failed to generate wireframes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncFromCurrentIdea = () => {
    if (!currentIdea) return;
    const newPurpose = `${currentIdea.title}: ${currentIdea.tagline}`;
    const newAudience = currentIdea.targetAudience;
    setPurposeInput(newPurpose);
    setAudienceInput(newAudience);
    if (currentIdea.wireframeBlueprint) {
      setBlueprint(currentIdea.wireframeBlueprint);
      setSelectedScreenIndex(0);
    } else {
      const generated = GeminiService.synthesizeWireframeBlueprint(newPurpose, newAudience, currentIdea.category);
      setBlueprint(generated);
      setSelectedScreenIndex(0);
    }
  };

  const currentScreen: WireframeScreen | undefined = blueprint.screens[selectedScreenIndex] || blueprint.screens[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Generator Card */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-750 p-6 lg:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider border border-indigo-500/20">
              <Smartphone className="w-3.5 h-3.5" />
              <span>AI UI Layouts &amp; Wireframe Architect</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Intuitive Navigation &amp; Screen Wireframes
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Input your app’s core purpose and target audience to generate ergonomic screen layouts, 
              one-handed thumb zone designs, and UX rationale grounded in cognitive science.
            </p>
          </div>

          {currentIdea && (
            <button
              onClick={handleSyncFromCurrentIdea}
              className="self-start lg:self-center flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-indigo-500/30 transition-all shadow-sm"
              title="Sync inputs from currently active Idea Lab blueprint"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync from Current Idea ({currentIdea.title})</span>
            </button>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>App Core Purpose</span>
                <span className="text-indigo-400 font-normal">(What problem does it solve?)</span>
              </label>
              <input
                type="text"
                value={purposeInput}
                onChange={(e) => setPurposeInput(e.target.value)}
                placeholder="e.g., Turn lecture audio notes into spaced-repetition flashcards..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-xs shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>Target Audience</span>
                <span className="text-indigo-400 font-normal">(Who is using it?)</span>
              </label>
              <input
                type="text"
                value={audienceInput}
                onChange={(e) => setAudienceInput(e.target.value)}
                placeholder="e.g., College students studying on busy subways..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-xs shadow-inner"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Design Archetype:</span>
              <select
                value={archetype}
                onChange={(e) => setArchetype(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Card-Centric Micro-Learning">Card-Centric Micro-Learning</option>
                <option value="Hyperlocal Marketplace & P2P Drops">Hyperlocal Marketplace &amp; P2P Drops</option>
                <option value="Financial Watchdog & Utility">Financial Watchdog &amp; Utility</option>
                <option value="Health, Habit & Streak Tracker">Health, Habit &amp; Streak Tracker</option>
                <option value="Material 3 Responsive Dashboard">Material 3 Responsive Dashboard</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all whitespace-nowrap disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing UI Wireframes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Generate UI Layouts &amp; Wireframes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="space-y-6">
        <div className="flex border-b border-slate-800 gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('wireframe')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'wireframe'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Interactive Mobile Wireframe ({blueprint.screens.length} Screens)</span>
          </button>

          <button
            onClick={() => setActiveTab('navigation')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'navigation'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Navigation Flow Map ({blueprint.navigationFlow.length} Steps)</span>
          </button>

          <button
            onClick={() => setActiveTab('ux_principles')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'ux_principles'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>UX Design Principles &amp; Rationale ({blueprint.uxRationales.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('compose_code')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'compose_code'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Jetpack Compose Layout Code</span>
          </button>
        </div>

        {/* Tab 1: Interactive Wireframe View */}
        {activeTab === 'wireframe' && currentScreen && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Screen Selector & Component Specs (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Screen Pills Switcher */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Select Screen to Inspect:</span>
                  <span className="text-[11px] font-mono">{selectedScreenIndex + 1} of {blueprint.screens.length}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {blueprint.screens.map((screen, idx) => (
                    <button
                      key={screen.id}
                      onClick={() => setSelectedScreenIndex(idx)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedScreenIndex === idx
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-bold text-indigo-400 mb-1">
                        {screen.screenType}
                      </div>
                      <div className="font-bold text-xs line-clamp-1">{screen.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Screen Details */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {currentScreen.screenType}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1.5">
                      {currentScreen.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {currentScreen.purpose}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Thumb Ergonomics</span>
                    <span className="text-xs font-bold text-emerald-400">{currentScreen.thumbZoneFocus}</span>
                  </div>
                </div>

                {/* Elements Breakdown with UX Rationale */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Component Hierarchy &amp; UX Decisions</span>
                  </h4>

                  <div className="space-y-2.5">
                    {currentScreen.elements.map((el, elIdx) => (
                      <div
                        key={el.id}
                        className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 text-[11px] font-mono font-bold flex items-center justify-center">
                              {elIdx + 1}
                            </span>
                            <span className="font-semibold text-xs text-white">
                              {el.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                            {el.type}
                          </span>
                        </div>

                        {el.subtitle && (
                          <p className="text-xs text-slate-400 pl-7">{el.subtitle}</p>
                        )}

                        {el.uxRationale && (
                          <div className="mt-1.5 pl-7 text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                            <span className="font-semibold text-emerald-400">UX Rationale: </span>
                            {el.uxRationale}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Interactive Phone Frame (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {/* Toggle Controls */}
              <div className="w-full max-w-sm flex items-center justify-between mb-3 px-1 text-xs">
                <span className="text-slate-400 font-medium">Interactive Wireframe Preview</span>
                <button
                  onClick={() => setShowThumbZoneOverlay(!showThumbZoneOverlay)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                    showThumbZoneOverlay
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <MousePointer className="w-3 h-3" />
                  <span>{showThumbZoneOverlay ? 'Hide Thumb Heatmap' : 'Show Thumb Heatmap'}</span>
                </button>
              </div>

              {/* Mobile Phone Mockup Frame */}
              <div className="relative w-full max-w-[340px] rounded-[42px] bg-slate-950 border-[6px] border-slate-800 p-3 shadow-2xl shadow-indigo-950/50 overflow-hidden ring-1 ring-slate-700">
                {/* Hardware Speaker Notch & Camera Pill */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-950 mr-2 border border-slate-800" />
                  <div className="w-8 h-1 rounded-full bg-slate-800" />
                </div>

                {/* Simulated Screen Body */}
                <div className="relative w-full min-h-[580px] max-h-[620px] rounded-[32px] bg-slate-950 overflow-y-auto flex flex-col justify-between pt-6 pb-2 text-slate-100 select-none">
                  {/* Status Bar */}
                  <div className="px-4 py-1.5 flex items-center justify-between text-[10px] text-slate-400 font-mono border-b border-slate-900">
                    <span>9:41 AM</span>
                    <div className="flex items-center gap-1.5">
                      <span>5G</span>
                      <SmartphoneCharging className="w-3 h-3 text-emerald-400" />
                    </div>
                  </div>

                  {/* Wireframe Dynamic Elements Rendering */}
                  <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                    {currentScreen.elements.map((el) => {
                      if (el.type === 'app_bar') {
                        return (
                          <div key={el.id} className="pb-2 border-b border-slate-800 flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-white">{el.title}</div>
                              {el.subtitle && <div className="text-[10px] text-slate-400">{el.subtitle}</div>}
                            </div>
                            {el.badge && (
                              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                                {el.badge}
                              </span>
                            )}
                          </div>
                        );
                      }

                      if (el.type === 'search_bar') {
                        return (
                          <div key={el.id} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                            <span>🔍 {el.title}</span>
                            {el.actionText && <span className="text-[10px] text-indigo-400">{el.actionText}</span>}
                          </div>
                        );
                      }

                      if (el.type === 'filter_chips') {
                        return (
                          <div key={el.id} className="flex gap-1.5 overflow-x-auto py-1">
                            {el.subtitle?.split('•').map((chip, ci) => (
                              <span key={ci} className={`text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium ${
                                ci === 0 
                                  ? 'bg-indigo-600 text-white' 
                                  : 'bg-slate-900 text-slate-300 border border-slate-800'
                              }`}>
                                {chip.trim()}
                              </span>
                            ))}
                          </div>
                        );
                      }

                      if (el.type === 'hero_card' || el.type === 'chart_metric') {
                        return (
                          <div key={el.id} className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-500/30 space-y-2 shadow-sm">
                            <div className="text-xs font-bold text-white">{el.title}</div>
                            {el.subtitle && <div className="text-[11px] text-slate-300">{el.subtitle}</div>}
                            {el.actionText && (
                              <div className="pt-2">
                                <div className="w-full py-2 px-3 rounded-xl bg-indigo-600 text-white text-[11px] font-bold text-center">
                                  {el.actionText}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }

                      if (el.type === 'audio_player') {
                        return (
                          <div key={el.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                            <div className="h-6 flex items-center justify-center gap-1">
                              {[12, 24, 18, 30, 16, 28, 22, 14, 26, 18, 10].map((h, i) => (
                                <div key={i} style={{ height: `${h}px` }} className="w-1 bg-indigo-500 rounded-full animate-pulse" />
                              ))}
                            </div>
                            <div className="text-[11px] font-bold text-white">{el.title}</div>
                            {el.actionText && (
                              <button className="text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                                {el.actionText}
                              </button>
                            )}
                          </div>
                        );
                      }

                      if (el.type === 'list_item') {
                        return (
                          <div key={el.id} className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
                            <div className="space-y-0.5">
                              <div className="text-[11px] font-semibold text-slate-200">{el.title}</div>
                              {el.subtitle && <div className="text-[9px] text-slate-400">{el.subtitle}</div>}
                            </div>
                            {el.badge && (
                              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                                {el.badge}
                              </span>
                            )}
                          </div>
                        );
                      }

                      if (el.type === 'card_grid') {
                        return (
                          <div key={el.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                            <div className="h-16 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 text-[10px]">
                              WebP Photo
                            </div>
                            <div className="text-[10px] font-bold text-white truncate">{el.title}</div>
                            <div className="text-[9px] text-emerald-400">{el.subtitle}</div>
                          </div>
                        );
                      }

                      if (el.type === 'input_field') {
                        return (
                          <div key={el.id} className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                            <div className="text-[10px] font-semibold text-slate-300">{el.title}</div>
                            <div className="h-7 rounded-lg bg-slate-950 border border-slate-700/60 px-2 flex items-center text-[10px] text-slate-500">
                              Type here...
                            </div>
                          </div>
                        );
                      }

                      if (el.type === 'cta_button') {
                        return (
                          <div key={el.id} className="pt-2">
                            <div className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold text-center shadow-md">
                              {el.actionText || el.title}
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>

                  {/* Bottom Navigation Simulation */}
                  <div className="px-4 py-2 border-t border-slate-900 bg-slate-950 flex items-center justify-around text-[10px] text-slate-400">
                    <span className="text-indigo-400 font-bold">🏠 Home</span>
                    <span>📑 Items</span>
                    <span>⚡ Quick</span>
                    <span>⚙️ Profile</span>
                  </div>

                  {/* Thumb Zone Overlay (Educational Heatmap) */}
                  {showThumbZoneOverlay && (
                    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col">
                      <div className="h-[35%] bg-rose-500/15 border-b border-rose-500/30 flex items-center justify-center text-[11px] font-bold text-rose-300">
                        Hard to Reach Zone (Top 35%)
                      </div>
                      <div className="h-[25%] bg-amber-500/15 border-b border-amber-500/30 flex items-center justify-center text-[11px] font-bold text-amber-300">
                        Reach Zone (25%)
                      </div>
                      <div className="h-[40%] bg-emerald-500/20 flex items-center justify-center text-[11px] font-bold text-emerald-300">
                        Natural Thumb Zone (Bottom 40%) ✓
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 text-center text-[11px] text-slate-400">
                <span>Viewport: Standard Mobile (360x780dp) • Android Material 3</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Navigation Flow Map */}
        {activeTab === 'navigation' && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-400" />
                <span>Suggested Mobile Navigation Architecture</span>
              </h3>
              <p className="text-xs text-slate-400">
                Predictable backstack management, screen transitions, and contextual trigger actions
              </p>
            </div>

            <div className="space-y-4">
              {blueprint.navigationFlow.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-950 border border-slate-800 p-5 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2 font-bold text-sm text-white">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono text-xs">
                        {step.fromScreen}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs">
                        {step.toScreen}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      Animation: {step.transitionType}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-indigo-300 block mb-0.5">User Trigger Event:</span>
                      <span className="text-slate-300">{step.trigger}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-emerald-300 block mb-0.5">Android Backstack Handling:</span>
                      <span className="text-slate-400">{step.backHandling}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: UX Design Principles */}
        {activeTab === 'ux_principles' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>UX Design Principles Applied in this Wireframe</span>
              </h3>
              <p className="text-xs text-slate-400">
                Cognitive psychology and human-computer interaction (HCI) rationale driving the layout
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blueprint.uxRationales.map((rationale, rIdx) => (
                <div
                  key={rIdx}
                  className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <h4 className="font-bold text-sm text-white">
                      {rationale.principleName}
                    </h4>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="font-semibold text-indigo-300 block mb-1">How it is implemented:</span>
                      <p className="text-slate-300 leading-relaxed">{rationale.howApplied}</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="font-semibold text-emerald-400 block mb-1">Benefit to User Experience:</span>
                      <p className="text-slate-300 leading-relaxed">{rationale.benefitToUser}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Compose Code Snippet */}
        {activeTab === 'compose_code' && currentScreen && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl space-y-0">
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <span>Jetpack Compose UI Layout: {currentScreen.name}</span>
                </h3>
                <span className="text-[11px] text-slate-400">Clean MVVM Composable with Material 3</span>
              </div>

              {currentScreen.composeCodeSnippet && (
                <button
                  onClick={() => handleCopyCode(currentScreen.composeCodeSnippet!)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Compose Code'}</span>
                </button>
              )}
            </div>

            <div className="p-5 bg-slate-950/90 overflow-x-auto">
              <pre className="font-mono text-xs text-slate-200 leading-relaxed tab-size-4">
                <code>
                  {currentScreen.composeCodeSnippet || `// Generated Composable Wireframe for ${currentScreen.name}
@Composable
fun ${currentScreen.name.replace(/[^a-zA-Z]/g, '')}Screen(
    onNavigateBack: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("${currentScreen.name}") }
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp)
        ) {
            Text("${currentScreen.purpose}", style = MaterialTheme.typography.bodyMedium)
        }
    }
}`}
                </code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
