import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Calendar, ShieldCheck, CreditCard } from 'lucide-react';
import { PaymentScheduleItem } from '../types';
import { AnimatedNumber } from './AnimatedNumber';
import { useTheme } from '../context/ThemeContext';

interface PaymentTimelineProps {
  schedule: PaymentScheduleItem[];
  totalCost: number;
  scenarioTitle: string;
}

export const PaymentTimeline: React.FC<PaymentTimelineProps> = ({
  schedule,
  totalCost,
  scenarioTitle,
}) => {
  const { isDark } = useTheme();
  const [selectedItem, setSelectedItem] = useState<PaymentScheduleItem | null>(
    schedule[0] || null
  );

  if (!schedule || schedule.length === 0) {
    return (
      <div
        className={`p-6 text-center rounded-2xl border font-semibold text-xs ${
          isDark
            ? 'text-slate-400 bg-[#0c1224] border-slate-700'
            : 'text-slate-600 bg-white border-slate-300'
        }`}
      >
        No installment schedule required for upfront payment.
      </div>
    );
  }

  return (
    <div
      className={`rounded-3xl border p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-colors duration-200 ${
        isDark
          ? 'bg-[#0c1224] border-slate-700 ring-1 ring-slate-700/50 shadow-black/80'
          : 'bg-white border-slate-300 ring-1 ring-slate-200 shadow-xl'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h3
              className={`text-lg sm:text-2xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              Payment & Installment Timeline
            </h3>
            <span
              className={`text-xs px-3 py-1 rounded-full font-black border ${
                isDark
                  ? 'bg-teal-950/80 border-teal-400/60 text-teal-300'
                  : 'bg-teal-100 border-teal-300 text-teal-900'
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
            Sequential breakdown of scheduled outflows. Click any installment node to inspect cash reserves.
          </p>
        </div>

        <div className="text-right shrink-0">
          <div
            className={`text-xs font-black uppercase ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Total Commitment
          </div>
          <div
            className={`text-xl sm:text-2xl font-black font-mono-nums ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
          >
            <AnimatedNumber value={totalCost} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sequential Timeline Nodes */}
        <div className="lg:col-span-7 relative pl-6 sm:pl-8 space-y-4">
          {/* Continuous vertical timeline trunk */}
          <div className="absolute left-3 sm:left-4 top-2 bottom-6 w-1 bg-gradient-to-b from-indigo-500 via-teal-400 to-emerald-400 rounded-full" />

          {schedule.map((item, index) => {
            const isSelected = selectedItem?.id === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                onClick={() => setSelectedItem(item)}
                className={`relative group cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? isDark
                      ? 'bg-[#121e3d] border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.3)] translate-x-1'
                      : 'bg-teal-50 border-teal-500 shadow-lg translate-x-1'
                    : isDark
                    ? 'bg-[#080d1e] border-slate-700 hover:border-slate-500 hover:bg-[#0c142b]'
                    : 'bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                {/* Node indicator on vertical line */}
                <div
                  className={`absolute -left-[27px] sm:-left-[35px] top-5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${
                    isSelected
                      ? 'bg-teal-400 border-white text-slate-950 scale-110 shadow-lg shadow-teal-400/50'
                      : isDark
                      ? 'bg-slate-900 border-teal-400 text-teal-300'
                      : 'bg-white border-teal-600 text-teal-800'
                  }`}
                >
                  {index + 1}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <div
                        className={`text-sm font-black transition-colors ${
                          isSelected
                            ? isDark ? 'text-teal-300' : 'text-teal-900'
                            : isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {item.label}
                      </div>
                      <div
                        className={`text-xs flex items-center gap-1 mt-0.5 font-mono-nums font-semibold ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{item.dateStr}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-base font-black font-mono-nums ${
                        isDark ? 'text-white' : 'text-slate-950'
                      }`}
                    >
                      ₹{item.amount.toLocaleString('en-IN')}
                    </div>
                    <div
                      className={`text-xs font-bold font-mono-nums ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      Remaining: ₹{item.remainingDue.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* COMPLETE TERMINAL NODE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: schedule.length * 0.08 }}
            className="relative flex items-center gap-3 pt-2"
          >
            <div className="absolute -left-[27px] sm:-left-[35px] w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-slate-950 shadow-md">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span
              className={`text-xs font-black tracking-wider uppercase pl-3 ${
                isDark ? 'text-emerald-400' : 'text-emerald-700'
              }`}
            >
              All Installments Cleared • 100% Complete
            </span>
          </motion.div>
        </div>

        {/* Node Detail Inspector Panel */}
        <div
          className={`lg:col-span-5 border p-5 rounded-2xl ${
            isDark
              ? 'bg-[#070b19] border-slate-700'
              : 'bg-slate-50 border-slate-300'
          }`}
        >
          <div
            className={`text-xs font-black uppercase tracking-wider mb-4 flex items-center gap-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            <CreditCard className="w-4 h-4 text-indigo-400" />
            <span>Installment Detail Inspection</span>
          </div>

          {selectedItem ? (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border ${
                  isDark
                    ? 'bg-[#0c1224] border-slate-700'
                    : 'bg-white border-slate-300'
                }`}
              >
                <div
                  className={`text-xs font-bold uppercase ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Milestone
                </div>
                <div
                  className={`text-base font-black mt-0.5 ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  {selectedItem.label}
                </div>
                <div className="text-xs font-black text-indigo-400 font-mono-nums mt-0.5">
                  Due {selectedItem.dateStr}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div
                  className={`p-3.5 rounded-xl border ${
                    isDark
                      ? 'bg-[#0c1224] border-slate-700'
                      : 'bg-white border-slate-300'
                  }`}
                >
                  <div
                    className={`text-[11px] font-bold uppercase ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    Payment Outflow
                  </div>
                  <div className="text-lg font-black text-teal-400 font-mono-nums mt-0.5">
                    ₹{selectedItem.amount.toLocaleString('en-IN')}
                  </div>
                </div>

                <div
                  className={`p-3.5 rounded-xl border ${
                    isDark
                      ? 'bg-[#0c1224] border-slate-700'
                      : 'bg-white border-slate-300'
                  }`}
                >
                  <div
                    className={`text-[11px] font-bold uppercase ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    Remaining Obligation
                  </div>
                  <div
                    className={`text-lg font-black font-mono-nums mt-0.5 ${
                      isDark ? 'text-slate-200' : 'text-slate-900'
                    }`}
                  >
                    ₹{selectedItem.remainingDue.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isDark
                    ? 'bg-indigo-950/60 border-indigo-400/50'
                    : 'bg-indigo-50 border-indigo-300'
                }`}
              >
                <div
                  className={`text-xs font-black ${
                    isDark ? 'text-slate-200' : 'text-indigo-950'
                  }`}
                >
                  Projected Account Liquidity
                </div>
                <div
                  className={`text-2xl font-black font-mono-nums mt-1 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-700'
                  }`}
                >
                  ₹{selectedItem.projectedBalanceAfter.toLocaleString('en-IN')}
                </div>
                <div
                  className={`text-xs font-bold mt-1.5 flex items-center gap-1.5 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Always above safety reserve floor (₹25,000)</span>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`text-sm font-semibold py-8 text-center ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Click any installment node to inspect the cash buffer impact.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

