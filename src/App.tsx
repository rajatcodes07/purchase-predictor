import React, { useState, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PurchaseInputBar } from './components/PurchaseInputBar';
import { FinancialRadarAI } from './components/FinancialRadarAI';
import { DecisionCard } from './components/DecisionCard';
import { ScenarioComparison } from './components/ScenarioComparison';
import { CashFlowChart } from './components/CashFlowChart';
import { MoneyFlowDiagram } from './components/MoneyFlowDiagram';
import { SafeSpendGauge } from './components/SafeSpendGauge';
import { SafetyScoreCard } from './components/SafetyScoreCard';
import { PaymentTimeline } from './components/PaymentTimeline';
import { FinancialCardsGrid } from './components/FinancialCardsGrid';
import { AIChatAdvisor } from './components/AIChatAdvisor';
import { ScreenshotUploader } from './components/ScreenshotUploader';

import { FinancialProfile, PurchaseItem, ScenarioType } from './types';
import {
  DEFAULT_PROFILE,
  DEFAULT_PURCHASE,
  evaluateAffordability,
} from './utils/financialEngine';

export default function App() {
  const [profile, setProfile] = useState<FinancialProfile>(DEFAULT_PROFILE);
  const [purchase, setPurchase] = useState<PurchaseItem>(DEFAULT_PURCHASE);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>('BUY_NOW');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // References for scrolling
  const analysisRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Run the deterministic engine on profile & purchase
  const decisionResult = useMemo(() => {
    return evaluateAffordability(profile, purchase);
  }, [profile, purchase]);

  // Current active scenario data
  const currentScenario = decisionResult.scenarios[selectedScenario] || decisionResult.scenarios.BUY_NOW;

  // Handler to trigger AI Analysis flow
  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleAnalysisComplete = () => {
    setIsAnalyzing(false);
    // Align selected scenario with AI recommendation on fresh analysis
    if (decisionResult.state === 'BUY_WITH_PLAN') {
      setSelectedScenario('PAY_PARTIALLY');
    } else if (decisionResult.state === 'WAIT') {
      setSelectedScenario('WAIT_30');
    } else {
      setSelectedScenario('BUY_NOW');
    }
  };

  // Quick preset selector
  const handleQuickPreset = (name: string, amount: number, category: string) => {
    setPurchase((prev) => ({
      ...prev,
      name,
      amount,
      category,
    }));
    handleStartAnalysis();
  };

  // Reset to baseline sample
  const handleResetDefaults = () => {
    setProfile(DEFAULT_PROFILE);
    setPurchase(DEFAULT_PURCHASE);
    setSelectedScenario('BUY_NOW');
  };

  // Profile update handler
  const handleUpdateProfile = (updated: Partial<FinancialProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // Screenshot scan application
  const handleApplyDetected = (data: Partial<FinancialProfile> & { purchaseAmount?: number }) => {
    if (data.purchaseAmount) {
      setPurchase((prev) => ({ ...prev, amount: data.purchaseAmount! }));
    }
    setProfile((prev) => ({
      ...prev,
      currentBalance: data.currentBalance ?? prev.currentBalance,
      monthlyIncome: data.monthlyIncome ?? prev.monthlyIncome,
      essentialExpenses: data.essentialExpenses ?? prev.essentialExpenses,
      safetyBuffer: data.safetyBuffer ?? prev.safetyBuffer,
    }));
    handleStartAnalysis();
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* 1. Header / Navbar */}
      <Navbar
        safetyBuffer={profile.safetyBuffer}
        onOpenUpload={() => setIsUploadOpen(true)}
        onReset={handleResetDefaults}
      />

      <main className="flex-1">
        {/* 2. Hero Section with Floating Financial Particles */}
        <HeroSection
          purchaseAmount={purchase.amount}
          itemName={purchase.name}
          onQuickPreset={handleQuickPreset}
          onScrollToAnalysis={() => analysisRef.current?.scrollIntoView({ behavior: 'smooth' })}
          onOpenUpload={() => setIsUploadOpen(true)}
        />

        {/* Dashboard Core Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
          {/* 3. Purchase Input Bar with Focus Glow & Confident Action */}
          <section>
            <PurchaseInputBar
              purchase={purchase}
              onChangePurchase={(updated) => setPurchase((prev) => ({ ...prev, ...updated }))}
              onAnalyze={handleStartAnalysis}
              isAnalyzing={isAnalyzing}
              onOpenUpload={() => setIsUploadOpen(true)}
              onResetToDefault={handleResetDefaults}
            />
          </section>

          {/* 4. AI Central Circular Radar Analysis Visualization */}
          <div ref={analysisRef}>
            <AnimatePresence mode="wait">
              {isAnalyzing && (
                <div className="py-6">
                  <FinancialRadarAI
                    isAnalyzing={isAnalyzing}
                    onComplete={handleAnalysisComplete}
                    purchaseAmount={purchase.amount}
                    itemName={purchase.name}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* 5. Main Analysis Output (Shown when not in active radar analysis) */}
          {!isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8 sm:space-y-10"
            >
              {/* Decision Result Card */}
              <section>
                <DecisionCard
                  decision={decisionResult}
                  onSelectScenario={(scen) => setSelectedScenario(scen)}
                  onScrollToTimeline={() =>
                    timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                />
              </section>

              {/* 4-Way Scenario Comparison Engine */}
              <section>
                <ScenarioComparison
                  scenarios={decisionResult.scenarios}
                  selectedScenario={selectedScenario}
                  recommendedScenario={
                    decisionResult.state === 'BUY_WITH_PLAN'
                      ? 'PAY_PARTIALLY'
                      : decisionResult.state === 'WAIT'
                      ? 'WAIT_30'
                      : 'BUY_NOW'
                  }
                  onSelectScenario={(id) => setSelectedScenario(id)}
                  safetyBuffer={profile.safetyBuffer}
                />
              </section>

              {/* 90-Day Animated Cash Flow Forecast Chart */}
              <section>
                <CashFlowChart
                  points={currentScenario.points}
                  minimumBalance={profile.safetyBuffer}
                  scenarioTitle={currentScenario.title}
                />
              </section>

              {/* Visual Money Flow Component */}
              <section>
                <MoneyFlowDiagram
                  currentBalance={profile.currentBalance}
                  monthlyIncome={profile.monthlyIncome}
                  essentialExpenses={profile.essentialExpenses}
                  safetyBuffer={profile.safetyBuffer}
                  purchaseAmount={currentScenario.upfrontPayment}
                  itemName={purchase.name}
                />
              </section>

              {/* Two-Column Analytics: Safe-to-Spend Gauge + Safety Score */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-6 flex flex-col">
                  <SafeSpendGauge
                    safeAmount={decisionResult.safeToSpendLimit}
                    currentBalance={profile.currentBalance}
                    minimumBalance={profile.safetyBuffer}
                  />
                </div>
                <div className="lg:col-span-6 flex flex-col">
                  <SafetyScoreCard
                    score={decisionResult.safetyScore}
                    grade={decisionResult.scoreGrade}
                    factors={decisionResult.scoreFactors}
                  />
                </div>
              </section>

              {/* Installment Payment Timeline (when plan has schedule) */}
              <section ref={timelineRef}>
                <PaymentTimeline
                  schedule={currentScenario.schedule}
                  totalCost={currentScenario.totalCost}
                  scenarioTitle={currentScenario.title}
                />
              </section>

              {/* Interactive Financial Cards Grid (Expand & inline edit) */}
              <section>
                <FinancialCardsGrid
                  profile={profile}
                  safeToSpendLimit={decisionResult.safeToSpendLimit}
                  onUpdateProfile={handleUpdateProfile}
                />
              </section>

              {/* AI Chat Advisor */}
              <section>
                <AIChatAdvisor
                  profile={profile}
                  purchase={purchase}
                  decision={decisionResult}
                />
              </section>
            </motion.div>
          )}
        </div>
      </main>

      {/* 6. Screenshot Upload Modal */}
      <ScreenshotUploader
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onApplyDetected={handleApplyDetected}
      />

      {/* 7. Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-center text-xs text-slate-400 space-y-2">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-slate-300">BUY OR WAIT?</span>
            <span className="text-slate-400">— Financial Decision Intelligence</span>
          </div>
          <div className="text-slate-400">
            Deterministic Engine • 90-Day Cash Flow Simulation • Zero Speculative Overrides
          </div>
        </div>
        <p className="text-[11px] text-slate-400 max-w-2xl mx-auto pt-2">
          Calculations are deterministic based on your input cash flow, obligations, and safety thresholds. Always maintain your personal emergency reserves.
        </p>
      </footer>
    </div>
  );
}
