import { getMyOrders } from "@/features/order/api/order.api";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2, Package } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  Delivered: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  Shipping: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  Pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  Cancelled: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
};

function OrderHistoryPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["orders", page],
    queryFn: () => getMyOrders(page, 5),
    placeholderData: (prev) => prev,
  });

  const orders = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Order History</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage your past orders.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-16">
          <Package className="size-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">No orders yet</p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Your order history will appear here.
          </p>
          <Link
            to="/products"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition-all duration-150 hover:bg-foreground/90 active:scale-[0.98]"
          >
            Start Shopping
          </Link>
        </div>
      )}

      {!isLoading && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => {
            const statusClass = STATUS_STYLES[order.status] ?? STATUS_STYLES.Pending;

            return (
              <div
                key={order.id}
                className="group rounded-xl border border-border/60 bg-card transition-colors duration-150 hover:border-foreground/15"
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${statusClass}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground/70">
                      {new Date(order.orderDate).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground/70">Total</p>
                      <p className="text-lg font-bold tabular-nums">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {order.status === "Pending" && (
                        <Link
                          to="/orders/checkout/$id"
                          params={{ id: order.id }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2 text-xs font-semibold text-background transition-all duration-150 hover:bg-foreground/90 active:scale-[0.98]"
                        >
                          Checkout
                        </Link>
                      )}
                      <Link
                        to="/orders/$id"
                        params={{ id: order.id }}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-3.5 py-2 text-xs font-medium transition-colors duration-150 hover:bg-accent"
                      >
                        Details
                        <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="inline-flex items-center justify-center rounded-lg border border-border p-1.5 text-muted-foreground transition-colors duration-150 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex items-center justify-center rounded-lg border border-border p-1.5 text-muted-foreground transition-colors duration-150 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistoryPage;
