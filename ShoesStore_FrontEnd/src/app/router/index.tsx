import { RouterProvider } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { router } from "@/app/router/router";

export function AppRouter() {
  const status = useAuthStore((state) => state.status);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  return (
    <RouterProvider
      router={router}
      context={{ auth: { status, isAuthenticated, user } }}
    />
  );
}
