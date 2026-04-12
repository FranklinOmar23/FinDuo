import type { AuthPayload, UserProfile } from "@finduo/types";
import type { User } from "@supabase/supabase-js";
import { supabase, supabaseAdmin } from "../../config/supabase.js";
import { AppError } from "../../shared/errors/AppError.js";
import type { LoginInput, LogoutInput, RefreshInput, RegisterInput } from "./auth.schema.js";

interface ProfileRow {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export class AuthService {
  private mapProfile(profile: ProfileRow, email: string): UserProfile {
    return {
      id: profile.id,
      email,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
      coupleId: null,
      createdAt: profile.created_at,
      updatedAt: profile.created_at
    };
  }

  private mapAuthUser(user: User, email: string): UserProfile {
    const fullName =
      typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null;
    const avatarUrl =
      typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : null;

    return {
      id: user.id,
      email,
      fullName,
      avatarUrl,
      coupleId: null,
      createdAt: user.created_at,
      updatedAt: user.updated_at ?? user.created_at
    };
  }

  private async fetchProfile(user: User, email: string): Promise<UserProfile> {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, avatar_url, created_at")
      .eq("id", user.id)
      .maybeSingle();

    if (error || !data) {
      return this.mapAuthUser(user, email);
    }

    return this.mapProfile(data satisfies ProfileRow, email);
  }

  private async ensureProfile(user: User, fullName: string | null) {
    await supabaseAdmin.from("profiles").upsert(
      {
        id: user.id,
        full_name: fullName,
        avatar_url: null
      },
      {
        onConflict: "id"
      }
    );
  }

  async register(payload: RegisterInput): Promise<AuthPayload> {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          full_name: payload.fullName
        }
      }
    });

    if (signUpError || !signUpData.user) {
      throw new AppError("No se pudo registrar el usuario", 400, signUpError?.message);
    }

    await this.ensureProfile(signUpData.user, payload.fullName);

    if (!signUpData.session) {
      return this.login({
        email: payload.email,
        password: payload.password
      });
    }

    const user = await this.fetchProfile(signUpData.user, signUpData.user.email ?? payload.email);

    return {
      user,
      session: {
        accessToken: signUpData.session.access_token,
        refreshToken: signUpData.session.refresh_token,
        expiresAt: signUpData.session.expires_at ?? null
      }
    };
  }

  async login(payload: LoginInput): Promise<AuthPayload> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password
    });

    if (error) {
      throw new AppError("Credenciales inválidas", 401, error.message);
    }

    if (!data.user || !data.session) {
      throw new AppError("No se pudo iniciar sesión", 401);
    }

    await this.ensureProfile(
      data.user,
      typeof data.user.user_metadata?.full_name === "string" ? data.user.user_metadata.full_name : null
    );

    const user = await this.fetchProfile(data.user, data.user.email ?? payload.email);

    return {
      user,
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at ?? null
      }
    };
  }

  async refreshSession(payload: RefreshInput): Promise<AuthPayload> {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: payload.refreshToken
    });

    if (error) {
      throw new AppError("No se pudo renovar la sesión", 401, error.message);
    }

    if (!data.user || !data.session) {
      throw new AppError("La sesión ya no es válida", 401);
    }

    await this.ensureProfile(
      data.user,
      typeof data.user.user_metadata?.full_name === "string" ? data.user.user_metadata.full_name : null
    );

    const user = await this.fetchProfile(data.user, data.user.email ?? "");

    return {
      user,
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at ?? null
      }
    };
  }

  async logout(payload: LogoutInput) {
    // TODO: implementar invalidación real de refresh token si se requiere.
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new AppError("No se pudo cerrar sesión", 400, error.message);
    }

    return {
      revoked: true,
      refreshToken: payload.refreshToken ?? null
    };
  }
}

export const authService = new AuthService();
