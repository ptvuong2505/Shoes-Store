import { createFileRoute } from "@tanstack/react-router";
import AdminProductsPage from "@/features/admin/pages/AdminProductsPage";

export const Route = createFileRoute("/admin/products")({
  component: AdminProductsPage,
});
