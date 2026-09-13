import React from 'react';
import { motion } from 'motion/react';
import { Zap, Clock, Split, CalendarDays } from 'lucide-react';
import { ScenarioResult, ScenarioType } from '../types';
import { AnimatedNumber } from './AnimatedNumber';
import { useTheme } from '../context/ThemeContext';

interface ScenarioComparisonProps {
  scenarios: Record<ScenarioType, ScenarioResult>;
  selectedScenario: ScenarioType;
  recommendedScenario: ScenarioType;
  onSelectScenario: (id: ScenarioType) => void;
  safetyBuffer: number;
}

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({
  scenarios,
  selectedScenario,
  recommendedScenario,
  onSelectScenario,
  safetyBuffer,
}) => {
  const { isDark } = useTheme();
  const scenarioKeys: ScenarioType[] = ['BUY_NOW', 'WAIT_30', 'PAY_PARTIALLY', 'EMI_6'];

  const iconMap: Record<ScenarioType, React.ElementType> = {
    BUY_NOW: Zap,
    WAIT_30: Clock,
    PAY_PARTIALLY: Split,
    EMI_6: CalendarDays,
  };

  return (
    <div
      className={`rounded-3xl border p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-colors duration-200 ${
        isDark
          ? 'bg-[#0c1224] border-slate-700 ring-1 ring-slate-700/50 shadow-black/80'
          : 'bg-white border-slate-300 ring-1 ring-slate-200 shadow-xl'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h3
              className={`text-lg sm:text-2xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              Scenario Comparative Engine
            </h3>
            <span
              className={`text-xs px-3 py-1 rounded-full font-black border ${
                isDark
                  ? 'bg-indigo-950/80 border-indigo-400/60 text-indigo-300 shadow-sm'
                  : 'bg-indigo-100 border-indigo-300 text-indigo-900'
              }`}
            >
              Interactive 4-Way Analysis
            </span>
          </div>
          <p
            className={`text-xs sm:text-sm font-semibold mt-1 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Switch scenarios in real-time to observe how each payment structure reshapes cash reserves and safety scores
          </p>
        </div>
      </div>

      {/* 4 Interactive Scenario Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {scenarioKeys.map((key) => {
          const scenario = scenarios[key];
          if (!scenario) return null;

          const isSelected = selectedScenario === key;
          const isRecommended = recommendedScenario === key;
          const Icon = iconMap[key];
          const isSafe = scenario.lowestBalance >= safetyBuffer;

          return (
            <motion.div
              key={key}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectScenario(key)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                isSelected
                  ? isDark
                    ? 'bg-[#111c38] border-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.35)]'
                    : 'bg-indigo-50/70 border-indigo-600 shadow-xl ring-2 ring-indigo-500/20'
                  : isDark
                  ? 'bg-[#090e1f] border-slate-700 hover:border-slate-500 hover:bg-[#0c142b]'
                  : 'bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              {/* Recommended Ribbon */}
              {isRecommended && (
                <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg">
                  AI Recommendation
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      isSelected
                        ? isDark
                          ? 'bg-indigo-500/30 text-indigo-300 border-indigo-400'
                          : 'bg-indigo-100 text-indigo-700 border-indigo-300'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.5]" />
                  </div>

                  <span
                    className={`text-[11px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border ${
                      isSafe
                        ? isDark
                          ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                          : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                        : isDark
                        ? 'bg-rose-950/80 border-rose-500/60 text-rose-300'
                        : 'bg-rose-100 border-rose-300 text-rose-800'
                    }`}
                  >
                    {scenario.badge}
                  </span>
                </div>

                <h4
                  className={`text-base font-black mb-0.5 ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  {scenario.title}
                </h4>
                <p
                  className={`text-xs font-semibold leading-snug line-clamp-2 min-h-[32px] ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {scenario.subtitle}
                </p>
              </div>

              <div
                className={`mt-5 pt-4 border-t space-y-2.5 ${
                  isDark ? 'border-slate-700' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                    Lowest Balance:
                  </span>
                  <span
                    className={`font-black font-mono-nums ${
                      isSafe
                        ? isDark ? 'text-emerald-400' : 'text-emerald-700'
                        : isDark ? 'text-rose-400' : 'text-rose-700'
                    }`}
                  >
                    <AnimatedNumber value={scenario.lowestBalance} />
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-bold">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                    Initial Outflow:
                  </span>
                  <span
                    className={`font-mono-nums ${
                      isDark ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    ₹{scenario.upfrontPayment.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-bold">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                    Monthly Run:
                  </span>
                  <span
                    className={`font-mono-nums ${
                      isDark ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {scenario.monthlyCommitment > 0
                      ? `₹${scenario.monthlyCommitment.toLocaleString('en-IN')}/mo`
                      : '₹0'}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-center">
                  <span
                    className={`w-full py-2 rounded-xl text-xs font-black text-center transition-all cursor-pointer shadow-sm ${
                      isSelected
                        ? 'bg-indigo-500 text-white shadow-indigo-500/30'
                        : isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                    }`}
                  >
                    {isSelected ? '✓ Active Simulation' : 'Simulate This'}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

