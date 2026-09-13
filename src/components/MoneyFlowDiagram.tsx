import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Home, UtensilsCrossed, ShoppingCart, ShieldCheck } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';
import { useTheme } from '../context/ThemeContext';

interface MoneyFlowDiagramProps {
  currentBalance: number;
  monthlyIncome: number;
  essentialExpenses: number;
  safetyBuffer: number;
  purchaseAmount: number;
  itemName: string;
}

export const MoneyFlowDiagram: React.FC<MoneyFlowDiagramProps> = ({
  currentBalance,
  monthlyIncome,
  essentialExpenses,
  safetyBuffer,
  purchaseAmount,
  itemName,
}) => {
  const { isDark } = useTheme();
  const rentEstimate = Math.round(essentialExpenses * 0.6);
  const livingBurn = Math.round(essentialExpenses * 0.4);

  return (
    <div
      className={`rounded-3xl border p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-colors duration-200 ${
        isDark
          ? 'bg-[#0c1224] border-slate-700 ring-1 ring-slate-700/50 shadow-black/80'
          : 'bg-white border-slate-300 ring-1 ring-slate-200 shadow-xl'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3
            className={`text-lg sm:text-2xl font-black tracking-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
          >
            Visual Money Flow
          </h3>
          <p
            className={`text-xs sm:text-sm font-semibold mt-0.5 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Real-time dynamic visualization of inbound cash, safety boundaries, and outbound commitments
          </p>
        </div>
        <div
          className={`flex items-center gap-2 text-xs font-black px-3 py-1.5 rounded-full border ${
            isDark
              ? 'text-indigo-300 bg-indigo-950/80 border-indigo-400/60 shadow-sm'
              : 'text-indigo-900 bg-indigo-100 border-indigo-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Safety Floor Protected: ₹{safetyBuffer.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Main Flow Canvas */}
      <div className="relative max-w-2xl mx-auto py-4 flex flex-col items-center">
        {/* 1. TOP NODE: INCOMING SALARY / INCOME */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`relative z-10 px-6 py-3.5 rounded-2xl border-2 shadow-xl flex items-center gap-3.5 text-center ${
            isDark
              ? 'bg-[#062419] border-emerald-400 shadow-emerald-950/50'
              : 'bg-emerald-50 border-emerald-500 shadow-emerald-500/10'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
              isDark
                ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300'
                : 'bg-emerald-200 border-emerald-400 text-emerald-800'
            }`}
          >
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <div
              className={`text-[11px] font-black uppercase tracking-wider ${
                isDark ? 'text-emerald-300' : 'text-emerald-800'
              }`}
            >
              Monthly Inflow
            </div>
            <div
              className={`text-xl font-black font-mono-nums ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              +<AnimatedNumber value={monthlyIncome} />
            </div>
          </div>
        </motion.div>

        {/* INFLOW STREAM ARROW with animated downward particles */}
        <div className="relative w-8 h-12 flex items-center justify-center">
          <svg className="w-6 h-full" viewBox="0 0 24 48">
            <line
              x1="12"
              y1="0"
              x2="12"
              y2="48"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />
          </svg>
          <motion.div
            animate={{ y: [0, 24, 48], opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]"
          />
        </div>

        {/* 2. CENTRAL NODE: BALANCE + SAFETY BOUNDARY */}
        <div className="relative my-2 w-full max-w-sm">
          {/* Outer Protective Safety Buffer Ring */}
          <div
            className={`absolute -inset-3.5 rounded-3xl border-2 border-dashed pointer-events-none flex items-start justify-end p-2 ${
              isDark
                ? 'border-indigo-400/60 bg-indigo-950/20'
                : 'border-indigo-400/80 bg-indigo-50/60'
            }`}
          >
            <span
              className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full border shadow-sm ${
                isDark
                  ? 'text-indigo-200 bg-[#090e1f] border-indigo-400'
                  : 'text-indigo-900 bg-white border-indigo-300'
              }`}
            >
              Safety Boundary: ₹{safetyBuffer.toLocaleString('en-IN')}
            </span>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative z-10 p-6 rounded-2xl border-2 shadow-2xl text-center ${
              isDark
                ? 'bg-gradient-to-b from-[#111c38] to-[#0a1124] border-slate-600'
                : 'bg-gradient-to-b from-slate-50 to-white border-slate-300'
            }`}
          >
            <div
              className={`text-xs font-black uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Current Liquid Balance
            </div>
            <div
              className={`text-3xl sm:text-4xl font-black font-mono-nums tracking-tight ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              <AnimatedNumber value={currentBalance} />
            </div>
            <div
              className={`mt-2 text-xs font-black flex items-center justify-center gap-1.5 ${
                isDark ? 'text-emerald-400' : 'text-emerald-700'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
              <span>Available Surplus: ₹{Math.max(0, currentBalance - safetyBuffer).toLocaleString('en-IN')}</span>
            </div>
          </motion.div>
        </div>

        {/* OUTFLOW SPLIT STREAM ARROWS */}
        <div className="relative w-full max-w-lg h-14">
          <svg className="w-full h-full" viewBox="0 0 400 56" preserveAspectRatio="none">
            {/* Outflow paths to Left (Rent), Middle (Living), Right (Purchase) */}
            <path
              d="M 200,0 C 200,28 70,28 70,56"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2.5"
              strokeDasharray="4 3"
              opacity={isDark ? '0.9' : '0.7'}
            />
            <path
              d="M 200,0 C 200,28 200,28 200,56"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeDasharray="4 3"
              opacity={isDark ? '0.9' : '0.7'}
            />
            <path
              d="M 200,0 C 200,28 330,28 330,56"
              fill="none"
              stroke="#818cf8"
              strokeWidth="2.5"
              strokeDasharray="4 3"
              opacity={isDark ? '1' : '0.8'}
            />
          </svg>

          {/* Animated Outflow Dots */}
          <motion.div
            animate={{
              x: [0, -65, -130],
              y: [0, 28, 56],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e]"
          />
          <motion.div
            animate={{
              y: [0, 28, 56],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear', delay: 0.4 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"
          />
          <motion.div
            animate={{
              x: [0, 65, 130],
              y: [0, 28, 56],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: 0.8 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8]"
          />
        </div>

        {/* 3. BOTTOM NODES: OUTGOING DESTINATIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-xl">
          {/* Node 1: Rent / Commitments */}
          <motion.div
            whileHover={{ y: -2 }}
            className={`p-3.5 rounded-2xl border-2 text-left flex items-center gap-3 ${
              isDark
                ? 'bg-[#180914] border-rose-500/60 shadow-lg'
                : 'bg-rose-50/70 border-rose-300 shadow-sm'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                isDark
                  ? 'bg-rose-500/30 border-rose-400 text-rose-300'
                  : 'bg-rose-200 border-rose-300 text-rose-800'
              }`}
            >
              <Home className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div
                className={`text-[10px] font-black uppercase ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Fixed Commitments
              </div>
              <div
                className={`text-sm font-black font-mono-nums ${
                  isDark ? 'text-rose-400' : 'text-rose-700'
                }`}
              >
                -₹{rentEstimate.toLocaleString('en-IN')}
              </div>
            </div>
          </motion.div>

          {/* Node 2: Living Burn / Utilities */}
          <motion.div
            whileHover={{ y: -2 }}
            className={`p-3.5 rounded-2xl border-2 text-left flex items-center gap-3 ${
              isDark
                ? 'bg-[#1e1503] border-amber-500/60 shadow-lg'
                : 'bg-amber-50/70 border-amber-300 shadow-sm'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                isDark
                  ? 'bg-amber-500/30 border-amber-400 text-amber-300'
                  : 'bg-amber-200 border-amber-300 text-amber-800'
              }`}
            >
              <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div
                className={`text-[10px] font-black uppercase ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Living & Food Burn
              </div>
              <div
                className={`text-sm font-black font-mono-nums ${
                  isDark ? 'text-amber-400' : 'text-amber-700'
                }`}
              >
                -₹{livingBurn.toLocaleString('en-IN')}
              </div>
            </div>
          </motion.div>

          {/* Node 3: Target Purchase */}
          <motion.div
            whileHover={{ y: -2 }}
            className={`p-3.5 rounded-2xl border-2 text-left flex items-center gap-3 shadow-xl ${
              isDark
                ? 'bg-[#111c38] border-indigo-400 shadow-indigo-950/60'
                : 'bg-indigo-50 border-indigo-400 shadow-indigo-500/10'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                isDark
                  ? 'bg-indigo-500/30 border-indigo-400 text-indigo-300'
                  : 'bg-indigo-200 border-indigo-300 text-indigo-800'
              }`}
            >
              <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div
                className={`text-[10px] font-black uppercase truncate max-w-[120px] ${
                  isDark ? 'text-indigo-300' : 'text-indigo-800'
                }`}
              >
                {itemName || 'Purchase'}
              </div>
              <div
                className={`text-sm font-black font-mono-nums ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                -₹{purchaseAmount.toLocaleString('en-IN')}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

