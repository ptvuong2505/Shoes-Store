import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, User } from "@/types/auth.types";

interface AuthStore extends AuthState {
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),
      login: (user) =>
        set({
          isAuthenticated: true,
          user,
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
        }),
    }),
    {
      name: "auth-user", // localStorage key
    },
  ),
);
