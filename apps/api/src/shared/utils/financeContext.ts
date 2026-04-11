import { supabaseAdmin } from "../../config/supabase.js";
import { AppError } from "../errors/AppError.js";

interface CoupleContextRow {
  id: string;
  savings_percent: number;
}

export interface ActiveCoupleContext {
  coupleId: string;
  savingsPercent: number;
}

export const getActiveCoupleContext = async (userId: string): Promise<ActiveCoupleContext> => {
  const { data: membership, error: membershipError } = await supabaseAdmin
    .from("couple_members")
    .select("couple_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (membershipError) {
    throw new AppError("No se pudo consultar la pareja actual", 500, membershipError.message);
  }

  if (!membership?.couple_id) {
    throw new AppError("Debes unirte o crear una pareja antes de registrar movimientos", 409);
  }

  const { data: couple, error: coupleError } = await supabaseAdmin
    .from("couples")
    .select("id, savings_percent")
    .eq("id", membership.couple_id)
    .single();

  if (coupleError || !couple) {
    throw new AppError("No se pudo obtener la configuración de la pareja", 404, coupleError?.message);
  }

  const typedCouple = couple as CoupleContextRow;

  return {
    coupleId: typedCouple.id,
    savingsPercent: typedCouple.savings_percent
  };
};

export const getMonthRange = (month?: string) => {
  const normalizedMonth = month && /^\d{4}-\d{2}$/.test(month) ? month : new Date().toISOString().slice(0, 7);
  const start = new Date(`${normalizedMonth}-01T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);

  return {
    normalizedMonth,
    start,
    end
  };
};