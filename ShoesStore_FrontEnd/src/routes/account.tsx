import { createFileRoute, redirect } from "@tanstack/react-router";
import AccountLayout from "@/features/account/layouts/AccountLayout";

export const Route = createFileRoute("/account")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/auth/login",
        search: { redirect: location.href },
      });
    }
  },
  component: AccountLayout,
});
