import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/entities/user/model/user.types";
import { refreshAccessToken } from "@/shared/api/axiosClient";
import { tokenStore } from "@/shared/api/token-store";

export type AuthStatus = "checking" | "authenticated" | "anonymous";

interface AuthStore {
  status: AuthStatus;
  user: User | null;
  isAuthenticated: boolean;
  setSession: (user: User, accessToken: string) => void;
  setUser: (user: User) => void;
  clearSession: () => void;
  bootstrap: () => Promise<void>;
}

let bootstrapPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      status: "checking",
      user: null,
      isAuthenticated: false,
      setSession: (user, accessToken) => {
        tokenStore.set(accessToken);
        localStorage.removeItem("accessToken");
        set({ user, status: "authenticated", isAuthenticated: true });
      },
      setUser: (user) => set({ user }),
      clearSession: () => {
        tokenStore.clear();
        localStorage.removeItem("accessToken");
        set({ user: null, status: "anonymous", isAuthenticated: false });
      },
      bootstrap: async () => {
        if (get().status !== "checking") return;
        if (!bootstrapPromise) {
          bootstrapPromise = refreshAccessToken()
            .then(() => {
              const user = get().user;
              set({
                status: user ? "authenticated" : "anonymous",
                isAuthenticated: Boolean(user),
              });
            })
            .catch(() => {
              get().clearSession();
            })
            .finally(() => {
              bootstrapPromise = null;
            });
        }
        await bootstrapPromise;
      },
    }),
    {
      name: "auth-user",
      partialize: ({ user }) => ({ user }),
    },
  ),
);
