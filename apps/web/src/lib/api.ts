import axios from "axios";
import { useAuthStore } from "../store/authStore";

const apiBaseUrl = import.meta.env.VITE_API_URL?.trim() || "https://finduo.onrender.com/api";
const loginRoute = "/#/login";

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json"
  }
});

let refreshPromise: Promise<string | null> | null = null;

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const authState = useAuthStore.getState();

    if (!originalRequest || status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (typeof originalRequest.url === "string" && originalRequest.url.includes("/auth/refresh")) {
      authState.clearSession();
      return Promise.reject(error);
    }

    if (!authState.refreshToken) {
      authState.clearSession();
      if (typeof window !== "undefined" && window.location.hash !== "#/login") {
        window.location.assign(loginRoute);
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = axios
        .post(`${apiBaseUrl}/auth/refresh`, { refreshToken: authState.refreshToken })
        .then((response) => {
          const data = response.data.data as {
            user: typeof authState.user;
            session: { accessToken: string; refreshToken: string; expiresAt: number | null };
          };

          if (!data.user) {
            throw new Error("No se pudo recuperar el usuario de la sesión renovada");
          }

          useAuthStore.getState().setSession(data.session, data.user);
          return data.session.accessToken;
        })
        .catch((refreshError) => {
          useAuthStore.getState().clearSession();
          if (typeof window !== "undefined" && window.location.hash !== "#/login") {
            window.location.assign(loginRoute);
          }
          throw refreshError;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const newToken = await refreshPromise;

    if (!newToken) {
      return Promise.reject(error);
    }

    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return api(originalRequest);
  }
);
