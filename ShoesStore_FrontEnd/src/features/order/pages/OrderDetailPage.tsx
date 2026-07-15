import { getOrderDetail } from "@/features/order/api/order.api";
import { formatVndCurrency } from "@/shared/lib/currency";
import type { OrderItem } from "@/features/order/types/order.types";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ChevronRight, CreditCard, Loader2, MapPin, Package } from "lucide-react";
import type { OrderDetail } from "@/features/order/types/order.types";

const STATUS_STYLES: Record<string, string> = {
  Delivered: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  Shipping: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  Pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  Cancelled: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
};

function OrderDetailPage() {
  const { id } = useParams({ from: "/orders/$id" });
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getOrderDetail(id)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !order) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statusClass = STATUS_STYLES[order.status] ?? STATUS_STYLES.Pending;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/account/order-history" className="hover:text-foreground transition-colors">
          Orders
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">#{order.id.slice(0, 8).toUpperCase()}</span>
      </nav>

      {/* Order header */}
      <div className="mb-8 rounded-xl border border-border/60 bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${statusClass}`}>
                {order.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed on {new Date(order.orderDate).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tabular-nums">
              {formatVndCurrency(order.totalAmount)}
            </span>
            {order.status === "Pending" && (
              <button
                onClick={() => navigate({ to: "/orders/checkout/$id", params: { id: order.id } })}
                className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-all duration-150 hover:bg-foreground/90 active:scale-[0.98]"
              >
                Continue Payment
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Order items */}
        <section className="space-y-4 lg:col-span-3">
          <div className="rounded-xl border border-border/60 bg-card">
            <div className="border-b border-border/40 px-6 py-4">
              <h2 className="text-base font-semibold">Order Items</h2>
            </div>
            <div className="divide-y divide-border/40">
              {order.items.map((item: OrderItem) => (
                <div key={item.productId} className="flex gap-4 p-5">
                  <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      className="size-full object-cover"
                      src={item.imageUrl}
                      alt={item.productName}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate text-sm font-semibold">{item.productName}</h3>
                      <span className="shrink-0 text-sm font-bold tabular-nums">
                        {formatVndCurrency(item.price)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Size {item.size} / {item.gender} / Qty {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sidebar info */}
        <section className="space-y-4 lg:col-span-2">
          {/* Shipping address */}
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Shipping Address
            </h3>
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress ?? "No address"}
              </p>
            </div>
          </div>

          {/* Payment info */}
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Payment
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <CreditCard className="size-4 shrink-0 text-muted-foreground/60" />
                <span className="text-sm font-medium">
                  {order.paymentMethod ?? "N/A"}
                </span>
              </div>
              {order.paymentStatus && (
                <div className="flex items-center gap-2.5">
                  <Package className="size-4 shrink-0 text-muted-foreground/60" />
                  <span className={`text-sm font-medium ${
                    order.paymentStatus === "Paid"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              )}
              {order.paidAt && (
                <p className="pl-6 text-xs text-muted-foreground">
                  {new Date(order.paidAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default OrderDetailPage;
