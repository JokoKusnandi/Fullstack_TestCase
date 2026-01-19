import axios from "axios";
import { getAccessToken, clearTokens } from "./token";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor → attach JWT
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor → handle 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 &&
      !error.config.url?.includes("auth/me")) {
      clearTokens();
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default api;
