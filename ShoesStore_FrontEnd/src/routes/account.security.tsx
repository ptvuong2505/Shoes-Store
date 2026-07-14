import { createFileRoute } from "@tanstack/react-router";
import SecurityPage from "@/features/account/pages/SecurityPage";

export const Route = createFileRoute("/account/security")({
  component: SecurityPage,
});
