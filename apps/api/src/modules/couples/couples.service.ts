import { randomUUID } from "node:crypto";
import type { CoupleMemberSummary, CoupleSummary } from "@finduo/types";
import { supabaseAdmin } from "../../config/supabase.js";
import { AppError } from "../../shared/errors/AppError.js";

interface CoupleRow {
  id: string;
  name: string;
  invite_code: string;
  savings_percent: number;
  created_at: string;
}

interface CoupleMemberRow {
  user_id: string;
  role: string;
}

interface UserNameRow {
  id: string;
  full_name: string | null;
}

const buildInviteCode = () => {
  return randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
};

export class CouplesService {
  private mapCouple(couple: CoupleRow, members: CoupleMemberSummary[]): CoupleSummary {
    return {
      id: couple.id,
      name: couple.name,
      inviteCode: couple.invite_code,
      savingsPercent: couple.savings_percent,
      membersCount: members.length,
      members
    };
  }

  private async getMembers(coupleId: string) {
    const { data, error } = await supabaseAdmin
      .from("couple_members")
      .select("user_id, role")
      .eq("couple_id", coupleId);

    if (error) {
      throw new AppError("No se pudo cargar los integrantes de la pareja", 500, error.message);
    }

    const members = (data as CoupleMemberRow[] | null) ?? [];
    const memberIds = members.map((member) => member.user_id);

    if (memberIds.length === 0) {
      return [];
    }

    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("app_users")
      .select("id, full_name")
      .in("id", memberIds);

    if (profilesError) {
      const { data: legacyProfiles, error: legacyProfilesError } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name")
        .in("id", memberIds);

      if (legacyProfilesError) {
        throw new AppError("No se pudieron cargar los perfiles de la pareja", 500, legacyProfilesError.message);
      }

      const profileMap = new Map(
        ((legacyProfiles as UserNameRow[] | null) ?? []).map((profile) => [profile.id, profile.full_name ?? null])
      );

      return members.map((member) => ({
        userId: member.user_id,
        fullName: profileMap.get(member.user_id) ?? null,
        role: member.role
      }));
    }

    const profileMap = new Map(
      ((profiles as UserNameRow[] | null) ?? []).map((profile) => [profile.id, profile.full_name ?? null])
    );

    return members.map((member) => ({
      userId: member.user_id,
      fullName: profileMap.get(member.user_id) ?? null,
      role: member.role
    }));
  }

  private async findMembership(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("couple_members")
      .select("id, couple_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new AppError("No se pudo consultar la membresía actual", 500, error.message);
    }

    return data;
  }

  private async getCoupleById(coupleId: string) {
    const { data, error } = await supabaseAdmin
      .from("couples")
      .select("id, name, invite_code, savings_percent, created_at")
      .eq("id", coupleId)
      .single();

    if (error || !data) {
      throw new AppError("No se pudo obtener la pareja", 404, error?.message);
    }

    return data as CoupleRow;
  }

  async createCouple(userId: string, payload: { name: string; savingsPercent: number }) {
    const existingMembership = await this.findMembership(userId);

    if (existingMembership) {
      throw new AppError("Ya perteneces a una pareja", 409);
    }

    let attempt = 0;

    while (attempt < 3) {
      const inviteCode = buildInviteCode();
      const { data: couple, error: coupleError } = await supabaseAdmin
        .from("couples")
        .insert({
          name: payload.name,
          owner_id: userId,
          invite_code: inviteCode,
          savings_percent: payload.savingsPercent
        })
        .select("id, name, invite_code, savings_percent, created_at")
        .single();

      if (coupleError) {
        if (coupleError.code === "23505") {
          attempt += 1;
          continue;
        }

        throw new AppError("No se pudo crear la pareja", 400, coupleError.message);
      }

      const { error: memberError } = await supabaseAdmin.from("couple_members").insert({
        couple_id: couple.id,
        user_id: userId,
        role: "owner"
      });

      if (memberError) {
        await supabaseAdmin.from("couples").delete().eq("id", couple.id);
        throw new AppError("No se pudo registrar al creador en la pareja", 400, memberError.message);
      }

      const members = await this.getMembers(couple.id);
      return this.mapCouple(couple as CoupleRow, members);
    }

    throw new AppError("No se pudo generar un código de invitación único", 500);
  }

  async getMyCouple(userId: string) {
    const membership = await this.findMembership(userId);

    if (!membership) {
      return null;
    }

    const couple = await this.getCoupleById(String(membership.couple_id));
    const members = await this.getMembers(couple.id);

    return this.mapCouple(couple, members);
  }

  async joinCouple(userId: string, payload: { inviteCode: string }) {
    const existingMembership = await this.findMembership(userId);

    if (existingMembership) {
      throw new AppError("Ya perteneces a una pareja", 409);
    }

    const { data: couple, error } = await supabaseAdmin
      .from("couples")
      .select("id, name, invite_code, savings_percent, created_at")
      .eq("invite_code", payload.inviteCode)
      .single();

    if (error || !couple) {
      throw new AppError("Código de invitación inválido", 404, error?.message);
    }

    const { error: memberError } = await supabaseAdmin.from("couple_members").insert({
      couple_id: couple.id,
      user_id: userId,
      role: "partner"
    });

    if (memberError) {
      throw new AppError("No se pudo unir a la pareja", 400, memberError.message);
    }

    const members = await this.getMembers(couple.id);
    return this.mapCouple(couple as CoupleRow, members);
  }

  async updateSavingsPercent(
    coupleId: string,
    payload: { savingsPercent: number }
  ) {
    const { data, error } = await supabaseAdmin
      .from("couples")
      .update({
        savings_percent: payload.savingsPercent
      })
      .eq("id", coupleId)
      .select("id, name, invite_code, savings_percent, created_at")
      .single();

    if (error || !data) {
      throw new AppError("No se pudo actualizar el porcentaje de ahorro", 400, error?.message);
    }

    const members = await this.getMembers(coupleId);
    return this.mapCouple(data as CoupleRow, members);
  }
}

export const couplesService = new CouplesService();
