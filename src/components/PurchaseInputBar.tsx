import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Sparkles, Tag, ArrowRight, Scan, RotateCcw } from 'lucide-react';
import { PurchaseItem } from '../types';
import { useTheme } from '../context/ThemeContext';

interface PurchaseInputBarProps {
  purchase: PurchaseItem;
  onChangePurchase: (updated: Partial<PurchaseItem>) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onOpenUpload: () => void;
  onResetToDefault: () => void;
}

export const PurchaseInputBar: React.FC<PurchaseInputBarProps> = ({
  purchase,
  onChangePurchase,
  onAnalyze,
  isAnalyzing,
  onOpenUpload,
  onResetToDefault,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded-3xl border p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative transition-colors duration-200 ${
        isDark
          ? 'bg-[#0c1224] border-slate-700 shadow-black/80 ring-1 ring-slate-700/50'
          : 'bg-white border-slate-300 shadow-xl ring-1 ring-slate-200'
      }`}
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-5">
        {/* Input: Item Name */}
        <div className="flex-1 space-y-2">
          <label
            className={`text-xs font-black uppercase tracking-wider flex items-center justify-between ${
              isDark ? 'text-slate-300' : 'text-slate-800'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-indigo-400" />
              Purchase Name / Item
            </span>
            <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              e.g. MacBook Pro, Trip, Watch
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={purchase.name}
              onChange={(e) => onChangePurchase({ name: e.target.value })}
              placeholder="What are you evaluating?"
              className={`w-full rounded-2xl px-4 py-3.5 text-base sm:text-lg font-bold border transition-all ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
              }`}
            />
          </div>
        </div>

        {/* Input: Category */}
        <div className="w-full lg:w-52 space-y-2">
          <label
            className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-slate-300' : 'text-slate-800'
            }`}
          >
            <Tag className="w-4 h-4 text-indigo-400" />
            Category
          </label>
          <select
            value={purchase.category}
            onChange={(e) => onChangePurchase({ category: e.target.value })}
            className={`w-full rounded-2xl px-4 py-4 text-sm font-bold border transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-950 border-slate-700 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30'
                : 'bg-slate-50 border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
            }`}
          >
            <option value="Electronics">Electronics</option>
            <option value="Mobile">Mobile / Gadget</option>
            <option value="Appliances">Appliances</option>
            <option value="Furniture">Furniture</option>
            <option value="Travel">Travel & Vacation</option>
            <option value="Luxury">Luxury / Fashion</option>
            <option value="Education">Course / Education</option>
            <option value="Other">Other Discretionary</option>
          </select>
        </div>

        {/* Input: Large Financial Amount with Focus Glow */}
        <div className="w-full lg:w-80 space-y-2">
          <label
            className={`text-xs font-black uppercase tracking-wider flex items-center justify-between ${
              isDark ? 'text-slate-300' : 'text-slate-800'
            }`}
          >
            <span className={isDark ? 'text-cyan-300' : 'text-indigo-700'}>Purchase Amount</span>
            <span className={`text-xs font-mono font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              INR (₹)
            </span>
          </label>
          <div
            className={`relative flex items-center rounded-2xl border transition-all ${
              isDark
                ? isFocused
                  ? 'bg-slate-950 border-cyan-400 ring-2 ring-cyan-500/40 glow-cyan'
                  : 'bg-slate-950 border-slate-700 hover:border-slate-500'
                : isFocused
                  ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/30 shadow-md'
                  : 'bg-slate-50 border-slate-300 hover:border-slate-400'
            }`}
          >
            <span
              className={`pl-4 text-2xl font-black select-none ${
                isDark ? 'text-cyan-400' : 'text-indigo-600'
              }`}
            >
              ₹
            </span>
            <input
              type="number"
              min="0"
              step="1000"
              value={purchase.amount || ''}
              onChange={(e) => onChangePurchase({ amount: Number(e.target.value) })}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`w-full bg-transparent px-3 py-3 text-2xl sm:text-3xl font-black font-mono-nums focus:outline-none ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
              placeholder="75000"
            />
          </div>
        </div>

        {/* Confident Analyze Button */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onAnalyze}
            disabled={isAnalyzing || !purchase.amount}
            className={`w-full lg:w-52 py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-xl cursor-pointer ${
              isAnalyzing
                ? 'bg-indigo-700 text-white cursor-wait animate-pulse'
                : 'bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-500 text-white hover:brightness-110 shadow-indigo-600/50'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <span>Analyze Purchase</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Auxiliary quick links */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4 pt-3.5 border-t text-xs font-semibold ${
          isDark ? 'border-slate-700/80 text-slate-300' : 'border-slate-200 text-slate-700'
        }`}
      >
        <button
          type="button"
          onClick={onOpenUpload}
          className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors font-bold cursor-pointer"
        >
          <Scan className="w-4 h-4 text-indigo-400" />
          <span>Extract from Bank Statement / Bill Screenshot</span>
        </button>

        <button
          type="button"
          onClick={onResetToDefault}
          className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
            isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Sample Scenario</span>
        </button>
      </div>
    </div>
  );
};

