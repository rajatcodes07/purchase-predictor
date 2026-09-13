import {
  CashFlowPoint,
  DecisionResult,
  DecisionState,
  FinancialProfile,
  PaymentScheduleItem,
  PurchaseItem,
  SafetyScoreFactor,
  ScenarioResult,
  ScenarioType,
} from '../types';

export const DEFAULT_PROFILE: FinancialProfile = {
  currentBalance: 85000,
  monthlyIncome: 75000,
  incomeDay: 1, // 1st of month
  essentialExpenses: 28000, // rent, food, utilities
  safetyBuffer: 25000, // minimum untouched emergency floor
  upcomingCommitments: [
    { id: 'c1', name: 'Apartment Rent & Society', amount: 18000, dueDay: 5, category: 'rent' },
    { id: 'c2', name: 'Broadband & Utilities', amount: 2400, dueDay: 12, category: 'utility' },
    { id: 'c3', name: 'Personal Health & Life SIP', amount: 5000, dueDay: 15, category: 'insurance' },
    { id: 'c4', name: 'Cloud & Tech Subscriptions', amount: 1299, dueDay: 22, category: 'subscription' },
  ],
};

export const DEFAULT_PURCHASE: PurchaseItem = {
  name: 'Apple MacBook Air M3',
  amount: 75000,
  category: 'Electronics',
  necessity: 'upgrade',
  notes: 'Productivity and remote work workstation upgrade',
};

// 7 Real processing stages for AI Analysis Visualization
export const AI_ANALYSIS_STAGES = [
  { id: 1, label: 'Understanding purchase details...', nodeKey: 'purchase', durationMs: 400 },
  { id: 2, label: 'Checking available liquid balance...', nodeKey: 'balance', durationMs: 450 },
  { id: 3, label: 'Analyzing recurring living expenses...', nodeKey: 'expenses', durationMs: 450 },
  { id: 4, label: 'Checking upcoming payment commitments...', nodeKey: 'commitments', durationMs: 450 },
  { id: 5, label: 'Forecasting 90-day daily cash flow...', nodeKey: 'forecast', durationMs: 500 },
  { id: 6, label: 'Comparing payment & EMI options...', nodeKey: 'payments', durationMs: 450 },
  { id: 7, label: 'Generating verified recommendation...', nodeKey: 'income', durationMs: 400 },
] as const;

/**
 * Deterministic 90-day Daily Cash Flow Forecaster
 */
