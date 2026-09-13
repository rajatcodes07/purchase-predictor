import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Sparkles, TrendingUp, ArrowDownRight, Compass, Zap, ArrowRight } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';
import { useTheme } from '../context/ThemeContext';

interface HeroSectionProps {
  purchaseAmount: number;
  itemName: string;
  onQuickPreset: (name: string, amount: number, category: string) => void;
  onScrollToAnalysis: () => void;
  onOpenUpload: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  purchaseAmount,
  itemName,
  onQuickPreset,
  onScrollToAnalysis,
  onOpenUpload,
}) => {
  const { isDark } = useTheme();

  return (
    <section
      className={`relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b transition-colors duration-200 ${
        isDark
          ? 'border-slate-700/80 bg-gradient-to-b from-[#080d1e] via-[#050814] to-[#030712]'
          : 'border-slate-300 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50'
      }`}
    >
      {/* Ambient glowing orbs */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[360px] rounded-full blur-3xl pointer-events-none -z-10 ${
          isDark ? 'bg-indigo-600/20' : 'bg-indigo-300/30'
        }`}
      />
      <div
        className={`absolute top-20 right-10 w-[350px] h-[280px] rounded-full blur-3xl pointer-events-none -z-10 ${
          isDark ? 'bg-emerald-500/15' : 'bg-emerald-200/40'
        }`}
      />

      {/* Floating high-contrast financial telemetry particles in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0 select-none">
        {/* Particle 1: Target ₹75,000 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: [-8, 8, -8],
            x: [0, 6, 0],
            opacity: [0.85, 1, 0.85],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute top-8 left-[6%] sm:left-[10%] hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border shadow-xl backdrop-blur-md ${
            isDark
              ? 'bg-slate-900/95 border-cyan-500/60 shadow-cyan-950/40'
              : 'bg-white border-cyan-500 shadow-cyan-100'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Target Item:
          </span>
          <span className={`text-sm font-black font-mono-nums ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
            ₹75,000
          </span>
        </motion.div>

        {/* Particle 2: +₹45,000 Income */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{
            y: [10, -10, 10],
            x: [0, -8, 0],
            opacity: [0.85, 1, 0.85],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.2,
          }}
          className={`absolute top-12 right-[6%] sm:right-[12%] hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border shadow-xl backdrop-blur-md ${
            isDark
              ? 'bg-slate-900/95 border-emerald-500/60 shadow-emerald-950/40'
              : 'bg-white border-emerald-500 shadow-emerald-100'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-extrabold font-mono-nums text-emerald-600 dark:text-emerald-400">
            +₹45,000 Inflow
          </span>
        </motion.div>

        {/* Particle 3: -₹25,000 Expenses */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{
            y: [-12, 12, -12],
            x: [4, -4, 4],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2.4,
          }}
          className={`absolute bottom-10 left-[8%] hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border shadow-xl backdrop-blur-md ${
            isDark
              ? 'bg-slate-900/95 border-rose-500/50 shadow-rose-950/40'
              : 'bg-white border-rose-400 shadow-rose-100'
          }`}
        >
          <ArrowDownRight className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-extrabold font-mono-nums text-rose-600 dark:text-rose-400">
            -₹25,000 Fixed Burn
          </span>
        </motion.div>

        {/* Particle 4: ₹20,000 Safety Buffer */}
        <motion.div
          initial={{ y: -5, opacity: 0 }}
          animate={{
            y: [8, -8, 8],
            x: [-6, 6, -6],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.7,
          }}
          className={`absolute bottom-6 right-[8%] sm:right-[12%] hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border shadow-xl backdrop-blur-md ${
            isDark
              ? 'bg-slate-900/95 border-indigo-500/60 shadow-indigo-950/40'
              : 'bg-white border-indigo-400 shadow-indigo-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-indigo-500" />
          <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Safety Floor:
          </span>
          <span className={`text-sm font-black font-mono-nums ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
            ₹20,000
          </span>
        </motion.div>
      </div>

      {/* Main Hero Header */}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* High-contrast status pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold tracking-wider uppercase mb-5 shadow-sm ${
            isDark
              ? 'bg-indigo-950/90 border-indigo-400/50 text-indigo-200'
              : 'bg-indigo-100 border-indigo-300 text-indigo-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>High-Contrast Financial Intelligence</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            Real-Time 90D Cash Flow Engine
          </span>
        </motion.div>

        {/* High-Contrast Bold Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-4 ${
            isDark
              ? 'text-white drop-shadow-[0_4px_16px_rgba(255,255,255,0.15)]'
              : 'text-slate-950 drop-shadow-sm'
          }`}
        >
          BUY OR WAIT?
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-xl sm:text-3xl font-semibold max-w-xl mx-auto mb-8 ${
            isDark ? 'text-indigo-200' : 'text-indigo-900'
          }`}
        >
          Know before you spend.
        </motion.p>

        {/* Evaluating Target Card with Glowing Accent Border */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`p-5 sm:p-6 rounded-3xl border text-left max-w-2xl mx-auto transition-all shadow-2xl backdrop-blur-xl ${
            isDark
              ? 'bg-[#0c1224] border-indigo-500/50 shadow-[0_10px_40px_rgba(0,0,0,0.8)] glow-indigo ring-1 ring-indigo-400/30'
              : 'bg-white border-slate-300 shadow-xl ring-1 ring-slate-200'
          }`}
        >
          <div
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b ${
              isDark ? 'border-slate-700' : 'border-slate-200'
            }`}
          >
            <div>
              <div
                className={`text-xs font-extrabold tracking-wider uppercase mb-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Target Evaluating Item
              </div>
              <div
                className={`text-xl sm:text-2xl font-black flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                <span>{itemName || 'Discretionary Purchase'}</span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div
                className={`text-xs font-extrabold tracking-wider uppercase mb-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Purchase Amount
              </div>
              <div
                className={`text-3xl sm:text-4xl font-black font-mono-nums ${
                  isDark ? 'text-cyan-300' : 'text-indigo-600'
                }`}
              >
                <AnimatedNumber value={purchaseAmount} />
              </div>
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="pt-4">
            <div className="text-xs font-bold mb-2.5 flex items-center justify-between">
              <span
                className={`flex items-center gap-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}
              >
                <Compass className="w-4 h-4 text-indigo-400" />
                Quick Presets (Click to Test):
              </span>
              <button
                type="button"
                onClick={onOpenUpload}
                className="text-xs font-bold text-indigo-500 hover:text-indigo-400 transition-colors flex items-center gap-1 underline underline-offset-4"
              >
                Scan Statement / Bill
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'MacBook Air M3', amount: 75000, cat: 'Electronics' },
                { label: 'iPhone 16 Pro', amount: 129900, cat: 'Mobile' },
                { label: 'Ergonomic Desk & Chair', amount: 22500, cat: 'Furniture' },
                { label: 'Goa Vacation', amount: 35000, cat: 'Travel' },
                { label: 'Smart 4K TV', amount: 48000, cat: 'Appliances' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onQuickPreset(preset.label, preset.amount, preset.cat)}
                  className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-all hover:scale-105 active:scale-95 shadow-sm ${
                    isDark
                      ? 'bg-slate-800/90 hover:bg-slate-700 border-slate-600 hover:border-cyan-400 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-300 hover:border-indigo-400 text-slate-900'
                  }`}
                >
                  <span>{preset.label}</span>{' '}
                  <span
                    className={`font-mono-nums ${
                      isDark ? 'text-cyan-300 font-black' : 'text-indigo-700 font-black'
                    }`}
                  >
                    ₹{preset.amount.toLocaleString('en-IN')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

