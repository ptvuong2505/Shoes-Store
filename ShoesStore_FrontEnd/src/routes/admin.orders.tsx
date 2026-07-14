import { createFileRoute } from "@tanstack/react-router";
import { AdminOrderPage } from "@/features/admin/pages/AdminOrderPage";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrderPage,
});
