import { createFileRoute } from "@tanstack/react-router";
import ProductDetailPage from "@/features/product/pages/ProductDetailPage";

export const Route = createFileRoute("/_store/products/$id")({
  component: ProductDetailPage,
});
