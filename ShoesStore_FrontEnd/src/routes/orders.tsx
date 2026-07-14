import { createFileRoute, redirect } from "@tanstack/react-router";
import AppLayout from "@/app/layouts/AppLayout";

export const Route = createFileRoute("/orders")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/auth/login",
        search: { redirect: location.href },
      });
    }
  },
  component: AppLayout,
});
