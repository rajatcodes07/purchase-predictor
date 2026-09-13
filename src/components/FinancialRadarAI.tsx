import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Cpu, Wallet, TrendingUp, Receipt, CalendarClock, LineChart, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { AI_ANALYSIS_STAGES } from '../utils/financialEngine';
import { useTheme } from '../context/ThemeContext';

interface FinancialRadarAIProps {
  isAnalyzing: boolean;
  onComplete: () => void;
  purchaseAmount: number;
  itemName: string;
}

const NODES = [
  { key: 'balance', label: 'Balance', icon: Wallet, angle: 0, color: '#38bdf8' },
  { key: 'income', label: 'Income', icon: TrendingUp, angle: 51.4, color: '#34d399' },
  { key: 'expenses', label: 'Expenses', icon: Receipt, angle: 102.8, color: '#f87171' },
  { key: 'commitments', label: 'Commitments', icon: CalendarClock, angle: 154.2, color: '#fbbf24' },
  { key: 'payments', label: 'Payments', icon: CheckCircle2, angle: 205.6, color: '#a78bfa' },
  { key: 'forecast', label: 'Forecast', icon: LineChart, angle: 257, color: '#60a5fa' },
  { key: 'purchase', label: 'Purchase', icon: ShoppingBag, angle: 308.4, color: '#f472b6' },
] as const;

