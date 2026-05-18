import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponseDto } from "@/types";

interface AuthState {
  user: Omit<AuthResponseDto, "token"> | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: AuthResponseDto) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (data) =>
        set({
          token: data.token,
          user: { email: data.email, fullName: data.fullName, role: data.role },
          isAuthenticated: true,
        }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: "buildcraft-auth" }
  )
);
