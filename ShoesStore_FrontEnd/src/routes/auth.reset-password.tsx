import { createFileRoute, redirect } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";
import { passwordResetSession } from "@/features/auth/model/password-reset";

export const Route = createFileRoute("/auth/reset-password")({
  beforeLoad: () => {
    if (!passwordResetSession.read()) {
      throw redirect({ to: "/auth/forgot-password" });
    }
  },
  component: ResetPasswordPage,
});
