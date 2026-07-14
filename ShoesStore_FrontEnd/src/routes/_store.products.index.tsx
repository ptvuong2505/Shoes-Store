import { createFileRoute } from "@tanstack/react-router";
import ProductsPage from "@/features/product/pages/ProductsPage";

export const Route = createFileRoute("/_store/products/")({
  component: ProductsPage,
});
