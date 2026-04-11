import type { AuthPayload, UserProfile } from "@finduo/types";
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

  private async fetchProfile(userId: string, email: string): Promise<UserProfile> {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, avatar_url, created_at")
      .eq("id", userId)
      .single();

    if (error || !data) {
      throw new AppError("No se pudo cargar el perfil del usuario", 500, error?.message);
    }

    return this.mapProfile(data satisfies ProfileRow, email);
  }

  async register(payload: RegisterInput): Promise<AuthPayload> {
    const { data: createdUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      email_confirm: true,
      user_metadata: {
        full_name: payload.fullName
      }
    });

    if (createUserError || !createdUser.user) {
      throw new AppError("No se pudo registrar el usuario", 400, createUserError?.message);
    }

    const { error: profileError } = await supabaseAdmin.from("profiles").upsert(
      {
        id: createdUser.user.id,
        full_name: payload.fullName,
        avatar_url: null
      },
      {
        onConflict: "id"
      }
    );

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(createdUser.user.id);
      throw new AppError("No se pudo crear el perfil del usuario", 400, profileError.message);
    }

    return this.login({
      email: payload.email,
      password: payload.password
    });
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

    const user = await this.fetchProfile(data.user.id, data.user.email ?? payload.email);

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

    const user = await this.fetchProfile(data.user.id, data.user.email ?? "");

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
