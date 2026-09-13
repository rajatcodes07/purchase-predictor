import React from 'react';
import { ShieldCheck, Sparkles, Scan, RotateCcw, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  safetyBuffer: number;
  onOpenUpload: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  safetyBuffer,
  onOpenUpload,
  onReset,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-xl transition-colors duration-200 border-b ${
        isDark
          ? 'bg-[#050814]/90 border-slate-700/80 shadow-lg shadow-black/60'
          : 'bg-white/95 border-slate-300 shadow-md shadow-slate-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/35 font-black text-base ring-1 ring-white/25">
            BW
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-base sm:text-lg font-black tracking-wider ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                BUY OR WAIT?
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30">
                LIVE
              </span>
            </div>
            <div
              className={`text-[11px] font-semibold -mt-0.5 hidden sm:block ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              High-Contrast Fintech Intelligence & 90-Day Cash Flow Forecast
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Safety floor badge */}
          <div
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
              isDark
                ? 'bg-slate-900/90 border-slate-700 text-slate-200 shadow-inner'
                : 'bg-slate-100 border-slate-300 text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Floor:</span>
            <span
              className={`font-black font-mono-nums ${
                isDark ? 'text-cyan-300' : 'text-indigo-700'
              }`}
            >
              ₹{safetyBuffer.toLocaleString('en-IN')}
            </span>
          </div>

          {/* High-Contrast Theme Switcher Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Switch to High-Contrast Light Theme' : 'Switch to High-Contrast Dark Theme'}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
              isDark
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-400/60 text-amber-300 hover:border-amber-300 hover:bg-amber-500/30 shadow-sm'
                : 'bg-indigo-50 border-indigo-300 text-indigo-900 hover:bg-indigo-100 hover:border-indigo-400 shadow-sm'
            }`}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-300 animate-spin-slow" />
                <span className="hidden sm:inline">Light Theme</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-700" />
                <span className="hidden sm:inline">Dark Theme</span>
              </>
            )}
          </button>

          {/* Statement Scan */}
          <button
            type="button"
            onClick={onOpenUpload}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white shadow-sm hover:border-indigo-400'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-900 shadow-sm hover:border-slate-400'
            }`}
          >
            <Scan className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Scan Statement</span>
            <span className="sm:hidden">Scan</span>
          </button>

          {/* Reset Baseline */}
          <button
            type="button"
            onClick={onReset}
            title="Reset to default baseline"
            className={`p-2 rounded-xl border transition-all active:scale-95 ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-950'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

