import { createFileRoute, redirect } from "@tanstack/react-router";
import AdminLayout from "@/features/admin/layouts/AdminLayout";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/auth/login",
        search: { redirect: location.href },
      });
    }
    if (!context.auth.user?.roles.some((role) => role.toLowerCase() === "admin")) {
      throw redirect({ to: "/" });
    }
  },
  component: AdminLayout,
});
