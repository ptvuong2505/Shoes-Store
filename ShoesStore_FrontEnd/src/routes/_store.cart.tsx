import { createFileRoute } from "@tanstack/react-router";
import CartPage from "@/features/cart/pages/CartPage";

export const Route = createFileRoute("/_store/cart")({ component: CartPage });
