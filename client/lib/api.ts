import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5237/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handling
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ?? error.message ?? "An error occurred";
    return Promise.reject(new Error(message));
  }
);

export default api;
