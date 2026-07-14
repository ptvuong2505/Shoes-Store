import { createFileRoute } from "@tanstack/react-router";
import OrderDetailPage from "@/features/order/pages/OrderDetailPage";

export const Route = createFileRoute("/orders/$id")({
  component: OrderDetailPage,
});
