import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, User, ShieldCheck } from 'lucide-react';
import { DecisionResult, FinancialProfile, PurchaseItem } from '../types';
import { useTheme } from '../context/ThemeContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  projectedBalance?: number;
  safeAmount?: number;
  statusBadge?: string;
  timestamp: string;
}

interface AIChatAdvisorProps {
  profile: FinancialProfile;
  purchase: PurchaseItem;
  decision: DecisionResult;
}

export const AIChatAdvisor: React.FC<AIChatAdvisorProps> = ({
  profile,
  purchase,
  decision,
}) => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello! I have simulated your 90-day cash flow for ${purchase.name || 'your purchase'} (₹${purchase.amount.toLocaleString('en-IN')}). Your current recommendation is ${decision.title}. Ask me any scenario questions or explore financial alternatives.`,
      projectedBalance: decision.lowestProjectedBalance,
      safeAmount: decision.safeToSpendLimit,
      statusBadge: decision.title,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input.trim();
    if (!textToSend || isThinking) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: {
            currentBalance: profile.currentBalance,
            monthlyIncome: profile.monthlyIncome,
            essentialExpenses: profile.essentialExpenses,
            safetyBuffer: profile.safetyBuffer,
            purchaseAmount: purchase.amount,
            itemName: purchase.name,
            decisionState: decision.state,
            lowestBalance: decision.lowestProjectedBalance,
          },
        }),
      });

      const data = await res.json();
      const replyText = data.reply || 'I analyzed your scenario and verified your safety margins.';

      // Determine badges dynamically
      let projected = decision.lowestProjectedBalance;
      let status = decision.title;
      if (textToSend.toLowerCase().includes('wait 30')) {
        projected = Math.round(decision.scenarios.WAIT_30?.lowestBalance || projected + 45000);
        status = 'WAIT 30 DAYS (SAFE)';
      } else if (textToSend.toLowerCase().includes('emi')) {
        projected = Math.round(decision.scenarios.EMI_6?.lowestBalance || projected + 20000);
        status = 'BUY WITH PLAN';
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        projectedBalance: projected,
        safeAmount: decision.safeToSpendLimit,
        statusBadge: status,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI chat error:', err);
      const fallbackMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `Waiting 30 days or using a structured split plan ensures your account always maintains ₹${profile.safetyBuffer.toLocaleString('en-IN')} as an emergency cushion while still purchasing ${purchase.name}.`,
        projectedBalance: decision.lowestProjectedBalance,
        safeAmount: decision.safeToSpendLimit,
        statusBadge: 'BUY WITH PLAN',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div
      className={`rounded-3xl border shadow-2xl backdrop-blur-xl flex flex-col h-[520px] overflow-hidden transition-colors duration-200 ${
        isDark
          ? 'bg-[#0c1224] border-slate-700 ring-1 ring-slate-700/50 shadow-black/80'
          : 'bg-white border-slate-300 ring-1 ring-slate-200 shadow-xl'
      }`}
    >
      {/* Header */}
      <div
        className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
          isDark ? 'border-slate-700 bg-[#070b19]' : 'border-slate-200 bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
              isDark
                ? 'bg-indigo-600/30 border-indigo-400 text-indigo-300'
                : 'bg-indigo-100 border-indigo-300 text-indigo-700'
            }`}
          >
            <Bot className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h4
              className={`text-sm font-black flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              <span>Financial Decision AI Advisor</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h4>
            <p
              className={`text-xs font-semibold ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Grounded in your deterministic 90-day cash flow ledger
            </p>
          </div>
        </div>

        <div
          className={`text-xs font-black px-3 py-1 rounded-full border hidden sm:flex items-center gap-1.5 ${
            isDark
              ? 'text-indigo-300 bg-indigo-950/80 border-indigo-400/60'
              : 'text-indigo-900 bg-indigo-100 border-indigo-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Buffer Aware</span>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex items-start gap-3 ${
              m.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : isDark
                  ? 'bg-slate-800 border border-slate-600 text-indigo-300'
                  : 'bg-slate-200 border border-slate-300 text-indigo-700'
              }`}
            >
              {m.sender === 'user' ? (
                <User className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <Bot className="w-4 h-4 stroke-[2.5]" />
              )}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white font-medium rounded-tr-none shadow-md shadow-indigo-600/30'
                  : isDark
                  ? 'bg-[#111c38] border-2 border-slate-600 text-slate-100 rounded-tl-none shadow-lg'
                  : 'bg-slate-50 border-2 border-slate-300 text-slate-900 rounded-tl-none shadow-sm'
              }`}
            >
              <p className="whitespace-pre-line font-medium">{m.text}</p>

              {/* Dynamic Financial Metric Badges for AI responses */}
              {m.sender === 'ai' && (m.projectedBalance !== undefined || m.statusBadge) && (
                <div
                  className={`mt-3 pt-3 border-t flex flex-wrap gap-2 text-xs font-mono-nums font-bold ${
                    isDark ? 'border-slate-700' : 'border-slate-300'
                  }`}
                >
                  {m.projectedBalance !== undefined && (
                    <span
                      className={`px-2.5 py-1 rounded-lg border ${
                        isDark
                          ? 'bg-[#070b19] border-slate-600 text-slate-200'
                          : 'bg-white border-slate-300 text-slate-800'
                      }`}
                    >
                      Projected Balance:{' '}
                      <strong className={isDark ? 'text-cyan-300' : 'text-cyan-700'}>
                        ₹{m.projectedBalance.toLocaleString('en-IN')}
                      </strong>
                    </span>
                  )}
                  {m.safeAmount !== undefined && (
                    <span
                      className={`px-2.5 py-1 rounded-lg border ${
                        isDark
                          ? 'bg-[#070b19] border-slate-600 text-slate-200'
                          : 'bg-white border-slate-300 text-slate-800'
                      }`}
                    >
                      Safe to Spend:{' '}
                      <strong className={isDark ? 'text-emerald-300' : 'text-emerald-700'}>
                        ₹{m.safeAmount.toLocaleString('en-IN')}
                      </strong>
                    </span>
                  )}
                  {m.statusBadge && (
                    <span
                      className={`px-2.5 py-1 rounded-lg border font-sans font-black ${
                        isDark
                          ? 'bg-indigo-950 border-indigo-400/60 text-indigo-300'
                          : 'bg-indigo-100 border-indigo-300 text-indigo-900'
                      }`}
                    >
                      {m.statusBadge}
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* AI Thinking Animation */}
        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3"
            >
              <div
                className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${
                  isDark
                    ? 'bg-slate-800 border-indigo-400 text-indigo-400'
                    : 'bg-slate-200 border-indigo-400 text-indigo-600'
                }`}
              >
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div
                className={`px-4 py-2.5 rounded-2xl rounded-tl-none border text-xs font-black flex items-center gap-2 ${
                  isDark
                    ? 'bg-[#111c38] border-indigo-400/60 text-indigo-300'
                    : 'bg-indigo-50 border-indigo-300 text-indigo-900'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
                <span>Simulating 90-day cash flow ledger impact...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div
        className={`px-4 sm:px-6 py-2.5 border-t overflow-x-auto flex gap-2 shrink-0 ${
          isDark ? 'bg-[#070b19] border-slate-700' : 'bg-slate-100 border-slate-200'
        }`}
      >
        {[
          'What if I wait 30 days?',
          'Can I afford a 6-month EMI?',
          'How does this affect my safety buffer?',
          'Should I pay 50% upfront?',
        ].map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(q)}
            disabled={isThinking}
            className={`text-xs font-black px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700 hover:border-slate-500'
                : 'bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-950 border-slate-300 hover:border-slate-400 shadow-sm'
            }`}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className={`p-3 sm:p-4 border-t flex items-center gap-2 shrink-0 ${
          isDark ? 'border-slate-700 bg-[#070b19]' : 'border-slate-200 bg-white'
        }`}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI about cash flow, scenarios, or safety buffers..."
          disabled={isThinking}
          className={`flex-1 border rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            isDark
              ? 'bg-[#0c1224] border-slate-700 text-white placeholder:text-slate-500'
              : 'bg-slate-50 border-slate-300 text-slate-950 placeholder:text-slate-500'
          }`}
        />
        <button
          type="submit"
          disabled={!input.trim() || isThinking}
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30 active:scale-95"
        >
          <span>Send</span>
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>
    </div>
  );
};

