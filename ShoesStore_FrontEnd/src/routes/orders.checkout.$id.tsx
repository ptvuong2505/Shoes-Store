import { createFileRoute } from "@tanstack/react-router";
import OrderCheckoutPage from "@/features/order/pages/OrderCheckoutPage";

export const Route = createFileRoute("/orders/checkout/$id")({
  component: OrderCheckoutPage,
});
