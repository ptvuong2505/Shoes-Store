import { createFileRoute } from "@tanstack/react-router";
import ReviewsPage from "@/features/account/pages/ReviewsPage";

export const Route = createFileRoute("/account/reviews")({
  component: ReviewsPage,
});
