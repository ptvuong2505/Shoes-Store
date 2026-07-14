import { createFileRoute } from "@tanstack/react-router";
import { AdminCustomerPage } from "@/features/admin/pages/AdminCustomerPage";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomerPage,
});
