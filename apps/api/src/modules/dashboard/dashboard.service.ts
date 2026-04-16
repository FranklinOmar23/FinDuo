import { expensesService } from "../expenses/expenses.service.js";
import { contributionsService } from "../contributions/contributions.service.js";
import { savingsService } from "../savings/savings.service.js";

export class DashboardService {
  async getMonthlySummary(userId: string, month?: string) {
    const [contributionsResult, expensesResult, savingsGoals, manualSavings] = await Promise.all([
      contributionsService.listContributions(userId, { month }),
      expensesService.listExpenses(userId, { month }),
      savingsService.listGoals(userId),
      savingsService.getManualSavingsForMonth(userId, month)
    ]);

    // Extraer arrays de paginación
    const contributions = contributionsResult.data;
    const expenses = expensesResult.data;

    const totalIncome = contributions.reduce((sum: number, item: any) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum: number, item: any) => sum + item.amount, 0);
    const reservedSavings = contributions.reduce((sum: number, item: any) => sum + item.savingsReserved, 0) + manualSavings;

    return {
      month: month ?? new Date().toISOString().slice(0, 7),
      totalIncome,
      totalExpenses,
      reservedSavings,
      availableToSpend: Math.max(totalIncome - totalExpenses - reservedSavings, 0),
      contributions,
      savingsGoals
    };
  }
}

export const dashboardService = new DashboardService();
