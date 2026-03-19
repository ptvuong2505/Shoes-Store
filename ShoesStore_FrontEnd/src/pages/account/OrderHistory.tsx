import { getMyOrders } from "@/api/order.api";
import type { Order } from "@/types/order.types";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getMyOrders(page, 5);
        setOrders(res.items);
        setTotalPages(res.totalPages);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  return (
    <div className="md:col-span-3 space-y-6">
      {/* header giữ nguyên */}

      {/* ===== ORDER LIST ===== */}
      <div className="space-y-4">
        {loading && <p>Loading orders...</p>}

        {!loading && orders.length === 0 && (
          <p className="text-sm text-[#9a5f4c]">No orders found.</p>
        )}

        {orders.map((order) => {
          return (
            <div
              key={order.id}
              className="bg-white dark:bg-background-dark rounded-xl border border-[#e7d5cf] dark:border-[#3d2a23] shadow-sm overflow-hidden hover:border-primary/30 transition-colors"
            >
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#9a5f4c] uppercase tracking-wider">
                        Order #{order.id.slice(0, 8)}
                      </span>

                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider
                          ${
                            order.status === "Delivered"
                              ? "status-delivered"
                              : order.status === "Shipping"
                                ? "status-shipping"
                                : "status-cancelled"
                          }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-[#9a5f4c] dark:text-[#b08e84]">
                      Placed on {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                  <div className="text-right">
                    <p className="text-xs text-[#9a5f4c] dark:text-[#b08e84]">
                      Total Amount
                    </p>
                    <p className="text-xl font-black text-primary">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {order.status === "Pending" && (
                      <NavLink
                        className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2"
                        to={`/orders/checkout/${order.id}`}
                      >
                        Checkout
                        <span className="material-symbols-outlined text-sm">
                          shopping_cart_checkout
                        </span>
                      </NavLink>
                    )}
                    <NavLink
                      className="px-4 py-2 text-sm font-bold bg-[#fcf9f8] dark:bg-background-dark border border-[#e7d5cf] dark:border-[#3d2a23] rounded-lg hover:border-primary hover:text-primary transition-all flex items-center gap-2"
                      to={`/orders/${order.id}`}
                    >
                      View Details
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm px-2">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