export const FinancialRadarAI: React.FC<FinancialRadarAIProps> = ({
  isAnalyzing,
  onComplete,
  purchaseAmount,
  itemName,
}) => {
  const { isDark } = useTheme();
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    if (!isAnalyzing) {
      setCurrentStageIdx(0);
      return;
    }

    let timeoutId: any;
    const runStage = (idx: number) => {
      if (idx >= AI_ANALYSIS_STAGES.length) {
        onComplete();
        return;
      }
      setCurrentStageIdx(idx);
      const stageDuration = AI_ANALYSIS_STAGES[idx].durationMs;
      timeoutId = setTimeout(() => {
        runStage(idx + 1);
      }, stageDuration);
    };

    runStage(0);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isAnalyzing, onComplete]);

  if (!isAnalyzing) return null;

  const currentStage = AI_ANALYSIS_STAGES[currentStageIdx] || AI_ANALYSIS_STAGES[0];
  const radius = 130; // px distance from center

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className={`p-8 sm:p-12 rounded-3xl border shadow-2xl backdrop-blur-2xl max-w-xl mx-auto text-center relative overflow-hidden transition-colors duration-200 ${
        isDark
          ? 'bg-[#0c1224] border-indigo-500/50 shadow-black/90'
          : 'bg-white border-indigo-400 shadow-2xl'
      }`}
    >
      {/* Background radar grid sweeps */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-0">
        <div className="w-[360px] h-[360px] rounded-full border border-indigo-500/20 animate-ping opacity-25" />
        <div
          className={`absolute w-[280px] h-[280px] rounded-full border ${
            isDark ? 'border-slate-700/60' : 'border-slate-300'
          }`}
        />
        <div className="absolute w-[180px] h-[180px] rounded-full border border-indigo-500/30" />
      </div>

      <div className="relative z-10">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-black mb-3 ${
            isDark
              ? 'bg-indigo-950/80 border-indigo-400/60 text-indigo-300'
              : 'bg-indigo-100 border-indigo-300 text-indigo-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
          <span>REAL-TIME MULTI-FACTOR CASH FLOW ANALYSIS</span>
        </div>

        <h3
          className={`text-xl sm:text-2xl font-black mb-1 ${
            isDark ? 'text-white' : 'text-slate-950'
          }`}
        >
          Analyzing {itemName || 'Purchase'}
        </h3>
        <p
          className={`text-base font-black font-mono-nums mb-6 ${
            isDark ? 'text-cyan-300' : 'text-indigo-700'
          }`}
        >
          ₹{purchaseAmount.toLocaleString('en-IN')}
        </p>

        {/* Central Circular Radar Visualization */}
        <div className="relative w-[320px] h-[320px] mx-auto mb-6 flex items-center justify-center">
          {/* Radar Sweep Effect */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-indigo-500/30 bg-gradient-to-tr from-indigo-500/15 via-transparent to-transparent pointer-events-none"
          />

          {/* SVG Connecting Beams between center and nodes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {NODES.map((node) => {
              const rad = (node.angle * Math.PI) / 180;
              const x2 = 160 + radius * Math.cos(rad);
              const y2 = 160 + radius * Math.sin(rad);
              const isActive = currentStage.nodeKey === node.key;

              return (
                <g key={`line-${node.key}`}>
                  <line
                    x1="160"
                    y1="160"
                    x2={x2}
                    y2={y2}
                    stroke={isActive ? node.color : isDark ? '#334155' : '#cbd5e1'}
                    strokeWidth={isActive ? '3' : '1.5'}
                    strokeDasharray={isActive ? '4 2' : 'none'}
                    className={isActive ? 'animate-pulse' : 'opacity-60'}
                  />
                  {isActive && (
                    <circle
                      cx={(160 + x2) / 2}
                      cy={(160 + y2) / 2}
                      r="4"
                      fill={node.color}
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Center AI Node */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              boxShadow: [
                '0 0 25px rgba(99, 102, 241, 0.5)',
                '0 0 40px rgba(99, 102, 241, 0.8)',
                '0 0 25px rgba(99, 102, 241, 0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 border-2 border-indigo-400 flex flex-col items-center justify-center text-white z-20 shadow-2xl"
          >
            <Cpu className="w-6 h-6 text-cyan-300 mb-0.5 stroke-[2.5]" />
            <span className="text-xs font-black tracking-wider text-white">AI</span>
          </motion.div>

          {/* Orbital Factor Nodes */}
          {NODES.map((node) => {
            const rad = (node.angle * Math.PI) / 180;
            const x = 160 + radius * Math.cos(rad) - 24; // 24 = half of 48px width
            const y = 160 + radius * Math.sin(rad) - 24;
            const Icon = node.icon;
            const isActive = currentStage.nodeKey === node.key;

            return (
              <motion.div
                key={node.key}
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  borderColor: isActive ? node.color : undefined,
                }}
                animate={{
                  scale: isActive ? 1.25 : 1,
                  boxShadow: isActive
                    ? `0 0 20px ${node.color}`
                    : '0 4px 6px rgba(0, 0, 0, 0.3)',
                }}
                transition={{ duration: 0.3 }}
                className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-xs transition-colors z-20 ${
                  isActive
                    ? isDark
                      ? 'bg-slate-800 border-2'
                      : 'bg-white border-2'
                    : isDark
                    ? 'bg-slate-900/95 border border-slate-700'
                    : 'bg-white border border-slate-300 shadow-sm'
                }`}
              >
                <Icon
                  className="w-4 h-4 mb-0.5 stroke-[2.5]"
                  style={{ color: isActive ? node.color : isDark ? '#94a3b8' : '#475569' }}
                />
                <span
                  className="text-[9px] font-black leading-none"
                  style={{ color: isActive ? node.color : isDark ? '#94a3b8' : '#475569' }}
                >
                  {node.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Current Processing Stage Ticker */}
        <div className="h-16 flex flex-col items-center justify-center">
          <div className="text-xs font-mono font-black text-indigo-400 mb-1">
            Stage {currentStageIdx + 1} of {AI_ANALYSIS_STAGES.length}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className={`text-base font-black flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
              {currentStage.label}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Linear Progress Bar */}
        <div
          className={`w-full rounded-full h-2 mt-4 overflow-hidden border ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'
          }`}
        >
          <motion.div
            className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full rounded-full"
            initial={{ width: '0%' }}
            animate={{
              width: `${((currentStageIdx + 1) / AI_ANALYSIS_STAGES.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

