import React from 'react';
import { Dumbbell } from 'lucide-react';

interface NavbarProps {
  currentTab: 'generator' | 'plan' | 'active-session' | 'saved' | 'coach';
  onSelectTab: (tab: 'generator' | 'plan' | 'active-session' | 'saved' | 'coach') => void;
  hasActivePlan: boolean;
  isSessionActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  hasActivePlan,
  isSessionActive,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => onSelectTab(hasActivePlan ? 'plan' : 'generator')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-sm shadow-amber-500/20">
            <Dumbbell className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span>AetherFit</span>
        </button>

        {/* Zone 2: 4-5 Clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('generator')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentTab === 'generator' ? 'text-amber-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Plan Architect
          </button>

          <button
            onClick={() => onSelectTab('plan')}
            disabled={!hasActivePlan}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              !hasActivePlan
                ? 'text-slate-600 cursor-not-allowed'
                : currentTab === 'plan'
                ? 'text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Current Program
          </button>

          <button
            onClick={() => onSelectTab('active-session')}
            disabled={!hasActivePlan}
            className={`relative transition-colors whitespace-nowrap shrink-0 ${
              !hasActivePlan
                ? 'text-slate-600 cursor-not-allowed'
                : currentTab === 'active-session'
                ? 'text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Live Workout</span>
            {isSessionActive && (
              <span className="ml-1.5 inline-block w-2 h-2 rounded-full bg-emerald-400 align-middle" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('coach')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentTab === 'coach' ? 'text-amber-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Biomechanics Coach
          </button>

          <button
            onClick={() => onSelectTab('saved')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentTab === 'saved' ? 'text-amber-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Saved Plans
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('generator')}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 rounded-lg hover:bg-amber-300 active:scale-[0.98] transition-all shadow-sm shadow-amber-400/20 whitespace-nowrap shrink-0"
          >
            Design New Plan
          </button>
        </div>
      </div>
    </header>
  );
};
