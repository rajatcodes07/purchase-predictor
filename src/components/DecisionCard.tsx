import React from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Split,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { DecisionResult, DecisionState, ScenarioType } from '../types';
import { AnimatedNumber } from './AnimatedNumber';
import { useTheme } from '../context/ThemeContext';

interface DecisionCardProps {
  decision: DecisionResult;
  onSelectScenario: (scenario: ScenarioType) => void;
  onScrollToTimeline: () => void;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({
  decision,
  onSelectScenario,
  onScrollToTimeline,
}) => {
  const { isDark } = useTheme();
  const { state, title, subtitle, lowestProjectedBalance, safetyScore, recommendationReason, detailedAnalysis } = decision;

  // Visual styling variants based on decision state and theme
  const configMap: Record<
    DecisionState,
    {
      bgGradientDark: string;
      bgGradientLight: string;
      borderColorDark: string;
      borderColorLight: string;
      iconBgDark: string;
      iconBgLight: string;
      iconColorDark: string;
      iconColorLight: string;
      badgeText: string;
      badgeDark: string;
      badgeLight: string;
      icon: React.ElementType;
      animationVariant: any;
    }
  > = {
    BUY_NOW: {
      bgGradientDark: 'from-[#06291a] via-[#091b16] to-[#090d18]',
      bgGradientLight: 'from-emerald-50 via-white to-emerald-50/50',
      borderColorDark: 'border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.35)]',
      borderColorLight: 'border-emerald-600 shadow-xl shadow-emerald-500/15',
      iconBgDark: 'bg-emerald-500/25 border-emerald-400',
      iconBgLight: 'bg-emerald-100 border-emerald-400',
      iconColorDark: 'text-emerald-300',
      iconColorLight: 'text-emerald-700',
      badgeText: 'VERIFIED AFFORDABLE • PROCEED SAFELY',
      badgeDark: 'bg-emerald-500 text-slate-950 font-black',
      badgeLight: 'bg-emerald-700 text-white font-black',
      icon: CheckCircle2,
      animationVariant: {
        initial: { scale: 0.94, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: 'spring', stiffness: 220, damping: 20 },
      },
    },
    BUY_WITH_PLAN: {
      bgGradientDark: 'from-[#062632] via-[#081824] to-[#090d18]',
      bgGradientLight: 'from-cyan-50 via-white to-sky-50/50',
      borderColorDark: 'border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.35)]',
      borderColorLight: 'border-cyan-600 shadow-xl shadow-cyan-500/15',
      iconBgDark: 'bg-cyan-500/25 border-cyan-400',
      iconBgLight: 'bg-cyan-100 border-cyan-400',
      iconColorDark: 'text-cyan-300',
      iconColorLight: 'text-cyan-700',
      badgeText: 'AFFORDABLE VIA STRUCTURED PLAN',
      badgeDark: 'bg-cyan-400 text-slate-950 font-black',
      badgeLight: 'bg-cyan-700 text-white font-black',
      icon: Split,
      animationVariant: {
        initial: { x: 25, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        transition: { type: 'spring', stiffness: 200, damping: 22 },
      },
    },
    WAIT: {
      bgGradientDark: 'from-[#2e1804] via-[#1a1107] to-[#090d18]',
      bgGradientLight: 'from-amber-50 via-white to-yellow-50/50',
      borderColorDark: 'border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.35)]',
      borderColorLight: 'border-amber-600 shadow-xl shadow-amber-500/15',
      iconBgDark: 'bg-amber-500/25 border-amber-400',
      iconBgLight: 'bg-amber-100 border-amber-400',
      iconColorDark: 'text-amber-300',
      iconColorLight: 'text-amber-700',
      badgeText: 'RESTORE SAFETY HEADROOM FIRST',
      badgeDark: 'bg-amber-400 text-slate-950 font-black',
      badgeLight: 'bg-amber-700 text-white font-black',
      icon: Clock,
      animationVariant: {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: 'easeOut' },
      },
    },
    DONT_PROCEED: {
      bgGradientDark: 'from-[#310811] via-[#1c080e] to-[#090d18]',
      bgGradientLight: 'from-rose-50 via-white to-red-50/50',
      borderColorDark: 'border-rose-400 shadow-[0_0_35px_rgba(244,63,94,0.35)]',
      borderColorLight: 'border-rose-600 shadow-xl shadow-rose-500/15',
      iconBgDark: 'bg-rose-500/25 border-rose-400',
      iconBgLight: 'bg-rose-100 border-rose-400',
      iconColorDark: 'text-rose-300',
      iconColorLight: 'text-rose-700',
      badgeText: 'HIGH LIQUIDITY DEFICIT RISK',
      badgeDark: 'bg-rose-500 text-slate-950 font-black',
      badgeLight: 'bg-rose-700 text-white font-black',
      icon: AlertTriangle,
      animationVariant: {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.4 },
      },
    },
    NEED_MORE_INFO: {
      bgGradientDark: 'from-indigo-950/40 via-slate-900 to-[#090d18]',
      bgGradientLight: 'from-indigo-50 via-white to-slate-50',
      borderColorDark: 'border-indigo-400/60',
      borderColorLight: 'border-indigo-400',
      iconBgDark: 'bg-indigo-500/25 border-indigo-400',
      iconBgLight: 'bg-indigo-100 border-indigo-400',
      iconColorDark: 'text-indigo-300',
      iconColorLight: 'text-indigo-700',
      badgeText: 'AWAITING PARAMETERS',
      badgeDark: 'bg-indigo-400 text-slate-950 font-black',
      badgeLight: 'bg-indigo-700 text-white font-black',
      icon: HelpCircle,
      animationVariant: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
      },
    },
  };

  const currentCfg = configMap[state];
  const IconComponent = currentCfg.icon;

  const bgGradient = isDark ? currentCfg.bgGradientDark : currentCfg.bgGradientLight;
  const borderColor = isDark ? currentCfg.borderColorDark : currentCfg.borderColorLight;
  const iconBg = isDark ? currentCfg.iconBgDark : currentCfg.iconBgLight;
  const iconColor = isDark ? currentCfg.iconColorDark : currentCfg.iconColorLight;
  const badgeClass = isDark ? currentCfg.badgeDark : currentCfg.badgeLight;

  return (
    <motion.div
      {...currentCfg.animationVariant}
      className={`rounded-3xl bg-gradient-to-b ${bgGradient} border-2 ${borderColor} p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-200`}
    >
      {/* Subtle top ambient specular light */}
      <div className="absolute top-0 right-1/4 w-96 h-36 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div
        className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b ${
          isDark ? 'border-slate-700' : 'border-slate-200'
        }`}
      >
        <div className="flex items-start gap-4 sm:gap-5">
          {/* Animated State Icon */}
          <motion.div
            initial={{ rotate: -15, scale: 0.85 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 15 }}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${iconBg} border-2 flex items-center justify-center shrink-0 shadow-lg`}
          >
            {state === 'BUY_NOW' ? (
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <IconComponent className={`w-9 h-9 sm:w-11 sm:h-11 ${iconColor}`} />
              </motion.div>
            ) : (
              <IconComponent className={`w-9 h-9 sm:w-11 sm:h-11 ${iconColor}`} />
            )}
          </motion.div>

          <div>
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase mb-2 shadow-sm ${badgeClass}`}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-ping" />
              {currentCfg.badgeText}
            </div>
            <h2
              className={`text-2xl sm:text-4xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              {title}
            </h2>
            <p
              className={`text-sm sm:text-base font-semibold mt-1 max-w-xl ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              }`}
            >
              {subtitle}
            </p>
          </div>
        </div>

        {/* Highlight Metric Card with high contrast borders */}
        <div
          className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl shrink-0 w-full md:w-auto justify-between md:justify-start border shadow-lg ${
            isDark
              ? 'bg-[#050814] border-slate-700'
              : 'bg-white border-slate-300'
          }`}
        >
          <div>
            <div
              className={`text-xs font-extrabold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Lowest Projected Balance
            </div>
            <div
              className={`text-2xl sm:text-3xl font-black font-mono-nums ${
                lowestProjectedBalance >= 25000
                  ? isDark ? 'text-emerald-400' : 'text-emerald-700'
                  : isDark ? 'text-amber-400' : 'text-amber-700'
              }`}
            >
              <AnimatedNumber value={lowestProjectedBalance} />
            </div>
            <div
              className={`text-xs font-bold flex items-center gap-1 mt-1 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Safety Floor: ₹25,000</span>
            </div>
          </div>

          <div
            className={`h-12 w-px mx-2 hidden sm:block ${
              isDark ? 'bg-slate-700' : 'bg-slate-200'
            }`}
          />

          <div className="text-right">
            <div
              className={`text-xs font-extrabold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Safety Score
            </div>
            <div
              className={`text-2xl sm:text-3xl font-black font-mono-nums ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              <AnimatedNumber value={safetyScore} prefix="" suffix="/100" />
            </div>
            <div
              className={`text-xs font-extrabold mt-1 ${
                safetyScore >= 80
                  ? isDark ? 'text-emerald-400' : 'text-emerald-700'
                  : isDark ? 'text-amber-400' : 'text-amber-700'
              }`}
            >
              Grade {decision.scoreGrade}
            </div>
          </div>
        </div>
      </div>

      {/* Rationale & Plan actions */}
      <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <div
            className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-indigo-300' : 'text-indigo-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Executive Financial Rationale
          </div>
          <p
            className={`text-sm sm:text-base leading-relaxed font-semibold ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}
          >
            {recommendationReason}
          </p>

          {detailedAnalysis.length > 0 && (
            <ul
              className={`text-xs sm:text-sm space-y-1 pt-1 list-disc list-inside font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {detailedAnalysis.map((item, idx) => (
                <li key={idx} className="leading-snug">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* State-specific CTA button with high contrast */}
        <div className="shrink-0 w-full md:w-auto">
          {state === 'BUY_WITH_PLAN' && (
            <button
              type="button"
              onClick={onScrollToTimeline}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm transition-all shadow-xl shadow-cyan-400/30 active:scale-95 cursor-pointer"
            >
              <span>View Installment Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {state === 'WAIT' && (
            <button
              type="button"
              onClick={() => onSelectScenario('WAIT_30')}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-all shadow-xl shadow-amber-400/30 active:scale-95 cursor-pointer"
            >
              <span>Simulate 30-Day Delay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {state === 'BUY_NOW' && (
            <button
              type="button"
              onClick={() => onSelectScenario('BUY_NOW')}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm transition-all shadow-xl shadow-emerald-400/30 active:scale-95 cursor-pointer"
            >
              <span>Review Immediate Execution</span>
              <TrendingUp className="w-4 h-4" />
            </button>
          )}

          {state === 'DONT_PROCEED' && (
            <button
              type="button"
              onClick={() => onSelectScenario('EMI_6')}
              className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm border transition-all active:scale-95 cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900 shadow-md'
              }`}
            >
              <span>Explore Alternative EMI Plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

