import type { Contribution } from "./contribution.types.js";
import type { SavingsGoal } from "./savings.types.js";

export interface DashboardSummary {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  reservedSavings: number;
  availableToSpend: number;
  contributions: Contribution[];
  savingsGoals: SavingsGoal[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
