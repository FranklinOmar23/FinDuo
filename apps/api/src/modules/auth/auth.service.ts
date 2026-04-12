import { randomUUID } from "node:crypto";
import type { AuthPayload, UserProfile } from "@finduo/types";
import { env } from "../../config/env.js";
import { supabaseAdmin } from "../../config/supabase.js";
import { AppError } from "../../shared/errors/AppError.js";
import { hashPassword, verifyPassword } from "../../shared/utils/password.js";
import { createAuthSession, verifyToken } from "../../shared/utils/tokens.js";
import type { LoginInput, LogoutInput, RefreshInput, RegisterInput } from "./auth.schema.js";

interface AppUserRow {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export class AuthService {
  private mapUser(user: AppUserRow): UserProfile {
    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      avatarUrl: user.avatar_url,
      coupleId: null,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private async getUserByEmail(email: string) {
    const { data, error } = await supabaseAdmin
      .from("app_users")
      .select("id, email, password_hash, full_name, avatar_url, created_at, updated_at")
      .eq("email", this.normalizeEmail(email))
      .maybeSingle();

    if (error) {
      throw new AppError("No se pudo consultar el usuario", 500, error.message);
    }

    return (data as AppUserRow | null) ?? null;
  }

  private async getUserById(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("app_users")
      .select("id, email, password_hash, full_name, avatar_url, created_at, updated_at")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      throw new AppError("No se pudo consultar el usuario", 500, error.message);
    }

    return (data as AppUserRow | null) ?? null;
  }

  private buildAuthPayload(user: AppUserRow): AuthPayload {
    return {
      user: this.mapUser(user),
      session: createAuthSession(
        {
          id: user.id,
          email: user.email
        },
        env.SUPABASE_JWT_SECRET,
        env.AUTH_ACCESS_TOKEN_MINUTES,
        env.AUTH_REFRESH_TOKEN_DAYS
      )
    };
  }

  async register(payload: RegisterInput): Promise<AuthPayload> {
    const email = this.normalizeEmail(payload.email);
    const existingUser = await this.getUserByEmail(email);

    if (existingUser) {
      throw new AppError("Ese correo ya está registrado", 409);
    }

    const passwordHash = await hashPassword(payload.password);
    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("app_users")
      .insert({
        id: randomUUID(),
        email,
        password_hash: passwordHash,
        full_name: payload.fullName.trim(),
        avatar_url: null,
        created_at: now,
        updated_at: now
      })
      .select("id, email, password_hash, full_name, avatar_url, created_at, updated_at")
      .single();

    if (error || !data) {
      if (error?.code === "23505") {
        throw new AppError("Ese correo ya está registrado", 409, error.message);
      }

      throw new AppError("No se pudo registrar el usuario", 400, error?.message);
    }

    return this.buildAuthPayload(data as AppUserRow);
  }

  async login(payload: LoginInput): Promise<AuthPayload> {
    const user = await this.getUserByEmail(payload.email);

    if (!user) {
      throw new AppError("Credenciales inválidas", 401, error.message);
    }

    const passwordMatches = await verifyPassword(payload.password, user.password_hash);

    if (!passwordMatches) {
      throw new AppError("Credenciales inválidas", 401);
    };

    return this.buildAuthPayload(user);
  }

  async refreshSession(payload: RefreshInput): Promise<AuthPayload> {
    const tokenPayload = verifyToken(payload.refreshToken, env.SUPABASE_JWT_SECRET, "refresh");
    const user = await this.getUserById(tokenPayload.sub);

    if (!user) {
      throw new AppError("La sesión ya no es válida", 401);
    };

    return this.buildAuthPayload(user);
  }

  async logout(payload: LogoutInput) {
    return {
      revoked: true,
      refreshToken: payload.refreshToken ?? null
    };
  }
}

export const authService = new AuthService();
