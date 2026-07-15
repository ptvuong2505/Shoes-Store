import { accountApi } from "@/features/account/api/account.api";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Loader2, MessageSquare, Star } from "lucide-react";

function ReviewsPage() {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: accountApi.getReviews,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reviews you&apos;ve written for products.
        </p>
      </div>

      {reviews.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-16">
          <MessageSquare className="size-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">No reviews yet</p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Share your thoughts after trying a product.
          </p>
          <Link
            to="/products"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition-all duration-150 hover:bg-foreground/90 active:scale-[0.98]"
          >
            Browse Products
          </Link>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-border/60 bg-card p-5"
            >
              <div className="flex gap-4">
                {review.productImageUrl && (
                  <Link
                    to="/products/$id"
                    params={{ id: review.productId }}
                    className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted"
                  >
                    <img
                      src={review.productImageUrl}
                      alt={review.productName}
                      className="size-full object-cover"
                    />
                  </Link>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to="/products/$id"
                      params={{ id: review.productId }}
                      className="text-sm font-semibold hover:underline"
                    >
                      {review.productName}
                    </Link>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3.5 ${
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/20"
                        }`}
                      />
                    ))}
                  </div>

                  {review.comment && (
                    <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsPage;
