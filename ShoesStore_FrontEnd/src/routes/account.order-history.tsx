import { createFileRoute } from "@tanstack/react-router";
import OrderHistoryPage from "@/features/account/pages/OrderHistoryPage";

export const Route = createFileRoute("/account/order-history")({
  component: OrderHistoryPage,
});
