import api from "@/lib/api";
import { setTokens, clearTokens } from "@/lib/token";

/* ================== TYPES ================== */

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export type UserRole = "admin" | "user";
export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

/* ================== SERVICE ================== */

export const AuthService = {
  register(payload: RegisterRequest) {
    return api.post("auth/register/", payload);
  },

  async login(payload: LoginRequest) {
    const { data } = await api.post<TokenResponse>("auth/login/", payload);
    console.log("LOGIN TOKEN:", data); // ← WAJIB cek
    setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  me(): Promise<User> {
    return api.get("auth/me/").then((res) => res.data);
  },

  refresh() {
    return api.post("auth/refresh/", {
      refresh: localStorage.getItem("refresh_token"),
    });
  },

  logout() {
    clearTokens();
  },
};
