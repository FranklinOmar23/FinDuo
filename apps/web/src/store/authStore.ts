import type { UserProfile } from "@finduo/types";
import { create } from "zustand";

const STORAGE_KEY = "finduo-auth";

interface StoredAuthState {
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  user: UserProfile | null;
}

const loadInitialState = (): StoredAuthState => {
  if (typeof window === "undefined") {
    return {
      token: null,
      refreshToken: null,
      expiresAt: null,
      user: null
    };
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return {
      token: null,
      refreshToken: null,
      expiresAt: null,
      user: null
    };
  }

  try {
    return JSON.parse(rawValue) as StoredAuthState;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return {
      token: null,
      refreshToken: null,
      expiresAt: null,
      user: null
    };
  }
};

const persistState = (state: StoredAuthState) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  user: UserProfile | null;
  setSession: (session: { accessToken: string; refreshToken: string; expiresAt: number | null }, user: UserProfile) => void;
  clearSession: () => void;
}

const initialState = loadInitialState();

export const useAuthStore = create<AuthState>((set) => ({
  token: initialState.token,
  refreshToken: initialState.refreshToken,
  expiresAt: initialState.expiresAt,
  user: initialState.user,
  setSession: (session, user) => {
    persistState({ token: session.accessToken, refreshToken: session.refreshToken, expiresAt: session.expiresAt, user });
    set({ token: session.accessToken, refreshToken: session.refreshToken, expiresAt: session.expiresAt, user });
  },
  clearSession: () => {
    persistState({ token: null, refreshToken: null, expiresAt: null, user: null });
    set({ token: null, refreshToken: null, expiresAt: null, user: null });
  }
}));
