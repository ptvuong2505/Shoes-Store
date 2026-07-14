import { createFileRoute, redirect } from "@tanstack/react-router";
import AuthLayout from "@/app/layouts/AuthLayout";

export const Route = createFileRoute("/auth")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) throw redirect({ to: "/" });
  },
  component: AuthLayout,
});
