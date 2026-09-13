import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet,
  TrendingUp,
  Receipt,
  CalendarClock,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { FinancialProfile } from '../types';
import { AnimatedNumber } from './AnimatedNumber';
import { useTheme } from '../context/ThemeContext';

interface FinancialCardsGridProps {
  profile: FinancialProfile;
  safeToSpendLimit: number;
  onUpdateProfile: (updated: Partial<FinancialProfile>) => void;
}

export const FinancialCardsGrid: React.FC<FinancialCardsGridProps> = ({
  profile,
  safeToSpendLimit,
  onUpdateProfile,
}) => {
  const { isDark } = useTheme();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Temporary edit states
  const [tempBalance, setTempBalance] = useState(profile.currentBalance);
  const [tempIncome, setTempIncome] = useState(profile.monthlyIncome);
  const [tempExpenses, setTempExpenses] = useState(profile.essentialExpenses);
  const [tempBuffer, setTempBuffer] = useState(profile.safetyBuffer);

  const totalCommitments = profile.upcomingCommitments.reduce((sum, c) => sum + c.amount, 0);

  const toggleExpand = (key: string) => {
    setExpandedCard((prev) => (prev === key ? null : key));
  };

  const cardBaseClasses = (key: string, activeBorderDark: string, activeBorderLight: string) => {
    const isExpanded = expandedCard === key;
    if (isDark) {
      return isExpanded
        ? `bg-[#0f172a] ${activeBorderDark} shadow-xl`
        : 'bg-[#0b1329] border-slate-700 hover:border-slate-500 hover:shadow-lg shadow-md';
    } else {
      return isExpanded
        ? `bg-white ${activeBorderLight} shadow-xl`
        : 'bg-white border-slate-300 hover:border-slate-400 hover:shadow-lg shadow-sm';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3
            className={`text-lg sm:text-xl font-black tracking-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
          >
            Financial Health Foundation
          </h3>
          <p
            className={`text-xs font-semibold ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Interactive financial factors. Click any card to expand and calibrate your balance or obligations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* CARD 1: Current Balance */}
        <motion.div
          whileHover={{ y: -3, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${cardBaseClasses(
            'balance',
            'border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]',
            'border-cyan-600 ring-2 ring-cyan-500/20'
          )}`}
          onClick={() => toggleExpand('balance')}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-black uppercase tracking-wider ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Current Balance
            </span>
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
                isDark
                  ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                  : 'bg-cyan-100 border-cyan-300 text-cyan-800'
              }`}
            >
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          <div
            className={`text-2xl font-black font-mono-nums ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
          >
            <AnimatedNumber value={profile.currentBalance} />
          </div>

          <div
            className={`flex items-center justify-between text-xs font-semibold mt-2 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            <span>Liquid in bank</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                expandedCard === 'balance' ? 'rotate-180 text-cyan-400' : ''
              }`}
            />
          </div>

          <AnimatePresence>
            {expandedCard === 'balance' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className={`mt-3 pt-3 border-t space-y-2 ${
                  isDark ? 'border-slate-700' : 'border-slate-200'
                }`}
              >
                <label
                  className={`text-[11px] uppercase font-black ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Update Balance (₹)
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    value={tempBalance}
                    onChange={(e) => setTempBalance(Number(e.target.value))}
                    className={`w-full border-2 rounded-xl px-2.5 py-1.5 text-xs font-bold font-mono-nums focus:outline-none ${
                      isDark
                        ? 'bg-[#050814] border-slate-600 text-white focus:border-cyan-400'
                        : 'bg-white border-slate-300 text-slate-950 focus:border-cyan-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateProfile({ currentBalance: tempBalance });
                      setExpandedCard(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-cyan-400 text-slate-950 text-xs font-black hover:bg-cyan-300 cursor-pointer shadow-md"
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CARD 2: Monthly Income */}
        <motion.div
          whileHover={{ y: -3, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${cardBaseClasses(
            'income',
            'border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]',
            'border-emerald-600 ring-2 ring-emerald-500/20'
          )}`}
          onClick={() => toggleExpand('income')}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-black uppercase tracking-wider ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Monthly Income
            </span>
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
                isDark
                  ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                  : 'bg-emerald-100 border-emerald-300 text-emerald-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div
            className={`text-2xl font-black font-mono-nums ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
          >
            <AnimatedNumber value={profile.monthlyIncome} />
          </div>

          <div
            className={`flex items-center justify-between text-xs font-semibold mt-2 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            <span>Net salary inflow</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                expandedCard === 'income' ? 'rotate-180 text-emerald-400' : ''
              }`}
            />
          </div>

          <AnimatePresence>
            {expandedCard === 'income' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className={`mt-3 pt-3 border-t space-y-2 ${
                  isDark ? 'border-slate-700' : 'border-slate-200'
                }`}
              >
                <label
                  className={`text-[11px] uppercase font-black ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Update Monthly Salary (₹)
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    value={tempIncome}
                    onChange={(e) => setTempIncome(Number(e.target.value))}
                    className={`w-full border-2 rounded-xl px-2.5 py-1.5 text-xs font-bold font-mono-nums focus:outline-none ${
                      isDark
                        ? 'bg-[#050814] border-slate-600 text-white focus:border-emerald-400'
                        : 'bg-white border-slate-300 text-slate-950 focus:border-emerald-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateProfile({ monthlyIncome: tempIncome });
                      setExpandedCard(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-400 text-slate-950 text-xs font-black hover:bg-emerald-300 cursor-pointer shadow-md"
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CARD 3: Essential Expenses */}
        <motion.div
          whileHover={{ y: -3, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${cardBaseClasses(
            'expenses',
            'border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.3)]',
            'border-rose-600 ring-2 ring-rose-500/20'
          )}`}
          onClick={() => toggleExpand('expenses')}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-black uppercase tracking-wider ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Living Expenses
            </span>
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
                isDark
                  ? 'bg-rose-500/20 border-rose-400/50 text-rose-300'
                  : 'bg-rose-100 border-rose-300 text-rose-800'
              }`}
            >
              <Receipt className="w-4 h-4" />
            </div>
          </div>

          <div
            className={`text-2xl font-black font-mono-nums ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
          >
            <AnimatedNumber value={profile.essentialExpenses} />
          </div>

          <div
            className={`flex items-center justify-between text-xs font-semibold mt-2 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            <span>Food, rent, utils</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                expandedCard === 'expenses' ? 'rotate-180 text-rose-400' : ''
              }`}
            />
          </div>

          <AnimatePresence>
            {expandedCard === 'expenses' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className={`mt-3 pt-3 border-t space-y-2 ${
                  isDark ? 'border-slate-700' : 'border-slate-200'
                }`}
              >
                <label
                  className={`text-[11px] uppercase font-black ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Update Monthly Living Burn (₹)
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    value={tempExpenses}
                    onChange={(e) => setTempExpenses(Number(e.target.value))}
                    className={`w-full border-2 rounded-xl px-2.5 py-1.5 text-xs font-bold font-mono-nums focus:outline-none ${
                      isDark
                        ? 'bg-[#050814] border-slate-600 text-white focus:border-rose-400'
                        : 'bg-white border-slate-300 text-slate-950 focus:border-rose-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateProfile({ essentialExpenses: tempExpenses });
                      setExpandedCard(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-black hover:bg-rose-400 cursor-pointer shadow-md"
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CARD 4: Upcoming Commitments */}
        <motion.div
          whileHover={{ y: -3, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${cardBaseClasses(
            'commitments',
            'border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]',
            'border-amber-600 ring-2 ring-amber-500/20'
          )}`}
          onClick={() => toggleExpand('commitments')}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-black uppercase tracking-wider ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Upcoming Bills
            </span>
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
                isDark
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                  : 'bg-amber-100 border-amber-300 text-amber-800'
              }`}
            >
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>

          <div
            className={`text-2xl font-black font-mono-nums ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
          >
            <AnimatedNumber value={totalCommitments} />
          </div>

          <div
            className={`flex items-center justify-between text-xs font-semibold mt-2 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            <span>{profile.upcomingCommitments.length} fixed obligations</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                expandedCard === 'commitments' ? 'rotate-180 text-amber-400' : ''
              }`}
            />
          </div>

          <AnimatePresence>
            {expandedCard === 'commitments' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className={`mt-3 pt-3 border-t space-y-1.5 ${
                  isDark ? 'border-slate-700' : 'border-slate-200'
                }`}
              >
                {profile.upcomingCommitments.map((c) => (
                  <div
                    key={c.id}
                    className={`flex justify-between text-xs font-semibold ${
                      isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    <span className="truncate max-w-[110px]">{c.name}</span>
                    <span className="font-mono-nums font-bold">
                      ₹{c.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CARD 5: Safe-to-Spend */}
        <motion.div
          whileHover={{ y: -3, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${cardBaseClasses(
            'buffer',
            'border-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.3)]',
            'border-indigo-600 ring-2 ring-indigo-500/20'
          )}`}
          onClick={() => toggleExpand('buffer')}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-black uppercase tracking-wider ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Safe-to-Spend
            </span>
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
                isDark
                  ? 'bg-indigo-500/20 border-indigo-400/50 text-indigo-300'
                  : 'bg-indigo-100 border-indigo-300 text-indigo-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div
            className={`text-2xl font-black font-mono-nums ${
              isDark ? 'text-emerald-400' : 'text-emerald-700'
            }`}
          >
            <AnimatedNumber value={safeToSpendLimit} />
          </div>

          <div
            className={`flex items-center justify-between text-xs font-semibold mt-2 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            <span>Buffer: ₹{profile.safetyBuffer.toLocaleString('en-IN')}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                expandedCard === 'buffer' ? 'rotate-180 text-indigo-400' : ''
              }`}
            />
          </div>

          <AnimatePresence>
            {expandedCard === 'buffer' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className={`mt-3 pt-3 border-t space-y-2 ${
                  isDark ? 'border-slate-700' : 'border-slate-200'
                }`}
              >
                <label
                  className={`text-[11px] uppercase font-black ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Safety Reserve Floor (₹)
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    value={tempBuffer}
                    onChange={(e) => setTempBuffer(Number(e.target.value))}
                    className={`w-full border-2 rounded-xl px-2.5 py-1.5 text-xs font-bold font-mono-nums focus:outline-none ${
                      isDark
                        ? 'bg-[#050814] border-slate-600 text-white focus:border-indigo-400'
                        : 'bg-white border-slate-300 text-slate-950 focus:border-indigo-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateProfile({ safetyBuffer: tempBuffer });
                      setExpandedCard(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500 text-white text-xs font-black hover:bg-indigo-400 cursor-pointer shadow-md"
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

