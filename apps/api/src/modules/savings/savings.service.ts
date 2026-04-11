import type { SavingsGoal } from "@finduo/types";
import { supabaseAdmin } from "../../config/supabase.js";
import { AppError } from "../../shared/errors/AppError.js";
import { getActiveCoupleContext, getMonthRange } from "../../shared/utils/financeContext.js";
import { INTERNAL_SAVINGS_EXPENSE_PREFIX } from "./savings.constants.js";

interface SavingsGoalRow {
  id: string;
  couple_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  created_at: string;
}

export class SavingsService {
  private buildInternalTransferNote(goalId: string, goalName: string) {
    return `${INTERNAL_SAVINGS_EXPENSE_PREFIX}:${goalId}:${goalName}`;
  }

  private async createInternalTransferExpense(coupleId: string, userId: string, goalId: string, goalName: string, amount: number) {
    if (amount <= 0) {
      return;
    }

    const { error } = await supabaseAdmin.from("expenses").insert({
      couple_id: coupleId,
      user_id: userId,
      amount,
      category: "otros",
      note: this.buildInternalTransferNote(goalId, goalName),
      expense_date: new Date().toISOString().slice(0, 10)
    });

    if (error) {
      throw new AppError("No se pudo registrar el abono de ahorro", 400, error.message);
    }
  }

  private mapGoal(row: SavingsGoalRow): SavingsGoal {
    return {
      id: row.id,
      coupleId: row.couple_id,
      name: row.name,
      targetAmount: row.target_amount,
      currentAmount: row.current_amount,
      deadline: row.deadline,
      createdAt: row.created_at,
      updatedAt: row.created_at
    };
  }

  async listGoals(userId: string) {
    const context = await getActiveCoupleContext(userId);
    const { data, error } = await supabaseAdmin
      .from("savings_goals")
      .select("id, couple_id, name, target_amount, current_amount, deadline, created_at")
      .eq("couple_id", context.coupleId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new AppError("No se pudieron obtener las metas", 500, error.message);
    }

    return (data as SavingsGoalRow[]).map((row) => this.mapGoal(row));
  }

  async createGoal(payload: {
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
  }, userId: string) {
    const context = await getActiveCoupleContext(userId);
    const { data, error } = await supabaseAdmin
      .from("savings_goals")
      .insert({
        couple_id: context.coupleId,
        name: payload.name,
        target_amount: payload.targetAmount,
        current_amount: payload.currentAmount,
        deadline: payload.deadline ? payload.deadline.slice(0, 10) : null
      })
      .select("id, couple_id, name, target_amount, current_amount, deadline, created_at")
      .single();

    if (error || !data) {
      throw new AppError("No se pudo crear la meta", 400, error?.message);
    }

    await this.createInternalTransferExpense(context.coupleId, userId, data.id, data.name, payload.currentAmount);

    return this.mapGoal(data as SavingsGoalRow);
  }

  async updateAmount(userId: string, id: string, payload: { currentAmount: number }) {
    const context = await getActiveCoupleContext(userId);
    const { data: existingGoal, error: existingGoalError } = await supabaseAdmin
      .from("savings_goals")
      .select("id, couple_id, name, target_amount, current_amount, deadline, created_at")
      .eq("id", id)
      .eq("couple_id", context.coupleId)
      .single();

    if (existingGoalError || !existingGoal) {
      throw new AppError("No se pudo encontrar la meta para actualizarla", 404, existingGoalError?.message);
    }

    const depositAmount = Math.max(payload.currentAmount - existingGoal.current_amount, 0);
    const { data, error } = await supabaseAdmin
      .from("savings_goals")
      .update({
        current_amount: payload.currentAmount
      })
      .eq("id", id)
      .eq("couple_id", context.coupleId)
      .select("id, couple_id, name, target_amount, current_amount, deadline, created_at")
      .single();

    if (error || !data) {
      throw new AppError("No se pudo actualizar el monto de la meta", 400, error?.message);
    }

    await this.createInternalTransferExpense(context.coupleId, userId, id, data.name, depositAmount);

    return this.mapGoal(data as SavingsGoalRow);
  }

  async getManualSavingsForMonth(userId: string, month?: string) {
    const context = await getActiveCoupleContext(userId);
    const range = getMonthRange(month);
    const { data, error } = await supabaseAdmin
      .from("expenses")
      .select("amount")
      .eq("couple_id", context.coupleId)
      .like("note", `${INTERNAL_SAVINGS_EXPENSE_PREFIX}%`)
      .gte("expense_date", range.start.toISOString().slice(0, 10))
      .lt("expense_date", range.end.toISOString().slice(0, 10));

    if (error) {
      throw new AppError("No se pudieron obtener los abonos a metas", 500, error.message);
    }

    return (data as Array<{ amount: number }>).reduce((sum, item) => sum + item.amount, 0);
  }

  async deleteGoal(userId: string, id: string) {
    const context = await getActiveCoupleContext(userId);
    const { error } = await supabaseAdmin
      .from("savings_goals")
      .delete()
      .eq("id", id)
      .eq("couple_id", context.coupleId);

    if (error) {
      throw new AppError("No se pudo eliminar la meta", 400, error.message);
    }

    return {
      id,
      deleted: true
    };
  }
}

export const savingsService = new SavingsService();
