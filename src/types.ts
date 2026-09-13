export type DecisionState =
  | 'BUY_NOW'
  | 'BUY_WITH_PLAN'
  | 'WAIT'
  | 'DONT_PROCEED'
  | 'NEED_MORE_INFO';

export type ScenarioType =
  | 'BUY_NOW'
  | 'WAIT_30'
  | 'PAY_PARTIALLY'
  | 'EMI_6';

export interface FinancialCommitment {
  id: string;
  name: string;
  amount: number;
  dueDay: number; // 1-31
  category: 'rent' | 'utility' | 'emi' | 'insurance' | 'subscription' | 'other';
}

export interface FinancialProfile {
  currentBalance: number;
  monthlyIncome: number;
  incomeDay: number; // Day of month (e.g., 1st or 30th)
  essentialExpenses: number; // Fixed baseline expenses per month
  safetyBuffer: number; // Minimum required safe balance floor
  upcomingCommitments: FinancialCommitment[];
}

export interface PurchaseItem {
  name: string;
  amount: number;
  category: string;
  necessity: 'essential' | 'upgrade' | 'want' | 'investment';
  notes?: string;
}

export interface CashFlowPoint {
  day: number;
  dateLabel: string;
  projectedBalance: number;
  minimumBalance: number;
  incomeDelta: number;
  expenseDelta: number;
  purchasePayment: number;
  isUnsafe: boolean;
  eventDescription?: string;
}

export interface PaymentScheduleItem {
  id: string;
  label: string;
  dateStr: string;
  amount: number;
  remainingDue: number;
  projectedBalanceAfter: number;
  status: 'pending' | 'due' | 'complete';
}

export interface ScenarioResult {
  id: ScenarioType;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  lowestBalance: number;
  safetyMargin: number; // lowestBalance - safetyBuffer
  isSafe: boolean;
  decisionState: DecisionState;
  upfrontPayment: number;
  monthlyCommitment: number;
  durationMonths: number;
  totalCost: number;
  description: string;
  points: CashFlowPoint[];
  schedule: PaymentScheduleItem[];
}

export interface SafetyScoreFactor {
  type: 'positive' | 'negative';
  text: string;
  weight: number;
}

export interface DecisionResult {
  state: DecisionState;
  title: string;
  subtitle: string;
  safetyScore: number; // 0-100
  scoreGrade: string; // e.g., 'Excellent', 'Comfortable', 'Tight', 'Dangerous'
  scoreFactors: SafetyScoreFactor[];
  safeToSpendLimit: number;
  lowestProjectedBalance: number;
  recommendationReason: string;
  detailedAnalysis: string[];
  recommendedScenario: ScenarioType;
  selectedScenario: ScenarioType;
  scenarios: Record<ScenarioType, ScenarioResult>;
}

export interface AnalysisStage {
  id: number;
  label: string;
  nodeKey: 'balance' | 'income' | 'expenses' | 'commitments' | 'payments' | 'forecast' | 'purchase';
  durationMs: number;
}
