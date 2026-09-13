# 💰 Buy or Wait? — AI Financial Affordability Agent

> **Know before you spend.**

Buy or Wait? is an AI-powered financial decision-support agent that determines whether a user can safely afford a requested purchase.

Instead of looking only at the user's current balance, the system analyzes the user's complete financial situation, including income, recurring expenses, essential spending, pending payments, existing commitments, minimum balance requirements, and available payment options.

The system can recommend:

- 🟢 Pay in Full
- 🟡 Pay Partially
- 🔵 Use Installments
- 🕐 Wait
- 🔴 Do Not Proceed

---

## 🚀 Key Features

### 💳 Affordability Analysis

Determines whether a requested purchase is financially safe based on the user's complete financial profile.

### 📊 Cash-Flow Forecasting

Projects the user's balance over time while considering:

- Confirmed income
- Essential expenses
- Recurring expenses
- Pending payments
- Existing commitments
- Purchase payments
- Minimum balance requirements

### 💰 Safe-to-Pay Calculation

Calculates the maximum amount the user can safely pay today while maintaining their required financial buffer.

### 🧾 Payment Plan Analysis

Compares:

- Full payment
- Partial payment
- Installments
- Waiting for future income

Installment plans are evaluated based on both cash-flow safety and total cost.

### 📅 Earliest Safe Purchase Date

Calculates the earliest date on which the user can safely make the full purchase without violating their financial safety constraints.

### 📸 Image & Media Understanding

The system can process relevant local media such as:

- Bank screenshots
- Bills
- Receipts
- Salary information
- Payment schedules

Extracted information is validated before being used in the affordability calculation.

### 🤖 AI Financial Assistant

Users can ask natural-language questions such as:

> "Can I afford this laptop?"

> "What if I wait 30 days?"

> "What if I pay half now?"

> "Which installment plan is safest?"

The AI uses structured financial data and the deterministic calculation engine to answer.

### 🔄 Scenario Comparison

Users can compare different purchasing strategies:

| Scenario | Total Cost | Lowest Balance | Safe? |
|----------|------------|----------------|-------|
| Buy Now | — | — | — |
| Wait 30 Days | — | — | — |
| Pay Partially | — | — | — |
| Installments | — | — | — |

---

# 🧠 System Architecture

The application separates AI reasoning from financial calculations.

```text
                  USER
                    │
                    ▼
          Natural Language Request
                    │
                    ▼
              ┌───────────┐
              │ Gemini AI │
              └─────┬─────┘
                    │
          Extract / Understand Data
                    │
                    ▼
        ┌──────────────────────────┐
        │ Financial Calculation    │
        │ Engine                   │
        ├──────────────────────────┤
        │ • Safe Amount            │
        │ • Cash Flow Forecast     │
        │ • Payment Plans          │
        │ • Date Calculation       │
        │ • Scenario Comparison    │
        └────────────┬─────────────┘
                     │
                     ▼
              Decision Engine
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
     BUY NOW      PLAN          WAIT
                     │
                     ▼
              AI Explanation
