import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Plus, Minus, Info } from 'lucide-react';
import { SafetyScoreFactor } from '../types';
import { AnimatedNumber } from './AnimatedNumber';
import { useTheme } from '../context/ThemeContext';

interface SafetyScoreCardProps {
  score: number;
  grade: string;
  factors: SafetyScoreFactor[];
}

export const SafetyScoreCard: React.FC<SafetyScoreCardProps> = ({
  score,
  grade,
  factors,
}) => {
  const { isDark } = useTheme();

  const getScoreColor = (val: number) => {
    if (val >= 80) return isDark ? 'text-emerald-400' : 'text-emerald-700';
    if (val >= 65) return isDark ? 'text-teal-400' : 'text-teal-700';
    if (val >= 50) return isDark ? 'text-amber-400' : 'text-amber-700';
    return isDark ? 'text-rose-400' : 'text-rose-700';
  };

  const getScoreBg = (val: number) => {
    if (val >= 80) return 'bg-emerald-500';
    if (val >= 65) return 'bg-teal-500';
    if (val >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div
      className={`rounded-3xl border p-6 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col justify-between transition-colors duration-200 ${
        isDark
          ? 'bg-[#0c1224] border-slate-700 ring-1 ring-slate-700/50 shadow-black/80'
          : 'bg-white border-slate-300 ring-1 ring-slate-200 shadow-xl'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-slate-300' : 'text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Affordability Safety Score
          </span>
          <span
            className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-300'
                : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            Cash-Flow Based
          </span>
        </div>

        {/* Big Score Display */}
        <div className="flex items-baseline gap-3 mb-2">
          <span
            className={`text-5xl sm:text-6xl font-black tracking-tight font-mono-nums ${getScoreColor(
              score
            )}`}
          >
            <AnimatedNumber value={score} prefix="" />
          </span>
          <span
            className={`text-xl font-bold font-mono-nums ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            /100
          </span>
          <span
            className={`text-xs font-black px-3 py-1 rounded-full border ml-auto shadow-sm ${
              isDark
                ? 'bg-slate-800 border-slate-600 text-white'
                : 'bg-slate-900 border-slate-900 text-white'
            }`}
          >
            {grade}
          </span>
        </div>

        {/* Linear meter */}
        <div
          className={`w-full h-3 rounded-full overflow-hidden mb-5 ${
            isDark ? 'bg-slate-800' : 'bg-slate-200'
          }`}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${getScoreBg(score)} shadow-md`}
          />
        </div>

        {/* Explain the factors behind the score */}
        <div className="space-y-2">
          <div
            className={`text-xs font-black uppercase tracking-wider mb-1 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            Contributing Financial Drivers:
          </div>
          {factors.map((f, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2.5 border ${
                f.type === 'positive'
                  ? isDark
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                    : 'bg-emerald-100 border-emerald-300 text-emerald-900'
                  : isDark
                  ? 'bg-rose-950/70 border-rose-500/50 text-rose-200'
                  : 'bg-rose-100 border-rose-300 text-rose-900'
              }`}
            >
              {f.type === 'positive' ? (
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-emerald-500/30 text-emerald-300' : 'bg-emerald-200 text-emerald-800'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              ) : (
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-rose-500/30 text-rose-300' : 'bg-rose-200 text-rose-800'
                  }`}
                >
                  <Minus className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
              <span className="leading-snug">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Explicit Disclaimer */}
      <div
        className={`mt-4 pt-3 border-t flex items-start gap-1.5 text-xs font-medium leading-normal ${
          isDark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'
        }`}
      >
        <Info className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
        <span>
          Affordability Safety Score is a deterministic liquidity health metric based purely on your current cash flow, upcoming obligations, and reserve margins. It is NOT a credit score.
        </span>
      </div>
    </div>
  );
};

