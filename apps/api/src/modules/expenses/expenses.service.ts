import type { Expense, ExpenseCategory } from "@finduo/types";
import { supabaseAdmin } from "../../config/supabase.js";
import { INTERNAL_SAVINGS_EXPENSE_PREFIX } from "../savings/savings.constants.js";
import { AppError } from "../../shared/errors/AppError.js";
import { getActiveCoupleContext, getMonthRange } from "../../shared/utils/financeContext.js";

interface ExpenseRow {
  id: string;
  couple_id: string;
  user_id: string;
  amount: number;
  category: ExpenseCategory;
  note: string | null;
  expense_date: string;
  created_at: string;
}

export class ExpensesService {
  private mapExpense(row: ExpenseRow): Expense {
    return {
      id: row.id,
      coupleId: row.couple_id,
      userId: row.user_id,
      title: row.note ?? row.category,
      amount: row.amount,
      category: row.category,
      expenseDate: row.expense_date,
      createdAt: row.created_at
    };
  }

  async listExpenses(userId: string, filters: { month?: string; category?: string }) {
    const context = await getActiveCoupleContext(userId);
    const range = getMonthRange(filters.month);

    let query = supabaseAdmin
      .from("expenses")
      .select("id, couple_id, user_id, amount, category, note, expense_date, created_at")
      .eq("couple_id", context.coupleId)
      .not("note", "like", `${INTERNAL_SAVINGS_EXPENSE_PREFIX}%`)
      .gte("expense_date", range.start.toISOString().slice(0, 10))
      .lt("expense_date", range.end.toISOString().slice(0, 10))
      .order("expense_date", { ascending: false });

    if (filters.category) {
      query = query.eq("category", filters.category);
    }

    const { data, error } = await query;

    if (error) {
      throw new AppError("No se pudieron obtener los gastos", 500, error.message);
    }

    return (data as ExpenseRow[]).map((row) => this.mapExpense(row));
  }

  async createExpense(userId: string, payload: { title: string; amount: number; category: string; expenseDate: string }) {
    const context = await getActiveCoupleContext(userId);
    const { data, error } = await supabaseAdmin
      .from("expenses")
      .insert({
        couple_id: context.coupleId,
        user_id: userId,
        amount: payload.amount,
        category: payload.category,
        note: payload.title,
        expense_date: payload.expenseDate.slice(0, 10)
      })
      .select("id, couple_id, user_id, amount, category, note, expense_date, created_at")
      .single();

    if (error || !data) {
      throw new AppError("No se pudo registrar el gasto", 400, error?.message);
    }

    return this.mapExpense(data as ExpenseRow);
  }

  async deleteExpense(userId: string, id: string) {
    const context = await getActiveCoupleContext(userId);
    const { error } = await supabaseAdmin
      .from("expenses")
      .delete()
      .eq("id", id)
      .eq("couple_id", context.coupleId);

    if (error) {
      throw new AppError("No se pudo eliminar el gasto", 400, error.message);
    }

    return {
      id,
      deleted: true
    };
  }
}

export const expensesService = new ExpensesService();
