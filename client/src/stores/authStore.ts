import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@shared/schema";
import { userRoleMap } from "@shared/schema";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (username: string) => {
        const role: UserRole = userRoleMap[username] || "FARMER";
        set({ user: { username, role }, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "ap-agri-guard-auth",
    }
  )
);
