import React, { useState, useId } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { CashFlowPoint } from '../types';
import { useTheme } from '../context/ThemeContext';

interface CashFlowChartProps {
  points: CashFlowPoint[];
  minimumBalance: number;
  scenarioTitle: string;
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({
  points,
  minimumBalance,
  scenarioTitle,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const filterId = useId();
  const { isDark } = useTheme();

  if (!points || points.length === 0) {
    return (
      <div
        className={`p-8 text-center rounded-2xl border ${
          isDark ? 'text-slate-400 bg-slate-900 border-slate-700' : 'text-slate-600 bg-white border-slate-300'
        }`}
      >
        No forecast data points available.
      </div>
    );
  }

  // Chart coordinate math
  const width = 800;
  const height = 340;
  const padding = { top: 30, right: 30, bottom: 50, left: 65 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Compute min & max balance to scale Y axis nicely
  const allBalances = points.map((p) => p.projectedBalance);
  allBalances.push(minimumBalance);
  allBalances.push(0);

  const rawMin = Math.min(...allBalances);
  const rawMax = Math.max(...allBalances);

  // Round min/max to nearest 10,000
  const yMin = Math.floor(Math.min(0, rawMin - 10000) / 10000) * 10000;
  const yMax = Math.ceil((rawMax + 15000) / 10000) * 10000;
  const yRange = yMax - yMin || 1;

  const getX = (index: number) => {
    return padding.left + (index / (points.length - 1)) * chartW;
  };

  const getY = (val: number) => {
    const norm = (val - yMin) / yRange;
    return padding.top + (1 - norm) * chartH;
  };

  const minSafeY = getY(minimumBalance);

  // Generate SVG Path for line
  const linePoints = points.map((p, i) => `${getX(i)},${getY(p.projectedBalance)}`);
  const linePath = `M ${linePoints.join(' L ')}`;

  // Area under path down to bottom of chart
  const areaPath = `${linePath} L ${getX(points.length - 1)},${padding.top + chartH} L ${getX(0)},${padding.top + chartH} Z`;

  // Determine if there are unsafe dips
  const unsafeDips = points.filter((p) => p.isUnsafe);
  const hasUnsafe = unsafeDips.length > 0;

  // Active hover point
  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];
  const activeX = hoverIndex !== null ? getX(hoverIndex) : getX(points.length - 1);
  const activeY = hoverIndex !== null ? getY(activePoint.projectedBalance) : getY(activePoint.projectedBalance);

  return (
    <div
      className={`rounded-3xl border p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative transition-colors duration-200 ${
        isDark
          ? 'bg-[#0c1224] border-slate-700 shadow-black/80 ring-1 ring-slate-700/50'
          : 'bg-white border-slate-300 shadow-xl ring-1 ring-slate-200'
      }`}
    >
      {/* Header with legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h3
              className={`text-lg sm:text-2xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              90-Day Cash Flow Projection
            </h3>
            <span
              className={`text-xs px-3 py-1 rounded-full font-black border ${
                isDark
                  ? 'bg-indigo-950/80 border-indigo-400/60 text-indigo-300 shadow-sm'
                  : 'bg-indigo-100 border-indigo-300 text-indigo-900'
              }`}
            >
              {scenarioTitle}
            </span>
          </div>
          <p
            className={`text-xs sm:text-sm font-semibold mt-1 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Progressive simulation factoring salary cycles, fixed obligations, and purchase impact
          </p>
        </div>

        {/* High-Contrast Legend */}
        <div className="flex items-center gap-4 text-xs font-bold flex-wrap">
          <div
            className={`flex items-center gap-1.5 ${
              isDark ? 'text-cyan-300' : 'text-cyan-800'
            }`}
          >
            <span className="w-3.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <span>Projected Balance</span>
          </div>
          <div
            className={`flex items-center gap-1.5 ${
              isDark ? 'text-indigo-300' : 'text-indigo-800'
            }`}
          >
            <span className="w-3.5 h-0.5 border-b-2 border-dashed border-indigo-400" />
            <span>Safety Floor (₹{minimumBalance.toLocaleString('en-IN')})</span>
          </div>
          {hasUnsafe && (
            <div className="flex items-center gap-1 text-rose-500 font-extrabold">
              <ShieldAlert className="w-4 h-4" />
              <span>Unsafe Region</span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div className="relative w-full overflow-x-auto select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[560px] overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            {/* Linear gradient for safe area */}
            <linearGradient id={`gradSafe-${filterId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={isDark ? '0.45' : '0.25'} />
              <stop offset="80%" stopColor="#06b6d4" stopOpacity={isDark ? '0.1' : '0.05'} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>

            {/* Gradient for Unsafe Zone beneath minimum balance */}
            <linearGradient id={`gradUnsafe-${filterId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity={isDark ? '0.45' : '0.25'} />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity={isDark ? '0.1' : '0.05'} />
            </linearGradient>

            {/* Glowing filter */}
            <filter id={`neon-glow-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#06b6d4" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Background Grid Lines & Y-Axis Labels (High Contrast) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const val = yMin + ratio * yRange;
            const y = getY(val);
            return (
              <g key={`y-grid-${i}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke={isDark ? '#334155' : '#cbd5e1'}
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill={isDark ? '#cbd5e1' : '#334155'}
                  fontSize="12"
                  fontWeight="bold"
                  className="font-mono-nums"
                >
                  ₹{Math.round(val / 1000)}k
                </text>
              </g>
            );
          })}

          {/* Unsafe Region Shaded Area Box (below minimum safe buffer) */}
          {minSafeY < padding.top + chartH && (
            <rect
              x={padding.left}
              y={minSafeY}
              width={chartW}
              height={padding.top + chartH - minSafeY}
              fill={`url(#gradUnsafe-${filterId})`}
              className="pointer-events-none"
            />
          )}

          {/* Area Fill Under Projected Balance Line */}
          <path
            d={areaPath}
            fill={`url(#gradSafe-${filterId})`}
            className="transition-all duration-500"
          />

          {/* PERSISTENT MINIMUM SAFE BALANCE REFERENCE LINE */}
          <line
            x1={padding.left}
            y1={minSafeY}
            x2={width - padding.right}
            y2={minSafeY}
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            className="opacity-95"
          />
          <rect
            x={width - padding.right - 160}
            y={minSafeY - 12}
            width="160"
            height="24"
            rx="6"
            fill={isDark ? '#1e1b4b' : '#312e81'}
            stroke="#818cf8"
            strokeWidth="1.5"
            className="shadow-md"
          />
          <text
            x={width - padding.right - 80}
            y={minSafeY + 4}
            textAnchor="middle"
            fill="#ffffff"
            fontSize="11"
            fontWeight="bold"
            letterSpacing="0.04em"
          >
            MIN SAFE: ₹{minimumBalance.toLocaleString('en-IN')}
          </text>

          {/* ANIMATED PROJECTED BALANCE LINE (Glowing & High Contrast) */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#neon-glow-${filterId})`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          {/* Interactive Hover Columns */}
          {points.map((p, i) => {
            const cx = getX(i);
            const cy = getY(p.projectedBalance);

            return (
              <g key={`hit-${i}`}>
                {/* Transparent hit area */}
                <rect
                  x={cx - chartW / points.length / 2}
                  y={padding.top}
                  width={chartW / points.length}
                  height={chartH}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                />

                {/* Milestone nodes (Day 0, 30, 60, 90 or payment event) */}
                {(p.day === 0 || p.day === 30 || p.day === 60 || p.day === 90 || p.purchasePayment > 0) && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={p.isUnsafe ? '6' : '5'}
                    fill={p.isUnsafe ? '#f43f5e' : '#06b6d4'}
                    stroke={isDark ? '#050814' : '#ffffff'}
                    strokeWidth="2.5"
                    className="pointer-events-none transition-transform"
                  />
                )}
              </g>
            );
          })}

          {/* Active Hover Crosshair Line */}
          {hoverIndex !== null && (
            <g className="pointer-events-none">
              <line
                x1={activeX}
                y1={padding.top}
                x2={activeX}
                y2={padding.top + chartH}
                stroke={isDark ? '#e2e8f0' : '#0f172a'}
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <circle
                cx={activeX}
                cy={activeY}
                r="8"
                fill={activePoint.isUnsafe ? '#f43f5e' : '#06b6d4'}
                stroke="#ffffff"
                strokeWidth="3"
                className="shadow-xl"
              />
            </g>
          )}

          {/* X-Axis Date Labels (High Contrast) */}
          {points.map((p, i) => {
            if (p.day === 0 || p.day === 30 || p.day === 60 || p.day === 90) {
              const x = getX(i);
              return (
                <text
                  key={`x-label-${i}`}
                  x={x}
                  y={padding.top + chartH + 25}
                  textAnchor="middle"
                  fill={isDark ? '#e2e8f0' : '#1e293b'}
                  fontSize="12"
                  fontWeight="bold"
                  className="font-mono-nums"
                >
                  {p.dateLabel}
                </text>
              );
            }
            return null;
          })}
        </svg>
      </div>

      {/* Dynamic Hover Tooltip Banner (High-Contrast) */}
      <div
        className={`mt-4 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
          isDark ? 'border-slate-700' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`font-black font-mono-nums ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
          >
            {activePoint.dateLabel} (Day {activePoint.day})
          </span>
          <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>•</span>
          <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Projected:</span>
          <span
            className={`font-black font-mono-nums text-base ${
              activePoint.isUnsafe
                ? isDark ? 'text-rose-400' : 'text-rose-600'
                : isDark ? 'text-cyan-300' : 'text-cyan-700'
            }`}
          >
            ₹{activePoint.projectedBalance.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {activePoint.isUnsafe ? (
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-black ${
                isDark
                  ? 'bg-rose-950 border-rose-500 text-rose-300 glow-rose'
                  : 'bg-rose-100 border-rose-400 text-rose-800'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>
                Safety Deficit: -₹
                {Math.abs(minimumBalance - activePoint.projectedBalance).toLocaleString('en-IN')}
              </span>
            </div>
          ) : (
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-black ${
                isDark
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300 glow-emerald'
                  : 'bg-emerald-100 border-emerald-400 text-emerald-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>
                Buffer Surplus: +₹
                {(activePoint.projectedBalance - minimumBalance).toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {activePoint.eventDescription && (
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-200'
                  : 'bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              {activePoint.eventDescription}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