export function simulateCashFlow(
  profile: FinancialProfile,
  purchase: PurchaseItem,
  scenario: ScenarioType
): { points: CashFlowPoint[]; schedule: PaymentScheduleItem[] } {
  const points: CashFlowPoint[] = [];
  const schedule: PaymentScheduleItem[] = [];

  let runningBalance = profile.currentBalance;
  const daysTotal = 90;
  const today = new Date();

  // Prepare purchase payment triggers
  const purchaseCost = Math.max(0, purchase.amount);
  const paymentEvents = new Map<number, { amount: number; label: string }>();

  if (purchaseCost > 0) {
    if (scenario === 'BUY_NOW') {
      paymentEvents.set(0, { amount: purchaseCost, label: 'Upfront Purchase (100%)' });
      schedule.push({
        id: 'p1',
        label: 'Upfront Full Settlement',
        dateStr: 'Today',
        amount: purchaseCost,
        remainingDue: 0,
        projectedBalanceAfter: runningBalance - purchaseCost,
        status: 'pending',
      });
    } else if (scenario === 'WAIT_30') {
      paymentEvents.set(30, { amount: purchaseCost, label: 'Deferred Purchase after Salary' });
      schedule.push({
        id: 'p1',
        label: 'Post-Salary Settlement',
        dateStr: '+30 Days',
        amount: purchaseCost,
        remainingDue: 0,
        projectedBalanceAfter: 0, // computed during loop
        status: 'pending',
      });
    } else if (scenario === 'PAY_PARTIALLY') {
      // 3 Splits: 34%, 33%, 33%
      const p1 = Math.round(purchaseCost * 0.34);
      const p2 = Math.round(purchaseCost * 0.33);
      const p3 = purchaseCost - p1 - p2;
      paymentEvents.set(0, { amount: p1, label: 'Down Payment (34%)' });
      paymentEvents.set(30, { amount: p2, label: 'Split 2 of 3 (33%)' });
      paymentEvents.set(60, { amount: p3, label: 'Final Split (33%)' });

      schedule.push(
        { id: 's1', label: 'Down Payment', dateStr: 'Today', amount: p1, remainingDue: p2 + p3, projectedBalanceAfter: 0, status: 'pending' },
        { id: 's2', label: 'Second Tranche', dateStr: '+30 Days', amount: p2, remainingDue: p3, projectedBalanceAfter: 0, status: 'pending' },
        { id: 's3', label: 'Final Tranche', dateStr: '+60 Days', amount: p3, remainingDue: 0, projectedBalanceAfter: 0, status: 'pending' }
      );
    } else if (scenario === 'EMI_6') {
      // 6 installments (including 4% nominal processing/interest)
      const totalWithFinancing = Math.round(purchaseCost * 1.035);
      const monthlyEmi = Math.round(totalWithFinancing / 6);
      paymentEvents.set(0, { amount: monthlyEmi, label: 'EMI 1/6 (Initial)' });
      paymentEvents.set(30, { amount: monthlyEmi, label: 'EMI 2/6' });
      paymentEvents.set(60, { amount: monthlyEmi, label: 'EMI 3/6' });
      // Next 3 are beyond 90 days, but first 3 hit the 90-day window

      let due = totalWithFinancing;
      for (let i = 1; i <= 6; i++) {
        due -= monthlyEmi;
        schedule.push({
          id: `emi-${i}`,
          label: `EMI Instalment ${i}/6`,
          dateStr: i === 1 ? 'Today' : `+${(i - 1) * 30} Days`,
          amount: monthlyEmi,
          remainingDue: Math.max(0, due),
          projectedBalanceAfter: 0,
          status: 'pending',
        });
      }
    }
  }

  // Daily essential rate excluding fixed commitments
  const dailyDiscretionaryBurn = Math.max(0, (profile.essentialExpenses * 0.4) / 30);

  for (let day = 0; day <= daysTotal; day++) {
    const d = new Date(today);
    d.setDate(d.getDate() + day);
    const dayOfMonth = d.getDate();
    const dateLabel = day === 0 ? 'Today' : day === 30 ? '+30d' : day === 60 ? '+60d' : day === 90 ? '+90d' : `Day ${day}`;

    let incomeDelta = 0;
    let expenseDelta = 0;
    let purchasePayment = 0;
    let eventDescription = '';

    // Check income (salary day)
    // Runs on dayOfMonth matching incomeDay or every 30 days
    if (day > 0 && (dayOfMonth === profile.incomeDay || day === 30 || day === 60)) {
      incomeDelta += profile.monthlyIncome;
      eventDescription = 'Monthly Salary Credit';
    }

    // Daily living expense
    expenseDelta += dailyDiscretionaryBurn;

    // Fixed upcoming commitments
    profile.upcomingCommitments.forEach((commit) => {
      if (dayOfMonth === commit.dueDay) {
        expenseDelta += commit.amount;
        eventDescription = eventDescription ? `${eventDescription}, ${commit.name}` : commit.name;
      }
    });

    // Purchase payment on this day
    if (paymentEvents.has(day)) {
      const pEvent = paymentEvents.get(day)!;
      purchasePayment += pEvent.amount;
      eventDescription = eventDescription ? `${eventDescription} + ${pEvent.label}` : pEvent.label;
    }

    runningBalance = runningBalance + incomeDelta - expenseDelta - purchasePayment;
    const isUnsafe = runningBalance < profile.safetyBuffer;

    // Sample every 2-3 days for chart smoothness, but always keep key milestone days
    const isKeyDay = day === 0 || day === 30 || day === 60 || day === 90 || paymentEvents.has(day) || incomeDelta > 0;
    if (isKeyDay || day % 3 === 0) {
      points.push({
        day,
        dateLabel,
        projectedBalance: Math.round(runningBalance),
        minimumBalance: profile.safetyBuffer,
        incomeDelta: Math.round(incomeDelta),
        expenseDelta: Math.round(expenseDelta),
        purchasePayment: Math.round(purchasePayment),
        isUnsafe,
        eventDescription: eventDescription || undefined,
      });
    }

    // Update schedule projected balance snapshot
    if (scenario === 'BUY_NOW' && day === 0 && schedule[0]) {
      schedule[0].projectedBalanceAfter = Math.round(runningBalance);
    } else if (scenario === 'WAIT_30' && day === 30 && schedule[0]) {
      schedule[0].projectedBalanceAfter = Math.round(runningBalance);
    } else if (scenario === 'PAY_PARTIALLY') {
      if (day === 0 && schedule[0]) schedule[0].projectedBalanceAfter = Math.round(runningBalance);
      if (day === 30 && schedule[1]) schedule[1].projectedBalanceAfter = Math.round(runningBalance);
      if (day === 60 && schedule[2]) schedule[2].projectedBalanceAfter = Math.round(runningBalance);
    } else if (scenario === 'EMI_6') {
      if (day === 0 && schedule[0]) schedule[0].projectedBalanceAfter = Math.round(runningBalance);
      if (day === 30 && schedule[1]) schedule[1].projectedBalanceAfter = Math.round(runningBalance);
      if (day === 60 && schedule[2]) schedule[2].projectedBalanceAfter = Math.round(runningBalance);
    }
  }

  return { points, schedule };
}

