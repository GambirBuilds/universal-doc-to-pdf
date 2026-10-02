import React from 'react';
import { FileText, ArrowRight, Clock, Info, Shield, Layers } from 'lucide-react';

export type PageTab = 'home' | 'convert' | 'history' | 'about' | 'privacy';

interface HeaderProps {
  currentTab: PageTab;
  onNavigate: (tab: PageTab) => void;
  queueCount: number;
  hasConverted: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  queueCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left text-slate-900 transition hover:opacity-85"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-200">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900">
              Universal PDF
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Document Converter
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('home')}
            className={`transition hover:text-slate-900 ${
              currentTab === 'home'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : ''
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('convert')}
            className={`flex items-center gap-1.5 transition hover:text-slate-900 ${
              currentTab === 'convert'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : ''
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Convert</span>
            {queueCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center rounded-full bg-indigo-100 px-1.5 py-0.2 text-[11px] font-semibold text-indigo-700">
                {queueCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('history')}
            className={`flex items-center gap-1.5 transition hover:text-slate-900 ${
              currentTab === 'history'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : ''
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>History</span>
          </button>

          <button
            onClick={() => onNavigate('about')}
            className={`flex items-center gap-1.5 transition hover:text-slate-900 ${
              currentTab === 'about'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : ''
            }`}
          >
            <Info className="h-4 w-4" />
            <span>About</span>
          </button>

          <button
            onClick={() => onNavigate('privacy')}
            className={`flex items-center gap-1.5 transition hover:text-slate-900 ${
              currentTab === 'privacy'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : ''
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>Privacy</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('convert')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-98"
          >
            <span>Open Converter</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
