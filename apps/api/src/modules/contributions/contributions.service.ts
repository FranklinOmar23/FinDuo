import type { Contribution } from "@finduo/types";
import { supabaseAdmin } from "../../config/supabase.js";
import { AppError } from "../../shared/errors/AppError.js";
import { getActiveCoupleContext, getMonthRange } from "../../shared/utils/financeContext.js";

interface ContributionRow {
  id: string;
  couple_id: string;
  user_id: string;
  amount: number;
  period: string;
  note: string | null;
  created_at: string;
}

export class ContributionsService {
  private mapContribution(row: ContributionRow, savingsPercent: number): Contribution {
    return {
      id: row.id,
      coupleId: row.couple_id,
      userId: row.user_id,
      amount: row.amount,
      savingsReserved: Number(((row.amount * savingsPercent) / 100).toFixed(2)),
      contributionDate: row.created_at,
      note: row.note,
      createdAt: row.created_at
    };
  }

  async listContributions(userId: string, filters: { month?: string }) {
    const context = await getActiveCoupleContext(userId);
    const range = getMonthRange(filters.month);

    const { data, error } = await supabaseAdmin
      .from("contributions")
      .select("id, couple_id, user_id, amount, period, note, created_at")
      .eq("couple_id", context.coupleId)
      .gte("created_at", range.start.toISOString())
      .lt("created_at", range.end.toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      throw new AppError("No se pudieron obtener los aportes", 500, error.message);
    }

    return (data as ContributionRow[]).map((row) => this.mapContribution(row, context.savingsPercent));
  }

  async createContribution(userId: string, payload: { amount: number; contributionDate: string; note?: string }) {
    const context = await getActiveCoupleContext(userId);

    const { data, error } = await supabaseAdmin
      .from("contributions")
      .insert({
        couple_id: context.coupleId,
        user_id: userId,
        amount: payload.amount,
        period: payload.contributionDate.slice(0, 7),
        note: payload.note ?? null
      })
      .select("id, couple_id, user_id, amount, period, note, created_at")
      .single();

    if (error || !data) {
      throw new AppError("No se pudo registrar el aporte", 400, error?.message);
    }

    return this.mapContribution(data as ContributionRow, context.savingsPercent);
  }

  async deleteContribution(userId: string, id: string) {
    const context = await getActiveCoupleContext(userId);
    const { error } = await supabaseAdmin
      .from("contributions")
      .delete()
      .eq("id", id)
      .eq("couple_id", context.coupleId);

    if (error) {
      throw new AppError("No se pudo eliminar el aporte", 400, error.message);
    }

    return {
      id,
      deleted: true
    };
  }
}

export const contributionsService = new ContributionsService();
