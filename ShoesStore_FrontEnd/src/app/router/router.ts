import { createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import type { AuthStatus } from "@/features/auth/model/auth.store";
import type { User } from "@/entities/user/model/user.types";

export interface RouterAuthContext {
  status: AuthStatus;
  isAuthenticated: boolean;
  user: User | null;
}

export interface RouterContext {
  auth: RouterAuthContext;
}

export const router = createRouter({
  routeTree,
  context: { auth: undefined! },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