/**
 * Builds full analysis comparing all 4 scenarios deterministically
 */
export function analyzePurchase(
  profile: FinancialProfile,
  purchase: PurchaseItem,
  selectedScenario: ScenarioType = 'BUY_NOW'
): DecisionResult {
  // Edge Case: Missing info
  if (!purchase.amount || purchase.amount <= 0 || !profile.monthlyIncome) {
    const emptyPoints: CashFlowPoint[] = [
      { day: 0, dateLabel: 'Today', projectedBalance: profile.currentBalance, minimumBalance: profile.safetyBuffer, incomeDelta: 0, expenseDelta: 0, purchasePayment: 0, isUnsafe: profile.currentBalance < profile.safetyBuffer },
      { day: 90, dateLabel: '+90d', projectedBalance: profile.currentBalance, minimumBalance: profile.safetyBuffer, incomeDelta: 0, expenseDelta: 0, purchasePayment: 0, isUnsafe: profile.currentBalance < profile.safetyBuffer },
    ];
    return {
      state: 'NEED_MORE_INFO',
      title: 'NEED MORE INFORMATION',
      subtitle: 'Enter a valid purchase amount and income to run decision analysis.',
      safetyScore: 50,
      scoreGrade: 'Incomplete Data',
      scoreFactors: [
        { type: 'negative', text: 'Purchase amount is required to run cash flow model', weight: 30 },
      ],
      safeToSpendLimit: Math.max(0, profile.currentBalance - profile.safetyBuffer),
      lowestProjectedBalance: profile.currentBalance,
      recommendationReason: 'We need both an intended purchase price and your monthly income to simulate safety trajectories.',
      detailedAnalysis: ['Please specify your target purchase amount in the input above.'],
      recommendedScenario: 'BUY_NOW',
      selectedScenario: 'BUY_NOW',
      scenarios: {
        BUY_NOW: createScenarioMock('BUY_NOW', emptyPoints, profile.safetyBuffer),
        WAIT_30: createScenarioMock('WAIT_30', emptyPoints, profile.safetyBuffer),
        PAY_PARTIALLY: createScenarioMock('PAY_PARTIALLY', emptyPoints, profile.safetyBuffer),
        EMI_6: createScenarioMock('EMI_6', emptyPoints, profile.safetyBuffer),
      },
    };
  }

  // 1. Compute 4 Scenarios
  const buyNow = simulateCashFlow(profile, purchase, 'BUY_NOW');
  const wait30 = simulateCashFlow(profile, purchase, 'WAIT_30');
  const payPartially = simulateCashFlow(profile, purchase, 'PAY_PARTIALLY');
  const emi6 = simulateCashFlow(profile, purchase, 'EMI_6');

  const buyNowLowest = Math.min(...buyNow.points.map((p) => p.projectedBalance));
  const wait30Lowest = Math.min(...wait30.points.map((p) => p.projectedBalance));
  const payPartiallyLowest = Math.min(...payPartially.points.map((p) => p.projectedBalance));
  const emi6Lowest = Math.min(...emi6.points.map((p) => p.projectedBalance));

  const scenarios: Record<ScenarioType, ScenarioResult> = {
    BUY_NOW: {
      id: 'BUY_NOW',
      title: 'Buy Now',
      subtitle: '100% upfront settlement today',
      badge: buyNowLowest >= profile.safetyBuffer ? 'Safe' : 'Breaches Buffer',
      badgeColor: buyNowLowest >= profile.safetyBuffer ? 'emerald' : 'rose',
      lowestBalance: buyNowLowest,
      safetyMargin: buyNowLowest - profile.safetyBuffer,
      isSafe: buyNowLowest >= profile.safetyBuffer,
      decisionState: buyNowLowest >= profile.safetyBuffer ? 'BUY_NOW' : 'WAIT',
      upfrontPayment: purchase.amount,
      monthlyCommitment: 0,
      durationMonths: 1,
      totalCost: purchase.amount,
      description: 'Clears cost immediately with zero recurring debts or interest.',
      points: buyNow.points,
      schedule: buyNow.schedule,
    },
    WAIT_30: {
      id: 'WAIT_30',
      title: 'Wait 30 Days',
      subtitle: 'Purchase after next pay cycle',
      badge: wait30Lowest >= profile.safetyBuffer ? 'Recommended' : 'Tight',
      badgeColor: wait30Lowest >= profile.safetyBuffer ? 'indigo' : 'amber',
      lowestBalance: wait30Lowest,
      safetyMargin: wait30Lowest - profile.safetyBuffer,
      isSafe: wait30Lowest >= profile.safetyBuffer,
      decisionState: 'WAIT',
      upfrontPayment: 0,
      monthlyCommitment: 0,
      durationMonths: 1,
      totalCost: purchase.amount,
      description: 'Allows your next salary credit to absorb the cost without stressing current reserves.',
      points: wait30.points,
      schedule: wait30.schedule,
    },
    PAY_PARTIALLY: {
      id: 'PAY_PARTIALLY',
      title: 'Pay Partially',
      subtitle: '3 splits (34% down, then 2 monthly)',
      badge: payPartiallyLowest >= profile.safetyBuffer ? 'Balanced' : 'Monitor',
      badgeColor: payPartiallyLowest >= profile.safetyBuffer ? 'teal' : 'amber',
      lowestBalance: payPartiallyLowest,
      safetyMargin: payPartiallyLowest - profile.safetyBuffer,
      isSafe: payPartiallyLowest >= profile.safetyBuffer,
      decisionState: 'BUY_WITH_PLAN',
      upfrontPayment: Math.round(purchase.amount * 0.34),
      monthlyCommitment: Math.round(purchase.amount * 0.33),
      durationMonths: 3,
      totalCost: purchase.amount,
      description: 'Zero interest split keeping liquidity evenly distributed over 60 days.',
      points: payPartially.points,
      schedule: payPartially.schedule,
    },
    EMI_6: {
      id: 'EMI_6',
      title: '6-Month EMI',
      subtitle: 'Even low-impact monthly installments',
      badge: emi6Lowest >= profile.safetyBuffer ? 'Max Liquidity' : 'Caution',
      badgeColor: 'sky',
      lowestBalance: emi6Lowest,
      safetyMargin: emi6Lowest - profile.safetyBuffer,
      isSafe: emi6Lowest >= profile.safetyBuffer,
      decisionState: 'BUY_WITH_PLAN',
      upfrontPayment: Math.round((purchase.amount * 1.035) / 6),
      monthlyCommitment: Math.round((purchase.amount * 1.035) / 6),
      durationMonths: 6,
      totalCost: Math.round(purchase.amount * 1.035),
      description: 'Preserves maximum daily emergency cash with minimal monthly strain.',
      points: emi6.points,
      schedule: emi6.schedule,
    },
  };

  // Safe-to-spend limit (cash available above safety buffer minus next 30d upcoming committed dips)
  const committedNext30 = profile.upcomingCommitments.reduce((sum, c) => sum + c.amount, 0) + (profile.essentialExpenses * 0.4);
  const safeToSpendLimit = Math.max(0, Math.round(profile.currentBalance - profile.safetyBuffer - (committedNext30 * 0.3)));

  // Determine overall best recommendation & state based on deterministic rules
  let finalState: DecisionState = 'BUY_NOW';
  let recommendedScenario: ScenarioType = 'BUY_NOW';
  let recommendationReason = '';
  const detailedAnalysis: string[] = [];

  const netMonthlySurplus = profile.monthlyIncome - profile.essentialExpenses;

  if (buyNowLowest >= profile.safetyBuffer * 1.25) {
    finalState = 'BUY_NOW';
    recommendedScenario = 'BUY_NOW';
    recommendationReason = `Your cash flow easily absorbs ₹${purchase.amount.toLocaleString('en-IN')} upfront while maintaining a healthy ₹${buyNowLowest.toLocaleString('en-IN')} safety cushion.`;
    detailedAnalysis.push('Post-purchase balance remains safely above your emergency buffer at all times.');
    detailedAnalysis.push(`You have zero debt obligation and preserve ₹${Math.round(buyNowLowest - profile.safetyBuffer).toLocaleString('en-IN')} in surplus liquidity.`);
  } else if (buyNowLowest >= profile.safetyBuffer) {
    finalState = 'BUY_NOW';
    recommendedScenario = 'BUY_NOW';
    recommendationReason = `Upfront purchase is feasible, maintaining ₹${buyNowLowest.toLocaleString('en-IN')} (just above your ₹${profile.safetyBuffer.toLocaleString('en-IN')} buffer).`;
    detailedAnalysis.push('Buffer is respected, but liquidity dips close to minimum before next paycheck.');
    detailedAnalysis.push('Consider a 3-part split if unexpected expenses arise this month.');
  } else if (payPartiallyLowest >= profile.safetyBuffer) {
    finalState = 'BUY_WITH_PLAN';
    recommendedScenario = 'PAY_PARTIALLY';
    recommendationReason = `Buying upfront breaches your ₹${profile.safetyBuffer.toLocaleString('en-IN')} buffer. Splitting into 3 tranches protects your daily reserves at ₹${payPartiallyLowest.toLocaleString('en-IN')}.`;
    detailedAnalysis.push(`Upfront payment dips balance to ₹${buyNowLowest.toLocaleString('en-IN')} (unsafe).`);
    detailedAnalysis.push(`3-month installment keeps your lowest balance at ₹${payPartiallyLowest.toLocaleString('en-IN')}, fully safe.`);
  } else if (wait30Lowest >= profile.safetyBuffer && wait30Lowest >= buyNowLowest + 15000) {
    finalState = 'WAIT';
    recommendedScenario = 'WAIT_30';
    recommendationReason = `Waiting 30 days allows your upcoming salary (+₹${profile.monthlyIncome.toLocaleString('en-IN')}) to replenish reserves, keeping your post-purchase buffer at ₹${wait30Lowest.toLocaleString('en-IN')}.`;
    detailedAnalysis.push('Immediate purchase leaves you exposed to immediate bills.');
    detailedAnalysis.push(`In 30 days, your safety margin expands by ₹${Math.round(wait30Lowest - buyNowLowest).toLocaleString('en-IN')}.`);
  } else if (emi6Lowest >= profile.safetyBuffer && netMonthlySurplus >= (purchase.amount / 6) * 1.5) {
    finalState = 'BUY_WITH_PLAN';
    recommendedScenario = 'EMI_6';
    recommendationReason = `A 6-month EMI of ₹${Math.round((purchase.amount * 1.035) / 6).toLocaleString('en-IN')}/mo keeps your daily balance at ₹${emi6Lowest.toLocaleString('en-IN')}.`;
    detailedAnalysis.push('Longer installment schedule keeps your daily emergency fund intact.');
  } else {
    finalState = 'DONT_PROCEED';
    recommendedScenario = 'WAIT_30';
    recommendationReason = `This purchase heavily strains your liquidity. Lowest projected balance drops to ₹${buyNowLowest.toLocaleString('en-IN')}, well below safe thresholds.`;
    detailedAnalysis.push(`Safety buffer breached by ₹${Math.abs(Math.round(profile.safetyBuffer - buyNowLowest)).toLocaleString('en-IN')}.`);
    detailedAnalysis.push('Focus on expanding emergency savings before executing this discretionary spend.');
  }

  // Calculate Affordability Safety Score (0-100)
  const scoreResult = computeAffordabilityScore(profile, purchase, scenarios[selectedScenario].lowestBalance);

  const titles: Record<DecisionState, { title: string; subtitle: string }> = {
    BUY_NOW: {
      title: 'BUY NOW',
      subtitle: 'Safe for immediate upfront purchase. Emergency buffer fully intact.',
    },
    BUY_WITH_PLAN: {
      title: 'BUY WITH PLAN',
      subtitle: 'Upfront payment strains reserves. Structured payment plan keeps you safe.',
    },
    WAIT: {
      title: 'WAIT 30 DAYS',
      subtitle: 'Delaying allows your next salary cycle to restore safety headroom.',
    },
    DONT_PROCEED: {
      title: "DON'T PROCEED",
      subtitle: 'Current cash flow and commitments cannot support this purchase safely.',
    },
    NEED_MORE_INFO: {
      title: 'NEED MORE INFORMATION',
      subtitle: 'Provide financial figures to generate a verified recommendation.',
    },
  };

  return {
    state: finalState,
    title: titles[finalState].title,
    subtitle: titles[finalState].subtitle,
    safetyScore: scoreResult.score,
    scoreGrade: scoreResult.grade,
    scoreFactors: scoreResult.factors,
    safeToSpendLimit,
    lowestProjectedBalance: scenarios[selectedScenario].lowestBalance,
    recommendationReason,
    detailedAnalysis,
    recommendedScenario,
    selectedScenario,
    scenarios,
  };
}

