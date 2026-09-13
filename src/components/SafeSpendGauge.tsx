import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';
import { useTheme } from '../context/ThemeContext';

interface SafeSpendGaugeProps {
  safeAmount: number;
  currentBalance: number;
  minimumBalance: number;
}

export const SafeSpendGauge: React.FC<SafeSpendGaugeProps> = ({
  safeAmount,
  currentBalance,
  minimumBalance,
}) => {
  const { isDark } = useTheme();

  // Gauge calculation: Arc from 150 deg to 390 deg (240 deg sweep)
  const totalBalance = Math.max(currentBalance, 1);
  const ratio = Math.min(1, Math.max(0, safeAmount / totalBalance));

  // Angles
  const startAngle = 150;
  const sweep = 240;
  const currentAngle = startAngle + ratio * sweep;

  const cx = 150;
  const cy = 135;
  const r = 95;

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  const bgArc = describeArc(cx, cy, r, startAngle, startAngle + sweep);
  const activeArc = describeArc(cx, cy, r, startAngle, Math.max(startAngle + 1, currentAngle));

  // Needle end point
  const needleEnd = polarToCartesian(cx, cy, r - 15, currentAngle);

  return (
    <div
      className={`rounded-3xl border p-6 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-between text-center relative overflow-hidden transition-colors duration-200 ${
        isDark
          ? 'bg-[#0c1224] border-slate-700 ring-1 ring-slate-700/50 shadow-black/80'
          : 'bg-white border-slate-300 ring-1 ring-slate-200 shadow-xl'
      }`}
    >
      <div className="w-full flex items-center justify-between gap-2 mb-2">
        <span
          className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
            isDark ? 'text-slate-300' : 'text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Safe-to-Pay Gauge
        </span>
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-black border ${
            isDark
              ? 'text-emerald-300 bg-emerald-950/80 border-emerald-500/50'
              : 'text-emerald-800 bg-emerald-100 border-emerald-300'
          }`}
        >
          Zero Debt Risk
        </span>
      </div>

      {/* SVG Radial Gauge */}
      <div className="relative w-[300px] h-[190px]">
        <svg viewBox="0 0 300 210" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="60%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Background Track Arc (High Contrast) */}
          <path
            d={bgArc}
            fill="none"
            stroke={isDark ? '#334155' : '#cbd5e1'}
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Reserved Buffer Zone (first ~30% of arc) */}
          <path
            d={describeArc(cx, cy, r, startAngle, startAngle + (minimumBalance / totalBalance) * sweep)}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="8"
            strokeDasharray="4 2"
            opacity={isDark ? '0.7' : '0.5'}
          />

          {/* Animated Active Safe Value Arc */}
          <motion.path
            d={activeArc}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {/* Needle pivot circle */}
          <circle
            cx={cx}
            cy={cy}
            r="9"
            fill="#06b6d4"
            stroke={isDark ? '#050814' : '#ffffff'}
            strokeWidth="2.5"
          />

          {/* Needle Line */}
          <motion.line
            x1={cx}
            y1={cy}
            x2={needleEnd.x}
            y2={needleEnd.y}
            stroke="#06b6d4"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#needleGlow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        </svg>

        {/* Center Display Value */}
        <div className="absolute top-[80px] inset-x-0 flex flex-col items-center justify-center">
          <div
            className={`text-xs font-black uppercase tracking-widest ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Safe To Pay Today
          </div>
          <div
            className={`text-3xl sm:text-4xl font-black font-mono-nums tracking-tight mt-0.5 ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
          >
            <AnimatedNumber value={safeAmount} />
          </div>
          <div
            className={`text-xs font-black mt-0.5 ${
              isDark ? 'text-emerald-400' : 'text-emerald-700'
            }`}
          >
            Buffer Remains Intact
          </div>
        </div>
      </div>

      {/* Metrics breakdown footer */}
      <div
        className={`grid grid-cols-2 gap-3 w-full mt-3 pt-3 border-t text-left ${
          isDark ? 'border-slate-700' : 'border-slate-200'
        }`}
      >
        <div
          className={`p-3 rounded-2xl border ${
            isDark
              ? 'bg-[#070b19] border-slate-700'
              : 'bg-slate-50 border-slate-300'
          }`}
        >
          <div
            className={`text-[11px] font-bold uppercase ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Current Balance
          </div>
          <div
            className={`text-sm font-black font-mono-nums mt-0.5 ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
          >
            ₹{currentBalance.toLocaleString('en-IN')}
          </div>
        </div>
        <div
          className={`p-3 rounded-2xl border ${
            isDark
              ? 'bg-[#070b19] border-slate-700'
              : 'bg-slate-50 border-slate-300'
          }`}
        >
          <div
            className={`text-[11px] font-bold uppercase ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Safety Reserve
          </div>
          <div
            className={`text-sm font-black font-mono-nums mt-0.5 ${
              isDark ? 'text-indigo-400' : 'text-indigo-700'
            }`}
          >
            ₹{minimumBalance.toLocaleString('en-IN')}
          </div>
        </div>
      </div>
    </div>
  );
};

