import type { ApiResponse, UserProfile } from "@finduo/types";
import { api } from "../../../lib/api";

interface AuthApiData {
  user: UserProfile;
  session: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number | null;
  } | null;
}

export const authService = {
  async login(payload: { email: string; password: string }) {
    const response = await api.post<ApiResponse<AuthApiData>>("/auth/login", payload);
    return response.data.data;
  },
  async register(payload: { email: string; password: string; fullName: string }) {
    const response = await api.post<ApiResponse<AuthApiData>>("/auth/register", payload);
    return response.data.data;
  },
  async refresh(refreshToken: string) {
    const response = await api.post<ApiResponse<AuthApiData>>("/auth/refresh", { refreshToken });
    return response.data.data;
  },
  async logout() {
    const response = await api.post<ApiResponse<{ revoked: boolean }>>("/auth/logout", {});
    return response.data.data;
  }
};