/**
 * Deterministic Affordability Safety Score (0-100)
 */
function computeAffordabilityScore(
  profile: FinancialProfile,
  purchase: PurchaseItem,
  lowestProjectedBalance: number
): { score: number; grade: string; factors: SafetyScoreFactor[] } {
  let score = 70;
  const factors: SafetyScoreFactor[] = [];

  // Factor 1: Lowest Projected Balance vs Safety Buffer
  const bufferMargin = lowestProjectedBalance - profile.safetyBuffer;
  if (bufferMargin >= 30000) {
    score += 15;
    factors.push({ type: 'positive', text: `Robust safety buffer (+₹${bufferMargin.toLocaleString('en-IN')} above floor)`, weight: 15 });
  } else if (bufferMargin >= 0) {
    score += 5;
    factors.push({ type: 'positive', text: 'Preserves minimum required safety buffer', weight: 5 });
  } else if (bufferMargin >= -15000) {
    score -= 20;
    factors.push({ type: 'negative', text: `Breaches safety buffer by ₹${Math.abs(bufferMargin).toLocaleString('en-IN')}`, weight: 20 });
  } else {
    score -= 35;
    factors.push({ type: 'negative', text: `Severe safety buffer deficit of ₹${Math.abs(bufferMargin).toLocaleString('en-IN')}`, weight: 35 });
  }

  // Factor 2: Purchase Size vs Monthly Discretionary Income
  const monthlySurplus = Math.max(1, profile.monthlyIncome - profile.essentialExpenses);
  const costToSurplusRatio = purchase.amount / monthlySurplus;

  if (costToSurplusRatio <= 0.8) {
    score += 10;
    factors.push({ type: 'positive', text: 'Purchase is less than 1 month of net surplus income', weight: 10 });
  } else if (costToSurplusRatio <= 1.5) {
    score += 0;
    factors.push({ type: 'positive', text: 'Manageable against monthly discretionary savings', weight: 0 });
  } else if (costToSurplusRatio > 2.5) {
    score -= 15;
    factors.push({ type: 'negative', text: `Represents ${costToSurplusRatio.toFixed(1)}x your monthly net savings`, weight: 15 });
  }

  // Factor 3: Current Cash Reserve Runway
  const monthlyBurn = profile.essentialExpenses;
  const runwayMonths = profile.currentBalance / (monthlyBurn || 1);
  if (runwayMonths >= 3) {
    score += 10;
    factors.push({ type: 'positive', text: `Healthy liquid runway (${runwayMonths.toFixed(1)} months of living costs)`, weight: 10 });
  } else if (runwayMonths < 1.5) {
    score -= 10;
    factors.push({ type: 'negative', text: `Low initial runway (${runwayMonths.toFixed(1)} months reserve)`, weight: 10 });
  }

  // Factor 4: Fixed commitments vs Income
  const totalCommitments = profile.upcomingCommitments.reduce((sum, c) => sum + c.amount, 0);
  const commitmentRatio = totalCommitments / (profile.monthlyIncome || 1);
  if (commitmentRatio < 0.35) {
    score += 5;
    factors.push({ type: 'positive', text: 'Low debt and recurring obligations (<35% of income)', weight: 5 });
  } else if (commitmentRatio > 0.6) {
    score -= 10;
    factors.push({ type: 'negative', text: 'High fixed commitments due before next pay cycle', weight: 10 });
  }

  // Clamp 0-100
  score = Math.max(5, Math.min(98, Math.round(score)));

  let grade = 'Moderate';
  if (score >= 85) grade = 'Extremely Safe';
  else if (score >= 70) grade = 'Comfortable';
  else if (score >= 50) grade = 'Caution Required';
  else grade = 'High Risk';

  return { score, grade, factors };
}

function createScenarioMock(id: ScenarioType, points: CashFlowPoint[], buffer: number): ScenarioResult {
  return {
    id,
    title: id.replace('_', ' '),
    subtitle: 'Scenario calculation',
    badge: 'Draft',
    badgeColor: 'slate',
    lowestBalance: buffer,
    safetyMargin: 0,
    isSafe: true,
    decisionState: 'NEED_MORE_INFO',
    upfrontPayment: 0,
    monthlyCommitment: 0,
    durationMonths: 1,
    totalCost: 0,
    description: 'Awaiting purchase amount',
    points,
    schedule: [],
  };
}

export const evaluateAffordability = analyzePurchase;
