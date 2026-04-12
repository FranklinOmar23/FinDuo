import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "../../config/supabase.js";
import { AppError } from "../errors/AppError.js";

interface CoupleContextRow {
  id: string;
  savings_percent: number;
  is_solo: boolean;
}

export interface ActiveCoupleContext {
  coupleId: string;
  savingsPercent: number;
  isSolo: boolean;
}

const buildInviteCode = () => randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();

const getUserDisplayName = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from("app_users")
    .select("full_name")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new AppError("No se pudo consultar el usuario actual", 500, error.message);
  }

  return typeof data?.full_name === "string" && data.full_name.trim().length > 0 ? data.full_name.trim() : "Mi espacio";
};

const createSoloWorkspaceContext = async (userId: string): Promise<ActiveCoupleContext> => {
  const displayName = await getUserDisplayName(userId);
  let attempt = 0;

  while (attempt < 3) {
    const inviteCode = buildInviteCode();
    const { data: couple, error: coupleError } = await supabaseAdmin
      .from("couples")
      .insert({
        name: displayName,
        owner_id: userId,
        invite_code: inviteCode,
        is_solo: true,
        savings_percent: 10
      })
      .select("id, savings_percent, is_solo")
      .single();

    if (coupleError) {
      if (coupleError.code === "23505") {
        attempt += 1;
        continue;
      }

      throw new AppError("No se pudo activar tu espacio personal", 400, coupleError.message);
    }

    const { error: membershipError } = await supabaseAdmin.from("couple_members").insert({
      couple_id: couple.id,
      user_id: userId,
      role: "owner"
    });

    if (membershipError) {
      await supabaseAdmin.from("couples").delete().eq("id", couple.id);
      throw new AppError("No se pudo vincular tu espacio personal", 400, membershipError.message);
    }

    return {
      coupleId: couple.id,
      savingsPercent: couple.savings_percent,
      isSolo: couple.is_solo
    };
  }

  throw new AppError("No se pudo generar un espacio personal válido", 500);
};

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
    return createSoloWorkspaceContext(userId);
  }

  const { data: couple, error: coupleError } = await supabaseAdmin
    .from("couples")
    .select("id, savings_percent, is_solo")
    .eq("id", membership.couple_id)
    .single();

  if (coupleError) {
    if (coupleError.code !== "PGRST116") {
      throw new AppError("No se pudo obtener la configuración de la pareja", 404, coupleError.message);
    }

    await supabaseAdmin.from("couple_members").delete().eq("user_id", userId).eq("couple_id", membership.couple_id);
    return createSoloWorkspaceContext(userId);
  }

  if (!couple) {
    return createSoloWorkspaceContext(userId);
  }

  const typedCouple = couple as CoupleContextRow;

  return {
    coupleId: typedCouple.id,
    savingsPercent: typedCouple.savings_percent,
    isSolo: typedCouple.is_solo
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